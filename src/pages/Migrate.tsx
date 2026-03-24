import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// Используем относительный путь, если @/ не срабатывает
import * as FamilyData from '../data/familyData'; 

export default function Migrate() {
  const [status, setStatus] = useState("Готов к миграции...");

  const runMigration = async () => {
    try {
      // Проверка: загрузились ли данные из файла
      const data = FamilyData.familyMembers;
      if (!data) {
        throw new Error("Массив familyMembers не найден в файле familyData.ts");
      }

      setStatus("Очистка базы...");
      await supabase.from('family_edges').delete().neq('id', '0');
      await supabase.from('people').delete().neq('id', '0');

      setStatus(`Загрузка ${data.length} родственников...`);
      
      const genCount: Record<number, number> = {};
      const nodesToInsert = data.map(m => {
        const g = m.generation || 0;
        if (!genCount[g]) genCount[g] = 0;
        
        // Авто-раскладка: X зависит от номера в поколении, Y от номера поколения
        const x = (genCount[g] * 300) - 1000; 
        const y = g * 400;
        genCount[g]++;

        return {
          id: m.id,
          full_name: m.name,
          info_label: m.years,
          biography: m.bio,
          generation: g,
          gender: m.gender,
          branch: m.branch,
          habits: m.habits || [],
          medical: m.medical || [],
          x_pos: x,
          y_pos: y
        };
      });

      const { error: nErr } = await supabase.from('people').insert(nodesToInsert);
      if (nErr) throw nErr;

      setStatus("Создание связей (Edges)...");
      const edgesToInsert: any[] = [];

      data.forEach(m => {
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
          const pair = [m.id, m.spouseId].sort();
          const sId = `edge-s-${pair[0]}-${pair[1]}`;
          if (!edgesToInsert.find(e => e.id === sId)) {
            edgesToInsert.push({
              id: sId,
              source_id: m.id,
              target_id: m.spouseId,
              label: 'супруги'
            });
          }
        }
      });

      if (edgesToInsert.length > 0) {
        const { error: eErr } = await supabase.from('family_edges').insert(edgesToInsert);
        if (eErr) throw eErr;
      }

      setStatus(`УСПЕХ! ${data.length} человек и все связи перенесены в БД.`);
    } catch (e: any) {
      console.error(e);
      setStatus("ОШИБКА: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e9] p-10 text-center font-serif">
      <div className="bg-white p-10 border-4 border-[#b4945c] shadow-2xl">
        <h1 className="text-3xl mb-4 font-bold uppercase tracking-widest">Мигратор Хроники</h1>
        <p className="mb-8 italic text-stone-600">{status}</p>
        <button 
          onClick={runMigration} 
          className="px-10 py-4 bg-[#b4945c] text-white rounded-full hover:bg-stone-800 transition-all shadow-lg active:scale-95"
        >
          ЗАПУСТИТЬ ПЕРЕНОС В БАЗУ
        </button>
      </div>
    </div>
  );
}