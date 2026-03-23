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
import dagre from "@dagrejs/dagre";
import Navbar from "@/components/Navbar";
import FamilyNode from "@/components/tree/FamilyNode";
import MemberSheet from "@/components/tree/MemberSheet";
import { familyMembers, type FamilyMember } from "@/data/familyData";

type FilterType = "all" | "paternal" | "maternal";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;

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

const buildNodesAndEdges = (filter: FilterType) => {
  const filtered = familyMembers.filter((m) => {
    if (filter === "all") return true;
    return m.branch === filter || m.branch === "both";
  });

  const ids = new Set(filtered.map((m) => m.id));

  // Build dagre graph
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 100, align: "UL" });

  filtered.forEach((m) => {
    g.setNode(m.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  relationships
    .filter(([from, to]) => ids.has(from) && ids.has(to))
    .forEach(([from, to]) => {
      g.setEdge(from, to);
    });

  dagre.layout(g);

  const nodes: Node[] = filtered.map((m) => {
    const pos = g.node(m.id);
    return {
      id: m.id,
      type: "familyNode",
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      draggable: false,
      data: {
        name: m.name,
        years: m.years,
        title: m.title,
        branch: m.branch,
        memberId: m.id,
      },
    };
  });

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
        style: { stroke, strokeWidth: 1.5 },
        type: "default",
      };
    });

  return { nodes, edges };
};

const nodeTypes = { familyNode: FamilyNode };

const Tree = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { nodes: builtNodes, edges: builtEdges } = useMemo(
    () => buildNodesAndEdges(filter),
    [filter]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);

  useMemo(() => {
    const { nodes: n, edges: e } = buildNodesAndEdges(filter);
    setNodes(n);
    setEdges(e);
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

        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
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
