import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { InfluencerOnboarding } from "@/components/InfluencerOnboarding";
import {
  Users,
  Eye,
  Heart,
  DollarSign,
  Star,
  Calendar,
  Award,
  Sparkles,
  Target,
  ArrowUpRight,
  Zap,
  TrendingDown,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bell,
  MessageSquare,
  Video,
  FileText,
  Send,
  ExternalLink,
  TrendingUp,
  Package,
  PlayCircle,
  Wallet,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      trend: "up",
      icon: Target,
      gradient: "from-primary to-primary/70",
      action: () => navigate("/app/influencer/contratos")
    },
    {
      title: "Ganhos Totais",
      value: "R$ 45.2K",
      change: "+R$ 5.2K",
      trend: "up",
      icon: DollarSign,
      gradient: "from-secondary to-secondary/70",
      action: () => navigate("/app/influencer/pagamentos")
    },
    {
      title: "Alcance Total",
      value: "2.5M",
      change: "+450K",
      trend: "up",
      icon: Eye,
      gradient: "from-accent to-accent/70",
      action: () => navigate("/app/influencer/analytics")
    },
    {
      title: "Avaliação",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      gradient: "from-green-500 to-green-600",
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
      status: "active",
      deadline: "2024-02-15",
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
      status: "active",
      deadline: "2024-03-01",
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
      deadline: "2024-02-20",
      deliverables: "3 Reels",
      category: "Beleza"
    },
    {
      id: 2,
      brand: "FitnessApp",
      logo: "💪",
      title: "Campanha Wellness",
      payment: 4200,
      deadline: "2024-02-25",
      deliverables: "5 Stories + 1 Post",
      category: "Fitness"
    }
  ];

  const notifications = [
    { id: 1, type: "campaign", message: "Nova campanha disponível: BeautyBrand", time: "5 min", urgent: true },
    { id: 2, type: "payment", message: "Pagamento de R$ 5.000 confirmado", time: "1h", urgent: false },
    { id: 3, type: "message", message: "FashionCo enviou uma mensagem", time: "2h", urgent: false },
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
    <div className="p-6 lg:p-8 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide">Painel do Influenciador</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Olá, {influencerData?.stage_name || "Influenciador"}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">Gerencie suas parcerias, propostas e ganhos em um só lugar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-border/50 hover:bg-accent/10 relative"
            onClick={() => navigate("/app/chat")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
            <Badge className="ml-2 bg-primary text-primary-foreground h-5 px-1.5 text-xs">3</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-border/50 hover:bg-accent/10 relative"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificações
            <Badge className="ml-2 bg-destructive text-destructive-foreground h-5 px-1.5 text-xs">5</Badge>
          </Button>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => navigate("/app/influencer/perfil")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Perfil
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : TrendingDown;
          return (
            <div 
              key={idx} 
              className="relative group cursor-pointer"
              onClick={stat.action}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300`} />
              <Card className="relative border-border/50 bg-card/80 backdrop-blur hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <TrendIcon className={`w-3.5 h-3.5 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className={`text-xs flex items-center gap-1 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Notificações Importantes */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4 text-primary" />
              Notificações Importantes
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">Ver todas</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
              <div className={`p-1.5 rounded-lg ${notif.urgent ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                <Bell className={`w-3.5 h-3.5 ${notif.urgent ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.time} atrás</p>
              </div>
              {notif.urgent && (
                <Badge variant="destructive" className="h-5 text-xs">Urgente</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Grid de 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campanhas Ativas */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-4 h-4 text-primary" />
                Campanhas Ativas
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => navigate("/app/influencer/contratos")}
              >
                Ver todas
              </Button>
            </div>
            <CardDescription className="text-xs">Seus projetos em andamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCampaigns.map((campaign) => {
              const progress = (campaign.completed / campaign.deliverables) * 100;
              return (
                <div key={campaign.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300" />
                  <div className="relative p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2">
                        <div className="text-2xl">{campaign.logo}</div>
                        <div>
                          <h3 className="font-semibold text-sm">{campaign.title}</h3>
                          <p className="text-xs text-muted-foreground">{campaign.brand}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs h-5">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ativa
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-0.5">Pagamento</p>
                        <p className="font-bold text-primary">R$ {campaign.payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Entregáveis</p>
                        <p className="font-semibold">{campaign.completed}/{campaign.deliverables}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-3 h-8 text-xs" 
                      size="sm"
                      onClick={() => navigate("/app/influencer/contratos")}
                    >
                      <Send className="w-3 h-3 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Oportunidades Disponíveis */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="w-4 h-4 text-primary" />
                Novas Oportunidades
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">Ver todas</Button>
            </div>
            <CardDescription className="text-xs">Marcas buscando influenciadores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300" />
                <div className="relative p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/20 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="text-2xl">{opportunity.logo}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{opportunity.title}</h3>
                        <p className="text-xs text-muted-foreground">{opportunity.brand}</p>
                        <Badge variant="outline" className="mt-1.5 text-xs h-5">
                          {opportunity.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">R$ {opportunity.payment.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.deliverables}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 h-8 text-xs" size="sm">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-secondary h-8 text-xs" size="sm">
                      <Send className="w-3 h-3 mr-2" />
                      Candidatar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate("/app/influencer/pagamentos")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-secondary to-secondary/70">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pagamentos</p>
              <p className="text-sm font-bold">Gerenciar</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate("/app/influencer/analytics")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-accent to-accent/70">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Analytics</p>
              <p className="text-sm font-bold">Ver Métricas</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate("/app/liveshop")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Live Shop</p>
              <p className="text-sm font-bold">Transmitir</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate("/app/chat")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chat</p>
              <p className="text-sm font-bold">Conversar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Perfil Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="w-4 h-4 text-primary" />
            Visão Geral do Perfil
          </CardTitle>
          <CardDescription className="text-xs">Suas informações e métricas principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Seguidores</p>
                <p className="text-lg font-bold">{influencerData?.followers_count?.toLocaleString() || "0"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Heart className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Engajamento</p>
                <p className="text-lg font-bold">{influencerData?.engagement_rate || 0}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-accent/10">
                <Award className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categoria</p>
                <p className="text-lg font-bold">{influencerData?.category || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
