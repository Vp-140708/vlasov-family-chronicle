import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, addEdge, Panel, Connection, Edge, Handle, Position, ConnectionLineType } from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { supabase } from '../lib/supabase';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Medal, HeartPulse, Home, Sparkles, User, FileText } from 'lucide-react'; // НОВЫЕ ИКОНКИ

const FamilyNode = ({ data }: { data: { member: FamilyMember } }) => {
  if (!data.member) return null;
  return (
    <div className={`group relative p-4 rounded-xl border-t-4 shadow-2xl bg-white w-64 text-center border-stone-200 transition-all hover:scale-105 ${
      data.member.branch === 'paternal' ? 'border-t-blue-800' : (data.member.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
    }`}>
      <Handle type="target" position={Position.Top} className="!w-6 !h-6 !bg-orange-500 !border-2 !border-white !-top-3" />
      <Handle type="source" position={Position.Bottom} className="!w-6 !h-6 !bg-orange-500 !border-2 !border-white !-bottom-3" />
      <Handle type="target" position={Position.Left} id="spouse-in" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-left-3" />
      <Handle type="source" position={Position.Right} id="spouse-out" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-right-3" />
      <div className="font-serif font-bold text-slate-900 text-lg leading-tight">{data.member.name}</div>
      <div className="text-sm text-amber-700 font-bold mt-1">{data.member.years}</div>
      <div className="text-[10px] uppercase text-stone-400 mt-2 tracking-widest">{data.member.title}</div>
    </div>
  );
};

const Tree = () => {
  const[selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const nodeTypes = useMemo(() => ({ familyNode: FamilyNode }),[]);

  const initialNodes = useMemo(() => familyMembers.map((m, index) => ({
    id: m.id, type: 'familyNode', data: { member: m },
    position: { x: (index % 5) * 350 - 800, y: m.generation * 320 },
  })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('tree_layout').select('*').filter('id', 'eq', 'main_tree').maybeSingle();
      if (data?.nodes) {
        setNodes(data.nodes.map((sn: any) => ({ ...sn, data: { member: familyMembers.find(fm => fm.id === sn.id) } })));
        setEdges(data.edges || []);
      }
    };
    load();
  },[]);

  const save = async () => {
    setIsSaving(true);
    const cleanNodes = nodes.map(({ id, position, type }) => ({ id, position, type }));
    await supabase.from('tree_layout').upsert({ id: 'main_tree', nodes: cleanNodes, edges });
    alert("Сохранено!");
    setIsSaving(false);
  };

  // ФИКС УДАЛЕНИЯ ЛИНИЙ: Добавлена interactionWidth (невидимая зона клика)
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ 
    ...params, 
    type: 'default', 
    style: { stroke: params.sourceHandle?.includes('spouse') ? '#f43f5e' : '#d4af37', strokeWidth: 3 },
    interactionWidth: 25 // Теперь по линии легко кликнуть!
  }, eds)),[setEdges]);

  // Удаление по клику
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (window.confirm("Удалить эту связь?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  },[setEdges]);
  const getCategoryStyles = (cat: MemberCategory) => {
    switch (cat) {
      case "young": return "border-t-amber-400 bg-amber-50"; // Золотистый
      case "parents": return "border-t-blue-400 bg-blue-50"; // Голубой
      case "grandparents": return "border-t-emerald-400 bg-emerald-50"; // Зеленый
      case "ww2": return "border-t-indigo-900 bg-indigo-50 text-indigo-900"; // Военный синий
      case "ww1": return "border-t-red-800 bg-red-50 text-red-900"; // Имперский красный
      case "peasant": return "border-t-orange-800 bg-orange-50"; // Коричневый
      case "middle": return "border-t-slate-500 bg-slate-50"; // Серый
      case "elite": return "border-t-purple-800 bg-purple-50"; // Пурпурный
      default: return "border-t-stone-400 bg-white";
    }
  };

  const renderNodeLabel = (m: FamilyMember) => (
    <div className={`p-4 rounded-xl border-t-8 shadow-2xl w-64 text-center border-stone-200 transition-all hover:scale-105 ${getCategoryStyles(m.category)}`}>
      <div className="font-serif text-[8px] uppercase tracking-[0.2em] opacity-60 mb-1">{m.category}</div>
      <div className="font-serif font-bold text-lg leading-tight">{m.name}</div>
      <div className="text-xs font-bold mt-1 opacity-80">{m.years}</div>
      <div className="text-[10px] uppercase mt-2 font-medium opacity-60">{m.title}</div>
    </div>
  );
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      <ReactFlow 
        nodes={nodes} edges={edges} nodeTypes={nodeTypes} 
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
        onConnect={onConnect} onEdgeClick={onEdgeClick} 
        deleteKeyCode={["Backspace", "Delete"]}
        onNodeClick={(_, node) => node.data?.member && setSelectedMember(node.data.member)} 
        connectionLineType={ConnectionLineType.Bezier}
        fitView
        fitView={false} 
        
        // 2. Устанавливаем начальную позицию камеры (X, Y) и масштаб (zoom)
        // X: 0 (центр), Y: 600 (уровень поколения дедов), Zoom: 0.8 (комфортный масштаб)
        defaultViewport={{ x: 700, y: -150, zoom: 0.285 }} 
        
        // 3. Границы масштабирования
        minZoom={0.05} // Позволяет отдалиться очень далеко
        maxZoom={2}    // Позволяет приблизиться
        
        // 4. Управление
        panOnDrag={true} // Перемещение зажатием мыши
        zoomOnScroll={true} // Зум колесиком
        nodesDraggable={true} // РАЗРЕШАЕМ ДВИГАТЬ КАРТОЧКИ (для расстановки)
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        <Panel position="top-left" className="bg-white/95 p-4 border border-stone-200 shadow-xl rounded-xl">
          <p className="text-[10px] text-stone-500 mb-2 uppercase font-bold">Клик на линию = Удалить</p>
          <button onClick={save} disabled={isSaving} className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold w-full">{isSaving ? "..." : "СОХРАНИТЬ"}</button>
        </Panel>
      </ReactFlow>

      {/* НОВАЯ ПОДРОБНАЯ БОКОВАЯ ПАНЕЛЬ */}
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] overflow-y-auto sm:max-w-lg font-serif p-0">
          {selectedMember && (
            <div className="h-full">
              {/* Шапка карточки */}
              <div className="bg-stone-900 text-stone-50 p-8 pt-12">
                <div className="text-amber-500 text-xs uppercase tracking-[0.3em] font-bold mb-2">{selectedMember.title}</div>
                <h2 className="text-3xl font-bold mb-2">{selectedMember.name}</h2>
                <div className="text-stone-400 italic text-lg">{selectedMember.years}</div>
              </div>

              {/* Тело карточки */}
              <div className="p-8 space-y-8">
                
                {/* Биография */}
                <section>
                  <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-bold mb-3 border-b border-stone-200 pb-2">
                    <FileText size={16} /> Основной путь
                  </h4>
                  <p className="text-stone-800 leading-relaxed text-lg text-justify">{selectedMember.bio || "Сведения собираются..."}</p>
                </section>

                {/* Награды и Достижения */}
                {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                  <section>
                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-600 font-bold mb-3 border-b border-stone-200 pb-2">
                      <Medal size={16} /> Награды и статус
                    </h4>
                    <ul className="space-y-2">
                      {selectedMember.achievements.map((a, i) => (
                        <li key={i} className="text-stone-800 bg-amber-50/50 p-3 rounded border border-amber-100">{a}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Владения / Состояние */}
                {selectedMember.possessions && (
                  <section>
                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-600 font-bold mb-3 border-b border-stone-200 pb-2">
                      <Home size={16} /> Быт и владения
                    </h4>
                    <p className="text-stone-800 italic">{selectedMember.possessions}</p>
                  </section>
                )}

                {/* Характер и внешность */}
                {(selectedMember.character?.length > 0 || selectedMember.appearance) && (
                  <section>
                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-600 font-bold mb-3 border-b border-stone-200 pb-2">
                      <User size={16} /> Личность
                    </h4>
                    {selectedMember.appearance && <p className="text-stone-800 mb-3"><strong>Внешность:</strong> {selectedMember.appearance}</p>}
                    {selectedMember.character && selectedMember.character.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.character.map((c, i) => (
                          <span key={i} className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm border border-stone-200">{c}</span>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Здоровье */}
                {selectedMember.medical?.length > 0 && (
                  <section className="mt-8">
                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-500 font-bold mb-3 border-b border-stone-200 pb-2">
                      <HeartPulse size={16} /> Медицинский профиль
                    </h4>
                    <ul className="list-inside list-disc text-red-900/80 text-sm space-y-1">
                      {selectedMember.medical.map((m, i) => <li key={i}>{m}</li>)}
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