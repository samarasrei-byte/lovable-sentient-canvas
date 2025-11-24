import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Facebook,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function Monitoramento() {
  const [filter, setFilter] = useState("all");

  const posts = [
    {
      id: 1,
      influencer: "Rafael Costa",
      campaign: "Lançamento Produto X",
      platform: "instagram",
      type: "reel",
      scheduledTime: "2024-01-20 14:00",
      postedTime: "2024-01-20 14:03",
      status: "posted",
      content: "Novo produto revolucionário! 🚀",
      views: 125000,
      likes: 8500,
      comments: 340,
      shares: 120,
      engagement: 7.2,
      link: "https://instagram.com/p/abc123"
    },
    {
      id: 2,
      influencer: "Camila Rodrigues",
      campaign: "Campanha Verão",
      platform: "instagram",
      type: "stories",
      scheduledTime: "2024-01-20 18:00",
      postedTime: null,
      status: "scheduled",
      content: "Look do dia com a nova coleção ☀️",
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0,
      link: null
    },
    {
      id: 3,
      influencer: "Bruno Almeida",
      campaign: "Lançamento Produto X",
      platform: "facebook",
      type: "post",
      scheduledTime: "2024-01-20 12:00",
      postedTime: null,
      status: "delayed",
      content: "Review completo do produto",
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0,
      link: null
    },
    {
      id: 4,
      influencer: "Ana Beatriz",
      campaign: "Campanha Verão",
      platform: "instagram",
      type: "feed",
      scheduledTime: "2024-01-19 16:00",
      postedTime: "2024-01-19 16:00",
      status: "posted",
      content: "Momento praia com estilo! 🌊",
      views: 98000,
      likes: 12500,
      comments: 560,
      shares: 89,
      engagement: 13.4,
      link: "https://instagram.com/p/xyz789"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'posted':
        return { 
          label: 'Publicado', 
          icon: CheckCircle2, 
          color: 'text-green-500', 
          bg: 'bg-green-500/10',
          variant: 'default' as const 
        };
      case 'scheduled':
        return { 
          label: 'Agendado', 
          icon: Clock, 
          color: 'text-blue-500', 
          bg: 'bg-blue-500/10',
          variant: 'secondary' as const 
        };
      case 'delayed':
        return { 
          label: 'Atrasado', 
          icon: AlertCircle, 
          color: 'text-red-500', 
          bg: 'bg-red-500/10',
          variant: 'outline' as const 
        };
      default:
        return { 
          label: 'Pendente', 
          icon: Clock, 
          color: 'text-muted-foreground', 
          bg: 'bg-muted',
          variant: 'outline' as const 
        };
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'instagram' ? Instagram : Facebook;
  };

  const filteredPosts = filter === "all" ? posts : posts.filter(p => p.status === filter);

  const stats = [
    {
      label: "Posts Monitorados",
      value: "248",
      change: "+18 hoje",
      icon: Activity,
      gradient: "from-primary to-primary/70"
    },
    {
      label: "Publicados no Prazo",
      value: "94%",
      change: "233 de 248",
      icon: CheckCircle2,
      gradient: "from-green-500 to-green-600"
    },
    {
      label: "Engajamento Médio",
      value: "9.8%",
      change: "+1.2% vs média",
      icon: TrendingUp,
      gradient: "from-secondary to-secondary/70"
    },
    {
      label: "Alcance Total",
      value: "2.8M",
      change: "Esta semana",
      icon: Eye,
      gradient: "from-artist to-artist/70"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Monitoramento em Tempo Real</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Tracking de Posts
        </h1>
        <p className="text-muted-foreground">
          Acompanhe em tempo real quando influenciadores publicam conteúdo das suas campanhas
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} inline-flex mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          Todos
        </Button>
        <Button
          variant={filter === "posted" ? "default" : "outline"}
          onClick={() => setFilter("posted")}
        >
          Publicados
        </Button>
        <Button
          variant={filter === "scheduled" ? "default" : "outline"}
          onClick={() => setFilter("scheduled")}
        >
          Agendados
        </Button>
        <Button
          variant={filter === "delayed" ? "default" : "outline"}
          onClick={() => setFilter("delayed")}
        >
          Atrasados
        </Button>
      </div>

      {/* Posts Timeline */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const statusInfo = getStatusInfo(post.status);
          const StatusIcon = statusInfo.icon;
          const PlatformIcon = getPlatformIcon(post.platform);
          
          return (
            <div key={post.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{post.influencer}</h3>
                      <Badge variant={statusInfo.variant} className={statusInfo.bg}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline">
                        <PlatformIcon className="w-3 h-3 mr-1" />
                        {post.platform}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {post.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{post.campaign}</p>
                    <p className="text-sm">{post.content}</p>
                  </div>
                  {post.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={post.link} target="_blank" rel="noopener noreferrer">
                        Ver Post
                      </a>
                    </Button>
                  )}
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Agendado: {post.scheduledTime}</span>
                  </div>
                  {post.postedTime && (
                    <>
                      <span className="text-muted-foreground">→</span>
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Publicado: {post.postedTime}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Metrics */}
                {post.status === 'posted' && (
                  <div className="grid grid-cols-5 gap-6 pt-4 border-t border-border/30">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">Visualizações</span>
                      </div>
                      <p className="text-lg font-bold">{(post.views / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">Curtidas</span>
                      </div>
                      <p className="text-lg font-bold">{(post.likes / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">Comentários</span>
                      </div>
                      <p className="text-lg font-bold">{post.comments}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Compartilhamentos</span>
                      </div>
                      <p className="text-lg font-bold">{post.shares}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">Engajamento</span>
                      </div>
                      <p className="text-lg font-bold text-primary">{post.engagement}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
