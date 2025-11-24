import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Eye,
  Sparkles,
  Target,
  Award,
  Calendar,
  Download,
  BarChart3
} from "lucide-react";

// Mock data - crescimento de seguidores
const followersGrowthData = [
  { month: "Jan", you: 45000, platform_avg: 38000, projection: 46000 },
  { month: "Fev", you: 48000, platform_avg: 39500, projection: 49500 },
  { month: "Mar", you: 52000, platform_avg: 41000, projection: 54000 },
  { month: "Abr", you: 58000, platform_avg: 42500, projection: 60000 },
  { month: "Mai", you: 65000, platform_avg: 44000, projection: 68000 },
  { month: "Jun", you: 73000, platform_avg: 45500, projection: 77000 },
  { month: "Jul", you: 82000, platform_avg: 47000, projection: 87000 },
  { month: "Ago", you: 92000, platform_avg: 48500, projection: 98000 }
];

// Engagement ao longo do tempo
const engagementData = [
  { week: "S1", likes: 12500, comments: 840, shares: 320, saves: 1200 },
  { week: "S2", likes: 13200, comments: 920, shares: 380, saves: 1350 },
  { week: "S3", likes: 11800, comments: 780, shares: 290, saves: 1100 },
  { week: "S4", likes: 14500, comments: 1050, shares: 450, saves: 1500 },
  { week: "S5", likes: 15800, comments: 1200, shares: 520, saves: 1680 },
  { week: "S6", likes: 16500, comments: 1340, shares: 580, saves: 1820 },
  { week: "S7", likes: 17200, comments: 1450, shares: 620, saves: 1950 },
  { week: "S8", likes: 18500, comments: 1580, shares: 680, saves: 2100 }
];

// Taxa de engajamento comparativa
const engagementRateComparison = [
  { category: "Reels", you: 9.2, platform_avg: 6.8 },
  { category: "Feed", you: 7.5, platform_avg: 5.2 },
  { category: "Stories", you: 5.8, platform_avg: 4.1 },
  { category: "IGTV", you: 4.2, platform_avg: 3.5 }
];

// Performance por tipo de conteúdo
const contentPerformance = [
  { type: "Tutorial", reach: 95000, engagement: 8.9, conversions: 4.2 },
  { type: "Review", reach: 88000, engagement: 7.8, conversions: 5.8 },
  { type: "Behind Scenes", reach: 72000, engagement: 9.5, conversions: 2.1 },
  { type: "Lifestyle", reach: 65000, engagement: 6.8, conversions: 3.2 },
  { type: "Colaboração", reach: 110000, engagement: 8.2, conversions: 6.5 }
];

// Radar de métricas
const radarData = [
  { metric: "Alcance", you: 92, platform: 75 },
  { metric: "Engajamento", you: 88, platform: 68 },
  { metric: "Crescimento", you: 85, platform: 70 },
  { metric: "Conversão", you: 78, platform: 65 },
  { metric: "Consistência", you: 90, platform: 72 },
  { metric: "Qualidade", you: 95, platform: 80 }
];

export default function InfluencerAnalytics() {
  const [period, setPeriod] = useState("30d");

  const stats = [
    {
      label: "Taxa de Crescimento",
      value: "+28.5%",
      change: "+4.2% vs mês anterior",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      trend: "up"
    },
    {
      label: "Engajamento Médio",
      value: "8.9%",
      change: "+1.3% acima da média",
      icon: Heart,
      gradient: "from-primary to-primary/70",
      trend: "up"
    },
    {
      label: "Alcance Semanal",
      value: "324K",
      change: "+15% vs semana anterior",
      icon: Eye,
      gradient: "from-secondary to-secondary/70",
      trend: "up"
    },
    {
      label: "Score de Performance",
      value: "88/100",
      change: "Top 10% da plataforma",
      icon: Award,
      gradient: "from-artist to-artist/70",
      trend: "up"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Analytics Avançado</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
            Meu Desempenho
          </h1>
          <p className="text-muted-foreground">
            Análise detalhada do seu crescimento e engajamento
          </p>
        </div>
        <div className="flex gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="7d">7 dias</TabsTrigger>
              <TabsTrigger value="30d">30 dias</TabsTrigger>
              <TabsTrigger value="90d">90 dias</TabsTrigger>
              <TabsTrigger value="1y">1 ano</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} inline-flex mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Crescimento de Seguidores */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Crescimento de Seguidores
              </h3>
              <p className="text-sm text-muted-foreground">Você vs Média da Plataforma</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">92K</p>
              <p className="text-xs text-muted-foreground">Total de seguidores</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={followersGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="you"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                name="Você"
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="platform_avg"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Média da Plataforma"
              />
              <Line
                type="monotone"
                dataKey="projection"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="Projeção"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engajamento ao Longo do Tempo */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Engajamento por Tipo
              </h3>
              <p className="text-sm text-muted-foreground">Últimas 8 semanas</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">18.5K</p>
              <p className="text-xs text-muted-foreground">Média semanal</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--artist))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--artist))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="hsl(var(--primary))"
                fill="url(#colorLikes)"
                strokeWidth={2}
                name="Curtidas"
              />
              <Area
                type="monotone"
                dataKey="comments"
                stroke="hsl(var(--secondary))"
                fill="url(#colorComments)"
                strokeWidth={2}
                name="Comentários"
              />
              <Area
                type="monotone"
                dataKey="shares"
                stroke="hsl(var(--artist))"
                fill="url(#colorShares)"
                strokeWidth={2}
                name="Compartilhamentos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Comparison Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Taxa de Engajamento Comparativa */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Taxa de Engajamento por Formato
            </h3>
            <p className="text-sm text-muted-foreground">Comparação com média da plataforma</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementRateComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => `${value}%`}
              />
              <Legend />
              <Bar 
                dataKey="you" 
                fill="hsl(var(--primary))" 
                name="Você"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="platform_avg" 
                fill="hsl(var(--muted-foreground))" 
                name="Média da Plataforma"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar de Performance */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Análise de Performance 360°
            </h3>
            <p className="text-sm text-muted-foreground">Suas métricas vs plataforma</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="metric" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
              />
              <Radar
                name="Você"
                dataKey="you"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Média da Plataforma"
                dataKey="platform"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance por Tipo de Conteúdo */}
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: "400ms" }}>
        <div className="mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Performance por Tipo de Conteúdo
          </h3>
          <p className="text-sm text-muted-foreground">
            Analise qual tipo de conteúdo performa melhor para você
          </p>
        </div>
        <div className="space-y-4">
          {contentPerformance.map((content, i) => (
            <div
              key={i}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${(i + 5) * 100}ms` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-background/50 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{content.type}</h4>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Alcance</p>
                      <p className="font-bold">{(content.reach / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Engajamento</p>
                      <p className="font-bold text-primary">{content.engagement}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Conversão</p>
                      <p className="font-bold text-green-500">{content.conversions}%</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${(content.reach / 110000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${(content.engagement / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(content.conversions / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights e Recomendações */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 border-border/50 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Crescimento Acelerado</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Seu crescimento está 28% acima da média da plataforma. Continue focando em conteúdo de colaboração!
              </p>
              <Button size="sm" variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Engajamento Elevado</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Seus Reels têm 35% mais engajamento que a média. Publique mais 2x por semana!
              </p>
              <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10">
                Ver Recomendações
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-gradient-to-br from-artist/10 to-artist/5 border-artist/20 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-artist/20">
              <Target className="w-5 h-5 text-artist" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Oportunidade de Melhoria</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Stories têm potencial inexplorado. Aumente frequência para 5-7 por dia.
              </p>
              <Button size="sm" variant="outline" className="border-artist/30 hover:bg-artist/10">
                Estratégias
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
