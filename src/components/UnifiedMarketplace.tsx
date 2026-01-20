import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Star, 
  Palette, 
  Sparkles,
  Heart,
  Eye,
  ArrowRight,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import influencer images
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";
import influencerArt from "@/assets/influencer-art.jpg";
import influencerMusic from "@/assets/influencer-music.jpg";
import influencerGaming from "@/assets/influencer-gaming.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";

const categories = [
  { id: "all", label: "Todos", icon: Users },
  { id: "influencers", label: "Influenciadores", icon: Star },
  { id: "artists", label: "Artistas", icon: Palette },
  { id: "avatars", label: "Avatares", icon: Sparkles },
];

const marketplaceItems = [
  // Influencers
  {
    id: 1,
    type: "influencers",
    name: "Marina Costa",
    category: "Fashion & Lifestyle",
    image: influencerFashion,
    tags: ["Moda", "Lifestyle", "2M+"],
    followers: "2.3M",
    engagement: "4.8%",
    likes: 892,
    views: 5400,
    isReal: true,
  },
  {
    id: 2,
    type: "influencers",
    name: "Pedro Alves",
    category: "Tech & Games",
    image: influencerTech,
    tags: ["Tech", "Gaming", "1.5M+"],
    followers: "1.5M",
    engagement: "5.2%",
    likes: 654,
    views: 3200,
    isReal: true,
  },
  {
    id: 3,
    type: "influencers",
    name: "Julia Fernandes",
    category: "Fitness & Saúde",
    image: influencerFitness,
    tags: ["Fitness", "Wellness", "800K+"],
    followers: "890K",
    engagement: "6.1%",
    likes: 723,
    views: 4100,
    isReal: true,
  },
  {
    id: 4,
    type: "influencers",
    name: "Lucas Vieira",
    category: "Viagem & Aventura",
    image: influencerTravel,
    tags: ["Travel", "Adventure", "1.2M+"],
    followers: "1.2M",
    engagement: "4.5%",
    likes: 567,
    views: 2800,
    isReal: true,
  },
  // Artists
  {
    id: 5,
    type: "artists",
    name: "Luna Digital",
    category: "Arte Digital",
    image: influencerArt,
    tags: ["IA", "Digital Art", "Único"],
    followers: "450K",
    engagement: "7.2%",
    likes: 567,
    views: 2900,
    isAI: true,
  },
  {
    id: 6,
    type: "artists",
    name: "Rafael Santos",
    category: "Música & Performance",
    image: influencerMusic,
    tags: ["Música", "Performance", "Criativo"],
    followers: "320K",
    engagement: "8.1%",
    likes: 423,
    views: 2100,
    isReal: true,
  },
  {
    id: 7,
    type: "artists",
    name: "Maya Virtual",
    category: "3D Art & Motion",
    image: influencerWellness,
    tags: ["3D", "Motion", "NFT"],
    followers: "280K",
    engagement: "6.8%",
    likes: 389,
    views: 1800,
    isAI: true,
  },
  // Avatars
  {
    id: 8,
    type: "avatars",
    name: "Alex Corporate",
    category: "Apresentador Virtual",
    image: influencerGaming,
    tags: ["Corporativo", "Vídeos", "IA"],
    followers: "150K",
    engagement: "5.5%",
    likes: 345,
    views: 1600,
    isAI: true,
  },
  {
    id: 9,
    type: "avatars",
    name: "Sofia Tech",
    category: "Tech Influencer Virtual",
    image: influencerTech,
    tags: ["Tech", "Reviews", "IA"],
    followers: "200K",
    engagement: "6.3%",
    likes: 412,
    views: 2000,
    isAI: true,
  },
  {
    id: 10,
    type: "avatars",
    name: "Marcus Fitness",
    category: "Personal Virtual",
    image: influencerFitness,
    tags: ["Fitness", "Treinos", "IA"],
    followers: "180K",
    engagement: "7.0%",
    likes: 378,
    views: 1900,
    isAI: true,
  },
];

export const UnifiedMarketplace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesCategory = activeTab === "all" || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="marketplace" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 border-primary/30 text-primary">
            <Users className="w-3 h-3 mr-2" />
            Marketplace de Talentos
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Encontre o talento perfeito
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Influenciadores, artistas e avatares — conecte sua marca com os melhores criadores.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar talentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-5 rounded-full bg-card/50 border-border/50 focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center gap-2 bg-transparent h-auto mb-8">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 gap-2 text-sm"
              >
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badge */}
                      <div className="absolute top-2 left-2">
                        {item.isReal && (
                          <Badge className="bg-success/90 text-success-foreground text-[10px] px-2 py-0.5">
                            Real
                          </Badge>
                        )}
                        {item.isAI && (
                          <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5">
                            IA
                          </Badge>
                        )}
                      </div>

                      {/* Stats on Hover */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 text-white text-[10px]">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {item.views}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3">
                      <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mb-2">{item.category}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                        <span>{item.followers} seguidores</span>
                        <span className="text-success">{item.engagement} eng.</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button 
            size="lg" 
            className="rounded-full px-8 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
            onClick={() => navigate("/login")}
          >
            Ver todos os talentos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
