
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, TreeDeciduous, Image, Map, Clock, LogOut, MessageSquarePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Главная", path: "/", icon: <TreeDeciduous className="w-4 h-4" /> },
    { name: "Древо", path: "/tree", icon: <TreeDeciduous className="w-4 h-4" /> },
    { name: "Артефакты", path: "/artifacts", icon: <Image className="w-4 h-4" /> },
    { name: "Карта", path: "/map", icon: <Map className="w-4 h-4" /> },
    { name: "Хронология", path: "/timeline", icon: <Clock className="w-4 h-4" /> },
    { name: "Предложить", path: "/suggest", icon: <MessageSquarePlus className="w-4 h-4" /> }, // Новая кнопка
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed w-full bg-stone-50/80 backdrop-blur-md z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-serif text-stone-800 font-semibold tracking-tight">
              Хроника Рода
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-stone-900"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm font-medium text-stone-500 hover:text-red-600 transition-colors ml-4 border-l pl-4 border-stone-200"
              title="Выйти из аккаунта"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-500 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "text-stone-900 bg-stone-100"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center w-full space-x-2 px-3 py-2 mt-2 rounded-md text-base font-medium text-stone-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;