import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useParallax } from "@/hooks/use-parallax";
import { InfluencerOnboarding } from "@/components/InfluencerOnboarding";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  Star,
  Instagram,
  Youtube,
  Calendar,
  Award,
  Sparkles,
  Target,
  Activity,
  ArrowUpRight,
  Zap,
  TrendingDown,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  FileText,
  BarChart3,
  Send,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [influencerData, setInfluencerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerOffset = useParallax(headerRef, 0.2);

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
        // No profile found, show onboarding
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
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: "from-primary to-primary/70"
    },
    {
      title: "Ganhos Totais",
      value: "R$ 45.2K",
      change: "+R$ 5.2K",
      trend: "up",
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      gradient: "from-secondary to-secondary/70"
    },
    {
      title: "Alcance Total",
      value: "2.5M",
      change: "+450K",
      trend: "up",
      icon: Eye,
      color: "text-artist",
      bgColor: "bg-artist/10",
      gradient: "from-artist to-artist/70"
    },
    {
      title: "Avaliação",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500 to-green-600"
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
    },
    {
      id: 3,
      brand: "TravelCo",
      logo: "✈️",
      title: "Destinos de Verão",
      payment: 9500,
      deadline: "2024-03-10",
      deliverables: "2 Vídeos YouTube",
      category: "Viagens"
    }
  ];

  const pendingProposals = [
    {
      id: 1,
      brand: "GamingBrand",
      logo: "🎮",
      title: "Torneio Exclusivo",
      payment: 7500,
      sentDate: "2024-01-28",
      status: "pending"
    },
    {
      id: 2,
      brand: "FoodDelivery",
      logo: "🍔",
      title: "Campanha Delivery",
      payment: 3800,
      sentDate: "2024-01-26",
      status: "under_review"
    }
  ];

  const recentMetrics = [
    { label: "Seguidores", value: influencerData?.followers_count?.toLocaleString() || "0", icon: Users },
    { label: "Engajamento", value: `${influencerData?.engagement_rate || 0}%`, icon: Heart },
    { label: "Categoria", value: influencerData?.category || "N/A", icon: Award }
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
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div 
        ref={headerRef}
        className="flex items-center justify-between"
        style={{
          transform: `translateY(${-headerOffset}px)`,
        }}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Painel do Influenciador</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
            Olá, {influencerData?.stage_name || "Influenciador"}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">Gerencie suas parcerias, propostas e ganhos</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/20">
            <Mail className="w-4 h-4 mr-2" />
            Mensagens
            <Badge className="ml-2 bg-primary text-white">3</Badge>
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Zap className="w-4 h-4 mr-2" />
            Atualizar Perfil
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : TrendingDown;
          return (
            <div key={idx} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <Card className="relative border-border/50 bg-card/60 backdrop-blur overflow-hidden hover:shadow-xl transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {stat.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className={`text-sm flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendIcon className="w-3 h-3" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Profile Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Seu Perfil
          </CardTitle>
          <CardDescription>Suas informações e métricas principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="campaigns">Minhas Campanhas</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="proposals">Propostas</TabsTrigger>
        </TabsList>

        {/* Active Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Campanhas Ativas
                  </CardTitle>
                  <CardDescription>Suas campanhas em andamento</CardDescription>
                </div>
                <Button variant="outline">Ver Todas</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCampaigns.map((campaign) => {
                const progress = (campaign.completed / campaign.deliverables) * 100;
                return (
                  <div key={campaign.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                    <div className="relative p-5 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="text-4xl">{campaign.logo}</div>
                          <div>
                            <h3 className="font-semibold text-lg">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                            <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                              {campaign.type}
                            </Badge>
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Ativa
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Pagamento</p>
                          <p className="font-bold text-primary text-lg">R$ {campaign.payment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Prazo</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(campaign.deadline).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Entregáveis</p>
                          <p className="font-semibold">{campaign.completed}/{campaign.deliverables}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-semibold">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Contrato
                        </Button>
                        <Button className="flex-1 bg-gradient-to-r from-primary to-secondary" size="sm">
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Entrega
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Oportunidades Disponíveis
              </CardTitle>
              <CardDescription>Marcas buscando influenciadores como você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative p-5 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-4xl">{opportunity.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                            <Badge variant="outline">{opportunity.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{opportunity.brand}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Prazo: {new Date(opportunity.deadline).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">R$ {opportunity.payment.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{opportunity.deliverables}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-primary to-secondary" size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Proposta
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Propostas Enviadas
              </CardTitle>
              <CardDescription>Acompanhe o status das suas propostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingProposals.map((proposal) => (
                <div key={proposal.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative p-5 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-4xl">{proposal.logo}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{proposal.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{proposal.brand}</p>
                          <p className="text-xs text-muted-foreground">
                            Enviada em {new Date(proposal.sentDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary mb-2">R$ {proposal.payment.toLocaleString()}</p>
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                          <Clock className="w-3 h-3 mr-1" />
                          {proposal.status === 'pending' ? 'Pendente' : 'Em Análise'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          className="h-24 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => navigate("/app/perfil")}
        >
          <Users className="w-6 h-6 mr-3" />
          Editar Perfil
        </Button>
        <Button
          variant="outline"
          className="h-24 text-lg border-2"
          onClick={() => navigate("/app/ia-insights")}
        >
          <BarChart3 className="w-6 h-6 mr-3" />
          Analytics & IA
        </Button>
        <Button
          variant="outline"
          className="h-24 text-lg border-2"
          onClick={() => navigate("/app/pagamentos")}
        >
          <DollarSign className="w-6 h-6 mr-3" />
          Pagamentos
        </Button>
      </div>
    </div>
  );
}
