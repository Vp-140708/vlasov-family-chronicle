import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Trash2, Mail, Clock, ShieldCheck, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchSuggestions();
  }, []);

  // Проверка: является ли текущий юзер админом
  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    // Ищем профиль юзера и проверяем роль
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      setIsAdmin(true);
    } else {
      // Если не админ — выкидываем на главную
      navigate("/");
    }
    setLoading(false);
  }

  async function fetchSuggestions() {
    const { data } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  }

  async function deleteItem(id: string) {
    await supabase.from('suggestions').delete().eq('id', id);
    fetchSuggestions();
  }

  if (loading) return <div className="min-h-screen bg-[#fdf6e9] flex items-center justify-center font-serif text-[#b4945c]">Проверка доступа...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#fdf6e9] py-12 px-4 font-serif">
      <div className="max-w-5xl mx-auto">
        
        {/* Хедер Админки */}
        <div className="flex items-center justify-between mb-12 border-b-2 border-[#b4945c] pb-6">
          <div>
            <h1 className="text-4xl text-stone-800 font-bold tracking-tight">Кабинет Хранителя</h1>
            <p className="text-[#b4945c] italic mt-2">Управление семейными архивами и запросами</p>
          </div>
          <div className="bg-white p-4 border border-[#b4945c]/30 rounded-full shadow-sm">
            <ShieldCheck size={32} className="text-[#b4945c]" />
          </div>
        </div>

        {/* Список сообщений */}
        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-[#b4945c]/20 p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#b4945c]" />
              
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="text-[#b4945c] flex items-center gap-1"><Mail size={12}/> {item.type}</span>
                  </div>
                  <h3 className="text-xl text-stone-800 mb-3 font-bold">Запрос от родственника</h3>
                  <div className="bg-stone-50 p-4 border-l-2 border-stone-200 italic text-stone-600 leading-relaxed">
                    "{item.content}"
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-700 transition-all rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    <Trash2 size={16} /> Удалить архив
                  </button>
                </div>
              </div>

              {/* Золотой декор в углу */}
              <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <UserIcon size={100} />
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-20 bg-white/50 border-2 border-dashed border-stone-200">
              <Mail size={48} className="mx-auto text-stone-300 mb-4" />
              <p className="text-stone-400 font-serif italic text-lg">Пока новых сообщений от семьи нет...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}