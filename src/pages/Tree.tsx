import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const Y_LEVEL = 350; 

    // 1. Сначала ставим людей
    familyMembers.forEach((m) => {
      let xBase = 0;
      if (m.branch === 'paternal') xBase = -500;
      if (m.branch === 'maternal') xBase = 500;
      
      const genderShift = m.gender === 'm' ? -150 : 150;

      nodes.push({
        id: m.id,
        data: { 
          member: m,
          label: (
            <div className={`p-4 rounded-xl border-t-4 shadow-xl bg-white w-60 text-center transition-all hover:scale-105 ${
              m.branch === 'paternal' ? 'border-t-blue-800' : (m.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
            }`}>
              <div className="font-serif font-bold text-slate-900 leading-tight">{m.name}</div>
              <div className="text-xs text-amber-700 font-bold">{m.years}</div>
              <div className="text-[9px] uppercase text-stone-400 mt-1">{m.title}</div>
            </div>
          )
        },
        position: { x: xBase + genderShift, y: m.generation * Y_LEVEL },
        draggable: true,
      });
    });

    // 2. Логика Т-связей через точки брака
    const processedUnions = new Set();
    familyMembers.forEach((m) => {
      if (m.fatherId && m.motherId) {
        const unionId = `u-${m.fatherId}-${m.motherId}`;
        if (!processedUnions.has(unionId)) {
          const fNode = nodes.find(n => n.id === m.fatherId);
          const mNode = nodes.find(n => n.id === m.motherId);
          
          if (fNode && mNode) {
            const ux = (fNode.position.x + mNode.position.x + 240) / 2;
            const uy = fNode.position.y + 110;

            nodes.push({
              id: unionId,
              data: { label: '' },
              position: { x: ux, y: uy },
              style: { width: 10, height: 10, borderRadius: '50%', background: '#d4af37', border: '2px solid #fff' },
              type: 'default'
            });

            edges.push({ id: `e-${m.fatherId}`, source: m.fatherId, target: unionId, style: { stroke: '#d4af37', strokeWidth: 2 }});
            edges.push({ id: `e-${m.motherId}`, source: m.motherId, target: unionId, style: { stroke: '#d4af37', strokeWidth: 2 }});
            processedUnions.add(unionId);
          }
        }
        edges.push({ id: `ec-${m.id}`, source: unionId, target: m.id, type: 'step', style: { stroke: '#d4af37', strokeWidth: 2 }});
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => node.data.member && setSelectedMember(node.data.member)}
        fitView
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        <Panel position="top-left" className="bg-white/90 p-4 border border-stone-200 shadow-sm rounded-lg">
            <h2 className="font-serif font-bold text-stone-800">Архив Рода</h2>
            <p className="text-[10px] text-stone-500 uppercase">Свободное перемещение включено</p>
        </Panel>
      </ReactFlow>

      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] border-l border-stone-200 overflow-y-auto sm:max-w-lg">
          {selectedMember && (
            <div className="py-8 font-serif text-stone-800">
                <div className="text-center mb-10">
                  <div className="w-24 h-24 bg-stone-200 rounded-full mx-auto flex items-center justify-center text-3xl text-stone-400 border-2 border-white shadow-lg">
                    {selectedMember.name[0]}
                  </div>
                  <h2 className="text-3xl mt-4 text-stone-900">{selectedMember.name}</h2>
                  <p className="text-amber-700 italic text-xl">{selectedMember.years}</p>
                </div>
                <div className="space-y-6 text-lg leading-relaxed">
                  <h4 className="text-xs uppercase tracking-widest text-stone-400 border-b pb-1">Биография</h4>
                  <p>{selectedMember.bio || "Сведения из архивов обрабатываются..."}</p>
                </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tree;