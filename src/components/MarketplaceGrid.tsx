import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Users, Palette, Check, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerArt from "@/assets/influencer-art.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";
import influencerGastro from "@/assets/influencer-gastro.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";
import influencerMusic from "@/assets/influencer-music.jpg";
import influencerGaming from "@/assets/influencer-gaming.jpg";
import influencerEducation from "@/assets/influencer-education.jpg";
import influencerEntrepreneur from "@/assets/influencer-entrepreneur.jpg";

type TalentType = "avatar" | "influencer" | "artist";

interface Talent {
  id: number;
  name: string;
  segment: string;
  followers: string;
  image: string;
  specialty: string;
  type: TalentType;
}

const talents: Talent[] = [
  // Avatares IA
  {
    id: 1,
    name: "Sophia AI",
    segment: "Tech & IA",
    followers: "2.5M",
    image: influencerTech,
    specialty: "Inovação Digital",
    type: "avatar"
  },
  {
    id: 2,
    name: "Max Power",
    segment: "Fitness",
    followers: "3.2M",
    image: influencerFitness,
    specialty: "Treino IA",
    type: "avatar"
  },
  {
    id: 3,
    name: "Luna Style",
    segment: "Moda",
    followers: "4.8M",
    image: influencerFashion,
    specialty: "Fashion Tech",
    type: "avatar"
  },
  {
    id: 4,
    name: "Alex Vision",
    segment: "Negócios",
    followers: "1.9M",
    image: influencerBusiness,
    specialty: "Startups IA",
    type: "avatar"
  },
  // Influenciadores Reais
  {
    id: 5,
    name: "Rafael Costa",
    segment: "Tecnologia",
    followers: "2.5M",
    image: influencerTech,
    specialty: "IA & Inovação",
    type: "influencer"
  },
  {
    id: 6,
    name: "Bruno Almeida",
    segment: "Fitness",
    followers: "3.2M",
    image: influencerFitness,
    specialty: "Treino Funcional",
    type: "influencer"
  },
  {
    id: 7,
    name: "Camila Rodrigues",
    segment: "Moda",
    followers: "4.8M",
    image: influencerFashion,
    specialty: "Streetwear",
    type: "influencer"
  },
  {
    id: 8,
    name: "João Silva",
    segment: "Negócios",
    followers: "1.9M",
    image: influencerBusiness,
    specialty: "Startups",
    type: "influencer"
  },
  // Artistas
  {
    id: 9,
    name: "Ana Beatriz",
    segment: "Arte Digital",
    followers: "2.1M",
    image: influencerArt,
    specialty: "NFT & Web3",
    type: "artist"
  },
  {
    id: 10,
    name: "Maria Santos",
    segment: "Bem-estar",
    followers: "3.5M",
    image: influencerWellness,
    specialty: "Mindfulness",
    type: "artist"
  },
  {
    id: 11,
    name: "Pedro Henrique",
    segment: "Gastronomia",
    followers: "2.8M",
    image: influencerGastro,
    specialty: "Alta Cozinha",
    type: "artist"
  },
  {
    id: 12,
    name: "Juliana Ferreira",
    segment: "Viagens",
    followers: "3.4M",
    image: influencerTravel,
    specialty: "Fotografia",
    type: "artist"
  },
];

const typeConfig = {
  avatar: {
    label: "Avatar IA",
    color: "hsl(var(--primary))",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30 hover:border-primary",
    icon: Bot,
    badgeClass: "bg-primary/20 text-primary border-primary/30"
  },
  influencer: {
    label: "Influenciador",
    color: "hsl(var(--secondary))",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30 hover:border-secondary",
    icon: Users,
    badgeClass: "bg-secondary/20 text-secondary border-secondary/30"
  },
  artist: {
    label: "Artista",
    color: "hsl(30, 100%, 60%)",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30 hover:border-orange-500",
    icon: Palette,
    badgeClass: "bg-orange-500/20 text-orange-500 border-orange-500/30"
  }
};

export const MarketplaceGrid = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<TalentType | "all">("all");
  const navigate = useNavigate();

  // Load selections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedTalents");
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        setSelectedIds(ids);
      } catch (e) {
        console.error("Failed to load selections", e);
      }
    }
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const newIds = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem("selectedTalents", JSON.stringify(newIds));
      
      // Also save full talent data
      const selectedTalents = talents.filter(t => newIds.includes(t.id));
      localStorage.setItem("selectedTalentsData", JSON.stringify(selectedTalents));
      
      return newIds;
    });
  };

  const handleCreateCampaign = () => {
    const selectedTalents = talents.filter(t => selectedIds.includes(t.id));
    if (selectedTalents.length === 0) {
      toast.error("Selecione pelo menos um talento");
      return;
    }
    
    localStorage.setItem("selectedTalentsData", JSON.stringify(selectedTalents));
    toast.success(`${selectedTalents.length} ${selectedTalents.length === 1 ? 'talento adicionado' : 'talentos adicionados'} ao painel`);
    navigate("/app/dashboard");
  };

  const filteredTalents = filterType === "all" 
    ? talents 
    : talents.filter(t => t.type === filterType);

  const TalentCard = ({ talent }: { talent: Talent }) => {
    const isSelected = selectedIds.includes(talent.id);
    const config = typeConfig[talent.type];
    const Icon = config.icon;
    
    return (
      <Card
        onClick={() => toggleSelection(talent.id)}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm bg-card/50 ${
          isSelected ? "ring-2 shadow-2xl scale-105" : ""
        } ${config.borderColor}`}
        style={{
          ...(isSelected && { borderColor: config.color })
        }}
      >
        <CardContent className="p-4 space-y-3">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={talent.image}
              alt={talent.name}
              className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Selected check */}
            {isSelected && (
              <div 
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center animate-scale-in shadow-lg"
                style={{ backgroundColor: config.color }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
            
            {/* Type badge */}
            <div className="absolute bottom-3 left-3">
              <Badge className={`${config.badgeClass} border flex items-center gap-1.5 px-2 py-1`}>
                <Icon className="w-3 h-3" />
                <span className="text-xs font-semibold">{config.label}</span>
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">{talent.name}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{talent.segment}</span>
              <span className="font-bold" style={{ color: config.color }}>{talent.followers}</span>
            </div>
            <p className="text-xs text-muted-foreground">{talent.specialty}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Marketplace Inteligente</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-orange-500 bg-clip-text text-transparent">
            Experimente criar com o coração
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conecte-se com avatares IA, influenciadores reais e artistas para suas campanhas
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className="gap-2"
          >
            Todos
          </Button>
          
          {(Object.entries(typeConfig) as [TalentType, typeof typeConfig.avatar][]).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className={`gap-2 ${filterType === type ? config.bgColor : ""}`}
                style={filterType === type ? { backgroundColor: config.color, color: 'white' } : {}}
              >
                <Icon className="w-4 h-4" />
                {config.label}s
              </Button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {filteredTalents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>

        {/* Selection summary */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
              <CardContent className="px-8 py-4 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{selectedIds.length}</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {selectedIds.length === 1 ? "talento selecionado" : "talentos selecionados"}
                  </p>
                </div>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={handleCreateCampaign}
                >
                  Adicionar ao Painel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};
