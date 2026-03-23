import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const Y_LEVEL = 350; // Расстояние между поколениями
    const X_GAP = 400;   // Расстояние между ветками

    // 1. Генерируем узлы людей
    familyMembers.forEach((m) => {
      const isVlasov = m.branch === 'paternal';
      const xBase = isVlasov ? -X_GAP : (m.branch === 'maternal' ? X_GAP : 0);
      const genderShift = m.gender === 'm' ? -140 : 140;

      nodes.push({
        id: m.id,
        data: { 
          member: m,
          label: (
            <div className={`p-5 rounded-sm border-t-4 shadow-2xl bg-[#fdfaf5] w-64 text-center transition-all hover:scale-105 border-b border-l border-r border-stone-200 ${
              m.branch === 'paternal' ? 'border-t-blue-800' : (m.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
            }`}>
              <div className="font-serif text-[10px] uppercase tracking-widest text-stone-400 mb-1">{m.title}</div>
              <div className="font-serif font-bold text-lg text-stone-900 leading-tight border-b border-stone-100 pb-2">{m.name}</div>
              <div className="text-xs text-amber-700 font-serif italic mt-2">{m.years}</div>
            </div>
          )
        },
        position: { x: xBase + genderShift, y: m.generation * Y_LEVEL },
        draggable: false, // Чтобы не ломать структуру захватом
      });

      // 2. Создаем Т-образные связи через Marriage Nodes
      if (m.fatherId && m.motherId) {
        const unionId = `u-${m.fatherId}-${m.motherId}`;
        
        if (!nodes.find(n => n.id === unionId)) {
          nodes.push({
            id: unionId,
            data: { label: '' },
            position: { x: xBase, y: (m.generation * Y_LEVEL) - 175 },
            style: { width: 12, height: 12, borderRadius: '50%', background: '#d4af37', border: '2px solid #fff', boxShadow: '0 0 10px rgba(212,175,55,0.5)' },
            type: 'default'
          });
          
          edges.push({ id: `e-${m.fatherId}`, source: m.fatherId, target: unionId, type: 'straight', style: { stroke: '#d4af37', strokeWidth: 1.5 }});
          edges.push({ id: `e-${m.motherId}`, source: m.motherId, target: unionId, type: 'straight', style: { stroke: '#d4af37', strokeWidth: 1.5 }});
        }

        edges.push({
          id: `ec-${m.id}`,
          source: unionId,
          target: m.id,
          type: 'step', // Углы 90 градусов
          style: { stroke: '#d4af37', strokeWidth: 2 }
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => node.data.member && setSelectedMember(node.data.member)}
        // Настройки зума и перемещения
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        panOnScroll={false} // Чтобы скролл страницы работал, если нужно
        selectionOnDrag={false}
        panOnDrag={true} // РАБОТАЕТ ЗАХВАТ МЫШКОЙ
        nodesDraggable={false} // Узлы зафиксированы
      >
        <Background color="#dcd6cc" gap={40} size={1} />
        <Controls showInteractive={false} className="bg-white border-stone-200" />
        
        <Panel position="top-left" className="bg-stone-50/80 p-3 rounded-md border border-stone-200 backdrop-blur-sm">
          <h2 className="font-serif text-stone-800 font-bold">Генеалогическое древо</h2>
          <p className="text-[10px] text-stone-500 uppercase tracking-tighter">Зажмите ЛКМ для перемещения</p>
        </Panel>
      </ReactFlow>

      {/* Боковая панель (как на всем сайте) */}
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] border-l border-stone-200 overflow-y-auto sm:max-w-lg">
          {selectedMember && (
            <div className="py-10 px-4">
              <SheetHeader className="text-center space-y-4">
                <div className="w-32 h-32 bg-stone-100 rounded-full mx-auto border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                   <span className="text-5xl font-serif text-stone-300">{selectedMember.name[0]}</span>
                </div>
                <div>
                  <SheetTitle className="text-3xl font-serif text-stone-900">{selectedMember.name}</SheetTitle>
                  <SheetDescription className="text-amber-700 font-serif italic text-lg mt-1">
                    {selectedMember.years}
                  </SheetDescription>
                </div>
                <div className="inline-block px-4 py-1 rounded-full bg-stone-100 text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">
                  {selectedMember.title}
                </div>
              </SheetHeader>

              <div className="mt-10 space-y-8">
                <section>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3 border-b pb-2">Личная летопись</h4>
                  <p className="font-serif text-stone-800 leading-relaxed text-lg first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                    {selectedMember.bio || "История этого предка еще собирается по крупицам в архивах..."}
                  </p>
                </section>

                {selectedMember.habits?.length > 0 && (
                  <section>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">Черты и привычки</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.habits.map(h => (
                        <span key={h} className="bg-white border border-stone-200 px-3 py-1 rounded-sm text-sm font-serif text-stone-700 shadow-sm">
                          {h}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {selectedMember.medical?.length > 0 && (
                  <section className="bg-red-50/50 p-4 border border-red-100 rounded-sm">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold mb-3">Генетическая память (Здоровье)</h4>
                    <ul className="space-y-1">
                      {selectedMember.medical.map(m => (
                        <li key={m} className="text-sm font-serif text-red-900 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {m}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tree;