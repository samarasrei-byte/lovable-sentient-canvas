import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  BarChart3,
  Target,
  Sparkles,
  Video,
  DollarSign,
  ArrowUpRight,
  Bot,
  Palette,
  ExternalLink,
  Search,
  Plus,
  Calendar,
  Clock,
  Zap,
  ArrowDownRight,
  Activity,
  TrendingDown,
  Globe,
  Share2,
  MousePointerClick,
  Repeat,
  ShoppingCart,
  Star,
  Instagram,
  Youtube,
  Twitter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import real influencer images
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";

interface Talent {
  id: number;
  name: string;
  segment: string;
  followers: string;
  image: string;
  specialty: string;
  type: "avatar" | "influencer" | "artist";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedTalents, setSelectedTalents] = useState<Talent[]>([]);
  const [analyzingLink, setAnalyzingLink] = useState<number | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const saved = localStorage.getItem("selectedTalentsData");
    if (saved) {
      try {
        const talents = JSON.parse(saved);
        setSelectedTalents(talents);
      } catch (e) {
        console.error("Failed to load talents", e);
      }
    }
  }, []);

  const analyzeLink = (talentId: number) => {
    if (!linkUrl.trim()) {
      toast.error("Insira uma URL válida");
      return;
    }
    
    setAnalyzingLink(talentId);
    
    setTimeout(() => {
      setAnalyzingLink(null);
      toast.success("Análise concluída! Métricas atualizadas.");
      setLinkUrl("");
    }, 2000);
  };

  const typeConfig = {
    avatar: {
      label: "Avatar IA",
      icon: Bot,
      color: "hsl(var(--primary))",
      bgColor: "bg-primary/10",
    },
    influencer: {
      label: "Influenciador",
      icon: Users,
      color: "hsl(var(--secondary))",
      bgColor: "bg-secondary/10",
    },
    artist: {
      label: "Artista",
      icon: Palette,
      color: "hsl(30, 100%, 60%)",
      bgColor: "bg-orange-500/10",
    }
  };

  const advancedMetrics = [
    { label: "Taxa de Conversão", value: "4.8%", change: "+1.2%", trend: "up", icon: Target },
    { label: "Custo por Aquisição", value: "R$ 12,50", change: "-R$ 2,30", trend: "down", icon: DollarSign },
    { label: "Valor Médio Pedido", value: "R$ 285", change: "+R$ 45", trend: "up", icon: ShoppingCart },
    { label: "Taxa de Retenção", value: "67%", change: "+8%", trend: "up", icon: Repeat },
    { label: "Tempo Médio Sessão", value: "4m 32s", change: "+45s", trend: "up", icon: Clock },
    { label: "Taxa de Cliques", value: "12.3%", change: "+2.1%", trend: "up", icon: MousePointerClick },
  ];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Análise completa e insights em tempo real</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card rounded-lg p-1 border">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="px-4"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Alcance Total", 
            value: "12.5M", 
            change: "+23%", 
            trend: "up",
            icon: Eye,
            color: "text-primary",
            bgColor: "bg-primary/10"
          },
          { 
            title: "Engajamento", 
            value: "8.2%", 
            change: "+5.3%", 
            trend: "up",
            icon: Heart,
            color: "text-secondary",
            bgColor: "bg-secondary/10"
          },
          { 
            title: "Campanhas Ativas", 
            value: "24", 
            change: "+12", 
            trend: "up",
            icon: Target,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
          },
          { 
            title: "ROI Médio", 
            value: "385%", 
            change: "+45%", 
            trend: "up",
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
          },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden group hover:shadow-xl transition-all">
              <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    {metric.title}
                  </span>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendIcon className="w-3 h-3" />
                    {metric.change}
                  </p>
                  <span className="text-xs text-muted-foreground">vs período anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Advanced Metrics Grid */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Métricas Avançadas
          </CardTitle>
          <CardDescription>KPIs detalhados de performance e conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {advancedMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              const isPositive = metric.trend === "up";
              return (
                <div key={idx} className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                  <div className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-green-500'}`}>
                    {metric.change}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="talents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="talents">Meus Talentos</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="talents" className="space-y-6">
          {selectedTalents.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Meus Talentos</h2>
                  <p className="text-muted-foreground">Influenciadores e avatares da sua conta</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Mais
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedTalents.map((talent) => {
                  const config = typeConfig[talent.type];
                  const Icon = config.icon;
                  
                  return (
                    <Card key={talent.id} className="border-border/50 bg-card/50 backdrop-blur overflow-hidden hover:shadow-xl transition-all">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img 
                              src={talent.image} 
                              alt={talent.name}
                              className="w-20 h-20 rounded-xl object-cover"
                            />
                            <Badge 
                              className={`absolute -bottom-2 -right-2 ${config.bgColor} border-0 flex items-center gap-1`}
                              style={{ color: config.color }}
                            >
                              <Icon className="w-3 h-3" />
                              <span className="text-xs">{config.label}</span>
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl">{talent.name}</CardTitle>
                            <CardDescription className="text-sm">{talent.segment}</CardDescription>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm font-semibold flex items-center gap-1" style={{ color: config.color }}>
                                <Users className="w-3 h-3" />
                                {talent.followers}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                                {(Math.random() * 2 + 3).toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Performance Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Performance</span>
                            <span className="font-bold text-green-500">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                          <div className="text-center">
                            <Eye className="w-5 h-5 mx-auto mb-1 text-primary" />
                            <div className="text-lg font-bold">
                              {Math.floor(Math.random() * 500 + 100)}K
                            </div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <Heart className="w-5 h-5 mx-auto mb-1 text-secondary" />
                            <div className="text-lg font-bold">
                              {(Math.random() * 10 + 2).toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Engage</div>
                          </div>
                          <div className="text-center">
                            <Share2 className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                            <div className="text-lg font-bold">
                              {Math.floor(Math.random() * 50 + 10)}K
                            </div>
                            <div className="text-xs text-muted-foreground">Shares</div>
                          </div>
                        </div>

                        {/* Link Analysis */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Analisar Link do Influenciador
                          </label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Cole a URL do perfil"
                              value={analyzingLink === talent.id ? "" : linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                              disabled={analyzingLink === talent.id}
                              className="flex-1"
                            />
                            <Button 
                              onClick={() => analyzeLink(talent.id)}
                              disabled={analyzingLink === talent.id}
                              className="gap-2"
                            >
                              {analyzingLink === talent.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Analisando
                                </>
                              ) : (
                                <>
                                  <Search className="w-4 h-4" />
                                  Analisar
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-3 h-3" />
                            Instagram
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-3 h-3" />
                            TikTok
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-3 h-3" />
                            YouTube
                          </Button>
                        </div>

                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => navigate("/app/talentos")}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Ver Métricas Completas
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="py-16 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum talento selecionado</h3>
                <p className="text-muted-foreground mb-6">
                  Adicione influenciadores e avatares ao seu painel
                </p>
                <Button onClick={() => navigate("/")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Explorar Marketplace
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <h2 className="text-2xl font-bold">Campanhas Ativas</h2>
          
          <div className="grid gap-4">
            {[
              {
                name: "Lançamento Produto X",
                status: "Ativa",
                engagement: "12.5%",
                reach: "2.3M",
                talents: 3,
                budget: "R$ 50.000",
                spent: "R$ 32.500",
                roi: "385%",
                statusColor: "bg-green-500"
              },
              {
                name: "Black Friday 2024",
                status: "Planejamento",
                engagement: "-",
                reach: "-",
                talents: 5,
                budget: "R$ 120.000",
                spent: "R$ 0",
                roi: "-",
                statusColor: "bg-yellow-500"
              },
              {
                name: "Verão 2025",
                status: "Em Análise",
                engagement: "8.7%",
                reach: "1.8M",
                talents: 4,
                budget: "R$ 75.000",
                spent: "R$ 45.000",
                roi: "245%",
                statusColor: "bg-blue-500"
              },
            ].map((campaign, idx) => (
              <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${campaign.statusColor}`} />
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.status}</p>
                        </div>
                      </div>
                      <Button variant="outline">Ver Detalhes</Button>
                    </div>

                    {campaign.spent !== "R$ 0" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Budget: {campaign.budget}</span>
                          <span className="font-bold">{campaign.spent} gasto</span>
                        </div>
                        <Progress value={(parseFloat(campaign.spent.replace(/[^\d]/g, '')) / parseFloat(campaign.budget.replace(/[^\d]/g, ''))) * 100} className="h-2" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-sm text-muted-foreground mb-1">Engajamento</div>
                        <div className="text-lg font-bold">{campaign.engagement}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-sm text-muted-foreground mb-1">Alcance</div>
                        <div className="text-lg font-bold">{campaign.reach}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-sm text-muted-foreground mb-1">Talentos</div>
                        <div className="text-lg font-bold">{campaign.talents}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-sm text-muted-foreground mb-1">Budget</div>
                        <div className="text-lg font-bold">{campaign.budget}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-sm text-muted-foreground mb-1">ROI</div>
                        <div className="text-lg font-bold text-green-500">{campaign.roi}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Analytics em Desenvolvimento</CardTitle>
              <CardDescription>Gráficos avançados e visualizações em breve</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Gráficos de performance, ROI, engajamento e análises comparativas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Insights Powered by IA
              </CardTitle>
              <CardDescription>Recomendações inteligentes para otimizar suas campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Melhor Horário de Postagem",
                  insight: "Seus seguidores estão mais ativos entre 19h-21h nos dias úteis",
                  action: "Agendar posts",
                  icon: Clock,
                  color: "text-blue-500"
                },
                {
                  title: "Conteúdo de Alto Performance",
                  insight: "Reels curtos (15-30s) geram 3x mais engajamento que posts estáticos",
                  action: "Ver exemplos",
                  icon: Video,
                  color: "text-purple-500"
                },
                {
                  title: "Oportunidade de Crescimento",
                  insight: "Público de 25-34 anos representa 45% do seu engajamento mas apenas 28% das campanhas",
                  action: "Criar campanha",
                  icon: TrendingUp,
                  color: "text-green-500"
                },
                {
                  title: "Colaboração Recomendada",
                  insight: "3 influenciadores no nicho fitness com alta afinidade detectada",
                  action: "Ver perfis",
                  icon: Users,
                  color: "text-orange-500"
                }
              ].map((insight, idx) => (
                <Card key={idx} className="border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0`}>
                        <insight.icon className={`w-6 h-6 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{insight.insight}</p>
                        <Button variant="outline" size="sm">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Marketplace Influencers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Talentos do Marketplace</h2>
            <p className="text-muted-foreground">Conecte-se com influenciadores reais verificados</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
            <Users className="w-4 h-4" />
            Ver Todos
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Rafael Costa",
              category: "Tecnologia",
              followers: "2.5M",
              engagement: "8.5%",
              image: influencerTech,
              verified: true,
              niche: "IA & Inovação",
              platforms: ["instagram", "youtube", "twitter"]
            },
            {
              name: "Bruno Almeida",
              category: "Fitness",
              followers: "3.2M",
              engagement: "9.2%",
              image: influencerFitness,
              verified: true,
              niche: "Treino Funcional",
              platforms: ["instagram", "youtube"]
            },
            {
              name: "Camila Rodrigues",
              category: "Moda",
              followers: "4.8M",
              engagement: "11.3%",
              image: influencerFashion,
              verified: true,
              niche: "Streetwear",
              platforms: ["instagram", "twitter"]
            },
            {
              name: "Maria Santos",
              category: "Bem-estar",
              followers: "3.5M",
              engagement: "10.1%",
              image: influencerWellness,
              verified: true,
              niche: "Mindfulness",
              platforms: ["instagram", "youtube"]
            }
          ].map((influencer, i) => (
            <Card key={i} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/50 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={influencer.image} 
                  alt={influencer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-lg">{influencer.name}</h4>
                    {influencer.verified && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/50 text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/80 text-sm">{influencer.niche}</p>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                    <p className="font-bold text-lg">{influencer.followers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Engajamento</p>
                    <p className="font-bold text-lg text-green-500">{influencer.engagement}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {influencer.platforms.map((platform) => (
                    <div key={platform} className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors cursor-pointer">
                      {platform === "instagram" && <Instagram className="w-4 h-4" />}
                      {platform === "youtube" && <Youtube className="w-4 h-4" />}
                      {platform === "twitter" && <Twitter className="w-4 h-4" />}
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="border-border/50 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => navigate("/app/consultoria")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Consultoria IA</h3>
              <p className="text-sm text-muted-foreground">
                Estratégias personalizadas com IA
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-border/50 bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => navigate("/app/liveshop")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Live Shop</h3>
              <p className="text-sm text-muted-foreground">
                Transmissões ao vivo com vendas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-border/50 bg-gradient-to-br from-orange-500/10 to-transparent hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => navigate("/app/talentos")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Descobrir Talentos</h3>
              <p className="text-sm text-muted-foreground">
                Explore influenciadores e avatares
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
