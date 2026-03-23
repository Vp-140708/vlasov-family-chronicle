import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Tree from "./pages/Tree";
import Artifacts from "./pages/Artifacts";
import MapPage from "./pages/MapPage";
import Timeline from "./pages/Timeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative min-h-screen bg-stone-50">
          {/* Хедер вынесен за пределы Routes, чтобы быть на всех страницах */}
          <Navbar /> 
          
          {/* Контент страницы под хедером */}
          <main className="pt-16"> 
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tree" element={<Tree />} />
              <Route path="/artifacts" element={<Artifacts />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/timeline" element={<Timeline />} />
              {/* Запасной маршрут для ошибок */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;