import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LifeBuoy, 
  Search, 
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  User
} from "lucide-react";

const AdminSupport = () => {
  const [search, setSearch] = useState("");

  const tickets = [
    {
      id: "TKT-001",
      user: "Rafael Costa",
      userType: "influencer",
      subject: "Problema com pagamento",
      priority: "high",
      status: "open",
      category: "financial",
      created: "2024-01-29 14:30",
      lastUpdate: "2024-01-29 15:45",
      messages: 3
    },
    {
      id: "TKT-002",
      user: "TechBrand",
      userType: "brand",
      subject: "Erro ao criar campanha",
      priority: "medium",
      status: "in_progress",
      category: "technical",
      created: "2024-01-29 10:15",
      lastUpdate: "2024-01-29 12:20",
      messages: 5
    },
    {
      id: "TKT-003",
      user: "Camila Rodrigues",
      userType: "influencer",
      subject: "Dúvida sobre métricas",
      priority: "low",
      status: "resolved",
      category: "general",
      created: "2024-01-28 16:00",
      lastUpdate: "2024-01-29 09:30",
      messages: 8
    }
  ];

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: 'Alta', color: 'bg-destructive/10 text-destructive border-destructive' };
      case 'medium':
        return { label: 'Média', color: 'bg-accent/10 text-accent border-accent' };
      default:
        return { label: 'Baixa', color: 'bg-muted/10 text-muted-foreground border-muted' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return { label: 'Aberto', color: 'bg-accent/10 text-accent border-accent', icon: AlertCircle };
      case 'in_progress':
        return { label: 'Em Andamento', color: 'bg-primary/10 text-primary border-primary', icon: Clock };
      case 'resolved':
        return { label: 'Resolvido', color: 'bg-success/10 text-success border-success', icon: CheckCircle };
      default:
        return { label: 'Pendente', color: 'bg-muted/10 text-muted-foreground border-muted', icon: Clock };
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'financial': 'Financeiro',
      'technical': 'Técnico',
      'general': 'Geral',
      'account': 'Conta'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Central de Suporte
        </h1>
        <p className="text-muted-foreground">Gerenciar tickets e solicitações de usuários</p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
              <p className="text-3xl font-bold">{tickets.length}</p>
            </div>
            <LifeBuoy className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Abertos</p>
              <p className="text-3xl font-bold text-accent">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-accent" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
              <p className="text-3xl font-bold text-primary">
                {tickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolvidos (24h)</p>
              <p className="text-3xl font-bold text-success">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tickets Recentes</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              Exportar
            </Button>
          </div>
        </div>

        {tickets.map((ticket) => {
          const priorityConfig = getPriorityConfig(ticket.priority);
          const statusConfig = getStatusConfig(ticket.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={ticket.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${ticket.userType === 'brand' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                      <User className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{ticket.subject}</h3>
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        <Badge className={priorityConfig.color}>
                          {priorityConfig.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.user}
                        </span>
                        <span>•</span>
                        <span>{getCategoryLabel(ticket.category)}</span>
                        <span>•</span>
                        <span>{ticket.id}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>Criado: {ticket.created}</span>
                        <span>Atualizado: {ticket.lastUpdate}</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {ticket.messages} mensagens
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Ticket
                    </Button>
                    {ticket.status !== 'resolved' && (
                      <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                        Responder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSupport;
