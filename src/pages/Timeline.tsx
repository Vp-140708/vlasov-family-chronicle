import { Shield, Plane, Award, MapPin } from "lucide-react";

const events = [
  { 
    year: "1915", 
    title: "Награждение Николая в Петрограде", 
    desc: "Николай Викентьевич Тороцко удостоен Георгиевского оружия за храбрость на фронте Первой мировой войны.", 
    icon: <Shield className="w-5 h-5 text-[#b4945c]" />,
    side: 'left'
  },
  { 
    year: "1942", 
    title: "Меркурий пропадает без вести в Севастополе", 
    desc: "Воентехник Меркурий Евтихеевич Власов пропал без вести во время обороны Севастополя.", 
    icon: <Plane className="w-5 h-5 text-[#b4945c]" />,
    side: 'right'
  },
  { 
    year: "1945", 
    title: "Анна в Потсдаме", 
    desc: "Капитан медслужбы Анна Тороцко встретила конец войны в Потсдаме, оказывая помощь раненым.", 
    icon: <Award className="w-5 h-5 text-[#b4945c]" />,
    side: 'left'
  }
];

export default function Timeline() {
  return (
    <div className="min-h-screen bg-[#fdf6e9] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#b4945c] uppercase tracking-[0.4em] text-xs font-bold block mb-4">Хроника</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800">Ключевые события</h1>
          <div className="w-24 h-1 bg-[#b4945c] mx-auto mt-6" />
        </div>

        <div className="relative">
          {/* Центральная линия */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-[#b4945c]/30 hidden md:block" />
          
          <div className="space-y-12">
            {events.map((event, idx) => (
              <div key={idx} className={`relative flex items-center justify-between w-full ${event.side === 'left' ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block w-5/12" />
                
                {/* Точка на линии */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#b4945c] rounded-full z-10 hidden md:block" />
                
                {/* Карточка события */}
                <div className="w-full md:w-5/12">
                  <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl border border-[#b4945c]/20 shadow-sm hover:shadow-lg transition-all relative group">
                    <div className={`flex items-center gap-3 mb-3 ${event.side === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                      {event.icon}
                      <span className="text-[#b4945c] font-serif font-bold italic">{event.year}</span>
                    </div>
                    <h3 className={`text-xl font-serif text-stone-800 mb-3 font-bold ${event.side === 'right' ? 'text-left' : 'text-right'}`}>
                      {event.title}
                    </h3>
                    <p className={`text-stone-600 font-serif leading-relaxed text-sm ${event.side === 'right' ? 'text-left' : 'text-right'}`}>
                      {event.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}