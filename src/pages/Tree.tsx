import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { X, Calendar, User, Info } from 'lucide-react';

export default function Tree() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const loadTree = async () => {
    // Тянем данные из двух таблиц
    const { data: people } = await supabase.from('people').select('*');
    const { data: relations } = await supabase.from('family_edges').select('*');

    if (people && relations) {
      setNodes(people.map(p => ({
        id: p.id,
        position: { x: p.x_pos, y: p.y_pos },
        data: { 
          label: (
            <div className="group relative">
              <div className="font-bold text-[11px] leading-tight">{p.full_name}</div>
              <div className="text-[9px] text-[#b4945c] mt-1 italic">{p.info_label}</div>
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info size={10} className="text-[#b4945c]" />
              </div>
            </div>
          ) 
        },
        className: 'vintage-node' // Стиль пропишем в CSS
      })));

      setEdges(relations.map(r => ({
        id: r.id,
        source: r.source_id,
        target: r.target_id,
        label: r.label,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#b4945c', strokeWidth: 1.5, opacity: 0.6 }
      })));
    }
  };
  const flowEdges = relations.map(r => ({
    id: r.id,
    source: r.source_id,
    target: r.target_id,
    label: r.label,
    type: 'smoothstep',
    className: r.label === 'супруги' ? 'edge-spouse' : '',
    style: { stroke: '#b4945c' }
  }));

  useEffect(() => { loadTree(); }, []);

  const onNodeClick = async (_: any, node: any) => {
    const { data } = await supabase.from('people').select('*').eq('id', node.id).single();
    if (data) setSelectedPerson(data);
  };

  return (
    <div className="h-screen w-full bg-[#fdf6e9] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.05} // Чтобы видеть всё огромное дерево сразу
      >
        <Background color="#b4945c" gap={40} size={1} opacity={0.1} />
        <Controls />
        <MiniMap nodeColor="#b4945c" maskColor="rgba(253, 246, 233, 0.8)" />
      </ReactFlow>

      {/* Личное дело (Модалка) */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-[#fdf6e9] border-2 border-[#b4945c] w-full max-w-3xl shadow-2xl rounded-sm p-0 flex flex-col md:flex-row overflow-hidden animate-in zoom-in duration-300">
            <button onClick={() => setSelectedPerson(null)} className="absolute top-4 right-4 z-20 hover:rotate-90 transition-transform">
              <X size={24} className="text-stone-400" />
            </button>
            
            <div className="w-full md:w-2/5 bg-stone-200 aspect-square md:aspect-auto">
              <img 
                src={selectedPerson.photo_url || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070"} 
                className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-1000" 
              />
            </div>

            <div className="p-10 flex-1 font-serif relative">
              <span className="text-[#b4945c] uppercase tracking-[0.3em] text-[10px] font-bold">Семейный архив</span>
              <h2 className="text-4xl text-stone-800 mt-4 mb-2">{selectedPerson.full_name}</h2>
              <p className="text-[#b4945c] italic mb-8 border-b border-[#b4945c]/20 pb-4">{selectedPerson.info_label}</p>
              
              <div className="text-stone-600 leading-relaxed text-sm h-48 overflow-y-auto pr-4 custom-scrollbar">
                {selectedPerson.biography || "Биография этого предка находится в процессе восстановления по архивным документам..."}
              </div>

              {/* Золотая печать в углу */}
              <div className="absolute bottom-6 right-6 w-16 h-16 border border-[#b4945c]/30 rounded-full flex items-center justify-center rotate-12">
                <span className="text-[#b4945c] text-[8px] uppercase text-center font-bold">Архив<br/>Власовых</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}