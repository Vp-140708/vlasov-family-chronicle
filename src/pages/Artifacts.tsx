import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function Artifacts() {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Поля новой формы
  const [newArt, setNewArt] = useState({ title: "", description: "", image_url: "" });

  useEffect(() => {
    checkUser();
    fetchArtifacts();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    // ЗАМЕНИ НА СВОЙ EMAIL
    if (user?.email === 'твой-email@gmail.com') {
      setIsAdmin(true);
    }
  }

  async function fetchArtifacts() {
    const { data } = await supabase.from("artifacts").select("*").order("created_at", { ascending: false });
    if (data) setArtifacts(data);
  }

  async function handleAdd() {
    if (!newArt.title) return toast.error("Введите название");
    const { error } = await supabase.from("artifacts").insert([newArt]);
    if (!error) {
      toast.success("Артефакт добавлен");
      setShowAddForm(false);
      setNewArt({ title: "", description: "", image_url: "" });
      fetchArtifacts();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить этот артефакт?")) return;
    const { error } = await supabase.from("artifacts").delete().eq("id", id);
    if (!error) {
      toast.success("Удалено");
      fetchArtifacts();
    }
  }

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-serif text-[#003366]">Семейные реликвии</h1>
        {isAdmin && (
          <Button onClick={() => setShowAddForm(true)} className="bg-[#bda67a] hover:bg-[#a68d5b]">
            <Plus className="mr-2 h-4 w-4" /> Добавить
          </Button>
        )}
      </div>

      {/* Форма добавления (только для админа) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4"><X /></button>
            <h2 className="text-2xl font-bold mb-4">Новый артефакт</h2>
            <div className="space-y-4">
              <Input placeholder="Название" value={newArt.title} onChange={e => setNewArt({...newArt, title: e.target.value})} />
              <Input placeholder="Ссылка на фото (URL)" value={newArt.image_url} onChange={e => setNewArt({...newArt, image_url: e.target.value})} />
              <Textarea placeholder="Описание" value={newArt.description} onChange={e => setNewArt({...newArt, description: e.target.value})} />
              <Button onClick={handleAdd} className="w-full bg-green-700">Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {/* Список артефактов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artifacts.map((art) => (
          <div key={art.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group relative">
            <img src={art.image_url || "/placeholder.svg"} alt={art.title} className="w-full h-56 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-bold text-[#003366] font-serif mb-2">{art.title}</h3>
              <p className="text-gray-600 text-sm italic leading-relaxed">{art.description}</p>
            </div>
            {isAdmin && (
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(art.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}