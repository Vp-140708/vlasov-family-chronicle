import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, addEdge, Panel, Connection, Edge, Handle, Position, ConnectionLineType } from 'reactflow';
import 'reactflow/dist/style.css';
import { familyMembers, FamilyMember } from '../data/familyData';
import { supabase } from '../lib/supabase';
import { Sheet, SheetContent } from "@/components/ui/sheet";

const FamilyNode = ({ data }: { data: { member: FamilyMember } }) => {
  if (!data.member) return null;
  return (
    <div className={`p-4 rounded-xl border-t-4 shadow-2xl bg-white w-64 text-center border-stone-200 transition-all hover:scale-105 ${data.member.branch === 'paternal' ? 'border-t-blue-800' : (data.member.branch === 'maternal' ? 'border-t-emerald-800' : 'border-t-amber-600')
      }`}>
      <Handle type="target" position={Position.Top} className="!w-6 !h-6 !bg-orange-500 !border-2 !border-white !-top-3" />
      <Handle type="source" position={Position.Bottom} className="!w-6 !h-6 !bg-orange-500 !border-2 !border-white !-bottom-3" />
      <Handle type="target" position={Position.Left} id="spouse-in" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-left-3" />
      <Handle type="source" position={Position.Right} id="spouse-out" className="!w-6 !h-6 !bg-rose-500 !border-2 !border-white !-right-3" />
      <div className="font-serif font-bold text-slate-900 leading-tight">{data.member.name}</div>
      <div className="text-sm text-amber-700 font-bold">{data.member.years}</div>
      <div className="text-[9px] uppercase text-stone-400 mt-1">{data.member.title}</div>
    </div>
  );
};

const Tree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const nodeTypes = useMemo(() => ({ familyNode: FamilyNode }), []);

  // Создаем узлы на основе ВСЕХ людей из файла
  const initialNodes: Node[] = useMemo(() => familyMembers.map((m, index) => ({
    id: m.id, type: 'familyNode', data: { member: m },
    position: { x: (index % 5) * 350 - 800, y: m.generation * 320 },
  })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      setEdges((eds) => eds.filter((e) => !deletedEdges.find((de) => de.id === e.id)));
    },
    [setEdges]
  );

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('tree_layout').select('*').filter('id', 'eq', 'main_tree').maybeSingle();

      if (data?.nodes) {
        // --- ЛОГИКА СЛИЯНИЯ ---
        const savedNodes = data.nodes;

        // Берем всех людей из нашего актуального файла familyData
        const mergedNodes = familyMembers.map((m, index) => {
          const savedNode = savedNodes.find((sn: any) => sn.id === m.id);

          if (savedNode) {
            // Если человек уже был в базе - ставим его на сохраненное место
            return {
              ...savedNode,
              type: 'familyNode',
              data: { member: m }
            };
          } else {
            // ЕСЛИ ЭТО НОВЫЙ ЧЕЛОВЕК (которого нет в базе) - ставим его в центр экрана
            return {
              id: m.id,
              type: 'familyNode',
              data: { member: m },
              position: { x: 0, y: m.generation * 320 }, // Новые появятся посередине своего поколения
            };
          }
        });

        setNodes(mergedNodes);
        setEdges(data.edges || []);
      }
    };
    load();
  }, []); // Пустой массив, чтобы сработало один раз при загрузке

  const save = async () => {
    setIsSaving(true);
    const cleanNodes = nodes.map(({ id, position, type }) => ({ id, position, type }));
    const { error } = await supabase.from('tree_layout').upsert({ id: 'main_tree', nodes: cleanNodes, edges });
    if (!error) alert("Все люди (включая новых) зафиксированы в базе!");
    setIsSaving(false);
  };

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'default', style: { stroke: params.sourceHandle?.includes('spouse') ? '#f43f5e' : '#d4af37', strokeWidth: 4 } }, eds)), [setEdges]);

  return (
      <div className="w-full h-[calc(100vh-64px)] bg-[#f5f2ed]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete} // ДОБАВЬ ЭТО
        deleteKeyCode={["Backspace", "Delete"]} // И ЭТО
        onNodeClick={(_, node) => node.data?.member && setSelectedMember(node.data.member)}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.01}
      >
        <Background color="#dcd6cc" gap={40} />
        <Panel position="top-left" className="bg-white/95 p-4 border border-stone-200 shadow-xl rounded-xl">
          <button onClick={save} disabled={isSaving} className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold">{isSaving ? "..." : "СОХРАНИТЬ"}</button>
        </Panel>
      </ReactFlow>
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-[#fdfaf5]">
          {selectedMember && <div className="py-8 font-serif">
            <h2 className="text-3xl font-bold">{selectedMember.name}</h2>
            <p className="text-amber-700 italic text-xl mb-4">{selectedMember.years}</p>
            <p className="text-lg">{selectedMember.bio}</p>
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tree;