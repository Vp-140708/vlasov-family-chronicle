import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Panel,
  Connection,
  Edge,
  Handle,
  Position,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { supabase } from '../lib/supabase';
import { Sheet, SheetContent } from "@/components/ui/sheet";

// --- ЭТАЛОННАЯ КАРТОЧКА ПРЕДКА (ПРЕМИУМ ДИЗАЙН) ---
const FamilyNode = ({ data }: { data: { member: FamilyMember } }) => {
  const m = data.member;
  if (!m) return null;

  return (
    <div className={`group relative p-5 rounded-xl border-t-4 shadow-2xl bg-[#fdfaf5] w-64 text-center border-b border-l border-r border-stone-200 transition-all hover:scale-105 ${
      m.branch === 'paternal' ? 'border-t-blue-800' : (m.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
    }`}>
      {/* ОГРОМНЫЕ ТОЧКИ СОЕДИНЕНИЯ (24px) */}
      <Handle type="target" position={Position.Top} className="!w-6 !h-6 !bg-amber-500 !border-2 !border-white !-top-3 z-10" />
      <Handle type="source" position={Position.Bottom} className="!w-6 !h-6 !bg-amber-500 !border-2 !border-white !-bottom-3 z-10" />
      <Handle type="target" position={Position.Left} id="spouse-in" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-left-3 z-10" />
      <Handle type="source" position={Position.Right} id="spouse-out" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-right-3 z-10" />

      <div className="font-serif text-[10px] uppercase tracking-widest text-stone-400 mb-1">{m.title}</div>
      <div className="font-serif font-bold text-lg text-stone-900 leading-tight border-b border-stone-100 pb-2">{m.name}</div>
      <div className="text-xs text-amber-700 font-serif italic mt-2">{m.years}</div>
    </div>
  );
};

const nodeTypes = {
  familyNode: FamilyNode,
};

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // УМНАЯ НАЧАЛЬНАЯ РАССТАНОВКА (Чтобы не было каши)
  const initialNodes = useMemo(() => {
    const nodes: any[] =[];
    const genGroups: Record<number, FamilyMember[]> = {};
    
    // Группируем по поколениям
    familyMembers.forEach(m => {
      if (!genGroups[m.generation]) genGroups[m.generation] = [];
      genGroups[m.generation].push(m);
    });

    familyMembers.forEach((m) => {
      const membersInGen = genGroups[m.generation];
      const index = membersInGen.indexOf(m);
      const total = membersInGen.length;
      
      // Вычисляем X так, чтобы они стояли ровно в ряд
      const xPos = (index - (total - 1) / 2) * 350;
      
      // Сдвигаем папину ветку левее, мамину правее
      const branchShift = m.branch === 'paternal' ? -400 : (m.branch === 'maternal' ? 400 : 0);

      nodes.push({
        id: m.id,
        type: 'familyNode',
        data: { member: m },
        position: { x: xPos + branchShift, y: m.generation * 300 },
        draggable: true,
      });
    });
    return nodes;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Загрузка из Supabase
  useEffect(() => {
    const loadTree = async () => {
      const { data, error } = await supabase.from('tree_layout').select('*').filter('id', 'eq', 'main_tree').maybeSingle();
      if (data && !error && data.nodes && data.nodes.length > 0) {
        const rehydratedNodes = data.nodes.map((sn: any) => {
          const m = familyMembers.find(fm => fm.id === sn.id);
          // Если человек удален из базы, не грузим его
          if (!m) return null;
          return { ...sn, type: 'familyNode', data: { member: m } };
        }).filter(Boolean);
        
        setNodes(rehydratedNodes);
        if (data.edges) setEdges(data.edges);
      }
    };
    loadTree();
  }, [setNodes, setEdges]);

  // Сохранение
  const saveToSupabase = async () => {
    setIsSaving(true);
    try {
      const cleanNodes = nodes.map(({ id, position, type }) => ({ id, position, type }));
      const { error } = await supabase.from('tree_layout').upsert({ id: 'main_tree', nodes: cleanNodes, edges: edges });
      if (error) throw error;
      alert("Сохранено в облаке!");
    } catch (e: any) { alert(e.message); }
    finally { setIsSaving(false); }
  };

  // КНОПКА ПАНИКИ: СБРОСИТЬ К НАЧАЛЬНЫМ НАСТРОЙКАМ
  const resetLayout = () => {
    if (window.confirm("Это вернет все карточки в ровные ряды по поколениям и удалит текущие линии. Вы уверены?")) {
      setNodes(initialNodes);
      setEdges([]); // Очищаем связи, чтобы нарисовать заново красиво
    }
  };

  // Красивые линии (Розовые для супругов, Золотые для детей)
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const isSpouseConnection = params.sourceHandle?.includes('spouse') || params.targetHandle?.includes('spouse');
      return setEdges((eds) => addEdge({ 
        ...params, 
        type: 'default', 
        style: { stroke: isSpouseConnection ? '#f43f5e' : '#d4af37', strokeWidth: 4 },
        animated: false 
      }, eds));
    },
    [setEdges]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (window.confirm("Удалить эту связь?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      {/* Стили для того, чтобы точки были огромными и всегда поверх линий */}
      <style>{`
        .react-flow__handle { width: 20px !important; height: 20px !important; z-index: 50 !important; }
      `}</style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        deleteKeyCode={["Backspace", "Delete"]}
        connectionLineType={ConnectionLineType.Bezier}
        fitView={false}
        defaultViewport={{ x: 0, y: 800, zoom: 0.6 }} // Камера стартует снизу, где находишься ты
        minZoom={0.05}
        maxZoom={2}
        panOnDrag={true}
        nodesDraggable={true}
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        <Panel position="top-left" className="bg-white/95 p-4 border border-stone-200 shadow-2xl rounded-2xl max-w-[280px]">
            <h2 className="font-serif font-bold text-stone-800 text-lg mb-2">Конструктор</h2>
            <div className="text-[10px] text-stone-500 mb-4 space-y-1 uppercase font-bold">
              <p className="text-amber-600">● ВЕРХ/НИЗ — РОДИТЕЛИ И ДЕТИ</p>
              <p className="text-rose-600">● ЛЕВО/ПРАВО — СУПРУГИ</p>
              <p className="text-stone-400">● КЛИК НА ЛИНИЮ — УДАЛИТЬ</p>
            </div>
            <div className="space-y-2">
              <button onClick={saveToSupabase} disabled={isSaving} className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 shadow-lg transition-colors">
                {isSaving ? "СОХРАНЯЮ..." : "ЗАФИКСИРОВАТЬ"}
              </button>
              <button onClick={resetLayout} className="w-full bg-stone-200 text-stone-600 font-bold py-2 rounded-xl hover:bg-stone-300 transition-colors text-xs">
                СБРОСИТЬ РАССТАНОВКУ
              </button>
            </div>
        </Panel>
      </ReactFlow>

      {/* Выезжающая панель с биографией */}
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] overflow-y-auto sm:max-w-lg font-serif">
          {selectedMember && (
            <div className="py-8">
              <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto flex items-center justify-center text-4xl text-stone-400 border-4 border-white shadow-xl mb-4">
                    {selectedMember.name[0]}
                  </div>
                  <h2 className="text-3xl font-bold text-stone-900 leading-tight">{selectedMember.name}</h2>
                  <p className="text-amber-700 italic text-xl mt-2">{selectedMember.years}</p>
              </div>
              <div className="space-y-6 text-lg text-stone-800 leading-relaxed">
                  <p>{selectedMember.bio || "Жизненный путь исследуется..."}</p>
                  
                  {selectedMember.habits?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-2">Особенности</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.habits.map(h => <span key={h} className="bg-white border border-stone-200 px-3 py-1 rounded-md text-sm shadow-sm">{h}</span>)}
                      </div>
                    </div>
                  )}

                  {selectedMember.medical?.length > 0 && (
                    <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-lg">
                      <h4 className="text-xs uppercase tracking-widest text-red-500 font-bold mb-2">Медицинский профиль</h4>
                      <ul className="list-disc pl-5 text-sm text-red-900/80">{selectedMember.medical.map(m => <li key={m}>{m}</li>)}</ul>
                    </div>
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