import { Handle, Position } from 'reactflow';

export default function PersonNode({ data }: any) {
  // Цвет берем из базы, либо ставим зеленый по умолчанию
  const topColor = data.color || '#19553b'; 

  return (
    <div className="relative bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-4 w-[260px] min-h-[100px] border border-gray-200">
      {/* Цветная полоска сверху */}
      <div 
        className="absolute top-0 left-0 right-0 h-2 rounded-t-xl" 
        style={{ backgroundColor: topColor }} 
      />
      
      {/* Текст карточки */}
      <div className="text-center mt-2 flex flex-col gap-1 w-full">
        <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{data.name}</h3>
        {data.dates && <p className="text-xs text-gray-500 font-medium">{data.dates}</p>}
        {data.description && (
           <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
             {data.description}
           </p>
        )}
      </div>

      {/* 4 красные точки (Handles) для соединения */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
    </div>
  );
}