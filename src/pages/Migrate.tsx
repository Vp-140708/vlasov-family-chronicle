import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { familyMembers } from '@/data/familyData';

export default function Migrate() {
  const [status, setStatus] = useState("Готов к миграции...");

  const runMigration = async () => {
    try {
      setStatus("Очистка базы...");
      await supabase.from('family_edges').delete().neq('id', '0');
      await supabase.from('people').delete().neq('id', '0');

      setStatus("Загрузка людей и расчет позиций...");
      
      // Группируем людей по поколениям для расчета X
      const genCount: Record<number, number> = {};

      const nodesToInsert = familyMembers.map(member => {
        const gen = member.generation;
        if (!genCount[gen]) genCount[gen] = 0;
        
        // Авто-раскладка: X зависит от порядкового номера в поколении, Y от номера поколения
        const x = (genCount[gen] * 250) - 500; 
        const y = gen * 300;
        genCount[gen]++;

        return {
          id: member.id,
          full_name: member.name,
          info_label: member.years,
          biography: member.bio,
          generation: gen,
          gender: member.gender,
          branch: member.branch,
          x_pos: x,
          y_pos: y
        };
      });

      const { error: nErr } = await supabase.from('people').insert(nodesToInsert);
      if (nErr) throw nErr;

      setStatus("Создание связей...");
      const edgesToInsert: any[] = [];

      familyMembers.forEach(m => {
        if (m.fatherId) {
          edgesToInsert.push({
            id: `edge-f-${m.fatherId}-${m.id}`,
            source_id: m.fatherId,
            target_id: m.id,
            label: 'отец'
          });
        }
        if (m.motherId) {
          edgesToInsert.push({
            id: `edge-m-${m.motherId}-${m.id}`,
            source_id: m.motherId,
            target_id: m.id,
            label: 'мать'
          });
        }
        if (m.spouseId) {
          // Чтобы не дублировать связь супругов дважды
          const edgeId = [m.id, m.spouseId].sort().join('-');
          if (!edgesToInsert.find(e => e.id === `edge-s-${edgeId}`)) {
            edgesToInsert.push({
              id: `edge-s-${edgeId}`,
              source_id: m.id,
              target_id: m.spouseId,
              label: 'супруги'
            });
          }
        }
      });

      const { error: eErr } = await supabase.from('family_edges').insert(edgesToInsert);
      if (eErr) throw eErr;

      setStatus("ГОТОВО! 8 поколений перенесены в базу данных.");
    } catch (e: any) {
      setStatus("ОШИБКА: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e9] p-10">
      <div className="bg-white p-10 border-4 border-[#b4945c] shadow-2xl text-center">
        <h1 className="text-3xl font-serif mb-6">Миграция Хроники</h1>
        <p className="mb-8 italic">{status}</p>
        <button onClick={runMigration} className="px-8 py-3 bg-[#b4945c] text-white rounded-full hover:bg-stone-800 transition-colors">
          Запустить перенос в БД
        </button>
      </div>
    </div>
  );
}