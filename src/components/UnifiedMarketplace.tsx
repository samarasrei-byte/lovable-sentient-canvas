import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ShoppingBag, 
  Camera, 
  Star, 
  Palette, 
  Sparkles,
  Heart,
  Eye,
  ArrowRight
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

const categories = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "products", label: "Produtos", icon: ShoppingBag },
  { id: "photos", label: "Fotos Profissionais", icon: Camera },
  { id: "influencers", label: "Influenciadores", icon: Star },
  { id: "artists", label: "Artistas", icon: Palette },
  { id: "avatars", label: "Avatares", icon: Sparkles },
];

const marketplaceItems = [
  // Products
  {
    id: 1,
    type: "products",
    name: "Mockup Premium",
    category: "E-commerce",
    image: "/placeholder.svg",
    tags: ["Produto", "3D", "Clean"],
    price: "2 créditos",
    likes: 234,
    views: 1200,
  },
  {
    id: 2,
    type: "products",
    name: "Cenário Minimalista",
    category: "Lifestyle",
    image: "/placeholder.svg",
    tags: ["Minimalista", "Elegante"],
    price: "3 créditos",
    likes: 189,
    views: 890,
  },
  // Photos
  {
    id: 3,
    type: "photos",
    name: "Studio Fashion",
    category: "Moda",
    image: influencerFashion,
    tags: ["Fashion", "Studio", "Premium"],
    price: "4 créditos",
    likes: 456,
    views: 2300,
  },
  {
    id: 4,
    type: "photos",
    name: "Ambiente Fitness",
    category: "Fitness",
    image: influencerFitness,
    tags: ["Fitness", "Energia", "Saúde"],
    price: "3 créditos",
    likes: 312,
    views: 1800,
  },
  // Influencers
  {
    id: 5,
    type: "influencers",
    name: "Marina Costa",
    category: "Fashion & Lifestyle",
    image: influencerFashion,
    tags: ["Moda", "Lifestyle", "2M+"],
    price: "8 créditos",
    likes: 892,
    views: 5400,
    isReal: true,
  },
  {
    id: 6,
    type: "influencers",
    name: "Pedro Alves",
    category: "Tech & Games",
    image: influencerTech,
    tags: ["Tech", "Gaming", "1.5M+"],
    price: "7 créditos",
    likes: 654,
    views: 3200,
    isReal: true,
  },
  // Artists
  {
    id: 7,
    type: "artists",
    name: "Luna Digital",
    category: "Arte Digital",
    image: influencerArt,
    tags: ["IA", "Digital Art", "Único"],
    price: "5 créditos",
    likes: 567,
    views: 2900,
    isAI: true,
  },
  {
    id: 8,
    type: "artists",
    name: "Rafael Santos",
    category: "Música & Performance",
    image: influencerMusic,
    tags: ["Música", "Performance", "Criativo"],
    price: "6 créditos",
    likes: 423,
    views: 2100,
    isReal: true,
  },
  // Avatars
  {
    id: 9,
    type: "avatars",
    name: "Avatar Corporativo",
    category: "Business",
    image: "/placeholder.svg",
    tags: ["Corporativo", "Profissional"],
    price: "4 créditos",
    likes: 345,
    views: 1600,
    isAI: true,
  },
  {
    id: 10,
    type: "avatars",
    name: "Apresentador Virtual",
    category: "Vídeo",
    image: "/placeholder.svg",
    tags: ["Vídeo", "Apresentação", "IA"],
    price: "5 créditos",
    likes: 278,
    views: 1400,
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
    <section id="marketplace" className="py-20 px-4 md:px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 border-primary/30 text-primary">
            <Sparkles className="w-3 h-3 mr-2" />
            Marketplace Unificado
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Explore e crie com <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">templates incríveis</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Produtos, fotos profissionais, influenciadores, artistas e avatares — tudo organizado para você criar.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar templates, influenciadores, artistas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 rounded-full bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 gap-2"
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.isReal && (
                          <Badge className="bg-success/90 text-success-foreground text-xs">
                            Real
                          </Badge>
                        )}
                        {item.isAI && (
                          <Badge className="bg-primary/90 text-primary-foreground text-xs">
                            IA
                          </Badge>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-3 text-white text-xs">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {item.views}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.price}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button 
                        className="w-full group/btn" 
                        size="sm"
                        onClick={() => navigate("/login")}
                      >
                        Criar com este template
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8"
            onClick={() => navigate("/login")}
          >
            Ver todos os templates
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
