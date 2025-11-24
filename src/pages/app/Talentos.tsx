import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Bot, Users, Palette, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Talentos() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  
  const talents = [
    { id: "luna-ai", name: "Luna AI", category: "Fashion", followers: "500K", engagement: "8.5%", type: "avatar", verified: true },
    { id: "ana-silva", name: "Ana Silva", category: "Lifestyle", followers: "820K", engagement: "9.2%", type: "influencer", verified: true },
    { id: "pedro-costa", name: "Pedro Costa", category: "Tech", followers: "320K", engagement: "7.2%", type: "influencer", verified: false },
    { id: "sophia-digital", name: "Sophia Digital", category: "Beauty", followers: "650K", engagement: "10.1%", type: "avatar", verified: true },
    { id: "maria-santos", name: "Maria Santos", category: "Wellness", followers: "890K", engagement: "9.1%", type: "influencer", verified: true },
    { id: "carlos-mendes", name: "Carlos Mendes", category: "Arte Urbana", followers: "450K", engagement: "8.8%", type: "artist", verified: true },
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent mb-2">
          Talentos
        </h1>
        <p className="text-muted-foreground">Descubra e conecte com criadores e avatares IA</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map((talent, i) => {
          const typeInfo = getTypeInfo(talent.type);
          const TypeIcon = typeInfo.icon;
          return (
            <div key={i} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-30 blur transition duration-500 rounded-xl"
                style={{ backgroundImage: `linear-gradient(to right, hsl(var(--${typeInfo.badge})), hsl(var(--${typeInfo.badge})))` }} 
              />
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className={`bg-${typeInfo.badge}/10 border-${typeInfo.badge}/20`}>
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {talent.type === 'avatar' ? 'Avatar IA' : talent.type === 'influencer' ? 'Influencer' : 'Artista'}
                  </Badge>
                  {talent.verified && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${typeInfo.color} mb-4 mx-auto`} />
                
                <h3 className="text-lg font-semibold text-center mb-1">{talent.name}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{talent.category}</p>
                
                <div className="flex justify-between text-sm mb-4 p-3 bg-background/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-muted-foreground text-xs mb-1">Seguidores</div>
                    <div className="font-semibold">{talent.followers}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground text-xs mb-1">Engajamento</div>
                    <div className="font-semibold text-green-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {talent.engagement}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/app/talentos/${talent.id}`)}
                >
                  Ver Perfil
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
