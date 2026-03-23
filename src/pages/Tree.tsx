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
import Navbar from "@/components/Navbar";
import FamilyNode from "@/components/tree/FamilyNode";
import MemberSheet from "@/components/tree/MemberSheet";
import type { FamilyMember } from "@/data/familyData";
import { familyMembers as localFamilyMembers } from "@/data/familyData";
import { fetchAllRelatives } from "@/lib/familyMembers";
import CoupleCenterNode from "@/components/tree/CoupleCenterNode";
import SpouseEdge from "@/components/tree/SpouseEdge";
import BranchEdge from "@/components/tree/BranchEdge";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;
const LEVEL_Y = 190;
const SPOUSE_OFFSET_X = 130;
const X_GAP = 260;
const SPOUSE_STROKE = "hsl(43, 76%, 52%)";

function getMotherId(m: FamilyMember) {
  return m.motherId ?? m.mother_id ?? null;
}
function getFatherId(m: FamilyMember) {
  return m.fatherId ?? m.father_id ?? null;
}

function buildTreeNodesAndEdges(members: FamilyMember[]): { nodes: Node[]; edges: Edge[] } {
  const byId: Record<string, FamilyMember> = Object.fromEntries(members.map((m) => [m.id, m]));

  const maxDepth = Math.max(0, ...members.map((m) => m.generation ?? 0));

  // Parent-child adjacency (for x layout)
  const childrenByParent: Record<string, string[]> = {};
  for (const m of members) childrenByParent[m.id] = [];
  for (const child of members) {
    const fatherId = getFatherId(child);
    const motherId = getMotherId(child);
    if (fatherId && byId[fatherId]) childrenByParent[fatherId].push(child.id);
    if (motherId && byId[motherId]) childrenByParent[motherId].push(child.id);
  }

  // Couples derived from father+mother of children
  type Couple = { coupleKey: string; fatherId: string; motherId: string; children: string[]; generation: number };
  const coupleMap = new Map<string, Couple>();

  // Also allow explicit spouseId pairs (if provided).
  for (const person of members) {
    const spouseId = person.spouseId ?? person.spouse_id ?? null;
    if (!spouseId) continue;
    if (!byId[spouseId]) continue;
    const a = person.id < spouseId ? person.id : spouseId;
    const b = person.id < spouseId ? spouseId : person.id;
    const coupleKey = `${a}|${b}`;
    if (coupleMap.has(coupleKey)) continue;
    const generation = Math.min(person.generation ?? 0, byId[spouseId].generation ?? 0);
    coupleMap.set(coupleKey, { coupleKey, fatherId: person.id, motherId: spouseId, children: [], generation });
  }

  for (const child of members) {
    const fatherId = getFatherId(child);
    const motherId = getMotherId(child);
    if (!fatherId || !motherId) continue;
    if (!byId[fatherId] || !byId[motherId]) continue;

    const a = fatherId < motherId ? fatherId : motherId;
    const b = fatherId < motherId ? motherId : fatherId;
    const coupleKey = `${a}|${b}`;

    const generation = Math.min(byId[fatherId]?.generation ?? 0, byId[motherId]?.generation ?? 0);
    const existing = coupleMap.get(coupleKey);
    if (!existing) {
      coupleMap.set(coupleKey, { coupleKey, fatherId, motherId, children: [child.id], generation });
    } else {
      existing.children.push(child.id);
    }
  }

  for (const couple of coupleMap.values()) {
    couple.children = Array.from(new Set(couple.children));
  }

  // Individuals grouped by generation
  const idsByDepth: Record<number, string[]> = {};
  for (const m of members) {
    const d = m.generation ?? 0;
    idsByDepth[d] = idsByDepth[d] ?? [];
    idsByDepth[d].push(m.id);
  }
  for (const depth of Object.keys(idsByDepth)) idsByDepth[Number(depth)].sort((a, b) => a.localeCompare(b));

  const xCenters: Record<string, number | undefined> = {};
  const coupleCenterX: Record<string, number | undefined> = {};

  let slot = 0;

  for (let depth = maxDepth; depth >= 0; depth--) {
    // 1) Assign x for couples at this depth (from children x if available)
    const couplesAtDepth = Array.from(coupleMap.values()).filter((c) => c.generation === depth);
    for (const c of couplesAtDepth) {
      const childXs = c.children.map((id) => xCenters[id]).filter((v): v is number => typeof v === "number");
      const centerX = childXs.length ? childXs.reduce((a, b) => a + b, 0) / childXs.length : slot * X_GAP;
      coupleCenterX[c.coupleKey] = centerX;

      xCenters[c.fatherId] = centerX - SPOUSE_OFFSET_X;
      xCenters[c.motherId] = centerX + SPOUSE_OFFSET_X;
      slot++;
    }

    // 2) Assign remaining individuals
    for (const id of idsByDepth[depth] ?? []) {
      if (typeof xCenters[id] === "number") continue;
      const childXs = (childrenByParent[id] ?? []).map((cid) => xCenters[cid]).filter((v): v is number => typeof v === "number");
      const centerX = childXs.length ? childXs.reduce((a, b) => a + b, 0) / childXs.length : slot * X_GAP;
      xCenters[id] = centerX;
      slot++;
    }
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Person nodes
  for (const m of members) {
    const cx = xCenters[m.id] ?? 0;
    const depth = m.generation ?? 0;
    nodes.push({
      id: m.id,
      type: "familyNode",
      position: { x: cx - NODE_WIDTH / 2, y: depth * LEVEL_Y },
      draggable: false,
      data: {
        name: m.name,
        years: m.years,
        title: m.title,
        branch: m.branch,
        memberId: m.id,
      },
    });
  }

  // Couple-center nodes and edges
  for (const c of coupleMap.values()) {
    const depth = c.generation;
    const centerX = coupleCenterX[c.coupleKey] ?? 0;
    const centerId = `center-${c.coupleKey}`;
    const centerY = depth * LEVEL_Y + NODE_HEIGHT / 2 - 1;

    nodes.push({
      id: centerId,
      type: "coupleCenter",
      position: { x: centerX - 0.5, y: centerY },
      draggable: false,
      data: { coupleKey: c.coupleKey },
    });

    // Horizontal edge between spouses
    edges.push({
      id: `spouse-${c.coupleKey}`,
      source: c.fatherId,
      target: c.motherId,
      sourceHandle: "right",
      targetHandle: "left",
      type: "spouseEdge",
      style: { stroke: SPOUSE_STROKE, strokeWidth: 2 },
    });

    // Vertical -> 90deg to all children
    for (const childId of c.children) {
      edges.push({
        id: `branch-${centerId}-${childId}`,
        source: centerId,
        target: childId,
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "branchEdge",
        style: { stroke: SPOUSE_STROKE, strokeWidth: 2 },
      });
    }
  }

  return { nodes, edges };
}

const nodeTypes = { familyNode: FamilyNode, coupleCenter: CoupleCenterNode };
const edgeTypes = { spouseEdge: SpouseEdge, branchEdge: BranchEdge };

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [members, setMembers] = useState<FamilyMember[]>(localFamilyMembers);
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const envCurrentUserId = (import.meta.env.VITE_CURRENT_USER_ID as string | undefined) || "";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await fetchAllRelatives();
        const normalized: FamilyMember[] = (rows ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          years: r.years ?? "",
          title: r.title ?? "",
          branch: (r.branch as any) ?? "both",
          bio: r.bio ?? "",
          habits: r.habits ?? [],
          medical: r.medical ?? [],
          generation: r.generation ?? 0,
          motherId: r.mother_id ?? null,
          fatherId: r.father_id ?? null,
          spouseId: r.spouse_id ?? null,
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
        const useFallback = !normalized.length;
        setMembers(useFallback ? localFamilyMembers : normalized);

        const picked =
          envCurrentUserId.trim() ||
          (useFallback ? localFamilyMembers : normalized).find((m) => m.generation === 0)?.id ||
          (useFallback ? localFamilyMembers : normalized)[0]?.id ||
          null;
        setCurrentUserId(picked);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[Tree] Failed to load family_members:", e);
        setMembers(localFamilyMembers);
        setCurrentUserId(
          localFamilyMembers.find((m) => m.id === "pavel_vlasov")?.id ?? localFamilyMembers[0]?.id ?? null
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [envCurrentUserId]);

  const { nodes: builtNodes, edges: builtEdges } = useMemo(
    () => buildTreeNodesAndEdges(members),
    [members]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);

  useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
  }, [builtNodes, builtEdges, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    const clickedId = (node.data as any)?.memberId as string | undefined;
    if (!clickedId) return;
    const member = members.find((m) => m.id === clickedId);
    if (!member) return;
    setSelectedMember(member);
    setSheetOpen(true);
  }, [members]);

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
            <p className="text-sm text-muted-foreground">Т-схема: перемычка супругов, от центра — к детям</p>
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
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={1.5}
            elementsSelectable={false}
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
