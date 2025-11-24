import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, Palette } from "lucide-react";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";

type FilterType = "todos" | "avatar-ia" | "influenciadores" | "artistas";

interface TalentCard {
  id: string;
  name: string;
  type: FilterType;
  category: string;
  image: string;
  followers?: string;
  engagement?: string;
}

const talents: TalentCard[] = [
  // Avatares IA
  {
    id: "1",
    name: "Maya Tech",
    type: "avatar-ia",
    category: "Tecnologia",
    image: influencerTech,
  },
  {
    id: "2",
    name: "Carlos Fitness",
    type: "avatar-ia",
    category: "Fitness",
    image: influencerFitness,
  },
  {
    id: "3",
    name: "Sofia Style",
    type: "avatar-ia",
    category: "Moda",
    image: influencerFashion,
  },
  {
    id: "4",
    name: "Ricardo Business",
    type: "avatar-ia",
    category: "Negócios",
    image: influencerBusiness,
  },
  // Influenciadores Reais
  {
    id: "5",
    name: "Ana Silva",
    type: "influenciadores",
    category: "Lifestyle",
    image: influencerFashion,
    followers: "250K",
    engagement: "8.5%",
  },
  {
    id: "6",
    name: "Pedro Santos",
    type: "influenciadores",
    category: "Fitness",
    image: influencerFitness,
    followers: "180K",
    engagement: "9.2%",
  },
  {
    id: "7",
    name: "Julia Costa",
    type: "influenciadores",
    category: "Tecnologia",
    image: influencerTech,
    followers: "320K",
    engagement: "7.8%",
  },
  {
    id: "8",
    name: "Lucas Oliveira",
    type: "influenciadores",
    category: "Empreendedorismo",
    image: influencerBusiness,
    followers: "450K",
    engagement: "6.5%",
  },
  // Artistas
  {
    id: "9",
    name: "Beatriz Almeida",
    type: "artistas",
    category: "Arte Digital",
    image: influencerFashion,
  },
  {
    id: "10",
    name: "Rafael Mendes",
    type: "artistas",
    category: "Motion Design",
    image: influencerTech,
  },
  {
    id: "11",
    name: "Camila Rocha",
    type: "artistas",
    category: "Ilustração",
    image: influencerBusiness,
  },
  {
    id: "12",
    name: "Thiago Ferreira",
    type: "artistas",
    category: "3D Artist",
    image: influencerFitness,
  },
];

export const MarketplaceExplorer = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");

  const filteredTalents = talents.filter(
    (talent) => activeFilter === "todos" || talent.type === activeFilter
  );

  const filters = [
    { id: "todos" as FilterType, label: "Todos", icon: null },
    { id: "avatar-ia" as FilterType, label: "Avatar IAs", icon: Bot },
    { id: "influenciadores" as FilterType, label: "Influenciadores", icon: Users },
    { id: "artistas" as FilterType, label: "Artistas", icon: Palette },
  ];

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="container mx-auto relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <Badge 
            variant="outline" 
            className="px-6 py-2 text-sm font-medium border-primary/30 bg-primary/5"
          >
            🔮 Marketplace Inteligente
          </Badge>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
          Experimente criar com o coração
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Conecte-se com avatares IA, influenciadores reais e artistas para suas campanhas
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant={isActive ? "default" : "outline"}
                className={`
                  px-6 py-3 rounded-full transition-all duration-300
                  ${isActive 
                    ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30" 
                    : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  }
                `}
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Talent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredTalents.map((talent) => {
            const getBadgeContent = () => {
              if (talent.type === "avatar-ia") {
                return { icon: Bot, label: "Avatar IA", color: "bg-secondary/90" };
              } else if (talent.type === "influenciadores") {
                return { icon: Users, label: "Influenciador", color: "bg-primary/90" };
              } else {
                return { icon: Palette, label: "Artista", color: "bg-orange-500/90" };
              }
            };

            const badge = getBadgeContent();
            const BadgeIcon = badge.icon;

            return (
              <Card
                key={talent.id}
                className="group relative overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 animate-fade-in"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${badge.color} backdrop-blur-sm`}>
                      <BadgeIcon className="w-3 h-3 mr-1" />
                      {badge.label}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <h3 className="text-xl font-bold mb-2">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{talent.category}</p>
                  
                  {talent.followers && (
                    <div className="flex gap-4 mb-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Seguidores:</span>
                        <span className="ml-1 font-semibold">{talent.followers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="ml-1 font-semibold">{talent.engagement}</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  >
                    Ver Perfil
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};