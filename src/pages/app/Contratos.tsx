import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  DollarSign, 
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  TrendingUp,
  Instagram,
  Youtube,
  Play
} from "lucide-react";

export default function Contratos() {
  const pricingTable = [
    {
      type: "Reels",
      icon: Play,
      influencer: "R$ 500 - R$ 5.000",
      avatar: "R$ 200 - R$ 800",
      delivery: "3-5 dias",
      color: "from-pink-500 to-rose-500"
    },
    {
      type: "Feed Post",
      icon: Instagram,
      influencer: "R$ 800 - R$ 8.000",
      avatar: "R$ 300 - R$ 1.200",
      delivery: "2-4 dias",
      color: "from-purple-500 to-pink-500"
    },
    {
      type: "Stories (24h)",
      icon: Instagram,
      influencer: "R$ 300 - R$ 2.500",
      avatar: "R$ 150 - R$ 600",
      delivery: "1-2 dias",
      color: "from-orange-500 to-red-500"
    },
    {
      type: "YouTube Video",
      icon: Youtube,
      influencer: "R$ 2.000 - R$ 20.000",
      avatar: "R$ 800 - R$ 3.000",
      delivery: "7-14 dias",
      color: "from-red-500 to-red-600"
    }
  ];

  const contracts = [
    {
      id: 1,
      influencer: "Rafael Costa",
      type: "avatar",
      contentType: "Reels + Feed",
      value: 3500,
      status: "active",
      startDate: "2024-01-15",
      deliverables: 4,
      completed: 2,
      arcanaFee: 350
    },
    {
      id: 2,
      influencer: "Camila Rodrigues",
      type: "influencer",
      contentType: "Stories Pack",
      value: 1800,
      status: "pending",
      startDate: "2024-01-20",
      deliverables: 6,
      completed: 0,
      arcanaFee: 180
    },
    {
      id: 3,
      influencer: "Max Power (Avatar)",
      type: "avatar",
      contentType: "YouTube Video",
      value: 2500,
      status: "completed",
      startDate: "2024-01-05",
      deliverables: 1,
      completed: 1,
      arcanaFee: 250
    }
  ];

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'active':
        return { label: 'Em Andamento', icon: Clock, color: 'text-primary', variant: 'default' as const };
      case 'pending':
        return { label: 'Aguardando', icon: Clock, color: 'text-secondary', variant: 'secondary' as const };
      case 'completed':
        return { label: 'Concluído', icon: CheckCircle2, color: 'text-green-500', variant: 'outline' as const };
      case 'cancelled':
        return { label: 'Cancelado', icon: XCircle, color: 'text-red-500', variant: 'outline' as const };
      default:
        return { label: 'Rascunho', icon: FileText, color: 'text-muted-foreground', variant: 'outline' as const };
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Contratos & Precificação</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Gestão de Contratos
        </h1>
        <p className="text-muted-foreground">
          Negocie, contrate e gerencie propostas com precificação transparente
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Contratos Ativos", value: "8", icon: FileText, gradient: "from-primary to-primary/70" },
          { label: "Valor Total", value: "R$ 45K", icon: DollarSign, gradient: "from-secondary to-secondary/70" },
          { label: "Taxa Arcana", value: "R$ 4.5K", icon: TrendingUp, gradient: "from-artist to-artist/70" },
          { label: "Concluídos", value: "24", icon: CheckCircle2, gradient: "from-green-500 to-green-600" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
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

      {/* Pricing Table */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Tabela de Precificação</h2>
        <div className="grid gap-4">
          {pricingTable.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
                <div className="relative bg-background/50 border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.type}</p>
                        <p className="text-xs text-muted-foreground">{item.delivery}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Influenciador Real</p>
                      <p className="font-semibold text-sm">{item.influencer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Avatar IA</p>
                      <p className="font-semibold text-sm">{item.avatar}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        Taxa Arcana: 10%
                      </Badge>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="w-full">
                        Solicitar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Contracts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Contratos em Andamento</h2>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Upload Contrato
          </Button>
        </div>
        {contracts.map((contract) => {
          const statusInfo = getStatusInfo(contract.status);
          const StatusIcon = statusInfo.icon;
          const progress = (contract.completed / contract.deliverables) * 100;
          
          return (
            <div key={contract.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{contract.influencer}</h3>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline" className={contract.type === 'avatar' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}>
                        {contract.type === 'avatar' ? 'Avatar IA' : 'Influenciador'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{contract.contentType}</p>
                  </div>
                  <Button variant="outline">Ver Contrato</Button>
                </div>

                <div className="grid md:grid-cols-5 gap-6 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Valor Total</p>
                    <p className="text-lg font-bold text-primary">R$ {contract.value.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Taxa Arcana (10%)</p>
                    <p className="text-lg font-bold">R$ {contract.arcanaFee}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Início</p>
                    <p className="text-sm font-semibold">{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Entregáveis</p>
                    <p className="text-sm font-semibold">{contract.completed} / {contract.deliverables}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Progresso</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
