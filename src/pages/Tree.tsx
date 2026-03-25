import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background, Controls, Node, Edge,
  applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange,
  ReactFlowProvider, useReactFlow, Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Save, X, Search } from 'lucide-react';
import dagre from '@dagrejs/dagre';
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
import PersonNode from '../components/PersonNode';


// ОПРЕДЕЛЯЕМ ДИЗАЙН ОДИН РАЗ
const MY_NODE_TYPES = {
  custom: PersonNode,
  person: PersonNode
};

const MY_EDGE_OPTIONS = {
  type: 'default', // Плавные линии
  style: {
    stroke: '#cda85f', // Золотой цвет
    strokeWidth: 3,    // Толстые линии
  },
};

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // nodesep: 30 (горизонталь) - очень близко
  // ranksep: 60 (вертикаль) - поколения очень близко
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 30, ranksep: 60 });

  nodes.forEach((node) => {
    // Указываем новые размеры: 170 в ширину, 60 в высоту
    dagreGraph.setNode(node.id, { width: 170, height: 60 });
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
        type: 'custom', // Гарантируем наш дизайн
        position: {
          x: nodeWithPosition.x - 170 / 2,
          y: nodeWithPosition.y - 60 / 2,
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
  // Вставляем функцию-обработчик
  const onSaveLayout = async () => {
    try {
      // Собираем координаты всех карточек
      const updates = nodes.map((node) => ({
        id: node.id,
        position_x: Math.round(node.position.x),
        position_y: Math.round(node.position.y),
      }));

      // ВАЖНО: Пишем правильное имя таблицы из вашей базы!
      const { error } = await supabase
        .from('tree_layout')
        .upsert(updates);

      if (error) throw error;
      toast.success("Расстановка успешно сохранена!");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при сохранении");
    }
  };
  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);
  const fetchData = useCallback(async () => {
    const { data: people } = await supabase.from('people').select('*');
    const { data: relations } = await supabase.from('family_edges').select('*');
    const { data: layout } = await supabase.from('tree_layout').select('*').eq('id', 'main-tree').maybeSingle();

    if (people) {
      const initialNodes = people.map(p => {
        const saved = layout?.nodes?.find((n: any) => n.id === p.id);

        // Определяем класс стиля
        let role = 'node-standard';
        const bio = (p.biography || "").toLowerCase();
        if (bio.includes('священник')) role = 'node-religious';
        if (bio.includes('военный') || bio.includes('капитан')) role = 'node-military';
        if (bio.includes('крестьянин') || bio.includes('пахарь')) role = 'node-peasant';
        if (bio.includes('дворян') || bio.includes('инженер')) role = 'node-noble';

        return {
          id: p.id,
          // ВАЖНО: Разрешаем вход/выход со всех сторон для удобства ручной расстановки
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          position: saved?.position || { x: p.x_pos || 0, y: p.y_pos || 0 },
          data: {
            label: (
              <div className="text-center">
                <div className="font-bold text-[11px] leading-tight mb-1">{p.full_name}</div>
                <div className="text-[9px] opacity-60 italic">{p.info_label}</div>
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
        // ТИП ЛИНИИ: default в React Flow — это плавная кривая Безье
        type: r.label === 'супруги' ? 'smoothstep' : 'default',
        label: r.label === 'супруги' ? '❤️' : '',
        style: {
          stroke: r.label === 'супруги' ? '#991b1b' : '#b4945c',
          strokeWidth: 2
        },
        // Плавность для прямых углов, если используется smoothstep
        pathOptions: { borderRadius: 40 },
        className: r.label === 'супруги' ? 'edge-spouse' : 'edge-blood'
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
      viewport: getViewport()
    });
    if (!error) alert("Ваша расстановка сохранена!");
  };

  return (
    <div className="h-screen w-full bg-[#fdf6e9] relative">
      <div className="absolute top-20 left-10 z-50 flex gap-4">
        <input
          className="pl-4 pr-4 py-2 bg-white border border-[#b4945c] rounded-md font-serif text-sm w-64 shadow-lg"
          placeholder="Поиск предка..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            const found = nodes.find(n => n.id.includes(e.target.value.toLowerCase()));
            if (found) setCenter(found.position.x, found.position.y, { zoom: 1, duration: 500 });
          }}
        />
        <button onClick={onSave} className="flex items-center gap-2 px-6 py-2 bg-[#b4945c] text-white rounded-md shadow-lg font-serif uppercase text-[10px] tracking-widest font-bold">
          <Save size={14} /> Сохранить расстановку
        </button>
        <button
          onClick={onLayout}
          className="bg-gray-800 text-white px-4 py-2 rounded font-medium shadow-md hover:bg-gray-700 transition"
        >
          ✨ ВЫРОВНЯТЬ ДЕРЕВО
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={MY_NODE_TYPES}     // <--- Используем новое имя
        defaultEdgeOptions={MY_EDGE_OPTIONS} // <--- Используем новое имя
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Личное дело (Модалка) */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fffcf5] border-2 border-[#b4945c] w-full max-w-2xl shadow-2xl p-8 font-serif relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-stone-400"><X size={24} /></button>
            <h2 className="text-3xl text-stone-800 mb-2 font-bold">{selected.full_name}</h2>
            <p className="text-[#b4945c] italic mb-6 border-b border-[#b4945c]/20 pb-2">{selected.info_label}</p>
            <div className="space-y-4 text-sm text-stone-600 leading-relaxed italic overflow-y-auto max-h-[50vh]">
              {selected.biography}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Tree() { return (<ReactFlowProvider><TreeContent /></ReactFlowProvider>); }