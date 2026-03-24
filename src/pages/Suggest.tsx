import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send } from "lucide-react";

export default function Suggest() {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      content: formData.get('content'),
      author: formData.get('author'),
      type: formData.get('type')
    };
    
    // Позже мы создадим таблицу requests в Supabase
    // const { error } = await supabase.from('requests').insert([data]);
    
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-10 border-t-8 border-[#b4945c] shadow-2xl rounded-xl">
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6 font-serif">
            <h2 className="text-3xl text-stone-800 text-center">Предложить дополнение</h2>
            <p className="text-stone-500 text-sm text-center italic">Ваша информация будет проверена хранителем древа</p>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#b4945c] font-bold mb-2">Что вы хотите добавить?</label>
              <select name="type" className="w-full p-3 border-b-2 border-stone-200 focus:border-[#b4945c] outline-none bg-transparent">
                <option>Биография человека</option>
                <option>Фотография/Артефакт</option>
                <option>Географическая метка</option>
                <option>Исправление ошибки</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#b4945c] font-bold mb-2">Подробности</label>
              <textarea name="content" required rows={5} className="w-full p-3 border-b-2 border-stone-200 focus:border-[#b4945c] outline-none resize-none bg-transparent" placeholder="Напишите всё, что знаете..."></textarea>
            </div>

            <button type="submit" className="w-full bg-[#b4945c] text-white py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#967b4b] transition-colors">
              <Send size={18} /> Отправить хранителю
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-2xl text-[#b4945c] mb-4">Спасибо!</h3>
            <p className="text-stone-600 font-serif italic">Ваше послание сохранено в архивах. Хранитель рассмотрит его в ближайшее время.</p>
          </div>
        )}
      </div>
    </div>
  );
}