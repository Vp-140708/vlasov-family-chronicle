import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sword, Plane, Cross } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AncestorCard from "@/components/AncestorCard";
import findingDress from "@/assets/finding-dress.jpg";
import findingTelegram from "@/assets/finding-telegram.jpg";

const ancestors = [
  {
    name: "Николай Викентьевич Тороцко",
    title: "Кавалер Ордена Святого Георгия IV степени и Георгиевского оружия",
    years: "1888 – 1974",
    link: "/tree",
  },
  {
    name: "Меркурий Евтихеевич Власов",
    title: "Воентехник 9-го истребительного авиаполка ЧФ, участник обороны Севастополя",
    years: "1912 – 2000",
    link: "/tree",
  },
  {
    name: "Анна Торотько",
    title: "Капитан медицинской службы, хирург",
    years: "1921 – 2003",
    link: "/tree",
  },
];

const findings = [
  {
    title: "Старинное платье",
    description: "Платье начала XX века, обнаруженное в семейном архиве. Предположительно принадлежало одной из женщин рода.",
    image: findingDress,
  },
  {
    title: "Телеграмма 1915 года",
    description: "Полевая телеграмма времён Первой мировой войны, найденная среди документов Николая Тороцко.",
    image: findingTelegram,
  },
];

const chronicle = [
  {
    year: "1915",
    title: "Награждение Николая в Петрограде",
    description: "Николай Викентьевич Тороцко удостоен Георгиевского оружия за храбрость на фронте Первой мировой войны.",
    icon: Sword,
  },
  {
    year: "1942",
    title: "Меркурий пропадает без вести в Севастополе",
    description: "Воентехник Меркурий Евтихеевич Власов пропал без вести во время обороны Севастополя.",
    icon: Plane,
  },
  {
    year: "1945",
    title: "Анна в Потсдаме",
    description: "Капитан медслужбы Анна Торотько встретила конец войны в Потсдаме, оказывая помощь раненым.",
    icon: Cross,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#fdf6e9] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      <HeroSection />

      {/* Featured Ancestors */}
      <section className="relative z-10 py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3 font-medium">
              Избранные
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Наши предки
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ancestors.map((ancestor, i) => (
              <Link key={ancestor.name} to={ancestor.link}>
                <AncestorCard
                  {...ancestor}
                  delay={i * 0.15}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Chronicle */}
      <section className="relative z-10 py-24 px-6 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3 font-medium">
              Хроника
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Ключевые события
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mt-4" />
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-accent/30 -translate-x-1/2" />

            {chronicle.map((event, i) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background z-10" />

                  {/* Content */}
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"}`}>
                    <div className="card-heritage p-5">
                      <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                        <Icon className="w-4 h-4 text-accent" />
                        <span className="font-display text-xl font-bold text-accent">{event.year}</span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Findings */}
      <section className="relative z-10 py-24 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3 font-medium">
              Архив
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Последние находки
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {findings.map((finding, i) => (
              <motion.div
                key={finding.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="card-heritage overflow-hidden group cursor-pointer hover:shadow-heritage-lg transition-shadow duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={finding.image}
                    alt={finding.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {finding.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {finding.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <div className="w-8 h-px bg-accent mx-auto mb-4" />
        <p className="text-xs text-muted-foreground tracking-wide">
          Vlasov Heritage · Приватный семейный а рхив
        </p>
      </footer>
    </div>
  );
};

export default Index;
