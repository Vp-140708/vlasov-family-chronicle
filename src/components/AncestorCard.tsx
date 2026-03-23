import { motion } from "framer-motion";
import { User } from "lucide-react";

interface AncestorCardProps {
  name: string;
  title: string;
  years: string;
  delay?: number;
}

const AncestorCard = ({ name, title, years, delay = 0 }: AncestorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      className="card-heritage p-6 flex flex-col items-center text-center group cursor-pointer transition-shadow duration-300 hover:shadow-heritage-lg"
    >
      {/* Photo placeholder */}
      <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center mb-5 border-2 border-gold/30 group-hover:border-gold/60 transition-colors duration-300">
        <User className="w-10 h-10 text-muted-foreground" />
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
        {name}
      </h3>

      <p className="text-sm text-accent font-medium mb-2">{title}</p>

      <p className="text-xs text-muted-foreground tracking-wide">{years}</p>
    </motion.div>
  );
};

export default AncestorCard;
