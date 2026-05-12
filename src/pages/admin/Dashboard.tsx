import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  ShoppingBag,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalUsers: number;
  totalInfluencers: number;
  activeInfluencers: number;
  pendingInfluencers: number;
  bannedInfluencers: number;
  totalBrands: number;
  verifiedBrands: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalRevenue: number;
  platformFees: number;
  pendingWithdrawals: number;
  totalPrompts: number;
  totalPurchases: number;
}

interface TopPrompt {
  id: string;
  name: string;
  category: string;
  count: number;
}

interface PlatformAlert {
  type: 'security' | 'financial' | 'system';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalInfluencers: 0, activeInfluencers: 0,
    pendingInfluencers: 0, bannedInfluencers: 0, totalBrands: 0,
    verifiedBrands: 0, totalCampaigns: 0, activeCampaigns: 0,
    totalRevenue: 0, platformFees: 0, pendingWithdrawals: 0,
    totalPrompts: 0, totalPurchases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [topPrompts, setTopPrompts] = useState<TopPrompt[]>([]);
  const [alerts, setAlerts] = useState<PlatformAlert[]>([]);
  const [blockedStats, setBlockedStats] = useState({ total: 0, critical: 0 });
  const navigate = useNavigate();

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    const [
      { count: totalUsers },
      { data: influencers },
      { count: pendingInfluencers },
      { count: totalBrands },
      { count: verifiedBrands },
      { data: contracts },
      { data: payments },
      { data: fees },
      { count: pendingWithdrawals },
      { count: totalPrompts },
      { count: totalPurchases },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("influencers").select("*"),
      supabase.from("influencer_approvals").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "brand"),
      supabase.from("brand_verifications").select("*", { count: "exact", head: true }).eq("status", "verified"),
      supabase.from("contracts").select("*"),
      supabase.from("payments").select("amount").eq("status", "completed"),
      supabase.from("platform_fees").select("total_fees"),
      supabase.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("prompts").select("*", { count: "exact", head: true }),
      supabase.from("prompt_purchases").select("*", { count: "exact", head: true }),
    ]);

    const totalInfluencers = influencers?.length || 0;

    setStats({
      totalUsers: totalUsers || 0,
      totalInfluencers,
      activeInfluencers: influencers?.filter((i) => !i.is_banned).length || 0,
      pendingInfluencers: pendingInfluencers || 0,
      bannedInfluencers: influencers?.filter((i) => i.is_banned).length || 0,
      totalBrands: totalBrands || 0,
      verifiedBrands: verifiedBrands || 0,
      totalCampaigns: contracts?.length || 0,
      activeCampaigns: contracts?.filter((c) => c.status === "active").length || 0,
      totalRevenue: payments?.reduce((s, p) => s + parseFloat(p.amount.toString()), 0) || 0,
      platformFees: fees?.reduce((s, f) => s + parseFloat(f.total_fees.toString()), 0) || 0,
      pendingWithdrawals: pendingWithdrawals || 0,
      totalPrompts: totalPrompts || 0,
      totalPurchases: totalPurchases || 0,
    });

    // Load top prompts ranking
    const { data: purchases } = await supabase
      .from("prompt_purchases")
      .select("prompt_id");
    
    if (purchases && purchases.length > 0) {
      const countMap: Record<string, number> = {};
      purchases.forEach((p) => { countMap[p.prompt_id] = (countMap[p.prompt_id] || 0) + 1; });
      
      const topIds = Object.entries(countMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);
      
      const { data: promptsData } = await supabase
        .from("prompts")
        .select("id, name, category")
        .in("id", topIds.map(([id]) => id));
      
      if (promptsData) {
        const ranked = topIds.map(([id, count]) => {
          const p = promptsData.find((pr) => pr.id === id);
          return { id, name: p?.name || "—", category: p?.category || "—", count };
        });
        setTopPrompts(ranked);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="h-5 w-5 animate-pulse" />
          <span className="text-sm">Carregando métricas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl pb-10">
      {/* Platform Health & Audit Alerts */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {alerts.map((alert, idx) => (
            <Card key={idx} className={`p-4 border-l-4 ${
              alert.severity === 'critical' ? 'border-l-destructive bg-destructive/5' : 
              alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50/30' : 
              'border-l-blue-500 bg-blue-50/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' : 
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">{alert.message}</h3>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'} className="text-[10px] uppercase">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.details}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/logs")} className="text-xs">
                  Ver Auditoria
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* KPI Cards - Primary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Usuários"
          value={stats.totalUsers}
          icon={Users}
          trend="+12%"
          trendUp
        />
        <KPICard
          label="Prompts Ativos"
          value={stats.totalPrompts}
          icon={Sparkles}
          trend="+8%"
          trendUp
        />
        <KPICard
          label="Vendas"
          value={stats.totalPurchases}
          icon={ShoppingBag}
          trend="+24%"
          trendUp
        />
        <KPICard
          label="Faturamento"
          value={`R$ ${stats.totalRevenue.toFixed(0)}`}
          icon={DollarSign}
          trend="+18%"
          trendUp
          highlight
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MiniStat label="Influenciadores" value={stats.activeInfluencers} sub={`${stats.totalInfluencers} total`} />
        <MiniStat label="Marcas" value={stats.totalBrands} sub={`${stats.verifiedBrands} verificadas`} />
        <MiniStat label="Campanhas Ativas" value={stats.activeCampaigns} sub={`${stats.totalCampaigns} total`} />
        <MiniStat label="Taxas Arcana" value={`R$ ${stats.platformFees.toFixed(0)}`} />
        <MiniStat label="Banidos" value={stats.bannedInfluencers} alert={stats.bannedInfluencers > 0} />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.pendingInfluencers > 0 && (
          <ActionCard
            icon={Clock}
            title="Aprovações Pendentes"
            description={`${stats.pendingInfluencers} influenciadores aguardando`}
            color="warning"
            onClick={() => navigate("/admin/users")}
          />
        )}
        {stats.pendingWithdrawals > 0 && (
          <ActionCard
            icon={CreditCard}
            title="Saques Pendentes"
            description={`${stats.pendingWithdrawals} solicitações de saque`}
            color="info"
            onClick={() => navigate("/admin/financial-dashboard")}
          />
        )}
        <ActionCard
          icon={Sparkles}
          title="Gerenciar Prompts"
          description={`${stats.totalPrompts} prompts no marketplace`}
          color="primary"
          onClick={() => navigate("/admin/prompts")}
        />
        <ActionCard
          icon={TrendingUp}
          title="Ver Financeiro"
          description="Dashboard financeiro completo"
          color="success"
          onClick={() => navigate("/admin/financial-dashboard")}
        />
        <ActionCard
          icon={Users}
          title="Gerenciar Usuários"
          description={`${stats.totalUsers} usuários registrados`}
          color="default"
          onClick={() => navigate("/admin/users")}
        />
      </div>

      {/* Top Prompts Ranking */}
      {topPrompts.length > 0 && (
        <Card className="p-5 border-border/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Ranking de Prompts — Top {topPrompts.length}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Prompts com mais gerações (todas as categorias)</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/prompts")} className="text-xs">
              Ver todos
            </Button>
          </div>
          <div className="space-y-2">
            {topPrompts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors">
                <span className={`text-xs font-black w-6 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                  {i + 1}º
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.category}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold shrink-0">
                  {p.count} {p.count === 1 ? 'venda' : 'vendas'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// --- Sub-components ---

function KPICard({ label, value, icon: Icon, trend, trendUp, highlight }: {
  label: string; value: string | number; icon: any; trend: string; trendUp: boolean; highlight?: boolean;
}) {
  return (
    <Card className={`p-4 ${highlight ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20' : 'border-border/40'} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-primary/10' : 'bg-muted/60'}`}>
          <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${trendUp ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'}`}>
          {trendUp ? <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
          {trend}
        </Badge>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Card>
  );
}

function MiniStat({ label, value, sub, alert }: {
  label: string; value: string | number; sub?: string; alert?: boolean;
}) {
  return (
    <Card className={`p-3 border-border/40 ${alert ? 'border-destructive/30 bg-destructive/5' : ''}`}>
      <p className={`text-lg font-semibold ${alert ? 'text-destructive' : 'text-foreground'}`}>{value}</p>
      <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
    </Card>
  );
}

function ActionCard({ icon: Icon, title, description, color, onClick }: {
  icon: any; title: string; description: string; color: string; onClick: () => void;
}) {
  const colorMap: Record<string, string> = {
    warning: 'bg-amber-50 border-amber-200/60 hover:border-amber-300',
    info: 'bg-blue-50 border-blue-200/60 hover:border-blue-300',
    primary: 'bg-primary/5 border-primary/15 hover:border-primary/30',
    success: 'bg-green-50 border-green-200/60 hover:border-green-300',
    default: 'bg-muted/30 border-border/40 hover:border-border',
  };
  const iconColorMap: Record<string, string> = {
    warning: 'text-amber-600',
    info: 'text-blue-600',
    primary: 'text-primary',
    success: 'text-green-600',
    default: 'text-muted-foreground',
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 ${colorMap[color] || colorMap.default}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColorMap[color] || iconColorMap.default}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 ml-auto" />
      </div>
    </Card>
  );
}

export default AdminDashboard;
