import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState, 
  Panel,
  applyNodeChanges,
  OnNodesChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // 1. Генерируем начальные позиции (теперь они временные)
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const Y_LEVEL = 300;

    familyMembers.forEach((m, index) => {
      const xBase = m.branch === 'paternal' ? -400 : (m.branch === 'maternal' ? 400 : 0);
      const genderShift = m.gender === 'm' ? -150 : 150;

      nodes.push({
        id: m.id,
        data: { 
          member: m,
          label: (
            <div className={`p-4 rounded-xl border-t-4 shadow-xl bg-white w-60 text-center border-b border-l border-r border-stone-200 cursor-grab active:cursor-grabbing ${
              m.branch === 'paternal' ? 'border-t-blue-800' : (m.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
            }`}>
              <div className="font-serif text-[9px] uppercase tracking-widest text-stone-400 mb-1">{m.title}</div>
              <div className="font-serif font-bold text-base text-stone-900 leading-tight border-b border-stone-50 pb-1">{m.name}</div>
              <div className="text-[10px] text-amber-700 font-serif italic mt-1">{m.years}</div>
            </div>
          )
        },
        position: { x: xBase + genderShift + (index * 10), y: m.generation * Y_LEVEL },
        draggable: true, // ВКЛЮЧАЕМ ВОЗМОЖНОСТЬ ДВИГАТЬ
      });

      // Простые связи для начала (прямые, чтобы не путаться при движении)
      if (m.fatherId) edges.push({ id: `e-f-${m.id}`, source: m.fatherId, target: m.id, style: { stroke: '#d4af37', strokeWidth: 2 }});
      if (m.motherId) edges.push({ id: `e-m-${m.id}`, source: m.motherId, target: m.id, style: { stroke: '#d4af37', strokeWidth: 2 }});
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Функция для вывода координат в консоль (чтобы потом сохранить результат)
  const logPositions = () => {
    console.log("Новые координаты для familyData.ts:");
    nodes.forEach(node => {
      console.log(`${node.id}: { x: ${Math.round(node.position.x)}, y: ${Math.round(node.position.y)} }`);
    });
    alert("Координаты выведены в консоль браузера (F12)");
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => node.data.member && setSelectedMember(node.data.member)}
        fitView
        nodesDraggable={true} // РАЗРЕШАЕМ ТАСКАТЬ
        panOnDrag={true}
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        
        <Panel position="top-left" className="bg-white/90 p-4 rounded-lg border border-stone-200 shadow-sm backdrop-blur-sm">
            <h2 className="font-serif font-bold text-stone-800">Режим конструктора</h2>
            <p className="text-[10px] uppercase text-stone-500 mb-4">Расставь людей как тебе удобно</p>
            <button 
              onClick={logPositions}
              className="bg-amber-600 text-white text-xs px-3 py-2 rounded hover:bg-amber-700 transition-colors"
            >
              Сохранить положение
            </button>
        </Panel>
      </ReactFlow>

      {/* Боковая панель (та же самая) */}
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] sm:max-w-lg overflow-y-auto">
          {selectedMember && (
            <div className="py-8">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto flex items-center justify-center text-3xl font-serif text-stone-400 border-2 border-white shadow-lg">
                        {selectedMember.name[0]}
                    </div>
                    <h2 className="text-3xl font-serif text-stone-900 mt-4">{selectedMember.name}</h2>
                    <p className="text-amber-700 font-serif italic text-lg">{selectedMember.years}</p>
                </div>
                <div className="space-y-6 font-serif text-stone-800 text-lg">
                    <p>{selectedMember.bio || "Исследуем..."}</p>
                </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tree;