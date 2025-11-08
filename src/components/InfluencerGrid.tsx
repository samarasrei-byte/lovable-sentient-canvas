import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, Check } from "lucide-react";

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

const realInfluencers = [
  {
    id: 1,
    name: "Rafael Costa",
    segment: "Tecnologia",
    followers: "2,5M",
    image: influencerTech,
    specialty: "IA & Inovação",
  },
  {
    id: 2,
    name: "Bruno Almeida",
    segment: "Fitness",
    followers: "3,2M",
    image: influencerFitness,
    specialty: "Treino Funcional",
  },
  {
    id: 3,
    name: "Camila Rodrigues",
    segment: "Moda",
    followers: "4,8M",
    image: influencerFashion,
    specialty: "Streetwear",
  },
  {
    id: 4,
    name: "João Silva",
    segment: "Negócios",
    followers: "1,9M",
    image: influencerBusiness,
    specialty: "Startups",
  },
  {
    id: 5,
    name: "Ana Beatriz",
    segment: "Arte",
    followers: "2,1M",
    image: influencerArt,
    specialty: "Arte Digital",
  },
  {
    id: 6,
    name: "Maria Santos",
    segment: "Bem-estar",
    followers: "3,5M",
    image: influencerWellness,
    specialty: "Mindfulness",
  },
];

const avatarInfluencers = [
  {
    id: 7,
    name: "Pedro Henrique",
    segment: "Gastronomia",
    followers: "2,8M",
    image: influencerGastro,
    specialty: "Culinária Brasileira",
  },
  {
    id: 8,
    name: "Juliana Ferreira",
    segment: "Viagens",
    followers: "3,4M",
    image: influencerTravel,
    specialty: "Turismo Aventura",
  },
  {
    id: 9,
    name: "Lucas Oliveira",
    segment: "Música",
    followers: "5,2M",
    image: influencerMusic,
    specialty: "Produção Musical",
  },
  {
    id: 10,
    name: "Gabriela Lima",
    segment: "Gaming",
    followers: "4,1M",
    image: influencerGaming,
    specialty: "E-sports",
  },
  {
    id: 11,
    name: "Carlos Eduardo",
    segment: "Educação",
    followers: "1,7M",
    image: influencerEducation,
    specialty: "Ensino Digital",
  },
  {
    id: 12,
    name: "Fernanda Mendes",
    segment: "Empreendedorismo",
    followers: "2,3M",
    image: influencerEntrepreneur,
    specialty: "Startups",
  },
];

export const InfluencerGrid = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const InfluencerCard = ({ influencer, isAvatar }: { influencer: typeof realInfluencers[0], isAvatar: boolean }) => {
    const isSelected = selectedIds.includes(influencer.id);
    
    return (
      <Card
        onClick={() => toggleSelection(influencer.id)}
        className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
          isSelected ? "ring-2 ring-primary shadow-xl" : ""
        } ${isAvatar ? "border-secondary/30 hover:border-secondary" : "border-primary/30 hover:border-primary"}`}
      >
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <img
              src={influencer.image}
              alt={influencer.name}
              className="w-full aspect-square object-cover rounded-2xl"
            />
            {isSelected && (
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                <Check className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <Badge className={isAvatar ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}>
                {isAvatar ? <Bot className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                {isAvatar ? "Avatar Digital" : "Influenciador Real"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{influencer.name}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{influencer.segment}</span>
              <span className="font-semibold">{influencer.followers}</span>
            </div>
            <p className="text-xs text-muted-foreground">{influencer.specialty}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Experimente criar com o coração
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha entre influenciadores reais e avatares digitais para suas campanhas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Influenciadores Reais */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Influenciadores Reais</h3>
                <p className="text-sm text-muted-foreground">Criadores autênticos com comunidades estabelecidas</p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {realInfluencers.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} isAvatar={false} />
              ))}
            </div>
          </div>

          {/* Avatares Digitais */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Avatares Digitais</h3>
                <p className="text-sm text-muted-foreground">Influencers virtuais personalizáveis com IA</p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {avatarInfluencers.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} isAvatar={true} />
              ))}
            </div>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <CardContent className="p-6">
                <p className="text-lg font-semibold">
                  {selectedIds.length} {selectedIds.length === 1 ? "influenciador selecionado" : "influenciadores selecionados"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};
