import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Navbar from "@/components/Navbar";
import FamilyNode from "@/components/tree/FamilyNode";
import MemberSheet from "@/components/tree/MemberSheet";
import { familyMembers, type BranchType, type FamilyMember } from "@/data/familyData";

type FilterType = "all" | "paternal" | "maternal";

const buildNodesAndEdges = (filter: FilterType) => {
  const filtered = familyMembers.filter((m) => {
    if (filter === "all") return true;
    return m.branch === filter || m.branch === "both";
  });

  const ids = new Set(filtered.map((m) => m.id));

  // Positions by generation
  const genPositions: Record<number, { members: FamilyMember[] }> = {};
  filtered.forEach((m) => {
    if (!genPositions[m.generation]) genPositions[m.generation] = { members: [] };
    genPositions[m.generation].members.push(m);
  });

  const nodes: Node[] = [];

  Object.entries(genPositions).forEach(([gen, { members }]) => {
    const g = parseInt(gen);
    const totalWidth = members.length * 220;
    const startX = -totalWidth / 2 + 110;

    members.forEach((m, i) => {
      nodes.push({
        id: m.id,
        type: "familyNode",
        position: { x: startX + i * 220, y: g * 220 },
        data: {
          name: m.name,
          years: m.years,
          title: m.title,
          branch: m.branch,
          memberId: m.id,
        },
      });
    });
  });

  // Edges: parent-child relationships
  const relationships: [string, string][] = [
    ["igor", "pavel"],
    ["anna", "pavel"],
    ["igor", "petr"],
    ["anna", "petr"],
    ["aleksandr", "igor"],
    ["olga", "igor"],
    ["igor-sr", "anna"],
    ["svetlana", "anna"],
  ];

  const edges: Edge[] = relationships
    .filter(([from, to]) => ids.has(from) && ids.has(to))
    .map(([from, to]) => {
      const fromMember = familyMembers.find((m) => m.id === from);
      let stroke = "hsl(43, 52%, 54%)";
      if (fromMember?.branch === "paternal") stroke = "hsl(222, 42%, 30%)";
      if (fromMember?.branch === "maternal") stroke = "hsl(152, 40%, 38%)";

      return {
        id: `${from}-${to}`,
        source: from,
        target: to,
        style: { stroke, strokeWidth: 2 },
        type: "smoothstep",
      };
    });

  return { nodes, edges };
};

const nodeTypes = { familyNode: FamilyNode };

const Tree = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodesAndEdges(filter),
    [filter]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when filter changes
  useMemo(() => {
    const { nodes: n, edges: e } = buildNodesAndEdges(filter);
    onNodesChange(
      n.map((node) => ({ type: "reset" as const, item: node }))
    );
    onEdgesChange(
      e.map((edge) => ({ type: "reset" as const, item: edge }))
    );
  }, [filter]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    const member = familyMembers.find((m) => m.id === (node.data as any).memberId);
    if (member) {
      setSelectedMember(member);
      setSheetOpen(true);
    }
  }, []);

  const filters: { label: string; value: FilterType; color: string }[] = [
    { label: "Все", value: "all", color: "bg-accent text-accent-foreground" },
    { label: "Папина линия", value: "paternal", color: "bg-[hsl(222,42%,30%)] text-[hsl(40,40%,95%)]" },
    { label: "Мамина линия", value: "maternal", color: "bg-[hsl(152,40%,38%)] text-[hsl(40,40%,95%)]" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Генеалогическое древо</h1>
            <p className="text-sm text-muted-foreground">Нажмите на узел, чтобы узнать больше</p>
          </div>

          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                  ${filter === f.value
                    ? f.color
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tree */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={1.5}
          >
            <Background color="hsl(35, 25%, 82%)" gap={24} size={1} />
            <Controls
              showInteractive={false}
              className="!bg-card !border-border !shadow-heritage [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground"
            />
          </ReactFlow>
        </div>
      </div>

      <MemberSheet member={selectedMember} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

export default Tree;
