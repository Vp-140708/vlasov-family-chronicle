import { Handle, Position } from 'reactflow';

export default function PersonNode({ data }: any) {
  // Цвет верхней полоски (зеленый по умолчанию, синий для paternal, красный для both)
  let topColor = '#166534'; 
  if (data.branch === 'paternal') topColor = '#1e3a8a'; 
  if (data.branch === 'both') topColor = '#991b1b'; 

  return (
    <div className="relative bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 w-[260px] min-h-[100px] border border-gray-100">
      
      {/* Цветная шапка сверху (как на 1-м скриншоте) */}
      <div 
        className="absolute top-0 left-0 right-0 h-[10px] rounded-t-2xl" 
        style={{ backgroundColor: topColor }} 
      />
      
      {/* Внутренний текст карточки */}
      <div className="text-center mt-3 flex flex-col gap-1 w-full px-2">
        {/* Имя: Темно-синее, шрифт с засечками (serif), жирное */}
        <h3 className="font-bold text-[#003366] text-[16px] leading-tight font-serif">
          {data.full_name || data.label}
        </h3>
        
        {/* Даты: Оранжевые/Золотистые */}
        {(data.info_label || data.dates) && (
          <p className="text-[13px] text-[#d97706] font-semibold mt-0.5">
            {data.info_label || data.dates}
          </p>
        )}

        {/* Описание/Профессия: Мелкий серый текст заглавными буквами */}
        {(data.description || data.role) && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">
            {data.description || data.role}
          </p>
        )}
      </div>

      {/* КРУПНЫЕ цветные точки (Handles) как на 1-м скриншоте */}
      {/* border-[3px] border-white делает ту самую красивую белую окантовку вокруг оранжевой точки */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top" 
        className="w-[18px] h-[18px] bg-[#ea580c] border-[3px] border-white z-10" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" 
        className="w-[18px] h-[18px] bg-[#ea580c] border-[3px] border-white z-10" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        className="w-[18px] h-[18px] bg-[#ea580c] border-[3px] border-white z-10" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        className="w-[18px] h-[18px] bg-[#ea580c] border-[3px] border-white z-10" 
      />
    </div>
  );
}