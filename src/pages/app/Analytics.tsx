import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  Heart,
  BarChart3,
  Download,
  Calendar,
  Target,
  Zap,
  Award,
} from "lucide-react";

// Mock data for charts
const revenueData = [
  { month: "Jan", receita: 45000, gastos: 32000 },
  { month: "Fev", receita: 52000, gastos: 28000 },
  { month: "Mar", receita: 48000, gastos: 35000 },
  { month: "Abr", receita: 61000, gastos: 30000 },
  { month: "Mai", receita: 55000, gastos: 34000 },
  { month: "Jun", receita: 67000, gastos: 38000 },
  { month: "Jul", receita: 72000, gastos: 42000 },
  { month: "Ago", receita: 69000, gastos: 45000 },
  { month: "Set", receita: 78000, gastos: 48000 },
  { month: "Out", receita: 85000, gastos: 52000 },
  { month: "Nov", receita: 92000, gastos: 55000 },
  { month: "Dez", receita: 98000, gastos: 58000 },
];

const campaignPerformance = [
  { name: "Lançamento X", alcance: 2500000, engajamento: 125000, conversoes: 3200, roi: 3.2 },
  { name: "Verão 2024", alcance: 1800000, engajamento: 95000, conversoes: 2100, roi: 2.8 },
  { name: "Black Friday", alcance: 3800000, engajamento: 280000, conversoes: 5400, roi: 4.5 },
  { name: "Natal 2023", alcance: 2200000, engajamento: 150000, conversoes: 2800, roi: 3.1 },
  { name: "Ano Novo", alcance: 1500000, engajamento: 85000, conversoes: 1600, roi: 2.5 },
];

const engagementByPlatform = [
  { name: "Instagram", value: 45, color: "#E1306C" },
  { name: "TikTok", value: 30, color: "#00F2EA" },
  { name: "YouTube", value: 15, color: "#FF0000" },
  { name: "Twitter", value: 10, color: "#1DA1F2" },
];

const dailyMetrics = [
  { day: "Seg", impressoes: 45000, cliques: 2250, conversoes: 180 },
  { day: "Ter", impressoes: 52000, cliques: 2600, conversoes: 210 },
  { day: "Qua", impressoes: 48000, cliques: 2400, conversoes: 195 },
  { day: "Qui", impressoes: 61000, cliques: 3050, conversoes: 245 },
  { day: "Sex", impressoes: 55000, cliques: 2750, conversoes: 220 },
  { day: "Sáb", impressoes: 38000, cliques: 1900, conversoes: 150 },
  { day: "Dom", impressoes: 35000, cliques: 1750, conversoes: 140 },
];

const topInfluencers = [
  { name: "Maria Silva", campanhas: 8, alcance: "2.5M", roi: 4.2, performance: 95 },
  { name: "João Santos", campanhas: 6, alcance: "1.8M", roi: 3.8, performance: 88 },
  { name: "Ana Costa", campanhas: 5, alcance: "1.2M", roi: 3.5, performance: 82 },
  { name: "Pedro Lima", campanhas: 4, alcance: "980K", roi: 3.2, performance: 78 },
  { name: "Carla Dias", campanhas: 3, alcance: "750K", roi: 2.9, performance: 72 },
];

export default function Analytics() {
  const [period, setPeriod] = useState("30d");

  const stats = [
    {
      icon: DollarSign,
      label: "Receita Total",
      value: "R$ 822K",
      change: "+23.5%",
      positive: true,
      gradient: "from-primary to-primary/70",
    },
    {
      icon: Eye,
      label: "Alcance Total",
      value: "18.2M",
      change: "+18.2%",
      positive: true,
      gradient: "from-secondary to-secondary/70",
    },
    {
      icon: Heart,
      label: "Engajamento",
      value: "1.2M",
      change: "+12.8%",
      positive: true,
      gradient: "from-artist to-artist/70",
    },
    {
      icon: Target,
      label: "Conversões",
      value: "15.5K",
      change: "+8.4%",
      positive: true,
      gradient: "from-primary to-secondary",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Analytics Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
            Performance das Campanhas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe métricas em tempo real e otimize suas estratégias
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="12m">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
              />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge
                    variant={stat.positive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {stat.positive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card/50 border border-border/50">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="influencers">Influenciadores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Chart */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 border-border/50 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Receita vs Gastos</h3>
                  <p className="text-sm text-muted-foreground">Últimos 12 meses</p>
                </div>
                <Badge variant="outline" className="text-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  ROI Médio: 3.2x
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    name="Receita"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorReceita)"
                  />
                  <Area
                    type="monotone"
                    dataKey="gastos"
                    name="Gastos"
                    stroke="hsl(var(--secondary))"
                    fillOpacity={1}
                    fill="url(#colorGastos)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Platform Distribution */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
              <div className="mb-6">
                <h3 className="text-lg font-bold">Engajamento por Plataforma</h3>
                <p className="text-sm text-muted-foreground">Distribuição atual</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={engagementByPlatform}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementByPlatform.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {engagementByPlatform.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span>{platform.name}</span>
                    </div>
                    <span className="font-semibold">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Daily Metrics */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Métricas Diárias</h3>
                <p className="text-sm text-muted-foreground">Última semana</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="impressoes" name="Impressões" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cliques" name="Cliques" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversoes" name="Conversões" fill="hsl(var(--artist))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Performance */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Performance por Campanha</h3>
                <p className="text-sm text-muted-foreground">Comparativo de resultados</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={campaignPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="engajamento" name="Engajamento" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="conversoes" name="Conversões" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* ROI Chart */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">ROI por Campanha</h3>
                <p className="text-sm text-muted-foreground">Retorno sobre investimento</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="roi"
                  name="ROI"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          {/* Top Influencers */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Top Influenciadores</h3>
                <p className="text-sm text-muted-foreground">Melhores performances</p>
              </div>
              <Badge variant="outline">
                <Award className="w-3 h-3 mr-1" />
                Top 5
              </Badge>
            </div>
            <div className="space-y-4">
              {topInfluencers.map((influencer, i) => (
                <div
                  key={influencer.name}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{influencer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {influencer.campanhas} campanhas • {influencer.alcance} alcance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="font-bold text-primary">{influencer.roi}x</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${influencer.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{influencer.performance}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
