import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Calendar,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  platformFees: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  avgTicket: number;
  mrr: number;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--muted))"];

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, fees: 6750 },
  { month: "Fev", revenue: 52000, fees: 7800 },
  { month: "Mar", revenue: 48000, fees: 7200 },
  { month: "Abr", revenue: 61000, fees: 9150 },
  { month: "Mai", revenue: 55000, fees: 8250 },
  { month: "Jun", revenue: 67000, fees: 10050 },
  { month: "Jul", revenue: 72000, fees: 10800 },
  { month: "Ago", revenue: 80000, fees: 12000 },
];

const planDistribution = [
  { name: "Starter", value: 45, color: "hsl(var(--muted-foreground))" },
  { name: "Creator", value: 30, color: "hsl(var(--primary))" },
  { name: "Professional", value: 18, color: "hsl(var(--accent))" },
  { name: "Business", value: 5, color: "hsl(var(--success))" },
  { name: "Enterprise", value: 2, color: "hsl(220 90% 56%)" },
];

const FinancialDashboard = () => {
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    platformFees: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    avgTicket: 0,
    mrr: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    // Get payments
    const { data: payments } = await supabase.from("payments").select("*");
    const completedPayments = payments?.filter((p) => p.status === "completed") || [];
    const pendingPayments = payments?.filter((p) => p.status === "pending") || [];

    // Get platform fees
    const { data: fees } = await supabase.from("platform_fees").select("*");

    // Get withdrawals
    const { data: withdrawals } = await supabase.from("withdrawals").select("*");
    const pendingWithdrawals = withdrawals?.filter((w) => w.status === "pending") || [];

    // Get subscriptions for MRR
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active");

    // Get mock payments for simulated data
    const { data: mockPayments } = await supabase.from("mock_payments").select("*");

    const totalRevenue = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
    const platformFees = fees?.reduce((sum, f) => sum + parseFloat(f.total_fees.toString()), 0) || 0;
    const totalWithdrawalsAmount = withdrawals?.reduce((sum, w) => sum + parseFloat(w.amount.toString()), 0) || 0;

    // Simulated MRR based on subscriptions
    const mrr = (subscriptions?.length || 0) * 150; // Average plan price

    setStats({
      totalRevenue: totalRevenue + (mockPayments?.reduce((sum, p) => sum + p.amount_cents / 100, 0) || 0),
      monthlyRevenue: totalRevenue * 0.15, // Simulated monthly
      platformFees,
      totalPayments: payments?.length || 0,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      totalWithdrawals: totalWithdrawalsAmount,
      pendingWithdrawals: pendingWithdrawals.length,
      avgTicket: completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0,
      mrr,
    });

    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground">Métricas financeiras e relatórios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Faturamento Total</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-2 text-success text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>+23% vs mês anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success/10">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">MRR (Receita Recorrente)</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.mrr)}</p>
              <div className="flex items-center gap-1 mt-2 text-success text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>+15% vs mês anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxas Arcana</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.platformFees)}</p>
              <p className="text-sm text-muted-foreground mt-2">15% das transações</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <CreditCard className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.avgTicket)}</p>
              <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                <ArrowDownRight className="h-4 w-4" />
                <span>-5% vs mês anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Evolução da Receita</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `R$ ${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorRevenue)"
                  name="Receita"
                />
                <Area
                  type="monotone"
                  dataKey="fees"
                  stroke="hsl(var(--accent))"
                  fill="url(#colorFees)"
                  name="Taxas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Distribuição de Planos</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm">{plan.name}</span>
                </div>
                <span className="text-sm font-semibold">{plan.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transactions & Withdrawals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Pagamentos</h3>
            <Badge variant="outline">{stats.totalPayments} total</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold">Pagamentos Completos</p>
                  <p className="text-sm text-muted-foreground">Transações finalizadas</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-success">{stats.completedPayments}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Pagamentos Pendentes</p>
                  <p className="text-sm text-muted-foreground">Aguardando processamento</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-accent">{stats.pendingPayments}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Saques</h3>
            <Badge variant="outline">{stats.pendingWithdrawals} pendentes</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Total em Saques</p>
                  <p className="text-sm text-muted-foreground">Valor total sacado</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">{formatCurrency(stats.totalWithdrawals)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Saques Pendentes</p>
                  <p className="text-sm text-muted-foreground">Aguardando aprovação</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-accent">{stats.pendingWithdrawals}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* KPIs */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Indicadores de Performance (Simulado)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-primary">R$ 45</p>
            <p className="text-sm text-muted-foreground">CAC (Custo de Aquisição)</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-success">R$ 580</p>
            <p className="text-sm text-muted-foreground">LTV (Lifetime Value)</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-accent">12.9x</p>
            <p className="text-sm text-muted-foreground">LTV/CAC Ratio</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-primary">3.2%</p>
            <p className="text-sm text-muted-foreground">Churn Mensal</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
