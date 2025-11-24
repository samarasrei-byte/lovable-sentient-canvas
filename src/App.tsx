import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout, { RedirectToDashboard } from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Talentos from "./pages/app/TalentosAprimorado";
import PerfilTalento from "./pages/app/PerfilTalento";
import Planos from "./pages/app/Planos";
import LiveShop from "./pages/app/LiveShop";
import Consultoria from "./pages/app/Consultoria";
import Perfil from "./pages/app/Perfil";
import Campanhas from "./pages/app/Campanhas";
import Contratos from "./pages/app/Contratos";
import Pagamentos from "./pages/app/Pagamentos";
import Monitoramento from "./pages/app/Monitoramento";
import IAInsights from "./pages/app/IAInsights";
import AvatarStudio from "./pages/app/AvatarStudio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<RedirectToDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="talentos" element={<Talentos />} />
            <Route path="talentos/:id" element={<PerfilTalento />} />
            <Route path="campanhas" element={<Campanhas />} />
            <Route path="contratos" element={<Contratos />} />
            <Route path="pagamentos" element={<Pagamentos />} />
              <Route path="monitoramento" element={<Monitoramento />} />
              <Route path="ia-insights" element={<IAInsights />} />
              <Route path="avatar-studio" element={<AvatarStudio />} />
              <Route path="liveshop" element={<LiveShop />} />
            <Route path="consultoria" element={<Consultoria />} />
            <Route path="planos" element={<Planos />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
