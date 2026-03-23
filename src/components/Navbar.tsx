import { motion } from "framer-motion";
import { GitBranch, Archive, Map, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Древо", icon: GitBranch, href: "/tree" },
  { label: "Артефакты", icon: Archive, href: "/artifacts" },
  { label: "Карта", icon: Map, href: "/map" },
  { label: "Таймлайн", icon: Clock, href: "/timeline" },
];

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="font-display text-xl font-semibold text-foreground tracking-wide">
          Vlasov <span className="text-gold-gradient">Heritage</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
