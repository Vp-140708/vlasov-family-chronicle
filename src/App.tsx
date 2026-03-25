import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Импортируем страницы
import Index from "./pages/Index";
import Tree from "./pages/Tree";
import Artifacts from "./pages/Artifacts";
import MapPage from "./pages/MapPage";
import Timeline from "./pages/Timeline";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Наша новая страница входа
import Suggest from "./pages/Suggest";
import Admin from "./pages/Admin";
import Migrate from "./pages/Migrate";
// Импортируем компонент защиты
import ProtectedRoute from "./components/ProtectedRoute";


const queryClient = new QueryClient();
const isAdmin = user?.email === 'vlasov_pavel@mail.ru';
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Открытый маршрут */}
          <Route path="/login" element={<Login />} />
          <Route path="/artifacts" element={<Artifacts isAdmin={isAdmin} />} />
          {/* ЗАЩИЩЕННЫЕ МАРШРУТЫ */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/migrate" element={<Migrate />} />
            <Route path="/artifacts" element={<Artifacts />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/suggest" element={<Suggest />} /> {/* ДОБАВЬ ЭТУ СТРОКУ */}
            <Route path="/admin" element={<Admin />} />
            
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;