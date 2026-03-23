import { motion } from "framer-motion";
import { GitBranch, Archive, Map, Clock, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Добавил useLocation для подсветки активной страницы
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { label: "Древо", icon: GitBranch, href: "/tree" },
  { label: "Артефакты", icon: Archive, href: "/artifacts" },
  { label: "Карта", icon: Map, href: "/map" },
  { label: "Таймлайн", icon: Clock, href: "/timeline" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      // Добавил фиксированную высоту h-16 и более плотный фон для мобилок
      className="fixed top-0 left-0 right-0 z-[100] h-16 bg-stone-50/90 backdrop-blur-md border-b border-stone-200"
    >
      <div className="container mx-auto flex items-center justify-between h-full px-6">
        <Link
          to="/"
          // font-serif сделает логотип более статусным
          className="font-serif text-xl font-bold text-stone-900 tracking-tight shrink-0"
        >
          Vlasov <span className="text-amber-600 font-light italic">Heritage</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                location.pathname === item.href 
                ? "text-amber-700" 
                : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu - бургером */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 shadow-sm"
                aria-label="Открыть меню"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-stone-50 border-l border-stone-200 w-[250px]">
              <div className="flex flex-col gap-6 pt-10">
                <div className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold border-b border-stone-200 pb-2">
                  Навигация
                </div>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-serif text-stone-700 hover:text-amber-700 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;