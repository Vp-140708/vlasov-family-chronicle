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
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { supabase } from '../lib/supabase';
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Функция для отрисовки красивой карточки (только для экрана)
  const renderNodeLabel = (m: FamilyMember) => (
    <div className={`p-4 rounded-xl border-t-4 shadow-xl bg-white w-60 text-center border-stone-200 transition-all hover:scale-105 ${
      m.branch === 'paternal' ? 'border-t-blue-800' : (m.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
    }`}>
      <div className="font-serif font-bold text-slate-900 leading-tight">{m.name}</div>
      <div className="text-xs text-amber-700 font-bold">{m.years}</div>
      <div className="text-[9px] uppercase text-stone-400 mt-1">{m.title}</div>
    </div>
  );

  // Начальные узлы (подгружаем данные из familyData и добавляем им визуализацию)
  const initialNodes: Node[] = useMemo(() => familyMembers.map((m, index) => ({
    id: m.id,
    data: { member: m, label: renderNodeLabel(m) },
    position: { x: m.branch === 'paternal' ? -400 : 400, y: m.generation * 300 },
    draggable: true,
  })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 1. ЗАГРУЗКА ИЗ БАЗЫ
  useEffect(() => {
    const loadTree = async () => {
      const { data, error } = await supabase
        .from('tree_layout')
        .select('*')
        .filter('id', 'eq', 'main_tree')
        .maybeSingle();

      if (data && !error && data.nodes) {
        // Восстанавливаем JSX-лейблы, так как в базе их нет
        const rehydratedNodes = data.nodes.map((savedNode: any) => {
          const member = familyMembers.find(m => m.id === savedNode.id);
          return {
            ...savedNode,
            data: { 
              member: member, 
              label: member ? renderNodeLabel(member) : 'Unknown' 
            }
          };
        });
        setNodes(rehydratedNodes);
        if (data.edges) setEdges(data.edges);
      }
    };
    loadTree();
  }, [setNodes, setEdges]);

  // 2. СОХРАНЕНИЕ В БАЗУ (С ОЧИСТКОЙ)
  const saveToSupabase = async () => {
    setIsSaving(true);
    try {
      // Очищаем узлы от JSX перед сохранением (оставляем только id, position и type)
      const cleanNodes = nodes.map(({ id, position, type, data }) => ({
        id,
        position,
        type,
        // Сохраняем только id участника, а не весь компонент label
        data: { memberId: data.member?.id } 
      }));

      const { error } = await supabase
        .from('tree_layout')
        .upsert({ 
          id: 'main_tree', 
          nodes: cleanNodes, // Теперь тут нет цикличных ссылок!
          edges: edges,
          updated_at: new Date().toISOString() 
        });

      if (error) throw error;
      alert("Расположение сохранено в облаке!");
    } catch (error: any) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'step',
      style: { stroke: '#d4af37', strokeWidth: 2 },
    }, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => node.data?.member && setSelectedMember(node.data.member)}
        fitView
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        <Panel position="top-left" className="bg-white/90 p-4 border border-stone-200 shadow-sm rounded-lg">
            <h2 className="font-serif font-bold text-stone-800">Конструктор архива</h2>
            <button 
              onClick={saveToSupabase}
              disabled={isSaving}
              className="mt-2 w-full bg-amber-600 text-white text-xs font-bold py-2 px-4 rounded hover:bg-amber-700 disabled:opacity-50"
            >
              {isSaving ? "СОХРАНЕНИЕ..." : "ЗАФИКСИРОВАТЬ В БАЗЕ"}
            </button>
        </Panel>
      </ReactFlow>

      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] overflow-y-auto">
          {selectedMember && (
            <div className="py-8 font-serif">
                <h2 className="text-3xl text-stone-900">{selectedMember.name}</h2>
                <p className="text-amber-700 italic text-xl mb-6">{selectedMember.years}</p>
                <p className="text-lg text-stone-800 leading-relaxed">
                  {selectedMember.bio || "Биография исследуется..."}
                </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tree;