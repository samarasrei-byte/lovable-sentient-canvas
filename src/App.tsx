import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import TestLogin from "./pages/qa/TestLogin";
import QADashboard from "./pages/qa/QADashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AppLayout, { RedirectToDashboard } from "./pages/app/AppLayout";
import { DashboardRouter } from "./components/DashboardRouter";
import { PerfilRouter } from "./components/PerfilRouter";
import Talentos from "./pages/app/TalentosAprimorado";
import { AdminLayout } from "./pages/admin/AdminLayout";
import PerfilTalento from "./pages/app/PerfilTalento";
import Planos from "./pages/app/Planos";
import LiveShop from "./pages/app/LiveShop";
import Consultoria from "./pages/app/Consultoria";
import Campanhas from "./pages/app/Campanhas";
import Contratos from "./pages/app/Contratos";
import Pagamentos from "./pages/app/Pagamentos";
import Monitoramento from "./pages/app/Monitoramento";
import IAInsights from "./pages/app/IAInsights";
import AvatarStudio from "./pages/app/AvatarStudio";
import AIStudio from "./pages/app/AIStudio";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInfluencers from "./pages/admin/Influencers";
import AdminBrands from "./pages/admin/Brands";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminFinancial from "./pages/admin/Financial";
import AdminWhiteLabel from "./pages/admin/WhiteLabel";
import AdminSupport from "./pages/admin/Support";
import AdminLogs from "./pages/admin/Logs";
import AdminSettings from "./pages/admin/Settings";
import PromptsManager from "./pages/admin/PromptsManager";
import Chat from "./pages/app/Chat";
import WhiteLabelDashboard from "./pages/app/WhiteLabelDashboard";
import Analytics from "./pages/app/Analytics";
import InfluencerContratos from "./pages/app/influencer/Contratos";
import InfluencerPagamentos from "./pages/app/influencer/Pagamentos";
import InfluencerMonitoramento from "./pages/app/influencer/Monitoramento";
import InfluencerAnalytics from "./pages/app/influencer/Analytics";
import AgencyDashboard from "./pages/app/agency/Dashboard";
import Insights from "./pages/app/Insights";
import MeusProdutos from "./pages/app/MeusProdutos";
import VideoCreator from "./pages/app/VideoCreator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* QA Routes - Hidden from public */}
          <Route path="/test-login" element={<TestLogin />} />
          <Route path="/qa-dashboard" element={<QADashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="prompts" element={<PromptsManager />} />
            <Route path="influencers" element={<AdminInfluencers />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="financial" element={<AdminFinancial />} />
            <Route path="whitelabel" element={<AdminWhiteLabel />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* App Routes */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<RedirectToDashboard />} />
            <Route path="dashboard" element={<DashboardRouter />} />
            <Route path="meus-produtos" element={<MeusProdutos />} />
            <Route path="insights" element={<Insights />} />
            <Route path="talentos" element={<Talentos />} />
            <Route path="talentos/:id" element={<PerfilTalento />} />
            <Route path="campanhas" element={<Campanhas />} />
            <Route path="contratos" element={<Contratos />} />
            <Route path="pagamentos" element={<Pagamentos />} />
            <Route path="monitoramento" element={<Monitoramento />} />
            <Route path="ia-insights" element={<IAInsights />} />
            <Route path="avatar-studio" element={<AvatarStudio />} />
            <Route path="ai-studio" element={<AIStudio />} />
            <Route path="video-creator" element={<VideoCreator />} />
            <Route path="liveshop" element={<LiveShop />} />
            <Route path="consultoria" element={<Consultoria />} />
            <Route path="planos" element={<Planos />} />
            <Route path="perfil" element={<PerfilRouter />} />
            <Route path="chat" element={<Chat />} />
            <Route path="analytics" element={<Analytics />} />
            
            {/* Influencer Routes */}
            <Route path="influencer/contratos" element={<InfluencerContratos />} />
            <Route path="influencer/pagamentos" element={<InfluencerPagamentos />} />
            <Route path="influencer/monitoramento" element={<InfluencerMonitoramento />} />
            <Route path="influencer/analytics" element={<InfluencerAnalytics />} />
            
            {/* Agency Routes */}
            <Route path="agency/dashboard" element={<AgencyDashboard />} />
          </Route>

          {/* White Label Agency Routes */}
          <Route path="/whitelabel/:domain" element={<WhiteLabelDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
