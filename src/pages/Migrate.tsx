import { supabase } from '@/lib/supabase';
import { familyMembers } from '@/data/familyData';

export default function Migrate() {
  const runBeautifulLayout = async () => {
    try {
      console.log("Запуск красивой расстановки...");

      const nodes: any[] = [];
      const edges: any[] = [];
      
      // Настройки сетки
      const VERTICAL_SPACING = 400; // Расстояние между поколениями
      const HORIZONTAL_SPACING = 250; // Расстояние между людьми

      // Группируем людей по поколениям
      const generations: Record<number, any[]> = {};
      familyMembers.forEach(m => {
        if (!generations[m.generation]) generations[m.generation] = [];
        generations[m.generation].push(m);
      });

      // Рассчитываем позиции
      Object.keys(generations).forEach((genStr) => {
        const gen = parseInt(genStr);
        const members = generations[gen];
        const totalWidth = (members.length - 1) * HORIZONTAL_SPACING;
        
        members.forEach((m, index) => {
          // Центрируем каждое поколение относительно центра экрана
          const x = (index * HORIZONTAL_SPACING) - (totalWidth / 2);
          const y = gen * VERTICAL_SPACING;

          nodes.push({
            id: m.id,
            position: { x, y },
            data: { label: m.name } // Tree.tsx сам подставит оформление
          });
        });
      });

      // Создаем связи
      familyMembers.forEach(m => {
        if (m.fatherId) edges.push({ id: `e-f-${m.fatherId}-${m.id}`, source: m.fatherId, target: m.id, label: 'отец' });
        if (m.motherId) edges.push({ id: `e-m-${m.motherId}-${m.id}`, source: m.motherId, target: m.id, label: 'мать' });
        if (m.spouseId) {
          const sId = [m.id, m.spouseId].sort().join('-');
          if (!edges.find(e => e.id === `s-${sId}`)) {
            edges.push({ id: `s-${sId}`, source: m.id, target: m.spouseId, label: 'супруги' });
          }
        }
      });

      // Сохраняем в таблицу людей (базовые позиции)
      // И сразу в tree_layout, чтобы зафиксировать "красоту"
      const { error: layoutErr } = await supabase.from('tree_layout').upsert({
        id: 'main-tree',
        nodes: nodes.map(n => ({ id: n.id, position: n.position })),
        edges: edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.label === 'супруги' ? 'smoothstep' : 'default', // Плавные линии
            data: { label: e.label }
        })),
        viewport: { x: 500, y: 100, zoom: 0.4 } // Начальный вид сверху
      });

      if (layoutErr) throw layoutErr;
      alert("Древо расставлено идеально! Иди проверять страницу Древо.");
      
    } catch (e: any) {
      alert("Ошибка: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e9]">
      <button 
        onClick={runBeautifulLayout}
        className="px-12 py-6 bg-[#b4945c] text-white text-2xl font-serif rounded-full shadow-2xl hover:scale-105 transition-all"
      >
        РАССТАВИТЬ ДРЕВО КРАСИВО
      </button>
    </div>
  );
}   