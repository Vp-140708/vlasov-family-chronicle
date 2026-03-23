import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Panel,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers } from '../data/familyData';
import { supabase } from '../lib/supabase'; // Импортируем базу

const Tree = () => {
  // Начальная расстановка (дефолтная)
  const defaultNodes = familyMembers.map((m, index) => ({
    id: m.id,
    data: { label: (
      <div className="p-3 text-center font-serif">
        <div className="font-bold text-[13px]">{m.name}</div>
        <div className="text-[10px] text-amber-700 italic">{m.years}</div>
      </div>
    )},
    position: { x: (index % 5) * 280, y: m.generation * 200 },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaving, setIsSaving] = useState(false);

  // 1. ЗАГРУЗКА ИЗ БАЗЫ ПРИ ОТКРЫТИИ
  useEffect(() => {
    const loadTree = async () => {
      const { data, error } = await supabase
        .from('tree_layout')
        .select('*')
        .eq('id', 'main_tree')
        .single();

      if (data && !error) {
        // Если в базе есть данные, обновляем позиции и связи
        setNodes(data.nodes);
        setEdges(data.edges);
      }
    };
    loadTree();
  }, [setNodes, setEdges]);

  // 2. СОХРАНЕНИЕ В БАЗУ ПО КНОПКЕ
  const saveToSupabase = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('tree_layout')
      .upsert({ 
        id: 'main_tree', 
        nodes: nodes, 
        edges: edges,
        updated_at: new Date() 
      });

    if (error) {
      alert("Ошибка сохранения: " + error.message);
    } else {
      alert("Всё сохранено в облако!");
    }
    setIsSaving(false);
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ 
      ...params, 
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
        fitView
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
        <Panel position="top-left" className="bg-white/95 p-4 border border-stone-200 shadow-xl rounded-2xl">
            <h2 className="font-serif font-bold text-stone-800">Облачный архив</h2>
            <p className="text-[10px] text-stone-500 mb-4 uppercase">Данные сохраняются навсегда</p>
            <button 
              onClick={saveToSupabase}
              disabled={isSaving}
              className="w-full bg-amber-600 text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-amber-700 disabled:opacity-50"
            >
              {isSaving ? "СОХРАНЯЮ..." : "ЗАФИКСИРОВАТЬ В БАЗЕ"}
            </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Tree;