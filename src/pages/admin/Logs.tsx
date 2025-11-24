import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from "lucide-react";

const AdminLogs = () => {
  const [search, setSearch] = useState("");

  const logs = [
    {
      id: 1,
      timestamp: "2024-01-29 15:45:32",
      level: "info",
      action: "user_login",
      user: "guilherme@g8prospect.com.br",
      details: "Login realizado com sucesso",
      ip: "177.81.73.248"
    },
    {
      id: 2,
      timestamp: "2024-01-29 15:30:15",
      level: "warning",
      action: "payment_pending",
      user: "marca@techbrand.com",
      details: "Pagamento pendente de confirmação - R$ 5.000",
      ip: "189.12.34.56"
    },
    {
      id: 3,
      timestamp: "2024-01-29 15:20:08",
      level: "success",
      action: "campaign_created",
      user: "admin@arcana.com",
      details: "Nova campanha criada: Lançamento Produto X",
      ip: "177.81.73.248"
    },
    {
      id: 4,
      timestamp: "2024-01-29 15:10:42",
      level: "error",
      action: "api_error",
      user: "system",
      details: "Erro na integração com Instagram API - Rate limit exceeded",
      ip: "177.81.73.248"
    },
    {
      id: 5,
      timestamp: "2024-01-29 15:00:19",
      level: "info",
      action: "influencer_approved",
      user: "admin@arcana.com",
      details: "Influenciador aprovado: Rafael Costa",
      ip: "177.81.73.248"
    }
  ];

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'error':
        return { 
          label: 'Erro', 
          color: 'bg-destructive/10 text-destructive border-destructive',
          icon: XCircle,
          iconColor: 'text-destructive'
        };
      case 'warning':
        return { 
          label: 'Aviso', 
          color: 'bg-accent/10 text-accent border-accent',
          icon: AlertCircle,
          iconColor: 'text-accent'
        };
      case 'success':
        return { 
          label: 'Sucesso', 
          color: 'bg-success/10 text-success border-success',
          icon: CheckCircle,
          iconColor: 'text-success'
        };
      default:
        return { 
          label: 'Info', 
          color: 'bg-primary/10 text-primary border-primary',
          icon: Info,
          iconColor: 'text-primary'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Logs do Sistema
        </h1>
        <p className="text-muted-foreground">Monitorar atividades e eventos da plataforma</p>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nos logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            Filtrar por Data
          </Button>
          <Button variant="outline">
            Exportar Logs
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total (24h)</p>
              <p className="text-3xl font-bold">{logs.length * 48}</p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Erros</p>
              <p className="text-3xl font-bold text-destructive">
                {logs.filter(l => l.level === 'error').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avisos</p>
              <p className="text-3xl font-bold text-accent">
                {logs.filter(l => l.level === 'warning').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-accent" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sucessos</p>
              <p className="text-3xl font-bold text-success">
                {logs.filter(l => l.level === 'success').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Logs List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Eventos Recentes</h2>

        <div className="space-y-3">
          {logs.map((log) => {
            const levelConfig = getLevelConfig(log.level);
            const LevelIcon = levelConfig.icon;

            return (
              <div 
                key={log.id} 
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className={`p-2 rounded-lg ${levelConfig.color}`}>
                  <LevelIcon className={`w-4 h-4 ${levelConfig.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={levelConfig.color}>
                      {levelConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.timestamp}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      •
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.action}
                    </span>
                  </div>

                  <p className="text-sm font-medium mb-1">{log.details}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>User: {log.user}</span>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm">
                  Detalhes
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AdminLogs;
