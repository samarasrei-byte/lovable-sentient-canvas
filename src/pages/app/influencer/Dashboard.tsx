import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
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
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [influencerData, setInfluencerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfluencerData();
  }, []);

  const loadInfluencerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: influencer } = await supabase
        .from("influencers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (influencer) {
        setInfluencerData(influencer);
      }
    } catch (error) {
      console.error("Error loading influencer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Campanhas Ativas",
      value: "5",
      change: "+2",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Ganhos Totais",
      value: "R$ 45.2K",
      change: "+12%",
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Alcance Total",
      value: "2.5M",
      change: "+18%",
      icon: Eye,
      color: "text-artist",
      bgColor: "bg-artist/10"
    },
    {
      title: "Avaliação",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-mystic-gold",
      bgColor: "bg-mystic-gold/10"
    }
  ];

  const activeCampaigns = [
    {
      id: 1,
      brand: "TechBrand",
      title: "Lançamento Produto X",
      budget: 5000,
      status: "active",
      deadline: "2024-02-15",
      posts: 3,
      completedPosts: 2
    },
    {
      id: 2,
      brand: "FashionCo",
      title: "Campanha Verão",
      budget: 8000,
      status: "active",
      deadline: "2024-03-01",
      posts: 5,
      completedPosts: 1
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

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Painel do Influenciador</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
            Olá, {influencerData?.stage_name || "Influenciador"}!
          </h1>
          <p className="text-muted-foreground mt-2">Acompanhe suas métricas e campanhas</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Zap className="w-4 h-4 mr-2" />
          Atualizar Métricas
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden group hover:shadow-xl transition-all">
              <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    {stat.title}
                  </span>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <p className="text-sm flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
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
                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
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

      {/* Active Campaigns */}
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
            <Button variant="outline" onClick={() => navigate("/app/campanhas")}>
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeCampaigns.map((campaign) => {
            const progress = (campaign.completedPosts / campaign.posts) * 100;
            return (
              <div key={campaign.id} className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Ativa
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-semibold">R$ {campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prazo</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(campaign.deadline).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Posts</p>
                    <p className="font-semibold">{campaign.completedPosts}/{campaign.posts}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

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
          onClick={() => navigate("/app/campanhas")}
        >
          <Target className="w-6 h-6 mr-3" />
          Ver Campanhas
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
