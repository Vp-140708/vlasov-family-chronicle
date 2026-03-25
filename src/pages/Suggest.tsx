import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Suggest() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return toast.error("Напишите что-нибудь");
    setLoading(true);
    
    const { error } = await supabase.from("suggestions").insert([{ content }]);
    
    if (!error) {
      toast.success("Спасибо! Ваше сообщение отправлено администратору.");
      setContent("");
    } else {
      toast.error("Ошибка при отправке");
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-6 pt-32 max-w-2xl text-center">
      <h1 className="text-3xl font-serif mb-4">Предложить дополнение</h1>
      <p className="text-gray-600 mb-8 italic">Если у вас есть фото, документы или истории о наших предках — напишите об этом здесь.</p>
      
      <Textarea 
        placeholder="Напишите всё, что знаете..." 
        className="min-h-[200px] mb-6 shadow-inner"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      
      <Button 
        onClick={handleSubmit} 
        disabled={loading}
        className="bg-[#003366] hover:bg-[#002244] px-10 py-6 text-lg"
      >
        {loading ? "Отправка..." : "Отправить информацию"}
      </Button>
    </div>
  );
}