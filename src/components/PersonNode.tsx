import { Handle, Position } from 'reactflow';

export default function PersonNode({ data }: any) {
  let topColor = '#166534'; // По умолчанию зеленый
  if (data.branch === 'paternal') topColor = '#1e3a8a'; 
  if (data.branch === 'both') topColor = '#991b1b'; 

  return (
    <div className="relative bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-2 w-[170px] min-h-[60px] border border-gray-100 transition-all">
      {/* Тонкая полоска сверху */}
      <div className="absolute top-0 left-0 right-0 h-[5px] rounded-t-lg" style={{ backgroundColor: topColor }} />
      
      <div className="text-center mt-1 flex flex-col w-full px-1">
        {/* Имя поменьше */}
        <h3 className="font-bold text-[#003366] text-[12px] leading-tight font-serif italic mb-0.5">
          {data.full_name || data.label}
        </h3>
        {/* Даты еще компактнее */}
        {data.info_label && (
          <p className="text-[10px] text-[#ea580c] font-bold">{data.info_label}</p>
        )}
      </div>

      {/* ТОЧКИ СВЯЗИ (Handles) — ID должны быть строгими! */}
      {/* Дети входят сверху, выходят снизу */}
      <Handle type="target" position={Position.Top} id="top" className="w-[8px] h-[8px] bg-[#ea580c] border-2 border-white !-top-1" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-[8px] h-[8px] bg-[#ea580c] border-2 border-white !-bottom-1" />
      
      {/* Супруги соединяются по бокам */}
      <Handle type="target" position={Position.Left} id="left" className="w-[8px] h-[8px] bg-[#ea580c] border-2 border-white !-left-1" />
      <Handle type="source" position={Position.Right} id="right" className="w-[8px] h-[8px] bg-[#ea580c] border-2 border-white !-right-1" />
    </div>
  );
}