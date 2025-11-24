import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from "lucide-react";

export default function Pagamentos() {
  const transactions = [
    {
      id: 1,
      type: "payment",
      description: "Pagamento Campanha Lançamento X",
      influencer: "Rafael Costa",
      amount: -3500,
      arcanaFee: -350,
      status: "completed",
      date: "2024-01-15",
      method: "Cartão de Crédito"
    },
    {
      id: 2,
      type: "payment",
      description: "Contrato Stories Pack",
      influencer: "Camila Rodrigues",
      amount: -1800,
      arcanaFee: -180,
      status: "pending",
      date: "2024-01-20",
      method: "Pix"
    },
    {
      id: 3,
      type: "refund",
      description: "Reembolso Parcial Campanha",
      influencer: "Bruno Almeida",
      amount: 500,
      arcanaFee: 50,
      status: "completed",
      date: "2024-01-10",
      method: "Pix"
    }
  ];

  const invoices = [
    {
      id: "INV-2024-001",
      campaign: "Lançamento Produto X",
      amount: 18500,
      arcanaFee: 1850,
      date: "2024-01-31",
      status: "paid"
    },
    {
      id: "INV-2024-002",
      campaign: "Campanha Verão 2024",
      amount: 12000,
      arcanaFee: 1200,
      date: "2024-02-15",
      status: "pending"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'completed':
      case 'paid':
        return { label: 'Pago', variant: 'default' as const, color: 'text-green-500' };
      case 'pending':
        return { label: 'Pendente', variant: 'secondary' as const, color: 'text-secondary' };
      case 'cancelled':
        return { label: 'Cancelado', variant: 'outline' as const, color: 'text-red-500' };
      default:
        return { label: 'Processando', variant: 'outline' as const, color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Pagamentos ARCANA</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Pagamentos & Faturamento
        </h1>
        <p className="text-muted-foreground">
          Gerencie pagamentos, faturas e acompanhe taxas da plataforma
        </p>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Investido", 
            value: "R$ 58.3K", 
            change: "+12% vs mês anterior",
            icon: DollarSign, 
            gradient: "from-primary to-primary/70",
            trend: "up"
          },
          { 
            label: "Taxa Arcana Total", 
            value: "R$ 5.8K", 
            change: "10% do investimento",
            icon: TrendingUp, 
            gradient: "from-secondary to-secondary/70",
            trend: "neutral"
          },
          { 
            label: "Pagamentos Pendentes", 
            value: "R$ 12K", 
            change: "3 transações",
            icon: Clock, 
            gradient: "from-artist to-artist/70",
            trend: "neutral"
          },
          { 
            label: "Pagamentos Realizados", 
            value: "R$ 46.3K", 
            change: "Este mês",
            icon: CheckCircle2, 
            gradient: "from-green-500 to-green-600",
            trend: "up"
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.trend === 'up' && (
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  )}
                  {stat.trend === 'down' && (
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Transações Recentes</h2>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {transactions.map((transaction) => {
          const statusInfo = getStatusInfo(transaction.status);
          const isPayment = transaction.type === 'payment';
          
          return (
            <div key={transaction.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${isPayment ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                      {isPayment ? (
                        <ArrowUpRight className={`w-5 h-5 ${isPayment ? 'text-red-500' : 'text-green-500'}`} />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{transaction.influencer}</span>
                        <span>•</span>
                        <span>{transaction.method}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isPayment ? 'text-red-500' : 'text-green-500'}`}>
                      {isPayment ? '-' : '+'} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Taxa Arcana: R$ {Math.abs(transaction.arcanaFee)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Faturas</h2>
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const statusInfo = getStatusInfo(invoice.status);
            return (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.campaign}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">R$ {invoice.amount.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-muted-foreground">Taxa: R$ {invoice.arcanaFee}</p>
                  </div>
                  <Badge variant={statusInfo.variant}>
                    {statusInfo.label}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Métodos de Pagamento</h2>
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Adicionar Método
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { type: "Cartão de Crédito", last4: "4242", brand: "Visa", default: true },
            { type: "Pix", info: "Pagamento instantâneo", default: false }
          ].map((method, i) => (
            <div key={i} className="p-6 bg-background/50 border border-border/50 rounded-xl hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{method.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.last4 ? `•••• ${method.last4}` : method.info}
                    </p>
                  </div>
                </div>
                {method.default && (
                  <Badge variant="secondary">Padrão</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
