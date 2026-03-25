import { useEffect, useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background, Controls, Node, Edge,
  applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange,
  ReactFlowProvider, useReactFlow, Position, ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Save, X, Medal, HeartPulse, Home, User, FileText, Star, Search, LogOut, GraduationCap, MapPin, Briefcase,Sparkles  } from 'lucide-react';
import dagre from '@dagrejs/dagre';
import PersonNode from '../components/PersonNode';
import { toast } from "sonner";

const MY_NODE_TYPES = {
  custom: PersonNode,
  person: PersonNode
};

const MY_EDGE_OPTIONS = {
  type: 'default',
  style: { stroke: '#cda85f', strokeWidth: 3 },
};

const TreeContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { setViewport, getViewport, setCenter } = useReactFlow();

  // Функция выхода
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const fetchData = useCallback(async () => {
    const { data: people } = await supabase.from('people').select('*');
    const { data: relations } = await supabase.from('family_edges').select('*');
    const { data: layout } = await supabase.from('tree_layout').select('*').eq('id', 'main-tree').maybeSingle();

    if (people) {
      const initialNodes = people.map(p => {
        const saved = layout?.nodes?.find((n: any) => n.id === p.id);
        let role = 'node-standard';
        const bio = (p.biography || "").toLowerCase();
        if (bio.includes('священник')) role = 'node-religious';
        if (bio.includes('военный') || bio.includes('капитан')) role = 'node-military';
        if (bio.includes('крестьянин') || bio.includes('пахарь')) role = 'node-peasant';
        if (bio.includes('дворян') || bio.includes('инженер')) role = 'node-noble';

        return {
          id: p.id,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          position: saved?.position || { x: 0, y: 0 },
          data: { 
            member: p,
            label: (
              <div className="text-center p-2">
                <div className="font-bold text-[13px] leading-tight mb-1">{p.full_name}</div>
                <div className="text-[10px] text-amber-700 italic">{p.info_label}</div>
              </div>
            )
          },
          className: `family-node ${role}`
        };
      });
      setNodes(initialNodes);
    }

    if (relations) {
      setEdges(relations.map(r => ({
        id: r.id,
        source: r.source_id,
        target: r.target_id,
        type: r.label === 'супруги' ? 'smoothstep' : 'default',
        style: {
          stroke: r.label === 'супруги' ? '#f43f5e' : '#cda85f',
          strokeWidth: r.label === 'супруги' ? 4 : 3
        },
        interactionWidth: 30, // Сделал зону клика еще шире для удаления
      })));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onNodesChange: OnNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((chs) => setEdges((eds) => applyEdgeChanges(chs, eds)), []);

  const onSave = async () => {
    const { error } = await supabase.from('tree_layout').upsert({
      id: 'main-tree',
      nodes: nodes.map(n => ({ id: n.id, position: n.position })),
      viewport: getViewport(),
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
    });
    if (!error) toast.success("Данные синхронизированы с облаком");
  };

  const onEdgeClick = useCallback((event: any, edge: Edge) => {
    if (window.confirm("Удалить эту связь?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, []);

  // Хелпер для отображения данных или "Неизвестно"
  const InfoRow = ({ icon: Icon, label, value, color = "text-stone-400" }: any) => (
    <div className="flex flex-col gap-1">
      <h4 className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold ${color} border-b border-stone-200 pb-1 mb-1`}>
        <Icon size={14} /> {label}
      </h4>
      <p className="text-stone-800 text-base">{value || "Неизвестно"}</p>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#fdfaf5] relative">
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="absolute top-20 left-4 right-4 md:left-10 z-50 flex flex-wrap gap-3 pointer-events-auto">
        <input
          className="pl-4 pr-4 py-2 bg-white border border-[#b4945c] rounded-full font-serif text-sm w-full md:w-64 shadow-lg"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button onClick={onSave} className="flex items-center gap-2 px-6 py-2 bg-[#b4945c] text-white rounded-full shadow-lg font-serif text-[10px] tracking-widest font-bold">
          <Save size={14} /> Сохранить
        </button>
        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full shadow-lg font-serif text-[10px] tracking-widest font-bold">
          <LogOut size={14} /> Выйти
        </button>
      </div>

      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onNodeClick={(_, node) => node.data?.member && setSelected(node.data.member)}
        nodeTypes={MY_NODE_TYPES} defaultEdgeOptions={MY_EDGE_OPTIONS}
        fitView minZoom={0.01}
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
      </ReactFlow>

      {/* КАРТОЧКА ОПИСАНИЯ */}
      {selected && (
        <div className="fixed inset-0 z-[1000] flex items-stretch justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          {/* Клик по фону теперь тоже закрывает */}
          <div className="absolute inset-0" onClick={() => setSelected(null)} />
          
          <div className="relative bg-[#fdfaf5] h-full w-full sm:max-w-xl shadow-2xl overflow-y-auto border-l-4 border-[#b4945c] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Кнопка закрытия вынесена в отдельный слой */}
            <button 
              onClick={() => setSelected(null)} 
              className="absolute top-6 left-6 z-[1100] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/30 transition-all shadow-xl"
              style={{ pointerEvents: 'auto' }}
            >
              <X size={28} />
            </button>

            {/* Header */}
            <div className="bg-stone-900 text-stone-50 p-10 pt-20 relative">
              <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">
                <Star size={12} fill="currentColor" /> {selected.info_label || "Член рода"}
              </div>
              <h2 className="text-4xl font-serif font-bold mb-2 leading-tight">{selected.full_name}</h2>
              <p className="text-stone-400 italic text-xl font-serif">{selected.years || "Даты уточняются"}</p>
            </div>

            {/* Детальная информация */}
            <div className="p-10 space-y-8 font-serif">
              
              <section className="bg-white p-6 border border-stone-200 rounded-sm shadow-sm">
                 <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-4 border-b pb-2"><FileText size={16}/> Летопись</h4>
                 <p className="text-lg leading-relaxed text-stone-800 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-stone-900">
                   {selected.biography || "В архивах пока не найдено развернутого описания жизненного пути."}
                 </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoRow icon={MapPin} label="Место рождения" value={selected.birth_place} />
                <InfoRow icon={GraduationCap} label="Обучение" value={selected.education} />
                <InfoRow icon={Briefcase} label="Профессия" value={selected.profession} />
                <InfoRow icon={User} label="Внешность" value={selected.appearance} />
              </div>

              <InfoRow icon={Sparkles} label="Характер и особенности" value={selected.character_traits} />
              
              <InfoRow 
                icon={Medal} 
                label="Награды и достижения" 
                value={selected.achievements} 
                color="text-amber-600" 
              />
              
              <InfoRow 
                icon={Home} 
                label="Быт и владения" 
                value={selected.possessions} 
                color="text-emerald-700" 
              />

              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <InfoRow 
                  icon={HeartPulse} 
                  label="Медицинские заметки" 
                  value={selected.health_info} 
                  color="text-red-500" 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Tree() { return (<ReactFlowProvider><TreeContent /></ReactFlowProvider>); } 