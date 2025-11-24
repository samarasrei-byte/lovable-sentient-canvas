import { Button } from "@/components/ui/button";
import { Users, Target, TrendingUp, DollarSign, Play, Eye, BarChart3, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const metrics = [
    {
      label: "Total de Seguidores",
      value: "2.4M",
      change: "+12.5%",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/20"
    },
    {
      label: "Campanhas Ativas",
      value: "8",
      change: "+25%",
      icon: Target,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-500/20"
    },
    {
      label: "Engajamento",
      value: "8.7%",
      change: "+5.3%",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/20"
    },
    {
      label: "ROI Médio",
      value: "4.2x",
      change: "+18.7%",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/20"
    }
  ];

  const campaigns = [
    {
      name: "Lançamento Produto X",
      reach: "450K",
      engagement: "9.2%",
      status: "Ao Vivo",
      statusColor: "bg-green-500",
      icon: "✨",
      iconBg: "from-purple-500 to-purple-600"
    },
    {
      name: "Collab Fashion Week",
      reach: "890K",
      engagement: "12.1%",
      status: "Ao Vivo",
      statusColor: "bg-green-500",
      icon: "✨",
      iconBg: "from-cyan-500 to-cyan-600"
    },
    {
      name: "Campanha Verão 2025",
      reach: "320K",
      engagement: "7.8%",
      status: "Agendado",
      statusColor: "bg-yellow-500",
      icon: "✨",
      iconBg: "from-orange-500 to-orange-600"
    }
  ];

  const topTalents = [
    { name: "Sarah Tech", category: "Tech IA", engagement: "12.5%", avatar: "🤖", color: "from-primary to-secondary" },
    { name: "Marcus Fit", category: "Fitness", engagement: "10.8%", avatar: "💪", color: "from-secondary to-artist" },
    { name: "Luna Fashion", category: "Fashion", engagement: "15.2%", avatar: "👗", color: "from-artist to-primary" }
  ];

  const insights = [
    { title: "Melhor Horário", value: "19h - 21h", icon: "⏰" },
    { title: "Conteúdo Top", value: "Reels", icon: "🎬" },
    { title: "Público Alvo", value: "18-34 anos", icon: "🎯" },
    { title: "Hashtag #1", value: "#TechLife", icon: "📈" }
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Visão geral das suas campanhas e talentos</p>
          </div>
          <Link to="/app/consultoria">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/50">
              <Plus className="w-5 h-5 mr-2" />
              Nova Campanha
            </Button>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${metric.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300`} />
                <div className="relative bg-card/70 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" style={{ color: metric.color.split(' ')[1].replace('to-', '') }} />
                    </div>
                    <span className="text-green-500 text-sm font-semibold">{metric.change}</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Campaigns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Campanhas Recentes</h2>
              </div>
              <Link to="/app/talentos">
                <Button variant="ghost" size="sm">Ver Todas</Button>
              </Link>
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/30 group-hover:to-secondary/30 rounded-2xl blur transition duration-300" />
                  <div className="relative bg-card/70 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${campaign.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {campaign.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">{campaign.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Alcance: {campaign.reach}</span>
                          <span>•</span>
                          <span>Eng: {campaign.engagement}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.statusColor} text-white`}>
                          {campaign.status}
                        </span>
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Talents */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">Top Talentos</h2>
            </div>

            <div className="space-y-4">
              {topTalents.map((talent, i) => (
                <div key={i} className="bg-card/70 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${talent.color} flex items-center justify-center text-xl`}>
                      {talent.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold mb-1">{talent.name}</div>
                      <div className="text-sm text-muted-foreground">{talent.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-500">{talent.engagement}</div>
                      <div className="text-xs text-muted-foreground">eng.</div>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/app/talentos">
                <Button variant="outline" className="w-full">
                  Ver Todos os Talentos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-artist/10 border border-primary/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Insights Rápidos</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {insights.map((insight, i) => (
              <div key={i} className="bg-card/70 backdrop-blur-xl border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all text-center">
                <div className="text-3xl mb-2">{insight.icon}</div>
                <div className="font-bold mb-1">{insight.value}</div>
                <div className="text-xs text-muted-foreground">{insight.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/app/consultoria" className="group">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 hover:scale-[1.02] transition-all">
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Consultoria IA</h3>
              <p className="text-sm text-muted-foreground">Obtenha insights personalizados e estratégias de campanha</p>
            </div>
          </Link>

          <Link to="/app/liveshop" className="group">
            <div className="bg-gradient-to-br from-secondary/20 to-artist/20 border border-secondary/30 rounded-2xl p-6 hover:scale-[1.02] transition-all">
              <Play className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-bold text-lg mb-2">Live Shop</h3>
              <p className="text-sm text-muted-foreground">Transmissões ao vivo com vendas integradas</p>
            </div>
          </Link>

          <Link to="/app/talentos" className="group">
            <div className="bg-gradient-to-br from-artist/20 to-primary/20 border border-artist/30 rounded-2xl p-6 hover:scale-[1.02] transition-all">
              <Users className="w-10 h-10 text-artist mb-4" />
              <h3 className="font-bold text-lg mb-2">Descobrir Talentos</h3>
              <p className="text-sm text-muted-foreground">Encontre o criador perfeito para sua marca</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}