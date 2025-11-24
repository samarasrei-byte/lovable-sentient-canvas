import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bot, Users, Palette, Star, TrendingUp, Eye, Heart, MessageCircle, Instagram, Youtube, ArrowUpRight, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerArt from "@/assets/influencer-art.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";

export default function TalentosAprimorado() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  
  const talents = [
    { 
      id: "rafael-costa",
      name: "Rafael Costa",
      category: "Tecnologia & IA", 
      followers: "2.5M", 
      engagement: "12.4%", 
      type: "influencer", 
      verified: true,
      image: influencerTech,
      growth: "+240%",
      reelsViews: "850K",
      storiesViews: "320K",
      avgLikes: "105K",
      avgComments: "3.2K",
      platforms: ["instagram", "youtube", "tiktok"],
      reachLast30: "12.5M"
    },
    { 
      id: "camila-rodrigues",
      name: "Camila Rodrigues",
      category: "Moda & Lifestyle", 
      followers: "4.8M", 
      engagement: "15.2%", 
      type: "influencer", 
      verified: true,
      image: influencerFashion,
      growth: "+180%",
      reelsViews: "1.2M",
      storiesViews: "580K",
      avgLikes: "230K",
      avgComments: "5.8K",
      platforms: ["instagram", "tiktok"],
      reachLast30: "18.2M"
    },
    { 
      id: "bruno-almeida",
      name: "Bruno Almeida",
      category: "Fitness & Saúde", 
      followers: "3.2M", 
      engagement: "10.8%", 
      type: "influencer", 
      verified: true,
      image: influencerFitness,
      growth: "+150%",
      reelsViews: "920K",
      storiesViews: "410K",
      avgLikes: "156K",
      avgComments: "4.1K",
      platforms: ["instagram", "youtube"],
      reachLast30: "15.8M"
    },
    { 
      id: "joao-silva",
      name: "João Silva",
      category: "Negócios & Startups", 
      followers: "1.9M", 
      engagement: "9.5%", 
      type: "influencer", 
      verified: true,
      image: influencerBusiness,
      growth: "+120%",
      reelsViews: "680K",
      storiesViews: "290K",
      avgLikes: "89K",
      avgComments: "2.5K",
      platforms: ["instagram", "youtube"],
      reachLast30: "8.9M"
    },
    { 
      id: "ana-beatriz",
      name: "Ana Beatriz",
      category: "Arte Digital & NFT", 
      followers: "2.1M", 
      engagement: "14.2%", 
      type: "artist", 
      verified: true,
      image: influencerArt,
      growth: "+200%",
      reelsViews: "750K",
      storiesViews: "350K",
      avgLikes: "128K",
      avgComments: "3.8K",
      platforms: ["instagram", "tiktok"],
      reachLast30: "11.2M"
    },
    { 
      id: "maria-santos",
      name: "Maria Santos",
      category: "Bem-estar & Mindfulness", 
      followers: "3.5M", 
      engagement: "11.8%", 
      type: "influencer", 
      verified: true,
      image: influencerWellness,
      growth: "+165%",
      reelsViews: "890K",
      storiesViews: "420K",
      avgLikes: "178K",
      avgComments: "4.6K",
      platforms: ["instagram", "youtube"],
      reachLast30: "16.5M"
    }
  ];

  const filteredTalents = filter === "all" ? talents : talents.filter(t => t.type === filter);

  const getTypeInfo = (type: string) => {
    switch(type) {
      case 'avatar': return { icon: Bot, color: 'from-primary to-primary/70', badge: 'primary' };
      case 'influencer': return { icon: Users, color: 'from-secondary to-secondary/70', badge: 'secondary' };
      case 'artist': return { icon: Palette, color: 'from-artist to-artist/70', badge: 'artist' };
      default: return { icon: Users, color: 'from-primary to-primary/70', badge: 'primary' };
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'tiktok': return Video;
      default: return Instagram;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent mb-2">
          Talentos
        </h1>
        <p className="text-muted-foreground">Descubra e conecte com criadores e avatares IA com métricas avançadas</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input className="pl-10 bg-card/50 border-border/50" placeholder="Buscar talentos..." />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-primary to-secondary" : ""}
          >
            Todos
          </Button>
          <Button
            variant={filter === "avatar" ? "default" : "outline"}
            onClick={() => setFilter("avatar")}
            className={filter === "avatar" ? "bg-primary" : ""}
          >
            <Bot className="w-4 h-4 mr-2" />
            Avatares
          </Button>
          <Button
            variant={filter === "influencer" ? "default" : "outline"}
            onClick={() => setFilter("influencer")}
            className={filter === "influencer" ? "bg-secondary" : ""}
          >
            <Users className="w-4 h-4 mr-2" />
            Influencers
          </Button>
          <Button
            variant={filter === "artist" ? "default" : "outline"}
            onClick={() => setFilter("artist")}
            className={filter === "artist" ? "bg-artist" : ""}
          >
            <Palette className="w-4 h-4 mr-2" />
            Artistas
          </Button>
        </div>
      </div>

      {/* Talents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTalents.map((talent, i) => {
          const typeInfo = getTypeInfo(talent.type);
          const TypeIcon = typeInfo.icon;
          return (
            <div key={i} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${typeInfo.color} opacity-0 group-hover:opacity-30 blur transition duration-500 rounded-2xl`} />
              
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex gap-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <img 
                      src={talent.image} 
                      alt={talent.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                    {talent.verified && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-br from-primary to-secondary rounded-full p-1.5">
                        <Star className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold">{talent.name}</h3>
                          <Badge variant="outline" className={`bg-${typeInfo.badge}/10 border-${typeInfo.badge}/20`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {talent.type === 'avatar' ? 'Avatar IA' : talent.type === 'influencer' ? 'Influencer' : 'Artista'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{talent.category}</p>
                        
                        {/* Platforms */}
                        <div className="flex items-center gap-2">
                          {talent.platforms.map((platform, j) => {
                            const Icon = getPlatformIcon(platform);
                            return (
                              <div key={j} className="p-1.5 rounded bg-muted/50">
                                <Icon className="w-4 h-4" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <Button onClick={() => navigate(`/app/talentos/${talent.id}`)}>Ver Perfil</Button>
                    </div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Seguidores</p>
                        <p className="text-lg font-bold">{talent.followers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Engajamento</p>
                        <p className="text-lg font-bold text-primary">{talent.engagement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          Crescimento <TrendingUp className="w-3 h-3" />
                        </p>
                        <p className="text-lg font-bold text-green-500">{talent.growth}</p>
                      </div>
                    </div>

                    {/* Advanced Metrics */}
                    <div className="pt-4 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-3 font-semibold">Métricas Detalhadas</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Média Reels
                          </span>
                          <span className="font-semibold">{talent.reelsViews}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Média Stories
                          </span>
                          <span className="font-semibold">{talent.storiesViews}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5" /> Média Likes
                          </span>
                          <span className="font-semibold">{talent.avgLikes}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5" /> Média Coments
                          </span>
                          <span className="font-semibold">{talent.avgComments}</span>
                        </div>
                        <div className="flex items-center justify-between col-span-2">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Alcance 30 dias
                          </span>
                          <span className="font-semibold text-primary">{talent.reachLast30}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
