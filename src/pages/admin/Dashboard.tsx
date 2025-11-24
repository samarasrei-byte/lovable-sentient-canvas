import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Building2,
  Megaphone,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalInfluencers: 0,
    activeInfluencers: 0,
    pendingInfluencers: 0,
    bannedInfluencers: 0,
    totalBrands: 0,
    verifiedBrands: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRevenue: 0,
    platformFees: 0,
    pendingWithdrawals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    // Get total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Get influencer stats
    const { data: influencers } = await supabase.from("influencers").select("*");
    const totalInfluencers = influencers?.length || 0;
    const activeInfluencers = influencers?.filter((i) => !i.is_banned).length || 0;
    const bannedInfluencers = influencers?.filter((i) => i.is_banned).length || 0;

    const { count: pendingInfluencers } = await supabase
      .from("influencer_approvals")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Get brand stats
    const { count: totalBrands } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "brand");

    const { count: verifiedBrands } = await supabase
      .from("brand_verifications")
      .select("*", { count: "exact", head: true })
      .eq("status", "verified");

    // Get campaign stats
    const { data: contracts } = await supabase.from("contracts").select("*");
    const totalCampaigns = contracts?.length || 0;
    const activeCampaigns = contracts?.filter((c) => c.status === "active").length || 0;

    // Get financial stats
    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "completed");
    
    const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;

    const { data: fees } = await supabase.from("platform_fees").select("total_fees");
    const platformFees = fees?.reduce((sum, f) => sum + parseFloat(f.total_fees.toString()), 0) || 0;

    const { count: pendingWithdrawals } = await supabase
      .from("withdrawals")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    setStats({
      totalUsers: totalUsers || 0,
      totalInfluencers,
      activeInfluencers,
      pendingInfluencers: pendingInfluencers || 0,
      bannedInfluencers,
      totalBrands: totalBrands || 0,
      verifiedBrands: verifiedBrands || 0,
      totalCampaigns,
      activeCampaigns,
      totalRevenue,
      platformFees,
      pendingWithdrawals: pendingWithdrawals || 0,
    });

    setLoading(false);
  };

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Influenciadores Ativos",
      value: stats.activeInfluencers,
      subtitle: `${stats.totalInfluencers} total`,
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pendentes Aprovação",
      value: stats.pendingInfluencers,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Influenciadores Banidos",
      value: stats.bannedInfluencers,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Total de Marcas",
      value: stats.totalBrands,
      subtitle: `${stats.verifiedBrands} verificadas`,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Campanhas Ativas",
      value: stats.activeCampaigns,
      subtitle: `${stats.totalCampaigns} total`,
      icon: Megaphone,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Faturamento Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Taxas Arcana",
      value: `R$ ${stats.platformFees.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Saques Pendentes",
      value: stats.pendingWithdrawals,
      icon: AlertCircle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  if (loading) {
    return <div className="text-center">Carregando métricas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Dashboard Arcana Oracle
        </h1>
        <p className="text-muted-foreground">Visão geral da plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                )}
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.pendingInfluencers > 0 && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-semibold text-accent">Aprovações Pendentes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.pendingInfluencers} influenciadores aguardando aprovação
              </p>
            </div>
          )}
          
          {stats.pendingWithdrawals > 0 && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">Saques Pendentes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.pendingWithdrawals} solicitações de saque
              </p>
            </div>
          )}
          
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">Campanhas Ativas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.activeCampaigns} campanhas em andamento
            </p>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">ROI Médio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              +240% de retorno médio
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
