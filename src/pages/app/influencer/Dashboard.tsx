import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { InfluencerOnboarding } from "@/components/InfluencerOnboarding";
import {
  Users,
  Eye,
  Heart,
  DollarSign,
  Star,
  TrendingUp,
  Target,
  Sparkles,
  Bell,
  MessageSquare,
  Upload,
  BarChart3,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Instagram,
  Facebook,
  Share2,
  ArrowUpRight,
  Plus,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [influencerData, setInfluencerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'influencer');
    loadInfluencerData();
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  const loadInfluencerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: influencer } = await supabase
        .from("influencers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (influencer) {
        setInfluencerData(influencer);
      } else {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error loading influencer data:", error);
      setShowOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadInfluencerData();
  };

  const stats = [
    {
      title: "Campanhas Ativas",
      value: "5",
      change: "+2 este mês",
      icon: Target,
      gradient: "from-primary to-primary/70",
      action: () => navigate("/app/influencer/contratos")
    },
    {
      title: "Ganhos Totais",
      value: "R$ 45.2K",
      change: "+R$ 5.2K",
      icon: DollarSign,
      gradient: "from-secondary to-secondary/70",
      action: () => navigate("/app/influencer/pagamentos")
    },
    {
      title: "Alcance Total",
      value: "2.5M",
      change: "+450K",
      icon: Eye,
      gradient: "from-accent to-accent/70",
      action: () => navigate("/app/influencer/analytics")
    },
    {
      title: "Avaliação",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      gradient: "from-success to-success/70",
      action: () => navigate("/app/influencer/perfil")
    }
  ];

  const activeCampaigns = [
    {
      id: 1,
      brand: "TechBrand",
      logo: "🚀",
      title: "Lançamento Produto X",
      payment: 5000,
      deliverables: 3,
      completed: 2,
      type: "Reels + Stories"
    },
    {
      id: 2,
      brand: "FashionCo",
      logo: "👗",
      title: "Campanha Verão",
      payment: 8000,
      deliverables: 5,
      completed: 1,
      type: "Feed Posts"
    }
  ];

  const availableOpportunities = [
    {
      id: 1,
      brand: "BeautyBrand",
      logo: "💄",
      title: "Lançamento Nova Linha",
      payment: 6500,
      deliverables: "3 Reels",
      category: "Beleza"
    },
    {
      id: 2,
      brand: "FitnessApp",
      logo: "💪",
      title: "Campanha Wellness",
      payment: 4200,
      deliverables: "5 Stories + 1 Post",
      category: "Fitness"
    }
  ];

  const notifications = [
    { id: 1, message: "Nova campanha disponível: BeautyBrand", time: "5 min", urgent: true },
    { id: 2, message: "Pagamento de R$ 5.000 confirmado", time: "1h", urgent: false },
    { id: 3, message: "FashionCo enviou uma mensagem", time: "2h", urgent: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding && userId) {
    return <InfluencerOnboarding userId={userId} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Premium Header com Glass Morphism */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-16 w-16 lg:h-20 lg:w-20 border-2 border-primary/30 shadow-lg ring-4 ring-primary/10">
                  <AvatarImage src={influencerData?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
                    {influencerData?.stage_name?.substring(0, 2) || "IN"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                    <span className="text-xs font-medium text-primary tracking-wide">Painel do Influenciador</span>
                  </div>
                  <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-1">
                    Olá, {influencerData?.stage_name || "Influenciador"}! 👋
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    @{influencerData?.instagram_handle || "username"}
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:bg-accent/10 hover:border-accent/50 transition-all"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Conectar Redes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:bg-accent/10 relative"
                  onClick={() => navigate("/app/chat")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mensagens
                  <Badge className="ml-2 bg-primary text-primary-foreground h-5 px-1.5 text-xs">3</Badge>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:bg-accent/10 relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <Badge className="ml-2 bg-destructive text-destructive-foreground h-5 px-1.5 text-xs">5</Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards com Glass Morphism e Gradientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={stat.action}
              >
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                      <div className="flex items-center gap-1 text-xs text-success pt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notificações Importantes - Glass Morphism */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  Notificações Importantes
                </h2>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10">Ver todas</Button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/50 hover:bg-background/80 transition-all p-4 hover:scale-[1.01]">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${notif.urgent ? 'bg-destructive/10' : 'bg-primary/10'} ring-2 ${notif.urgent ? 'ring-destructive/20' : 'ring-primary/20'}`}>
                      <Bell className={`w-4 h-4 ${notif.urgent ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.time} atrás
                      </p>
                    </div>
                    {notif.urgent && (
                      <Badge variant="destructive" className="h-6 text-xs animate-pulse">Urgente</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Principal - 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campanhas Ativas - Premium Glass Design */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent" />
            <div className="relative">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/70">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    Campanhas Ativas
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs hover:bg-success/10"
                    onClick={() => navigate("/app/influencer/contratos")}
                  >
                    Ver todas
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Projetos em andamento</p>
              </div>
              <div className="p-6 space-y-4">
                {activeCampaigns.map((campaign) => {
                  const progress = (campaign.completed / campaign.deliverables) * 100;
                  return (
                    <div key={campaign.id} className="group">
                      <div className="relative overflow-hidden rounded-xl border border-border/30 bg-background/50 hover:bg-background/80 transition-all p-5 hover:scale-[1.01]">
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-success/10 text-success border-success/20 text-xs h-6">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ativa
                          </Badge>
                        </div>

                        <div className="flex items-start gap-3 mb-4">
                          <div className="text-3xl">{campaign.logo}</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1">{campaign.title}</h3>
                            <p className="text-xs text-muted-foreground">{campaign.brand}</p>
                            <Badge variant="outline" className="mt-2 text-xs h-5">{campaign.type}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <p className="text-xs text-muted-foreground mb-1">Pagamento</p>
                            <p className="text-lg font-bold text-primary">R$ {campaign.payment.toLocaleString()}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                            <p className="text-xs text-muted-foreground mb-1">Entregáveis</p>
                            <p className="text-lg font-bold">{campaign.completed}/{campaign.deliverables}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Progresso</span>
                            <span className="font-bold text-success">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div 
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-9"
                          onClick={() => navigate("/app/influencer/contratos")}
                        >
                          <Send className="w-3.5 h-3.5 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Métricas e Insights - Premium Design */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/70">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    Métricas e Insights
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs hover:bg-accent/10"
                  >
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    Carregar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Performance e engajamento</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-pink-500/10 to-transparent p-4 hover:scale-[1.02] transition-all">
                    <Instagram className="w-5 h-5 text-pink-500 mb-2" />
                    <p className="text-xs text-muted-foreground">Instagram</p>
                    <p className="text-xl font-bold">{influencerData?.followers_count?.toLocaleString() || "0"}</p>
                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12.5%</span>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-blue-500/10 to-transparent p-4 hover:scale-[1.02] transition-all">
                    <Facebook className="w-5 h-5 text-blue-500 mb-2" />
                    <p className="text-xs text-muted-foreground">Facebook</p>
                    <p className="text-xl font-bold">85.2K</p>
                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+8.3%</span>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border/30 bg-background/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Engajamento</span>
                    <span className="text-sm font-bold text-success">{influencerData?.engagement_rate || 0}%</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Curtidas</span>
                        <span className="font-semibold">24.5K</span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Comentários</span>
                        <span className="font-semibold">3.2K</span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Compartilhamentos</span>
                        <span className="font-semibold">1.8K</span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-2 hover:bg-accent/10 hover:border-accent/50 h-24"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">Carregar Métricas</p>
                      <p className="text-xs text-muted-foreground">Screenshots ou links</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Pagamentos - Full Width Premium */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
          <div className="relative">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-secondary to-secondary/70">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  Pagamentos
                </h2>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-secondary to-secondary/70 hover:opacity-90"
                  onClick={() => navigate("/app/influencer/pagamentos")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Solicitar Pagamento
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Histórico e próximos pagamentos</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-success/10 to-transparent p-5 hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-success/20">
                      <Calendar className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Próximo</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">R$ 5.000</p>
                  <p className="text-xs text-muted-foreground">Previsão: 15 Fev</p>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-primary/10 to-transparent p-5 hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Wallet className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Disponível</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">R$ 12.450</p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Sacar
                  </Button>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-accent/10 to-transparent p-5 hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <BarChart3 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">R$ 45.200</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +15% vs mês anterior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Oportunidades Disponíveis */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/70">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Novas Oportunidades
                </h2>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10">Ver todas</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Marcas procurando influenciadores</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="group">
                  <div className="relative overflow-hidden rounded-xl border border-border/30 bg-background/50 hover:bg-background/80 transition-all p-5 hover:scale-[1.01]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{opportunity.logo}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1">{opportunity.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{opportunity.brand}</p>
                          <Badge variant="outline" className="text-xs h-5">{opportunity.category}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Pagamento</span>
                        <span className="text-xl font-bold text-primary">R$ {opportunity.payment.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{opportunity.deliverables}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Detalhes
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-secondary h-8 text-xs">
                        <Send className="w-3 h-3 mr-1" />
                        Candidatar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perfil Overview - Premium Footer */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5" />
          <div className="relative p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/70">
                <Star className="w-4 h-4 text-white" />
              </div>
              Visão Geral do Perfil
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-primary/10 to-transparent p-5 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Seguidores</span>
                </div>
                <p className="text-3xl font-bold">{influencerData?.followers_count?.toLocaleString() || "0"}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.5% este mês</span>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-secondary/10 to-transparent p-5 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Engajamento</span>
                </div>
                <p className="text-3xl font-bold">{influencerData?.engagement_rate || 0}%</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span>+2.1% este mês</span>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-accent/10 to-transparent p-5 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</span>
                </div>
                <p className="text-2xl font-bold">{influencerData?.category || "N/A"}</p>
                <Badge className="mt-2 bg-accent/10 text-accent border-accent/20 text-xs h-5">
                  Top Performer
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
