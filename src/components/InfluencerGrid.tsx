import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

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

const influencers = [
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
    specialty: "Treinamento Pessoal",
  },
  {
    id: 3,
    name: "Camila Rodrigues",
    segment: "Moda",
    followers: "4,8M",
    image: influencerFashion,
    specialty: "Alta Costura",
  },
  {
    id: 4,
    name: "João Silva",
    segment: "Negócios",
    followers: "1,9M",
    image: influencerBusiness,
    specialty: "Liderança",
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
  const [selectedInfluencers, setSelectedInfluencers] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedInfluencers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha seu{" "}
            <span className="text-primary">Influenciador</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Rostos reais. Histórias autênticas. Conexões verdadeiras.
          </p>
        </div>

        {/* Influencer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {influencers.map((influencer, index) => (
            <Card
              key={influencer.id}
              className="relative overflow-hidden bg-card/30 backdrop-blur-xl border-primary/20 p-6 hover:scale-105 transition-all duration-500 cursor-pointer group"
              onClick={() => toggleSelection(influencer.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Selection Indicator */}
              {selectedInfluencers.includes(influencer.id) && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10 animate-scale-in">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden">
                <img
                  src={influencer.image}
                  alt={influencer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Segment Badge */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-sm font-medium bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full">
                    {influencer.segment}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-xl truncate">{influencer.name}</h3>
                <p className="text-sm text-muted-foreground">{influencer.specialty}</p>
                <p className="text-sm font-medium text-secondary">{influencer.followers} seguidores</p>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedInfluencers.length > 0 && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <p className="text-muted-foreground">
              {selectedInfluencers.length} influenciador
              {selectedInfluencers.length > 1 ? "es" : ""} selecionado
              {selectedInfluencers.length > 1 ? "s" : ""}
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform px-10"
            >
              Criar Campanha com Selecionados
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
