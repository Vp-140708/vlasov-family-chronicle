import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, NodeMouseHandler } from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { User, X, Calendar, Music } from 'lucide-react';

export default function Tree() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    setLoading(true);
    const { data: people, error } = await supabase.from('people').select('*');

    if (error) {
      console.error("Ошибка загрузки:", error);
      setLoading(false);
      return;
    }

    if (people) {
      const flowNodes: Node[] = people.map((person, index) => ({
        id: person.id,
        position: { x: index * 250, y: person.father_id ? 300 : 50 },
        data: {
          label: (
            <div className="text-center p-2 font-serif">
              <div className="w-10 h-10 bg-[#b4945c] rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <User size={20} />
              </div>
              <div className="font-bold text-stone-800">{person.full_name}</div>
              <div className="text-[10px] text-[#b4945c]">{person.birth_date} — {person.death_date || 'н.в.'}</div>
            </div>
          ),
        },
        style: {
          background: '#fff',
          border: '2px solid #b4945c',
          borderRadius: '8px',
          width: 200,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        },
      }));

      const flowEdges: Edge[] = [];
      people.forEach((person) => {
        if (person.father_id) {
          flowEdges.push({
            id: `e-${person.father_id}-${person.id}`,
            source: person.father_id,
            target: person.id,
            animated: true,
            style: { stroke: '#b4945c', strokeWidth: 2 },
          });
        }
        if (person.mother_id) {
          flowEdges.push({
            id: `e-${person.mother_id}-${person.id}`,
            source: person.mother_id,
            target: person.id,
            animated: true,
            style: { stroke: '#b4945c', strokeWidth: 2 },
          });
        }
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
    setLoading(false);
  };

  const onNodeClick: NodeMouseHandler = useCallback(async (event, node) => {
    const { data } = await supabase.from('people').select('*').eq('id', node.id).single();
    if (data) setSelectedPerson(data);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6e9] font-serif">
        <div className="text-[#b4945c] animate-pulse text-2xl">Разворачиваем свитки рода...</div>
      </div>
    );
  }

  return (
    <div className="h-[90vh] w-full bg-[#fdf6e9] relative">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-4xl font-serif text-stone-800 mb-2">Генеалогическое древо</h1>
        <div className="w-24 h-1 bg-[#b4945c] mx-auto" />
      </div>

      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <Background color="#b4945c" gap={20} size={1} />
        <Controls />
      </ReactFlow>

      {/* Личное дело при клике */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#fdf6e9] border-2 border-[#b4945c] shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-stone-200 aspect-[3/4]">
                <img
                  src={selectedPerson.photo_url || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070'}
                  className="w-full h-full object-cover grayscale-[30%]"
                  alt={selectedPerson.full_name}
                />
              </div>

              <div className="p-8 flex-1 font-serif">
                <span className="text-[#b4945c] uppercase tracking-widest text-xs font-bold">Личное дело</span>
                <h2 className="text-3xl text-stone-800 mt-2 mb-4 font-bold">{selectedPerson.full_name}</h2>

                <div className="space-y-4 text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#b4945c]" />
                    <span>
                      {selectedPerson.birth_date} — {selectedPerson.death_date || 'н.в.'}
                    </span>
                  </div>

                  <p className="italic leading-relaxed">{selectedPerson.biography || 'Биография в процессе исследования...'}</p>

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
            <div className="h-2 bg-[#b4945c]" />
          </div>
        </div>
      )}
    </div>
  );
}