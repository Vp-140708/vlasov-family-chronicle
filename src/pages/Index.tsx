import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AncestorCard from "@/components/AncestorCard";
import findingDress from "@/assets/finding-dress.jpg";
import findingTelegram from "@/assets/finding-telegram.jpg";

const ancestors = [
  {
    name: "Николай Тороцко",
    title: "Офицер РИА, Георгиевское оружие",
    years: "1888 – 1974",
    link: "/tree",
  },
  {
    name: "Меркурий Власов",
    title: "Воентехник авиации ЧФ, герой Севастополя",
    years: "1912 – 2000",
    link: "/tree",
  },
  {
    name: "Анна Торотько",
    title: "Капитан медслужбы, хирург",
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Featured Ancestors */}
      <section className="py-24 px-6">
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

      {/* Recent Findings */}
      <section className="py-24 px-6 bg-secondary/30">
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
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground tracking-wide">
          Vlasov Heritage · Приватный семейный архив
        </p>
      </footer>
    </div>
  );
};

export default Index;
