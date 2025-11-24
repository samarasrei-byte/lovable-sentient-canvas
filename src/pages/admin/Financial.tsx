import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const AdminFinancial = () => {
  const transactions = [
    {
      id: 1,
      type: "payment",
      brand: "TechBrand",
      influencer: "Rafael Costa",
      amount: 5000,
      arcanaFee: 500,
      status: "completed",
      date: "2024-01-28"
    },
    {
      id: 2,
      type: "withdrawal",
      influencer: "Camila Rodrigues",
      amount: 3500,
      fee: 175,
      status: "pending",
      date: "2024-01-29"
    },
    {
      id: 3,
      type: "payment",
      brand: "FashionCo",
      influencer: "Lucas Silva",
      amount: 8000,
      arcanaFee: 800,
      status: "completed",
      date: "2024-01-27"
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Concluído', color: 'bg-success/10 text-success border-success', icon: CheckCircle };
      case 'pending':
        return { label: 'Pendente', color: 'bg-accent/10 text-accent border-accent', icon: Clock };
      case 'failed':
        return { label: 'Falhou', color: 'bg-destructive/10 text-destructive border-destructive', icon: AlertCircle };
      default:
        return { label: 'Processando', color: 'bg-primary/10 text-primary border-primary', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Gestão Financeira
        </h1>
        <p className="text-muted-foreground">Transações, saques e taxas da plataforma</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Faturamento Total</p>
              <p className="text-3xl font-bold">R$ 125K</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +18% vs mês anterior
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxas Arcana (10%)</p>
              <p className="text-3xl font-bold text-success">R$ 12.5K</p>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saques Pendentes</p>
              <p className="text-3xl font-bold text-accent">R$ 8.2K</p>
              <p className="text-xs text-muted-foreground mt-1">
                4 solicitações
              </p>
            </div>
            <Clock className="h-8 w-8 text-accent" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Processadas Hoje</p>
              <p className="text-3xl font-bold text-primary">R$ 15.8K</p>
              <p className="text-xs text-muted-foreground mt-1">
                12 transações
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Receita nos Últimos 6 Meses</h2>
        <div className="h-64 flex items-end justify-between gap-4">
          {[45, 62, 58, 78, 95, 125].map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${(value / 125) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">
                {['Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'][idx]}
              </span>
              <span className="text-sm font-semibold">R$ {value}K</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Transações Recentes</h2>
          <Button variant="outline" size="sm">
            Exportar CSV
          </Button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => {
            const statusConfig = getStatusConfig(transaction.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${transaction.type === 'payment' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                    {transaction.type === 'payment' ? (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-accent" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">
                        {transaction.type === 'payment' ? 'Pagamento' : 'Saque'}
                      </h3>
                      <Badge className={statusConfig.color} >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.brand && `${transaction.brand} → `}
                      {transaction.influencer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    {transaction.type === 'payment' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Taxa: R$ {(transaction.arcanaFee || transaction.fee || 0).toLocaleString()}
                  </p>
                </div>

                <Button variant="ghost" size="sm" className="ml-4">
                  Ver Detalhes
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AdminFinancial;
