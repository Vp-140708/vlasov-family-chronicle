import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, ConnectionLineType, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers } from '../data/familyData';

const Tree = () => {
  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = [];
    const es: Edge[] = [];

    const Y_GAP = 250; // Расстояние между поколениями
    const X_GAP = 300; // Расстояние между людьми

    // 1. Создаем узлы людей
    familyMembers.forEach((member) => {
      const isVlasov = member.id.includes('vlasov') || member.id.includes('igor') || member.id.includes('alexander');
      const xBase = isVlasov ? -400 : 400;

      ns.push({
        id: member.id,
        data: { label: (
          <div className={`p-4 rounded-lg border-2 shadow-md bg-white w-52 text-center transition-transform hover:scale-105 ${
            member.branch === 'paternal' ? 'border-blue-300' : 'border-emerald-300'
          }`}>
            <div className="font-serif font-bold text-sm text-slate-800">{member.name}</div>
            <div className="text-[10px] text-amber-700 font-semibold">{member.years}</div>
            <div className="text-[9px] uppercase text-slate-400 mt-1">{member.title}</div>
          </div>
        )},
        // Позиция: X зависит от ветки, Y строго от поколения
        position: { x: xBase + (familyMembers.indexOf(member) * 20), y: member.generation * Y_GAP },
        draggable: true, // Временно оставим, чтобы ты мог поправить если что, потом выключим
      });

      // 2. Логика Т-связей (Брак и Дети)
      if (member.fatherId && member.motherId) {
        const marriageNodeId = `marriage-${member.fatherId}-${member.motherId}`;
        
        // Создаем невидимый узел-связку между родителями (если его еще нет)
        if (!ns.find(n => n.id === marriageNodeId)) {
          ns.push({
            id: marriageNodeId,
            data: { label: '' },
            position: { x: xBase, y: (member.generation * Y_GAP) - (Y_GAP / 2) },
            style: { width: 1, height: 1, backgroundColor: 'transparent', border: 'none' },
            type: 'output'
          });

          // Линия от Отца к Marriage Node
          es.push({
            id: `e-${member.fatherId}-m`,
            source: member.fatherId,
            target: marriageNodeId,
            type: 'step',
            style: { stroke: '#d4af37', strokeWidth: 2 },
          });

          // Линия от Матери к Marriage Node
          es.push({
            id: `e-${member.motherId}-m`,
            source: member.motherId,
            target: marriageNodeId,
            type: 'step',
            style: { stroke: '#d4af37', strokeWidth: 2 },
          });
        }

        // Линия от Marriage Node к Ребенку
        es.push({
          id: `e-m-${member.id}`,
          source: marriageNodeId,
          target: member.id,
          type: 'step',
          style: { stroke: '#d4af37', strokeWidth: 2 },
        });
      }
    });

    return { nodes: ns, edges: es };
  }, []);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#fdfaf5]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.Step}
        fitView
      >
        <Background color="#e2dcd0" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Tree;