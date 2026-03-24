import dagre from '@dagrejs/dagre';
import { Node, Edge } from 'reactflow'; // Замените на @xyflow/react, если используете новую версию

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Укажите ПРИМЕРНЫЕ реальные размеры ваших карточек в пикселях
const nodeWidth = 280;  // Ширина карточки человека
const nodeHeight = 100; // Высота карточки человека
const unionWidth = 40;  // Размер "сердечка" (узла брака)
const unionHeight = 40; 

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  // Настройки графа
  dagreGraph.setGraph({ 
    rankdir: direction, // TB = Top to Bottom (сверху вниз)
    nodesep: 50,        // Расстояние по горизонтали между братьями/сестрами
    ranksep: 100,       // Расстояние по вертикали между поколениями
    edgesep: 30         // Расстояние между линиями
  });

  // Загружаем узлы в алгоритм
  nodes.forEach((node) => {
    // Если узел - это брачное сердечко, даем ему маленькие размеры
    // Замените 'union' на тот type, который у вас используется для брака
    const isUnion = node.type === 'union' || node.id.includes('union');
    
    dagreGraph.setNode(node.id, { 
      width: isUnion ? unionWidth : nodeWidth, 
      height: isUnion ? unionHeight : nodeHeight 
    });
  });

  // Загружаем связи (линии) в алгоритм
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Запускаем математический расчет (магия происходит здесь)
  dagre.layout(dagreGraph);

  // Обновляем координаты React Flow узлов на основе расчетов
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isUnion = node.type === 'union' || node.id.includes('union');
    const w = isUnion ? unionWidth : nodeWidth;
    const h = isUnion ? unionHeight : nodeHeight;

    return {
      ...node,
      position: {
        // Dagre отдает координаты центра, а React Flow рисует от левого верхнего угла.
        // Поэтому мы вычитаем половину ширины/высоты.
        x: nodeWithPosition.x - w / 2,
        y: nodeWithPosition.y - h / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};