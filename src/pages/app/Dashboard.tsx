import { TrendingUp, Users, Target, DollarSign, Sparkles, BarChart3, Play, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
      </div>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </Card>
);

const CampaignCard = ({ name, status, reach, engagement, type }: any) => (
  <div className="flex items-center justify-between p-4 bg-card/30 rounded-xl border border-border/50 hover:bg-card/50 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        type === 'avatar' ? 'bg-primary/20' : type === 'influencer' ? 'bg-secondary/20' : 'bg-artist/20'
      }`}>
        <Sparkles className={`w-6 h-6 ${
          type === 'avatar' ? 'text-primary' : type === 'influencer' ? 'text-secondary' : 'text-artist'
        }`} />
      </div>
      <div>
        <h4 className="font-semibold mb-1">{name}</h4>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Alcance: {reach}</span>
          <span>•</span>
          <span>Eng: {engagement}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {status === 'live' ? 'Ao Vivo' : 'Agendado'}
      </span>
      <Button variant="ghost" size="sm">Ver</Button>
    </div>
  </div>
);

export default function Dashboard() {
  const stats = [
    { icon: Users, label: "Total de Seguidores", value: "2.4M", trend: 12.5, color: "from-primary to-primary/70" },
    { icon: Target, label: "Campanhas Ativas", value: "8", trend: 25, color: "from-secondary to-secondary/70" },
    { icon: TrendingUp, label: "Engajamento", value: "8.7%", trend: 5.3, color: "from-artist to-artist/70" },
    { icon: DollarSign, label: "ROI Médio", value: "4.2x", trend: 18.7, color: "from-green-500 to-green-700" },
  ];

  const campaigns = [
    { name: "Lançamento Produto X", status: "live", reach: "450K", engagement: "9.2%", type: "avatar" },
    { name: "Collab Fashion Week", status: "live", reach: "890K", engagement: "12.1%", type: "influencer" },
    { name: "Campanha Verão 2025", status: "scheduled", reach: "320K", engagement: "7.8%", type: "artist" },
  ];

  const topTalents = [
    { name: "Luna AI", type: "Avatar IA", performance: "Excelente", color: "primary" },
    { name: "Ana Silva", type: "Influencer", performance: "Muito Bom", color: "secondary" },
    { name: "Pedro Costa", type: "Artista", performance: "Excelente", color: "artist" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Visão geral das suas campanhas e talentos</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          <Play className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Campaigns Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Campanhas Recentes</h2>
          </div>
          <Button variant="ghost" size="sm">Ver Todas</Button>
        </div>
        <div className="space-y-3">
          {campaigns.map((campaign, i) => (
            <CampaignCard key={i} {...campaign} />
          ))}
        </div>
      </div>

      {/* Top Talents */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold">Top Talentos</h2>
          </div>
          <Button variant="ghost" size="sm">Ver Todos</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topTalents.map((talent, i) => (
            <Card key={i} className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br ${
                talent.color === 'primary' ? 'from-primary to-primary/70' : 
                talent.color === 'secondary' ? 'from-secondary to-secondary/70' : 
                'from-artist to-artist/70'
              }`} />
              <h3 className="font-semibold mb-1">{talent.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{talent.type}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                {talent.performance}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
