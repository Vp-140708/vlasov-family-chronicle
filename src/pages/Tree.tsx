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
import { useCallback } from 'react';
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  // Настройки сетки (можете потом менять эти цифры, если захотите сделать шире/уже)
  dagreGraph.setGraph({
    rankdir: 'TB', // сверху вниз
    nodesep: 80,   // отступ по горизонтали (между братьями/сестрами)
    ranksep: 120   // отступ по вертикали (между поколениями)
  });

  nodes.forEach((node) => {
    // Ищем ваши "сердечки". Обычно в Lovable их id или type содержит слово union/marriage/heart
    // Если "сердечки" выстроятся как огромные карточки, просто поменяйте 'union' на ваш тип узла
    const isUnion = node.type === 'union' || (typeof node.id === 'string' && node.id.includes('union'));

    dagreGraph.setNode(node.id, {
      width: isUnion ? 40 : 280,   // 280 - примерная ширина вашей карточки с человеком
      height: isUnion ? 40 : 100   // 100 - примерная высота
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isUnion = node.type === 'union' || (typeof node.id === 'string' && node.id.includes('union'));
    const w = isUnion ? 40 : 280;
    const h = isUnion ? 40 : 100;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - w / 2,
        y: nodeWithPosition.y - h / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};
const TreeContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { setViewport, getViewport, setCenter } = useReactFlow();
  // Вставляем функцию-обработчик
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
        onNodeClick={(_, n) => supabase.from('people').select('*').eq('id', n.id).single().then(({ data }) => setSelected(data))}
        fitView
      >
        <Background color="#b4945c" gap={40} opacity={0.05} />
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