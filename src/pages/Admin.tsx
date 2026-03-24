import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Trash2, Clock, MessageSquare } from "lucide-react";

export default function Admin() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    const { data } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSuggestions(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('suggestions').update({ status }).eq('id', id);
    fetchSuggestions();
  }

  return (
    <div className="min-h-screen bg-[#fdf6e9] py-12 px-4 font-serif">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl text-stone-800 mb-10 border-b-2 border-[#b4945c] pb-4">Запросы на изменения</h1>
        
        <div className="space-y-6">
          {suggestions.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold ${
                    item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status === 'pending' ? 'Ожидает' : 'Одобрено'}
                  </span>
                  <span className="text-stone-400 text-sm flex items-center gap-1">
                    <Clock size={14} /> {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-[#b4945c]" /> {item.type}
                </h3>
                <p className="text-stone-600 mt-2 italic">"{item.content}"</p>
              </div>
              
              <div className="flex items-center gap-3">
                {item.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus(item.id, 'approved')}
                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    title="Одобрить"
                  >
                    <Check size={20} />
                  </button>
                )}
                <button 
                  onClick={async () => {
                    await supabase.from('suggestions').delete().eq('id', item.id);
                    fetchSuggestions();
                  }}
                  className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  title="Удалить"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {suggestions.length === 0 && <p className="text-center text-stone-400 py-20">Новых предложений пока нет.</p>}
        </div>
      </div>
    </div>
  );
}