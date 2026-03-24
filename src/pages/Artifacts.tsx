import React from 'react';
import { motion } from 'framer-motion';

const artifacts =[
  {
    id: 1,
    title: "Золотое Георгиевское оружие",
    owner: "Николай Викентьевич Тороцко",
    year: "16 декабря 1915 г.",
    description: "Награда за выдающуюся храбрость и штыковую атаку у д. Бартники. Высший знак офицерской доблести Российской Империи.",
    image: "https://images.unsplash.com/photo-1595350028249-14a513d6a908?q=80&w=800&auto=format&fit=crop", // ЗАМЕНИШЬ НА СВОЕ ФОТО
    tag: "Российская Империя"
  },
  {
    id: 2,
    title: "Немецкое платье из Потсдама",
    owner: "Анна Николаевна Торотько",
    year: "1945 - 1950 гг.",
    description: "Привезено из Германии, где Анна служила начальником госпиталя. Символ возвращения к мирной жизни после ледяной воды Сиваша.",
    image: "https://images.unsplash.com/photo-1583391733959-b051f67f7cb5?q=80&w=800&auto=format&fit=crop", // ЗАМЕНИШЬ НА СВОЕ ФОТО
    tag: "Послевоенное время"
  },
  {
    id: 3,
    title: "Телеграмма Главного Штаба",
    owner: "Николай Викентьевич Тороцко",
    year: "1915 год",
    description: "Оригинальный исторический документ, подтверждающий прикомандирование к 1-й Сибирской тяжелой артиллерийской бригаде и награждение.",
    image: "https://images.unsplash.com/photo-1600683451336-db1821dfbf16?q=80&w=800&auto=format&fit=crop", // ЗАМЕНИШЬ НА СВОЕ ФОТО
    tag: "Документ"
  }
];

const Artifacts = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdfaf5] pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Семейный <span className="text-amber-600 italic font-light">Архив</span>
          </h1>
          <p className="text-stone-500 uppercase tracking-[0.3em] text-xs font-bold">
            Вещи, сохранившие тепло рук наших предков
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {artifacts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                {/* ЗАГЛУШКА ДЛЯ ФОТО */}
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur text-stone-100 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {item.tag}
                </div>
              </div>
              
              <div className="p-8">
                <div className="text-amber-700 text-xs font-bold mb-2">{item.year}</div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <div className="text-xs uppercase tracking-wider text-stone-400 mb-4 border-b border-stone-100 pb-4">
                  Принадлежало: <span className="text-stone-700 font-bold">{item.owner}</span>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed font-serif">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artifacts;