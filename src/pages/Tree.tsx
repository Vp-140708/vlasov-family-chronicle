import { useEffect, useState, useCallback, useMemo } from "react";
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
import type { FamilyMember, BranchType } from "@/data/familyData";
import { fetchAllRelatives } from "@/lib/familyMembers";
import { fetchAllRelationships, relationshipToEdge, type RelationshipRow } from "@/lib/relationships";

type FilterType = "all" | "paternal" | "maternal";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;

const buildNodesAndEdges = (
  filter: FilterType,
  members: FamilyMember[],
  relationships: RelationshipRow[]
) => {
  const filtered = members.filter((m) => {
    if (filter === "all") return true;
    return (m.branch ?? "both") === filter || (m.branch ?? "both") === "both";
  });

  const ids = new Set(filtered.map((m) => m.id));

  // Build dagre graph
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 100, align: "UL" });

  filtered.forEach((m) => {
    g.setNode(m.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Edges from `relationships` table: parent -> child (source -> target)
  for (const r of relationships) {
    const edge = relationshipToEdge(r);
    if (!edge) continue;
    if (ids.has(edge.sourceId) && ids.has(edge.targetId)) {
      g.setEdge(edge.sourceId, edge.targetId);
    }
  }

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
        branch: m.branch as BranchType,
        memberId: m.id,
      },
    };
  });

  const edges: Edge[] = [];
  for (const r of relationships) {
    const edge = relationshipToEdge(r);
    if (!edge) continue;
    if (!ids.has(edge.sourceId) || !ids.has(edge.targetId)) continue;

    edges.push({
      id: `${edge.sourceId}-${edge.targetId}`,
      source: edge.sourceId,
      target: edge.targetId,
      style: { stroke: "hsl(43, 76%, 52%)", strokeWidth: 1 },
      type: "straight",
    });
  }

  return { nodes, edges };
};

const nodeTypes = { familyNode: FamilyNode };

const Tree = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [relationships, setRelationships] = useState<RelationshipRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const envCurrentUserId = (import.meta.env.VITE_CURRENT_USER_ID as string | undefined) || "";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [rows, rels] = await Promise.all([fetchAllRelatives(), fetchAllRelationships()]);
        const normalized: FamilyMember[] = rows.map((r) => ({
          id: r.id,
          name: r.name,
          years: r.years ?? "",
          title: r.title ?? "",
          branch: (r.branch as BranchType) ?? "both",
          bio: r.bio ?? "",
          habits: r.habits ?? [],
          medical: r.medical ?? [],
          generation: r.generation ?? 0,
          mother_id: r.mother_id ?? null,
          father_id: r.father_id ?? null,
          spouse_id: r.spouse_id ?? null,
          gender: r.gender ?? null,
          map_locations: r.map_locations ?? null,
          map_city: r.map_city ?? null,
          map_lat: r.map_lat ?? null,
          map_lng: r.map_lng ?? null,
          map_description: r.map_description ?? null,
          map_surnames: r.map_surnames ?? null,
          photo_url: r.photo_url ?? null,
        }));

        if (!mounted) return;
        setMembers(normalized);
        setRelationships(rels);

        const picked =
          envCurrentUserId.trim() ||
          normalized.find((m) => m.generation === 0)?.id ||
          normalized[0]?.id ||
          null;
        setCurrentUserId(picked);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[Tree] Failed to load family_members:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [envCurrentUserId]);

  const { nodes: builtNodes, edges: builtEdges } = useMemo(
    () => buildNodesAndEdges(filter, members, relationships),
    [filter, members, relationships]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);

  useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
  }, [builtNodes, builtEdges, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    const member = members.find((m) => m.id === (node.data as any).memberId);
    if (member) {
      setSelectedMember(member);
      setSheetOpen(true);
    }
  }, [members]);

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
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Загрузка генеалогических данных...
            </div>
          ) : (
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
          )}
        </div>
      </div>

      <MemberSheet
        member={selectedMember}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        members={members}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default Tree;
