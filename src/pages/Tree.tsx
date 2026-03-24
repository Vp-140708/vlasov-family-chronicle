import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, Controls, Node, Edge, 
  applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange,
  ReactFlowProvider, useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Save, X, Info } from 'lucide-react';

const TreeContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const { setViewport, getViewport } = useReactFlow();

  // 1. ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    const fetchData = async () => {
      const { data: people } = await supabase.from('people').select('*');
      const { data: relations } = await supabase.from('family_edges').select('*');
      const { data: layout } = await supabase.from('tree_layout').select('*').eq('id', 'main-tree').single();

      if (people) {
        const initialNodes = people.map(p => {
          // Если есть сохраненная позиция в layout, берем её, иначе из таблицы people
          const savedPos = layout?.nodes?.find((n: any) => n.id === p.id)?.position;
          
          // Логика определения стиля по титулу/био
          let roleClass = 'node-standard';
          const title = p.biography?.toLowerCase() || '';
          if (title.includes('военный') || title.includes('капитан') || title.includes('полк')) roleClass = 'node-military';
          if (title.includes('священник') || title.includes('духовн')) roleClass = 'node-religious';
          if (title.includes('крестьянин') || title.includes('пахарь')) roleClass = 'node-peasant';
          if (title.includes('дворян') || title.includes('инженер') || title.includes('профессор')) roleClass = 'node-noble';

          return {
            id: p.id,
            type: 'default',
            position: savedPos || { x: p.x_pos || 0, y: p.y_pos || 0 },
            data: { label: (
              <div className="text-center relative">
                <div className="font-bold text-xs mb-1">{p.full_name}</div>
                <div className="text-[10px] opacity-70 italic">{p.info_label}</div>
              </div>
            )},
            className: `family-node ${roleClass}`
          };
        });
        setNodes(initialNodes);
      }

      if (relations) {
        setEdges(relations.map(r => ({
          id: r.id,
          source: r.source_id,
          target: r.target_id,
          label: r.label === 'супруги' ? '❤️' : '',
          type: 'smoothstep', // ЗАКРУГЛЕННЫЕ ЛИНИИ
          className: r.label === 'супруги' ? 'edge-spouse' : '',
          data: { label: r.label }
        })));
      }

      // Загружаем зум и положение камеры
      if (layout?.viewport) {
        setViewport(layout.viewport, { duration: 1000 });
      }
    };
    fetchData();
  }, [setViewport]);

  // 2. ОБРАБОТКА ИЗМЕНЕНИЙ (Ручное перемещение)
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // 3. СОХРАНЕНИЕ ВСЕГО
  const onSave = async () => {
    const viewport = getViewport();
    const { error } = await supabase.from('tree_layout').upsert({
      id: 'main-tree',
      nodes: nodes.map(n => ({ id: n.id, position: n.position })),
      edges: edges,
      viewport: viewport
    });

    if (!error) alert("Расположение и зум сохранены!");
    else alert("Ошибка сохранения: " + error.message);
  };

  return (
    <div className="h-screen w-full bg-[#fdf6e9] relative">
      {/* Кнопка Сохранить */}
      <div className="absolute top-20 right-10 z-50">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#b4945c] text-white rounded-full shadow-2xl hover:bg-stone-800 transition-all font-serif uppercase text-xs tracking-widest"
        >
          <Save size={16} /> Зафиксировать раскладку
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, n) => {
          supabase.from('people').select('*').eq('id', n.id).single().then(({data}) => setSelected(data));
        }}
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#b4945c" gap={40} size={1} opacity={0.1} />
        <Controls />
      </ReactFlow>

      {/* Личное дело */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fdf6e9] border-2 border-[#b4945c] w-full max-w-3xl shadow-2xl rounded-sm p-8 font-serif relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"><X size={24} /></button>
            <h2 className="text-4xl text-stone-800 mb-2 font-bold">{selected.full_name}</h2>
            <p className="text-[#b4945c] italic mb-6 border-b border-[#b4945c]/20 pb-2 text-xl">{selected.info_label}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <p className="italic leading-relaxed text-stone-700">{selected.biography || "История исследуется..."}</p>
               </div>
               <div className="bg-white/50 p-6 border border-[#b4945c]/20 rounded">
                  <h4 className="text-[#b4945c] font-bold text-xs uppercase mb-4 tracking-tighter">Наследственные черты</h4>
                  {selected.habits?.length > 0 && <div className="mb-4 text-sm"><b>Особенности:</b> {selected.habits.join(", ")}</div>}
                  {selected.medical?.length > 0 && <div className="text-sm text-rose-900"><b>Медицина:</b> {selected.medical.join(", ")}</div>}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Tree() {
  return (
    <ReactFlowProvider>
      <TreeContent />
    </ReactFlowProvider>
  );
}