import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    
    // Simulate analysis
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

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Visão geral das suas campanhas e talentos</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Alcance Total", 
            value: "12.5M", 
            change: "+23%", 
            icon: Eye,
            color: "text-primary"
          },
          { 
            title: "Engajamento", 
            value: "8.2%", 
            change: "+5.3%", 
            icon: Heart,
            color: "text-secondary"
          },
          { 
            title: "Campanhas Ativas", 
            value: "24", 
            change: "+12", 
            icon: Target,
            color: "text-orange-500"
          },
          { 
            title: "ROI Médio", 
            value: "385%", 
            change: "+45%", 
            icon: TrendingUp,
            color: "text-green-500"
          },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {metric.change} vs mês anterior
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Talents Section */}
      {selectedTalents.length > 0 && (
        <div className="space-y-6">
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
                <Card key={talent.id} className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
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
                          <span className="text-sm font-semibold" style={{ color: config.color }}>
                            {talent.followers} seguidores
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="text-center">
                        <Eye className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="text-lg font-bold">
                          {Math.floor(Math.random() * 500 + 100)}K
                        </div>
                        <div className="text-xs text-muted-foreground">Visualizações</div>
                      </div>
                      <div className="text-center">
                        <Heart className="w-5 h-5 mx-auto mb-1 text-secondary" />
                        <div className="text-lg font-bold">
                          {(Math.random() * 10 + 2).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Engajamento</div>
                      </div>
                      <div className="text-center">
                        <MessageCircle className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold">
                          {Math.floor(Math.random() * 50 + 10)}K
                        </div>
                        <div className="text-xs text-muted-foreground">Interações</div>
                      </div>
                    </div>

                    {/* Link Analysis */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Analisar Link do Influenciador</label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Cole a URL do perfil (Instagram, TikTok, etc.)"
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

                    {/* Sites/Links */}
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
        </div>
      )}

      {/* Empty state */}
      {selectedTalents.length === 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="py-16 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum talento selecionado</h3>
            <p className="text-muted-foreground mb-6">
              Adicione influenciadores e avatares ao seu painel para começar
            </p>
            <Button onClick={() => navigate("/")}>
              <Plus className="w-4 h-4 mr-2" />
              Explorar Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Campaigns */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Campanhas Recentes</h2>
        
        <div className="grid gap-4">
          {[
            {
              name: "Lançamento Produto X",
              status: "Ativa",
              engagement: "12.5%",
              reach: "2.3M",
              talents: 3,
              statusColor: "bg-green-500"
            },
            {
              name: "Black Friday 2024",
              status: "Planejamento",
              engagement: "-",
              reach: "-",
              talents: 5,
              statusColor: "bg-yellow-500"
            },
            {
              name: "Verão 2025",
              status: "Em Análise",
              engagement: "8.7%",
              reach: "1.8M",
              talents: 4,
              statusColor: "bg-blue-500"
            },
          ].map((campaign, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${campaign.statusColor}`} />
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Engajamento</div>
                      <div className="text-lg font-bold">{campaign.engagement}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Alcance</div>
                      <div className="text-lg font-bold">{campaign.reach}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Talentos</div>
                      <div className="text-lg font-bold">{campaign.talents}</div>
                    </div>
                    
                    <Button variant="outline">Ver Detalhes</Button>
                  </div>
                </div>
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
