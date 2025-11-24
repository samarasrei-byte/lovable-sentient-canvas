import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Loader2
} from "lucide-react";

interface Contract {
  id: string;
  brand_name: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export default function InfluencerContratos() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    total_value: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: influencer } = await supabase
        .from("influencers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!influencer) return;

      const { data: contractsData, error } = await supabase
        .from("contracts")
        .select(`
          id,
          description,
          amount,
          status,
          created_at,
          started_at,
          completed_at,
          brand_id,
          profiles!contracts_brand_id_fkey(full_name)
        `)
        .eq("influencer_id", influencer.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedContracts = contractsData.map((c: any) => ({
        id: c.id,
        brand_name: c.profiles?.full_name || "Marca",
        description: c.description,
        amount: c.amount,
        status: c.status,
        created_at: c.created_at,
        started_at: c.started_at,
        completed_at: c.completed_at
      }));

      setContracts(formattedContracts);

      // Calculate stats
      const active = formattedContracts.filter((c) => c.status === "active").length;
      const completed = formattedContracts.filter((c) => c.status === "completed").length;
      const pending = formattedContracts.filter((c) => c.status === "pending_payment").length;
      const total_value = formattedContracts.reduce((sum, c) => sum + Number(c.amount), 0);

      setStats({ active, completed, pending, total_value });
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar seus contratos."
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Em Andamento",
          icon: Clock,
          color: "text-primary",
          variant: "default" as const
        };
      case "pending_payment":
        return {
          label: "Aguardando Pagamento",
          icon: AlertCircle,
          color: "text-secondary",
          variant: "secondary" as const
        };
      case "completed":
        return {
          label: "Concluído",
          icon: CheckCircle2,
          color: "text-green-500",
          variant: "outline" as const
        };
      default:
        return {
          label: "Desconhecido",
          icon: FileText,
          color: "text-muted-foreground",
          variant: "outline" as const
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
          <span className="text-sm font-medium text-primary">Meus Contratos</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Gestão de Contratos
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seus contratos e oportunidades com marcas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            label: "Contratos Ativos",
            value: stats.active.toString(),
            icon: FileText,
            gradient: "from-primary to-primary/70"
          },
          {
            label: "Valor Total",
            value: `R$ ${(stats.total_value / 1000).toFixed(0)}K`,
            icon: DollarSign,
            gradient: "from-secondary to-secondary/70"
          },
          {
            label: "Aguardando Início",
            value: stats.pending.toString(),
            icon: Clock,
            gradient: "from-artist to-artist/70"
          },
          {
            label: "Concluídos",
            value: stats.completed.toString(),
            icon: CheckCircle2,
            gradient: "from-green-500 to-green-600"
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
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Meus Contratos</h2>

        {contracts.length === 0 ? (
          <Card className="p-12 text-center border-border/50 bg-card/50">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-bold mb-2">Nenhum contrato ainda</h3>
            <p className="text-muted-foreground">
              Seus contratos com marcas aparecerão aqui
            </p>
          </Card>
        ) : (
          contracts.map((contract) => {
            const statusInfo = getStatusInfo(contract.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={contract.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{contract.brand_name}</h3>
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{contract.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {contract.status === "active" && (
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6 pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Valor do Contrato</p>
                      <p className="text-lg font-bold text-primary">
                        R$ {contract.amount.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taxa Arcana (10%)</p>
                      <p className="text-lg font-bold">
                        R$ {(contract.amount * 0.1).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Você Receberá</p>
                      <p className="text-lg font-bold text-green-500">
                        R$ {(contract.amount * 0.9).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Data de Criação</p>
                      <p className="text-sm font-semibold">
                        {new Date(contract.created_at).toLocaleDateString("pt-BR")}
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
