import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background, Controls, Node, Edge,
  applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange,
  ReactFlowProvider, useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Save, X, Heart, Shield, Book, Hammer, GraduationCap } from 'lucide-react';

const TreeContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const { setViewport, getViewport } = useReactFlow();

  const fetchData = useCallback(async () => {
    const { data: people } = await supabase.from('people').select('*');
    const { data: relations } = await supabase.from('family_edges').select('*');
    const { data: layout } = await supabase.from('tree_layout').select('*').eq('id', 'main-tree').maybeSingle();

    if (people) {
      const initialNodes = people.map(p => {
        const savedPos = layout?.nodes?.find((n: any) => n.id === p.id)?.position;

        // ОПРЕДЕЛЕНИЕ СТИЛЯ (ПО ТВОИМ ДАННЫМ)
        let roleClass = 'node-standard';
        let Icon = <div className="w-2 h-2" />;
        const text = (p.full_name + p.biography + p.info_label).toLowerCase();

        if (text.match(/капитан|полк|военный|штабс|унтер|герой|фронт|пмв|вов/)) {
          roleClass = 'node-military';
          Icon = <Shield size={10} className="text-emerald-800" />;
        } else if (text.match(/священник|духовн|церков/)) {
          roleClass = 'node-religious';
          Icon = <Book size={10} className="text-amber-700" />;
        } else if (text.match(/пахарь|крестьянин|рабочий|сталевар|шорник/)) {
          roleClass = 'node-peasant';
          Icon = <Hammer size={10} className="text-orange-900" />;
        } else if (text.match(/профессор|ученый|дворян|инженер|хирург|модельер/)) {
          roleClass = 'node-noble';
          Icon = <GraduationCap size={10} className="text-blue-900" />;
        }

        return {
          id: p.id,
          position: savedPos || { x: p.x_pos || 0, y: p.y_pos || 0 },
          data: {
            label: (
              <div className="text-center relative py-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-1 rounded-full border border-stone-200">
                  {Icon}
                </div>
                <div className="font-bold text-[11px] mb-0.5 leading-tight">{p.full_name}</div>
                <div className="text-[9px] opacity-60 italic">{p.info_label}</div>
              </div>
            )
          },
          className: `family-node ${roleClass}`
        };
      });
      setNodes(initialNodes);
    }

    // Внутри loadTree функции:
    if (relations) {
      setEdges(relations.map(r => ({
        id: r.id,
        source: r.source_id,
        target: r.target_id,
        type: 'smoothstep', // Закругленные углы
        label: r.label === 'супруги' ? '❤️' : '',
        // Настройки стиля линии
        style: {
          stroke: '#b4945c',
          strokeWidth: 2,
          // Добавляем небольшую тень для объема нити
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))'
        },
        // Настройка закругления
        pathOptions: { borderRadius: 20 },
        className: r.label === 'супруги' ? 'edge-spouse' : 'edge-blood',
      })));
    }

    // Восстанавливаем зум и камеру
    if (layout?.viewport) {
      setViewport(layout.viewport, { duration: 1000 });
    }
  }, [setViewport]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onSave = async () => {
    const viewport = getViewport();
    const { error } = await supabase.from('tree_layout').upsert({
      id: 'main-tree',
      nodes: nodes.map(n => ({ id: n.id, position: n.position })),
      viewport: viewport
    });
    if (!error) alert("Раскладка и масштаб сохранены!");
  };

  return (
    <div className="h-screen w-full bg-[#fdf6e9] relative">
      <div className="absolute top-20 right-10 z-50 flex gap-2">
        <button onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-[#b4945c] text-white rounded-full shadow-xl hover:bg-stone-800 transition-all font-serif text-xs uppercase tracking-widest">
          <Save size={16} /> Сохранить вид
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={(_, n) => {
          supabase.from('people').select('*').eq('id', n.id).single().then(({ data }) => setSelected(data));
        }}
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#b4945c" gap={40} opacity={0.1} />
        <Controls />
      </ReactFlow>

      {/* Модалка Личного дела (в твоем стиле) */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fdf6e9] border-2 border-[#b4945c] w-full max-w-3xl shadow-2xl p-10 font-serif relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"><X size={30} /></button>
            <h2 className="text-4xl text-stone-800 mb-2 font-bold">{selected.full_name}</h2>
            <p className="text-[#b4945c] italic mb-8 border-b border-[#b4945c]/30 pb-4 text-xl">{selected.info_label}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar text-stone-700 leading-relaxed italic">
                {selected.biography}
              </div>
              <div className="bg-white/60 p-6 border border-[#b4945c]/20 shadow-inner">
                <h4 className="text-[#b4945c] font-bold text-xs uppercase mb-4 tracking-tighter">Наследственные данные</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Особенности:</p>
                    <p className="text-sm">{selected.habits?.join(", ") || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 uppercase font-bold">Медицина:</p>
                    <p className="text-sm text-rose-900">{selected.medical?.join(", ") || "Нет данных"}</p>
                  </div>
                </div>
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