import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  TrendingUp,
  Download,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Wallet,
  Loader2,
  Calendar
} from "lucide-react";

interface Payment {
  id: string;
  contract_id: string;
  brand_name: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export default function InfluencerPagamentos() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_earned: 0,
    pending: 0,
    completed: 0,
    available_balance: 0
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: influencer } = await supabase
        .from("influencers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!influencer) return;

      // Get payments through contracts
      const { data: paymentsData, error } = await supabase
        .from("payments")
        .select(`
          id,
          contract_id,
          amount,
          status,
          paid_at,
          created_at,
          contracts!inner(
            influencer_id,
            profiles!contracts_brand_id_fkey(full_name)
          )
        `)
        .eq("contracts.influencer_id", influencer.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedPayments = paymentsData.map((p: any) => ({
        id: p.id,
        contract_id: p.contract_id,
        brand_name: p.contracts?.profiles?.full_name || "Marca",
        amount: Number(p.amount) * 0.9, // Influencer receives 90% after platform fee
        status: p.status,
        paid_at: p.paid_at,
        created_at: p.created_at
      }));

      setPayments(formattedPayments);

      // Calculate stats
      const completed = formattedPayments.filter((p) => p.status === "completed");
      const pending = formattedPayments.filter((p) => p.status === "pending");
      const total_earned = completed.reduce((sum, p) => sum + p.amount, 0);
      const pending_amount = pending.reduce((sum, p) => sum + p.amount, 0);

      setStats({
        total_earned,
        pending: pending_amount,
        completed: completed.length,
        available_balance: total_earned * 0.8 // Mock available for withdrawal
      });
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar seus pagamentos."
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Recebido",
          variant: "default" as const,
          color: "text-green-500"
        };
      case "pending":
        return {
          label: "Pendente",
          variant: "secondary" as const,
          color: "text-secondary"
        };
      default:
        return {
          label: "Processando",
          variant: "outline" as const,
          color: "text-muted-foreground"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Pagamentos</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Meus Ganhos
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seus pagamentos e saldo disponível
        </p>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Ganho",
            value: `R$ ${(stats.total_earned / 1000).toFixed(1)}K`,
            change: "Todos os tempos",
            icon: DollarSign,
            gradient: "from-green-500 to-green-600",
            trend: "up"
          },
          {
            label: "Saldo Disponível",
            value: `R$ ${(stats.available_balance / 1000).toFixed(1)}K`,
            change: "Pronto para saque",
            icon: Wallet,
            gradient: "from-primary to-primary/70",
            trend: "neutral"
          },
          {
            label: "Aguardando",
            value: `R$ ${(stats.pending / 1000).toFixed(1)}K`,
            change: "Em processamento",
            icon: Clock,
            gradient: "from-secondary to-secondary/70",
            trend: "neutral"
          },
          {
            label: "Pagamentos Recebidos",
            value: stats.completed.toString(),
            change: "Este mês",
            icon: CheckCircle2,
            gradient: "from-artist to-artist/70",
            trend: "up"
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
              />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} inline-flex mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Withdraw Button */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Saldo Disponível para Saque</h3>
            <p className="text-3xl font-bold text-primary mb-2">
              R$ {stats.available_balance.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm text-muted-foreground">
              Taxa de saque: 2% | Processamento: 1-2 dias úteis
            </p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
            <Download className="w-4 h-4 mr-2" />
            Solicitar Saque
          </Button>
        </div>
      </Card>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Histórico de Pagamentos</h2>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {payments.length === 0 ? (
          <Card className="p-12 text-center border-border/50 bg-card/50">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-bold mb-2">Nenhum pagamento ainda</h3>
            <p className="text-muted-foreground">
              Seus pagamentos de contratos aparecerão aqui
            </p>
          </Card>
        ) : (
          payments.map((payment) => {
            const statusInfo = getStatusInfo(payment.status);

            return (
              <div key={payment.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <ArrowDownRight className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">Pagamento de {payment.brand_name}</h3>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(payment.created_at).toLocaleDateString("pt-BR")}
                          </span>
                          {payment.paid_at && (
                            <>
                              <span>•</span>
                              <span>
                                Recebido em {new Date(payment.paid_at).toLocaleDateString("pt-BR")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-500">
                        + R$ {payment.amount.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Já descontada taxa de 10%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
