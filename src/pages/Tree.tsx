import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { GitBranch } from "lucide-react";

const Tree = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 border-2 border-accent/30">
              <GitBranch className="w-7 h-7 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Генеалогическое древо
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Интерактивное древо рода Власовых — 8 поколений от XVIII века до наших дней.
            </p>
            <div className="mt-12 card-heritage p-12 text-center">
              <p className="text-muted-foreground text-sm">Интерактивное древо скоро будет здесь</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tree;
