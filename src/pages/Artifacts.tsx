import { useState } from "react";
import { Image, FileText, Award, Music, Search } from "lucide-react";

// Временные данные (позже заменим на запрос к Supabase)
const initialArtifacts = [
  {
    id: 1,
    title: "Георгиевский крест",
    category: "награда",
    year: "1915",
    description: "Награда прадеда за отвагу в Первой мировой войне. Сохранилась оригинальная лента.",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80",
    hasAudio: true
  },
  {
    id: 2,
    title: "Письмо с фронта",
    category: "документ",
    year: "1943",
    description: "Письмо, написанное карандашом на пожелтевшей бумаге. В нем рассказ о быте и надежда на встречу.",
    image: "https://images.unsplash.com/photo-1587731556938-3860014f3c39?auto=format&fit=crop&q=80",
    hasAudio: false
  },
  {
    id: 3,
    title: "Свадебное фото",
    category: "фото",
    year: "1952",
    description: "Первое послевоенное фото семьи. Сделано в сельском фотоателье.",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80",
    hasAudio: true
  }
];

export default function Artifacts() {
  const [filter, setFilter] = useState("все");

  const categories = [
    { id: "все", label: "Все", icon: <Search className="w-4 h-4" /> },
    { id: "фото", label: "Фотографии", icon: <Image className="w-4 h-4" /> },
    { id: "документ", label: "Документы", icon: <FileText className="w-4 h-4" /> },
    { id: "награда", label: "Награды", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fdf6e9] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок в стиле Index */}
        <div className="text-center mb-16">
          <span className="text-[#b4945c] uppercase tracking-[0.3em] text-xs font-bold block mb-4">Наследие</span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-800 mb-6">Семейные артефакты</h1>
          <div className="w-32 h-1 bg-[#b4945c] mx-auto mb-8" />
          
          {/* Фильтры */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-serif border transition-all ${
                  filter === cat.id 
                  ? "bg-[#b4945c] text-white border-[#b4945c]" 
                  : "bg-white text-stone-600 border-stone-200 hover:border-[#b4945c]"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка артефактов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {initialArtifacts
            .filter(item => filter === "все" || item.category === filter)
            .map(item => (
            <div key={item.id} className="group relative bg-white p-4 border border-[#b4945c]/20 rounded-sm shadow-sm hover:shadow-2xl transition-all">
              {/* "Паспарту" для фото */}
              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-stone-100 border border-stone-200">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                {item.hasAudio && (
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#b4945c] text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Music className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="text-center px-4 pb-4">
                <span className="text-[#b4945c] font-serif italic text-sm">{item.year} год</span>
                <h3 className="text-2xl font-serif text-stone-800 my-2">{item.title}</h3>
                <p className="text-stone-600 font-serif text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                
                <button className="mt-6 text-[#b4945c] uppercase tracking-widest text-[10px] font-bold border-b border-[#b4945c] pb-1 hover:text-stone-800 hover:border-stone-800 transition-colors">
                  Изучить подробнее
                </button>
              </div>

              {/* Золотой уголок (декор) */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#b4945c]/30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#b4945c]/30 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}