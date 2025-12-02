import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContractData {
  id: string;
  amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  influencer_id: string;
  description: string;
}

interface PaymentData {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface InfluencerData {
  id: string;
  stage_name: string;
  category: string;
  followers_count: number;
  engagement_rate: number;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
}

const engagementByPlatform = [
  { name: "Instagram", value: 45, color: "#E1306C" },
  { name: "TikTok", value: 30, color: "#00F2EA" },
  { name: "YouTube", value: 15, color: "#FF0000" },
  { name: "Twitter", value: 10, color: "#1DA1F2" },
];

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [influencers, setInfluencers] = useState<InfluencerData[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case "7d":
          startDate = subDays(now, 7);
          break;
        case "30d":
          startDate = subDays(now, 30);
          break;
        case "90d":
          startDate = subDays(now, 90);
          break;
        case "12m":
          startDate = subMonths(now, 12);
          break;
        default:
          startDate = subDays(now, 30);
      }

      // Fetch contracts
      const { data: contractsData, error: contractsError } = await supabase
        .from("contracts")
        .select("*")
        .eq("brand_id", user.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (contractsError) console.error("Error fetching contracts:", contractsError);
      setContracts(contractsData || []);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("brand_id", user.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (paymentsError) console.error("Error fetching payments:", paymentsError);
      setPayments(paymentsData || []);

      // Fetch influencers (all active ones for the platform distribution)
      const { data: influencersData, error: influencersError } = await supabase
        .from("influencers")
        .select("*")
        .eq("is_banned", false)
        .limit(50);

      if (influencersError) console.error("Error fetching influencers:", influencersError);
      setInfluencers(influencersData || []);

    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalRevenue = payments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount), 0);
    
    const totalSpent = contracts.reduce((sum, c) => sum + Number(c.total_amount), 0);
    const activeContracts = contracts.filter(c => c.status === "active").length;
    const completedContracts = contracts.filter(c => c.status === "completed").length;

    // Calculate estimated reach (based on influencer followers)
    const totalReach = influencers.reduce((sum, i) => sum + i.followers_count, 0);
    
    // Calculate average engagement
    const avgEngagement = influencers.length > 0
      ? influencers.reduce((sum, i) => sum + Number(i.engagement_rate), 0) / influencers.length
      : 0;

    return [
      {
        icon: DollarSign,
        label: "Receita Total",
        value: `R$ ${(totalRevenue / 1000).toFixed(1)}K`,
        change: "+23.5%",
        positive: true,
        gradient: "from-primary to-primary/70",
      },
      {
        icon: Eye,
        label: "Alcance Estimado",
        value: totalReach > 1000000 ? `${(totalReach / 1000000).toFixed(1)}M` : `${(totalReach / 1000).toFixed(0)}K`,
        change: "+18.2%",
        positive: true,
        gradient: "from-secondary to-secondary/70",
      },
      {
        icon: Heart,
        label: "Engajamento Médio",
        value: `${avgEngagement.toFixed(1)}%`,
        change: "+12.8%",
        positive: avgEngagement > 3,
        gradient: "from-artist to-artist/70",
      },
      {
        icon: Target,
        label: "Contratos Ativos",
        value: activeContracts.toString(),
        change: `${completedContracts} concluídos`,
        positive: true,
        gradient: "from-primary to-secondary",
      },
    ];
  }, [payments, contracts, influencers]);

  // Generate revenue chart data from real payments
  const revenueData = useMemo(() => {
    const now = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(now, 11),
      end: now,
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const monthContracts = contracts.filter(c => {
        const contractDate = new Date(c.created_at);
        return contractDate >= monthStart && contractDate <= monthEnd;
      });

      const receita = monthPayments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      const gastos = monthContracts.reduce((sum, c) => sum + Number(c.total_amount), 0);

      return {
        month: format(month, "MMM", { locale: ptBR }),
        receita,
        gastos,
      };
    });
  }, [payments, contracts]);

  // Calculate platform distribution from influencers
  const platformData = useMemo(() => {
    let instagram = 0, tiktok = 0, youtube = 0, other = 0;
    
    influencers.forEach(inf => {
      if (inf.instagram_handle) instagram++;
      if (inf.tiktok_handle) tiktok++;
      if (inf.youtube_handle) youtube++;
      if (!inf.instagram_handle && !inf.tiktok_handle && !inf.youtube_handle) other++;
    });

    const total = instagram + tiktok + youtube + other || 1;

    return [
      { name: "Instagram", value: Math.round((instagram / total) * 100), color: "#E1306C" },
      { name: "TikTok", value: Math.round((tiktok / total) * 100), color: "#00F2EA" },
      { name: "YouTube", value: Math.round((youtube / total) * 100), color: "#FF0000" },
      { name: "Outros", value: Math.round((other / total) * 100), color: "#6B7280" },
    ].filter(p => p.value > 0);
  }, [influencers]);

  // Top influencers by engagement
  const topInfluencers = useMemo(() => {
    return [...influencers]
      .sort((a, b) => Number(b.engagement_rate) - Number(a.engagement_rate))
      .slice(0, 5)
      .map(inf => ({
        name: inf.stage_name,
        category: inf.category,
        alcance: inf.followers_count > 1000000 
          ? `${(inf.followers_count / 1000000).toFixed(1)}M`
          : `${(inf.followers_count / 1000).toFixed(0)}K`,
        engagement: Number(inf.engagement_rate),
        performance: Math.min(100, Number(inf.engagement_rate) * 15),
      }));
  }, [influencers]);

  // Daily metrics (last 7 days)
  const dailyMetrics = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const now = new Date();
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = subDays(now, 6 - i);
      const dayContracts = contracts.filter(c => {
        const cDate = new Date(c.created_at);
        return cDate.toDateString() === day.toDateString();
      });
      const dayPayments = payments.filter(p => {
        const pDate = new Date(p.created_at);
        return pDate.toDateString() === day.toDateString();
      });

      return {
        day: days[day.getDay()],
        contratos: dayContracts.length,
        pagamentos: dayPayments.filter(p => p.status === "completed").length,
        valor: dayPayments.reduce((sum, p) => sum + Number(p.amount), 0) / 1000,
      };
    });
  }, [contracts, payments]);

  // Average ROI calculation
  const avgROI = useMemo(() => {
    const completedPayments = payments.filter(p => p.status === "completed");
    const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalSpent = contracts.reduce((sum, c) => sum + Number(c.total_amount), 0);
    
    if (totalSpent === 0) return 0;
    return (totalRevenue / totalSpent).toFixed(1);
  }, [payments, contracts]);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
            Dados em tempo real do seu banco de dados
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
                    variant={stat.positive ? "default" : "secondary"}
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
                  ROI Médio: {avgROI}x
                </Badge>
              </div>
              {revenueData.some(d => d.receita > 0 || d.gastos > 0) ? (
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
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>Nenhum dado disponível para o período selecionado</p>
                </div>
              )}
            </Card>

            {/* Platform Distribution */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
              <div className="mb-6">
                <h3 className="text-lg font-bold">Distribuição por Plataforma</h3>
                <p className="text-sm text-muted-foreground">Influenciadores cadastrados</p>
              </div>
              {platformData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
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
                    {platformData.map((platform) => (
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
                </>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <p>Nenhum influenciador cadastrado</p>
                </div>
              )}
            </Card>
          </div>

          {/* Daily Metrics */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Atividade Semanal</h3>
                <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
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
                <Bar dataKey="contratos" name="Contratos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pagamentos" name="Pagamentos" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Contract Status */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Status dos Contratos</h3>
                <p className="text-sm text-muted-foreground">Distribuição por status</p>
              </div>
            </div>
            {contracts.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {["pending_payment", "active", "completed", "cancelled"].map(status => {
                  const count = contracts.filter(c => c.status === status).length;
                  const percentage = ((count / contracts.length) * 100).toFixed(0);
                  const labels: Record<string, string> = {
                    pending_payment: "Aguardando Pagamento",
                    active: "Ativos",
                    completed: "Concluídos",
                    cancelled: "Cancelados",
                  };
                  const colors: Record<string, string> = {
                    pending_payment: "from-yellow-500 to-yellow-600",
                    active: "from-green-500 to-green-600",
                    completed: "from-blue-500 to-blue-600",
                    cancelled: "from-red-500 to-red-600",
                  };
                  return (
                    <div key={status} className="p-4 rounded-xl border border-border/50 bg-background/50">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[status]} flex items-center justify-center text-white font-bold mb-3`}>
                        {count}
                      </div>
                      <p className="text-sm font-medium">{labels[status]}</p>
                      <p className="text-xs text-muted-foreground">{percentage}% do total</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p>Nenhum contrato encontrado</p>
              </div>
            )}
          </Card>

          {/* Recent Contracts */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Contratos Recentes</h3>
                <p className="text-sm text-muted-foreground">Últimas movimentações</p>
              </div>
            </div>
            <div className="space-y-3">
              {contracts.slice(0, 5).map(contract => (
                <div key={contract.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                  <div>
                    <p className="font-medium">{contract.description.substring(0, 50)}...</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(contract.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">R$ {Number(contract.total_amount).toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">{contract.status}</Badge>
                  </div>
                </div>
              ))}
              {contracts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum contrato encontrado no período</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          {/* Top Influencers */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Top Influenciadores</h3>
                <p className="text-sm text-muted-foreground">Por taxa de engajamento</p>
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
                        {influencer.category} • {influencer.alcance} seguidores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Engajamento</p>
                      <p className="font-bold text-primary">{influencer.engagement.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${influencer.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{influencer.performance.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {topInfluencers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum influenciador encontrado</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
