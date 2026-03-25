import { Handle, Position } from 'reactflow';

export default function PersonNode({ data }: any) {
  // Выбираем цвет шапки на основе ветви (branch)
  let topColor = '#166534'; // Зеленый (мамина линия)
  if (data.branch === 'paternal') topColor = '#1e3a8a'; // Синий (папина линия)
  if (data.branch === 'both') topColor = '#991b1b'; // Красный

  return (
    <div className="relative bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4 w-[260px] min-h-[100px] border border-gray-100 transition-all hover:shadow-2xl">
      
      {/* Цветная шапка сверху */}
      <div 
        className="absolute top-0 left-0 right-0 h-[12px] rounded-t-2xl" 
        style={{ backgroundColor: topColor }} 
      />
      
      {/* Текстовый блок */}
      <div className="text-center mt-3 flex flex-col gap-1 w-full px-2">
        {/* Имя: Шрифт с засечками (serif), темно-синий */}
        <h3 className="font-bold text-[#003366] text-[17px] leading-tight font-serif italic">
          {data.full_name || data.label}
        </h3>
        
        {/* Даты: Оранжевый полужирный */}
        {data.info_label && (
          <p className="text-[13px] text-[#ea580c] font-bold mt-0.5">
            {data.info_label}
          </p>
        )}

        {/* Описание: Мелкий серый текст заглавными буквами */}
        {data.biography && (
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1 line-clamp-2">
            {data.biography}
          </p>
        )}
      </div>

      {/* КРУПНЫЕ оранжевые точки с белой обводкой */}
      <Handle type="target" position={Position.Top} id="top" className="w-[16px] h-[16px] bg-[#ea580c] border-[3px] border-white !-top-2 shadow-sm" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-[16px] h-[16px] bg-[#ea580c] border-[3px] border-white !-bottom-2 shadow-sm" />
      <Handle type="target" position={Position.Left} id="left" className="w-[16px] h-[16px] bg-[#ea580c] border-[3px] border-white !-left-2 shadow-sm" />
      <Handle type="source" position={Position.Right} id="right" className="w-[16px] h-[16px] bg-[#ea580c] border-[3px] border-white !-right-2 shadow-sm" />
    </div>
  );
}