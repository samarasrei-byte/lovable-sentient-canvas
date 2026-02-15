import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Megaphone, 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Pause,
  Play,
  Eye
} from "lucide-react";

const AdminCampaigns = () => {
  const [search, setSearch] = useState("");

  const campaigns = [
    {
      id: 1,
      name: "Lançamento Produto X - TechBrand",
      brand: "TechBrand",
      influencers: 3,
      budget: 2000,
      spent: 1400,
      status: "active",
      reach: 18000,
      engagement: 1200,
      startDate: "2024-01-15",
      endDate: "2024-02-15"
    },
    {
      id: 2,
      name: "Campanha Verão - FashionCo",
      brand: "FashionCo",
      influencers: 5,
      budget: 3500,
      spent: 2100,
      status: "active",
      reach: 32000,
      engagement: 2800,
      startDate: "2024-01-20",
      endDate: "2024-03-31"
    },
    {
      id: 3,
      name: "Black Friday - RetailPro",
      brand: "RetailPro",
      influencers: 2,
      budget: 1500,
      spent: 1500,
      status: "completed",
      reach: 12000,
      engagement: 950,
      startDate: "2023-11-01",
      endDate: "2023-11-30"
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativa', color: 'bg-success/10 text-success border-success', icon: Play };
      case 'paused':
        return { label: 'Pausada', color: 'bg-accent/10 text-accent border-accent', icon: Pause };
      case 'completed':
        return { label: 'Concluída', color: 'bg-primary/10 text-primary border-primary', icon: CheckCircle };
      default:
        return { label: 'Planejamento', color: 'bg-muted/10 text-muted-foreground border-muted', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Gestão de Campanhas
        </h1>
        <p className="text-muted-foreground">Monitorar e gerenciar todas as campanhas ativas</p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campanhas..."
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
              <p className="text-sm text-muted-foreground">Total Campanhas</p>
              <p className="text-3xl font-bold">{campaigns.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativas</p>
              <p className="text-3xl font-bold text-success">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
            <Play className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget Total</p>
              <p className="text-3xl font-bold text-primary">
                R$ {(campaigns.reduce((sum, c) => sum + c.budget, 0)).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alcance Total</p>
              <p className="text-3xl font-bold text-accent">
                {(campaigns.reduce((sum, c) => sum + c.reach, 0) / 1000).toFixed(1)}K
              </p>
            </div>
            <Eye className="h-8 w-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const statusConfig = getStatusConfig(campaign.status);
          const StatusIcon = statusConfig.icon;
          const progress = (campaign.spent / campaign.budget) * 100;

          return (
            <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{campaign.name}</h3>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.influencers} influenciadores • {new Date(campaign.startDate).toLocaleDateString('pt-BR')} até {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="outline">Ver Detalhes</Button>
                </div>

                {/* Budget Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Budget Utilizado</span>
                    <span className="font-semibold">
                      R$ {campaign.spent.toLocaleString()} / R$ {campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Alcance</p>
                    <p className="text-lg font-bold">{(campaign.reach / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Engajamento</p>
                    <p className="text-lg font-bold">{campaign.engagement.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Taxa Eng.</p>
                    <p className="text-lg font-bold">{((campaign.engagement / campaign.reach) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ROI</p>
                    <p className="text-lg font-bold text-success">
                      {((campaign.engagement / campaign.spent) * 100).toFixed(0)}%
                    </p>
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

export default AdminCampaigns;
