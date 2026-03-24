import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, NodeMouseHandler } from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { User, X, Calendar, MapPin, Award, Music } from 'lucide-react';

export default function Tree() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Функция клика по узлу
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    // Находим данные человека в базе по ID узла
    fetchPersonDetails(node.id);
  }, []);

  async function fetchPersonDetails(id: string) {
    const { data } = await supabase.from('people').select('*').eq('id', id).single();
    if (data) setSelectedPerson(data);
  }

  const saveLayout = async () => {
    const { error } = await supabase
      .from('tree_layout')
      .upsert({ id: 'main-tree', nodes, edges });
    if (!error) alert("Положения зафиксированы в истории!");
  };
  // ... (весь код loadFamilyData из предыдущего сообщения остается) ...

  return (
    <div className="h-screen w-full relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#b4945c" gap={20} size={1} />
        <Controls />
      </ReactFlow>

      {/* ВСПЛЫВАЮЩЕЕ ОКНО (МОДАЛКА) */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#fdf6e9] border-2 border-[#b4945c] shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Фото слева */}
              <div className="w-full md:w-1/3 bg-stone-200 aspect-[3/4]">
                <img 
                  src={selectedPerson.photo_url || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070"} 
                  className="w-full h-full object-cover grayscale-[30%]"
                  alt={selectedPerson.full_name}
                />
              </div>

              {/* Инфо справа */}
              <div className="p-8 flex-1 font-serif">
                <span className="text-[#b4945c] uppercase tracking-widest text-xs font-bold">Личное дело</span>
                <h2 className="text-3xl text-stone-800 mt-2 mb-4 font-bold">{selectedPerson.full_name}</h2>
                
                <div className="space-y-4 text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#b4945c]" />
                    <span>{selectedPerson.birth_date} — {selectedPerson.death_date || 'н.в.'}</span>
                  </div>
                  
                  <p className="italic leading-relaxed">
                    {selectedPerson.biography || "Биография в процессе исследования..."}
                  </p>

                  {/* Аудиозапись если есть */}
                  {selectedPerson.audio_url && (
                    <div className="mt-6 p-4 bg-white/50 border border-[#b4945c]/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 text-[#b4945c] font-bold text-xs uppercase">
                        <Music size={14} /> Голос предка
                      </div>
                      <audio controls className="w-full h-8">
                        <source src={selectedPerson.audio_url} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Золотая кайма внизу */}
            <div className="h-2 bg-[#b4945c]" />
          </div>
        </div>
      )}
    </div>
  );
}