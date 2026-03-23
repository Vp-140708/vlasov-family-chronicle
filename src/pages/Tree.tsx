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

// --- КАСТОМНАЯ КАРТОЧКА С БОЛЬШИМИ ТОЧКАМИ ---
const FamilyNode = ({ data }: { data: { member: FamilyMember } }) => {
  const m = data.member;
  if (!m) return null;

  return (
    <div className={`group relative p-4 rounded-xl border-t-4 shadow-2xl bg-white w-64 text-center border-stone-200 transition-all hover:scale-105 ${
      m.branch === 'paternal' ? 'border-t-blue-800' : (m.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
    }`}>
      {/* ОГРОМНЫЕ ТОЧКИ СОЕДИНЕНИЯ (24px) */}
      <Handle type="target" position={Position.Top} className="!w-6 !h-6 !bg-amber-500 !border-2 !border-white !-top-3" />
      <Handle type="source" position={Position.Bottom} className="!w-6 !h-6 !bg-amber-500 !border-2 !border-white !-bottom-3" />
      <Handle type="source" position={Position.Left} id="left" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-left-3" />
      <Handle type="source" position={Position.Right} id="right" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-right-3" />

      <div className="font-serif font-bold text-slate-900 text-base leading-tight">{m.name}</div>
      <div className="text-sm text-amber-700 font-bold mt-1">{m.years}</div>
      <div className="text-[10px] uppercase text-stone-400 mt-2 tracking-widest">{m.title}</div>
    </div>
  );
};

const nodeTypes = {
  familyNode: FamilyNode,
};

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialNodes = useMemo(() => familyMembers.map((m, index) => ({
    id: m.id,
    type: 'familyNode',
    data: { member: m },
    position: { x: (index % 4) * 350 - 500, y: m.generation * 300 },
  })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Загрузка данных из Supabase
  useEffect(() => {
    const loadTree = async () => {
      const { data, error } = await supabase.from('tree_layout').select('*').filter('id', 'eq', 'main_tree').maybeSingle();
      if (data && !error && data.nodes) {
        const rehydratedNodes = data.nodes.map((sn: any) => {
          const m = familyMembers.find(fm => fm.id === sn.id);
          return { ...sn, type: 'familyNode', data: { member: m } };
        });
        setNodes(rehydratedNodes);
        if (data.edges) setEdges(data.edges);
      }
    };
    loadTree();
  }, [setNodes, setEdges]);

  // Сохранение (включая удаленные связи)
  const saveToSupabase = async () => {
    setIsSaving(true);
    try {
      const cleanNodes = nodes.map(({ id, position, type }) => ({ id, position, type }));
      const { error } = await supabase.from('tree_layout').upsert({ 
        id: 'main_tree', 
        nodes: cleanNodes, 
        edges: edges 
      });
      if (error) throw error;
      alert("Изменения (включая удаление линий) сохранены!");
    } catch (e: any) { alert(e.message); }
    finally { setIsSaving(false); }
  };

  // Создание связи
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ 
      ...params, 
      style: { stroke: '#d4af37', strokeWidth: 4 },
      animated: false 
    }, eds)),
    [setEdges]
  );

  // --- ФУНКЦИЯ УДАЛЕНИЯ ЛИНИИ ---
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (window.confirm("Удалить эту связь?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick} // Удаление по клику
        deleteKeyCode={["Backspace", "Delete"]} // Удаление кнопкой
        fitView
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        <Panel position="top-left" className="bg-white/95 p-4 border border-stone-200 shadow-2xl rounded-2xl max-w-[280px]">
            <h2 className="font-serif font-bold text-stone-800 text-lg">Редактор</h2>
            <div className="text-[11px] text-stone-500 mb-4 space-y-1 uppercase">
              <p>• Тяни за точки для связи</p>
              <p>• Клик на линию для удаления</p>
              <p>• Или выдели линию и нажми Del</p>
            </div>
            <button 
              onClick={saveToSupabase}
              disabled={isSaving}
              className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 shadow-lg"
            >
              {isSaving ? "СОХРАНЯЮ..." : "ЗАФИКСИРОВАТЬ"}
            </button>
        </Panel>
      </ReactFlow>

      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5] overflow-y-auto sm:max-w-md">
          {selectedMember && (
            <div className="py-8 font-serif">
                <h2 className="text-3xl font-bold">{selectedMember.name}</h2>
                <p className="text-amber-700 italic text-xl mb-6">{selectedMember.years}</p>
                <p className="text-lg leading-relaxed text-stone-800">{selectedMember.bio}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tree;