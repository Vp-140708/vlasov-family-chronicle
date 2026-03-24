import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { User } from 'lucide-react';

export default function Tree() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    setLoading(true);
    
    // 1. Тянем всех людей из базы
    const { data: people, error } = await supabase
      .from('people')
      .select('*');

    if (error) {
      console.error("Ошибка загрузки:", error);
      return;
    }

    if (people) {
      // 2. Превращаем людей в Узлы (Nodes) для React Flow
      const flowNodes: Node[] = people.map((person, index) => ({
        id: person.id,
        // Вычисляем позицию (позже можно сделать авто-раскладку, пока просто в ряд)
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
          ) 
        },
        // Стилизуем под наш "Золотой архив"
        style: { 
          background: '#fff', 
          border: '2px solid #b4945c', 
          borderRadius: '8px',
          width: 200,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }
      }));

      // 3. Создаем связи (Edges) на основе father_id и mother_id
      const flowEdges: Edge[] = [];
      people.forEach(person => {
        if (person.father_id) {
          flowEdges.push({
            id: `e-${person.father_id}-${person.id}`,
            source: person.father_id,
            target: person.id,
            animated: true,
            style: { stroke: '#b4945c', strokeWidth: 2 }
          });
        }
        if (person.mother_id) {
          flowEdges.push({
            id: `e-${person.mother_id}-${person.id}`,
            source: person.mother_id,
            target: person.id,
            animated: true,
            style: { stroke: '#b4945c', strokeWidth: 2 }
          });
        }
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e9] font-serif">
      <div className="text-[#b4945c] animate-pulse text-2xl">Разворачиваем свитки рода...</div>
    </div>
  );

  return (
    <div className="h-[90vh] w-full bg-[#fdf6e9] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-4xl font-serif text-stone-800 mb-2">Генеалогическое древо</h1>
        <div className="w-24 h-1 bg-[#b4945c] mx-auto" />
      </div>
      
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        fitView
      >
        <Background color="#b4945c" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}