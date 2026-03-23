import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AncestorCard from "@/components/AncestorCard";

const ancestors = [
  {
    name: "Николай Тороцко",
    title: "Офицер Русской Императорской Армии",
    years: "1872 – 1932",
  },
  {
    name: "Меркурий Власов",
    title: "Ветеран Великой Отечественной войны",
    years: "1918 – 1995",
  },
  {
    name: "Анна Торотько",
    title: "Капитан медицинской службы",
    years: "1920 – 2001",
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
              <AncestorCard
                key={ancestor.name}
                {...ancestor}
                delay={i * 0.15}
              />
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
