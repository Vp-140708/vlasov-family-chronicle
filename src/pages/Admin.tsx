import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Trash2, Clock, User, MessageSquare } from "lucide-react";

export default function Admin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  async function handleAction(id: string, action: 'approve' | 'delete') {
    if (action === 'approve') {
      await supabase.from('suggestions').update({ status: 'approved' }).eq('id', id);
    } else {
      await supabase.from('suggestions').delete().eq('id', id);
    }
    fetchData();
  }

  return (
    <div className="min-h-screen bg-[#fdf6e9] p-8 font-serif">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8 border-b-2 border-[#b4945c] pb-2">Кабинет Хранителя</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 border border-[#b4945c]/30 shadow-sm rounded-lg flex justify-between items-start transition-all hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {item.status === 'pending' ? 'Новое' : 'Одобрено'}
                  </span>
                  <span className="text-stone-400 text-xs flex items-center gap-1"><Clock size={12}/> {new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-800">{item.type}</h3>
                <p className="text-stone-600 italic mt-2">"{item.content}"</p>
              </div>
              <div className="flex gap-2 ml-4">
                {item.status === 'pending' && (
                  <button onClick={() => handleAction(item.id, 'approve')} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md transition-all"><Check size={18}/></button>
                )}
                <button onClick={() => handleAction(item.id, 'delete')} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <p className="text-center text-stone-400 mt-20">Пока запросов не поступало...</p>}
        </div>
      </div>
    </div>
  );
}