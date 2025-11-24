import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  Target,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Campanhas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const campaigns = [
    {
      id: 1,
      name: "Lançamento Produto X",
      status: "active",
      budget: 25000,
      spent: 18500,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      influencers: 12,
      posts: 24,
      reach: 2500000,
      engagement: 125000,
      roi: 3.2
    },
    {
      id: 2,
      name: "Campanha Verão 2024",
      status: "planning",
      budget: 50000,
      spent: 0,
      startDate: "2024-02-01",
      endDate: "2024-03-31",
      influencers: 25,
      posts: 0,
      reach: 0,
      engagement: 0,
      roi: 0
    },
    {
      id: 3,
      name: "Black Friday 2023",
      status: "completed",
      budget: 35000,
      spent: 34200,
      startDate: "2023-11-01",
      endDate: "2023-11-30",
      influencers: 18,
      posts: 42,
      reach: 3800000,
      engagement: 280000,
      roi: 4.5
    }
  ];

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'active':
        return { label: 'Ativa', variant: 'default' as const, color: 'text-primary' };
      case 'planning':
        return { label: 'Planejamento', variant: 'secondary' as const, color: 'text-secondary' };
      case 'completed':
        return { label: 'Concluída', variant: 'outline' as const, color: 'text-muted-foreground' };
      default:
        return { label: 'Pausada', variant: 'outline' as const, color: 'text-muted-foreground' };
    }
  };

  const stats = [
    {
      icon: Target,
      label: "Campanhas Ativas",
      value: "3",
      change: "+2 este mês",
      gradient: "from-primary to-primary/70"
    },
    {
      icon: DollarSign,
      label: "Budget Total",
      value: "R$ 110K",
      change: "3 campanhas",
      gradient: "from-secondary to-secondary/70"
    },
    {
      icon: Users,
      label: "Influenciadores",
      value: "55",
      change: "Em 3 campanhas",
      gradient: "from-artist to-artist/70"
    },
    {
      icon: TrendingUp,
      label: "ROI Médio",
      value: "3.8x",
      change: "+0.5 vs último mês",
      gradient: "from-primary to-secondary"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Campanhas ARCANA</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
            Gestão de Campanhas
          </h1>
          <p className="text-muted-foreground">
            Crie, gerencie e otimize suas campanhas com influenciadores e avatares IA
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Suas Campanhas</h2>
        
        {campaigns.map((campaign) => {
          const statusInfo = getStatusInfo(campaign.status);
          const progress = (campaign.spent / campaign.budget) * 100;
          
          return (
            <div key={campaign.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{campaign.name}</h3>
                      <Badge variant={statusInfo.variant} className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(campaign.startDate).toLocaleDateString('pt-BR')} - {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {campaign.influencers} influenciadores
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Ver Detalhes</Button>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Budget Utilizado</span>
                    <span className="font-semibold">
                      R$ {(campaign.spent / 1000).toFixed(1)}K / R$ {(campaign.budget / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Posts</p>
                    <p className="text-lg font-bold">{campaign.posts}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Alcance</p>
                    <p className="text-lg font-bold">{(campaign.reach / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Engajamento</p>
                    <p className="text-lg font-bold">{(campaign.engagement / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ROI</p>
                    <p className="text-lg font-bold text-primary">{campaign.roi}x</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação */}
      <CreateCampaignModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
