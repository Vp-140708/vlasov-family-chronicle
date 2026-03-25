import { useEffect, useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background, Controls, Node, Edge,
  applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange,
  ReactFlowProvider, useReactFlow, Position, ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
// ДОБАВИЛ Search В ИМПОРТ НИЖЕ
import { Save, X, Medal, HeartPulse, Home, User, FileText, Star, Search } from 'lucide-react';
import dagre from '@dagrejs/dagre';
import PersonNode from '../components/PersonNode';
import { toast } from "sonner";

const MY_NODE_TYPES = {
  custom: PersonNode,
  person: PersonNode
};

const MY_EDGE_OPTIONS = {
  type: 'default',
  style: {
    stroke: '#cda85f',
    strokeWidth: 3,
  },
};

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 260, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        type: 'custom',
        position: {
          x: nodeWithPosition.x - 260 / 2,
          y: nodeWithPosition.y - 80 / 2,
        },
      };
    }),
    edges,
  };
};

const TreeContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { setViewport, getViewport, setCenter } = useReactFlow();

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
          position: saved?.position || { x: p.x_pos || 0, y: p.y_pos || 0 },
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
        interactionWidth: 25,
      })));
    }

    if (layout?.viewport) setViewport(layout.viewport, { duration: 1000 });
  }, [setViewport]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onNodesChange: OnNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((chs) => setEdges((eds) => applyEdgeChanges(chs, eds)), []);

  const onSave = async () => {
    const { error } = await supabase.from('tree_layout').upsert({
      id: 'main-tree',
      nodes: nodes.map(n => ({ id: n.id, position: n.position })),
      viewport: getViewport(),
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, type: e.type, style: e.style }))
    });
    if (!error) toast.success("Ваша расстановка и связи сохранены!");
  };

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges]);

  const onEdgeClick = useCallback((event: any, edge: Edge) => {
    if (window.confirm("Удалить эту связь?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, []);

  return (
    <div className="h-screen w-full bg-[#fdfaf5] relative">
      <div className="absolute top-20 left-10 z-50 flex flex-wrap gap-3 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 text-stone-400" size={16} />
          <input
            className="pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-[#b4945c] rounded-full font-serif text-sm w-64 shadow-lg focus:ring-2 focus:ring-[#b4945c]"
            placeholder="Поиск по архиву..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              const found = nodes.find(n => n.id.toLowerCase().includes(e.target.value.toLowerCase()));
              if (found) setCenter(found.position.x, found.position.y, { zoom: 1, duration: 500 });
            }}
          />
        </div>
        <button onClick={onSave} className="flex items-center gap-2 px-6 py-2 bg-[#b4945c] text-white rounded-full shadow-lg font-serif uppercase text-[10px] tracking-widest font-bold hover:bg-[#8e7549] transition-all">
          <Save size={14} /> Сохранить в облако
        </button>
        <button onClick={onLayout} className="bg-stone-800 text-white px-6 py-2 rounded-full font-serif uppercase text-[10px] tracking-widest font-bold shadow-lg hover:bg-black transition-all">
          ✨ Выровнять всё
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onNodeClick={(_, node) => node.data?.member && setSelected(node.data.member)}
        nodeTypes={MY_NODE_TYPES}
        defaultEdgeOptions={MY_EDGE_OPTIONS}
        fitView
        minZoom={0.01}
      >
        <Background color="#dcd6cc" gap={40} />
        <Controls />
      </ReactFlow>

      {selected && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-end sm:p-0 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fdfaf5] h-full sm:h-full w-full sm:max-w-xl shadow-2xl overflow-y-auto border-l-2 border-[#b4945c] animate-in slide-in-from-right duration-300">
            <div className="bg-stone-900 text-stone-50 p-8 pt-12 relative">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-stone-400 hover:text-white"><X size={32} /></button>
              <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">
                <Star size={12} fill="currentColor" /> {selected.info_label || "Член рода"}
              </div>
              <h2 className="text-4xl font-serif font-bold mb-2">{selected.full_name}</h2>
              <p className="text-stone-400 italic text-xl">{selected.years || "Даты уточняются"}</p>
            </div>
            <div className="p-8 space-y-10 font-serif text-stone-800">
              <section>
                <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-4 border-b border-stone-200 pb-2">
                  <FileText size={18} /> Летопись жизни
                </h4>
                <p className="text-lg leading-relaxed text-justify first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                  {selected.biography || "Сведения собираются в государственных и семейных архивах..."}
                </p>
              </section>
              {selected.achievements && (
                <section>
                  <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-600 font-bold mb-4 border-b border-stone-200 pb-2">
                    <Medal size={18} /> Награды и отличия
                  </h4>
                  <p className="text-lg bg-amber-50 p-4 rounded-lg border border-amber-100 shadow-sm">{selected.achievements}</p>
                </section>
              )}
              {(selected.appearance || selected.character_traits) && (
                <section>
                  <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-blue-700 font-bold mb-4 border-b border-stone-200 pb-2">
                    <User size={18} /> Личность
                  </h4>
                  {selected.appearance && <p className="mb-4"><strong>Внешность:</strong> {selected.appearance}</p>}
                  {selected.character_traits && <p><strong>Особенности:</strong> {selected.character_traits}</p>}
                </section>
              )}
              {selected.possessions && (
                <section>
                  <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-bold mb-4 border-b border-stone-200 pb-2">
                    <Home size={18} /> Быт и состояние
                  </h4>
                  <p className="italic text-lg">{selected.possessions}</p>
                </section>
              )}
              {selected.health_info && (
                <section className="bg-red-50/50 p-6 rounded-lg border border-red-100">
                  <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold mb-3 border-b border-red-200 pb-2">
                    <HeartPulse size={18} /> Генетическая память
                  </h4>
                  <p className="text-red-900 leading-relaxed">{selected.health_info}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Tree() { return (<ReactFlowProvider><TreeContent /></ReactFlowProvider>); }