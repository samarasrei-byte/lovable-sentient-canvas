import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";

import { MyPhotos } from "@/components/dashboard/MyPhotos";
import { MyPurchases } from "@/components/dashboard/MyPurchases";
import { SupportTickets } from "@/components/dashboard/SupportTickets";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

// Lazy load ALL routes except the landing page for instant FCP
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const TestLogin = lazy(() => import("./pages/qa/TestLogin"));
const QADashboard = lazy(() => import("./pages/qa/QADashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute").then(m => ({ default: m.ProtectedRoute })));
const AppLayout = lazy(() => import("./pages/app/AppLayout"));
const RedirectToDashboard = lazy(() => import("./pages/app/AppLayout").then(m => ({ default: m.RedirectToDashboard })));
const DashboardRouter = lazy(() => import("./components/DashboardRouter").then(m => ({ default: m.DashboardRouter })));
const PerfilRouter = lazy(() => import("./components/PerfilRouter").then(m => ({ default: m.PerfilRouter })));
const Talentos = lazy(() => import("./pages/app/TalentosAprimorado"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const PerfilTalento = lazy(() => import("./pages/app/PerfilTalento"));
const Planos = lazy(() => import("./pages/app/Planos"));
const LiveShop = lazy(() => import("./pages/app/LiveShop"));
const Consultoria = lazy(() => import("./pages/app/Consultoria"));
const Campanhas = lazy(() => import("./pages/app/Campanhas"));
const Contratos = lazy(() => import("./pages/app/Contratos"));
const Pagamentos = lazy(() => import("./pages/app/Pagamentos"));
const Monitoramento = lazy(() => import("./pages/app/Monitoramento"));
const IAInsights = lazy(() => import("./pages/app/IAInsights"));
const AvatarStudio = lazy(() => import("./pages/app/AvatarStudio"));
const AIStudio = lazy(() => import("./pages/app/AIStudio"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminInfluencers = lazy(() => import("./pages/admin/Influencers"));
const AdminBrands = lazy(() => import("./pages/admin/Brands"));
const AdminCampaigns = lazy(() => import("./pages/admin/Campaigns"));
const AdminFinancial = lazy(() => import("./pages/admin/Financial"));
const AdminWhiteLabel = lazy(() => import("./pages/admin/WhiteLabel"));
const AdminSupport = lazy(() => import("./pages/admin/Support"));
const AdminLogs = lazy(() => import("./pages/admin/Logs"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const PromptsManager = lazy(() => import("./pages/admin/PromptsManager"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const MarketplaceManager = lazy(() => import("./pages/admin/MarketplaceManager"));
const FinancialDashboard = lazy(() => import("./pages/admin/FinancialDashboard"));
const Chat = lazy(() => import("./pages/app/Chat"));
const WhiteLabelDashboard = lazy(() => import("./pages/app/WhiteLabelDashboard"));
const Analytics = lazy(() => import("./pages/app/Analytics"));
const InfluencerContratos = lazy(() => import("./pages/app/influencer/Contratos"));
const InfluencerPagamentos = lazy(() => import("./pages/app/influencer/Pagamentos"));
const InfluencerMonitoramento = lazy(() => import("./pages/app/influencer/Monitoramento"));
const InfluencerAnalytics = lazy(() => import("./pages/app/influencer/Analytics"));
const AgencyDashboard = lazy(() => import("./pages/app/agency/Dashboard"));
const Insights = lazy(() => import("./pages/app/Insights"));
const MeusProdutos = lazy(() => import("./pages/app/MeusProdutos"));
const VideoCreator = lazy(() => import("./pages/app/VideoCreator"));
const PromptDashboard = lazy(() => import("./pages/app/PromptDashboard"));
const FutebolGenerator = lazy(() => import("./pages/app/FutebolGenerator"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const FotoInfantil = lazy(() => import("./pages/Mesversario"));
const MelodiaPod = lazy(() => import("./pages/MelodiaPod"));
const TermosDeUso = lazy(() => import("./pages/TermosDeUso"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<ProtectedRoute requiredRole="admin"><Login /></ProtectedRoute>} />
            
            {/* QA Routes - Hidden from public */}
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/qa-dashboard" element={<QADashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="prompts" element={<PromptsManager />} />
              <Route path="marketplace" element={<MarketplaceManager />} />
              <Route path="influencers" element={<AdminInfluencers />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="financial" element={<AdminFinancial />} />
              <Route path="financial-dashboard" element={<FinancialDashboard />} />
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
              <Route path="prompt-dashboard" element={<PromptDashboard />} />
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
              <Route path="futebol" element={<FutebolGenerator />} />
              <Route path="liveshop" element={<LiveShop />} />
              <Route path="consultoria" element={<Consultoria />} />
              <Route path="planos" element={<Planos />} />
              <Route path="perfil" element={<PerfilRouter />} />
              <Route path="chat" element={<Chat />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="minhas-fotos" element={<MyPhotos />} />
              <Route path="minhas-compras" element={<MyPurchases />} />
              <Route path="chamados" element={<SupportTickets />} />
              <Route path="em-breve" element={<ComingSoon />} />
              
              {/* Influencer Routes */}
              <Route path="influencer/contratos" element={<InfluencerContratos />} />
              <Route path="influencer/pagamentos" element={<InfluencerPagamentos />} />
              <Route path="influencer/monitoramento" element={<InfluencerMonitoramento />} />
              <Route path="influencer/analytics" element={<InfluencerAnalytics />} />
              
              {/* Agency Routes */}
              <Route path="agency/dashboard" element={<AgencyDashboard />} />
            </Route>

            {/* Category Landing Pages */}
            <Route path="/fotoinfantil" element={<FotoInfantil />} />
            <Route path="/melodiapod" element={<MelodiaPod />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />

            {/* Legal Pages */}
            <Route path="/termos" element={<TermosDeUso />} />
            <Route path="/privacidade" element={<PoliticaPrivacidade />} />

            {/* White Label Agency Routes */}
            <Route path="/whitelabel/:domain" element={<WhiteLabelDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
