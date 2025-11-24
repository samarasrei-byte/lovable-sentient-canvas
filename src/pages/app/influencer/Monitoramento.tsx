import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
  Upload,
  Link as LinkIcon,
  Calendar
} from "lucide-react";

export default function InfluencerMonitoramento() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      campaign: "Lançamento Produto X",
      brand: "TechCorp",
      platform: "Instagram",
      type: "Reel",
      deadline: "2024-01-25",
      status: "posted",
      postedAt: "2024-01-20 14:03",
      link: "https://instagram.com/p/abc123",
      views: 125000,
      likes: 8500,
      comments: 340,
      shares: 120,
      engagement: 7.2
    },
    {
      id: 2,
      campaign: "Campanha Verão",
      brand: "FashionBrand",
      platform: "Instagram",
      type: "Stories",
      deadline: "2024-01-22",
      status: "pending",
      postedAt: null,
      link: null,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0
    }
  ]);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "posted":
        return {
          label: "Publicado",
          icon: CheckCircle2,
          color: "text-green-500",
          bg: "bg-green-500/10",
          variant: "default" as const
        };
      case "pending":
        return {
          label: "Pendente",
          icon: Clock,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          variant: "secondary" as const
        };
      default:
        return {
          label: "Atrasado",
          icon: Clock,
          color: "text-red-500",
          bg: "bg-red-500/10",
          variant: "outline" as const
        };
    }
  };

  const stats = [
    {
      label: "Posts Realizados",
      value: "24",
      change: "+3 este mês",
      icon: Activity,
      gradient: "from-primary to-primary/70"
    },
    {
      label: "Taxa de Entrega",
      value: "96%",
      change: "No prazo",
      icon: CheckCircle2,
      gradient: "from-green-500 to-green-600"
    },
    {
      label: "Engajamento Médio",
      value: "8.9%",
      change: "+1.5% vs média",
      icon: TrendingUp,
      gradient: "from-secondary to-secondary/70"
    },
    {
      label: "Alcance Total",
      value: "1.2M",
      change: "Este mês",
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
          <span className="text-sm font-medium text-primary">Meu Desempenho</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Monitoramento de Posts
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus posts e acompanhe métricas de engajamento
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
              />
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

      {/* Posts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Meus Posts</h2>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Upload className="w-4 h-4 mr-2" />
                Reportar Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reportar Post Publicado</DialogTitle>
                <DialogDescription>
                  Adicione o link do post e as métricas atuais
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="post-link">Link do Post</Label>
                  <Input
                    id="post-link"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="views">Visualizações</Label>
                    <Input id="views" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="likes">Curtidas</Label>
                    <Input id="likes" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments">Comentários</Label>
                    <Input id="comments" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shares">Compartilhamentos</Label>
                    <Input id="shares" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Adicione informações relevantes..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Reportar Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {posts.map((post) => {
          const statusInfo = getStatusInfo(post.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={post.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />

              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{post.campaign}</h3>
                      <Badge variant={statusInfo.variant} className={statusInfo.bg}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline">{post.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Marca: {post.brand} • {post.platform}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Prazo: {new Date(post.deadline).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {post.link ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={post.link} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Ver Post
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Reportar
                    </Button>
                  )}
                </div>

                {/* Metrics */}
                {post.status === "posted" && (
                  <div className="grid grid-cols-5 gap-6 pt-4 border-t border-border/30">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">Visualizações</span>
                      </div>
                      <p className="text-lg font-bold">
                        {(post.views / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">Curtidas</span>
                      </div>
                      <p className="text-lg font-bold">
                        {(post.likes / 1000).toFixed(1)}K
                      </p>
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
                      <p className="text-lg font-bold text-primary">
                        {post.engagement}%
                      </p>
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
