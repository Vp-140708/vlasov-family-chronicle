import { Handle, Position } from 'reactflow';

export default function PersonNode({ data }: any) {
  // Автоматически красим верхнюю полоску в зависимости от колонки branch из вашей БД!
  let topColor = '#19553b'; // Зеленый (по умолчанию или maternal)
  if (data.branch === 'paternal') topColor = '#1e3a8a'; // Синий (отцовская линия)
  if (data.branch === 'both') topColor = '#b91c1c'; // Красный

  return (
    <div className="relative bg-[#f8f9fa] rounded-xl shadow-md flex flex-col items-center justify-center p-4 w-[260px] min-h-[90px] border border-gray-200">
      {/* Цветная полоска сверху */}
      <div 
        className="absolute top-0 left-0 right-0 h-2 rounded-t-xl" 
        style={{ backgroundColor: topColor }} 
      />
      
      {/* Текст внутри карточки */}
      <div className="text-center mt-2 flex flex-col gap-1 w-full">
        {/* Берем full_name из вашей базы */}
        <h3 className="font-bold text-gray-900 text-[15px] leading-tight">
          {data.full_name || data.label}
        </h3>
        
        {/* Берем info_label из вашей базы (даты) */}
        {data.info_label && (
          <p className="text-xs text-gray-600 font-medium">{data.info_label}</p>
        )}
      </div>

      {/* 4 красные точки (Handles) для соединения линий */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-[#e84142] border-2 border-white" />
    </div>
  );
}