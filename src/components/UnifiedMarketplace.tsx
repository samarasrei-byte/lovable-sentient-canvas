import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { 
  Search, 
  Star, 
  Palette, 
  Sparkles,
  Heart,
  Eye,
  ArrowRight,
  Users,
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
import influencerGastro from "@/assets/influencer-gastro.jpg";
import influencerEducation from "@/assets/influencer-education.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerEntrepreneur from "@/assets/influencer-entrepreneur.jpg";

const categories = [
  { id: "all", label: "Todos", icon: Users },
  { id: "influencers", label: "Influenciadores", icon: Star },
  { id: "artists", label: "Artistas", icon: Palette },
  { id: "avatars", label: "Avatares", icon: Sparkles },
];

const marketplaceItems = [
  // Real Influencers
  {
    id: 1,
    type: "influencers",
    name: "Marina Costa",
    category: "Fashion & Lifestyle",
    image: influencerFashion,
    tags: ["Moda", "Lifestyle"],
    followers: "2.3M",
    engagement: "4.8%",
    isReal: true,
  },
  {
    id: 2,
    type: "influencers",
    name: "Pedro Alves",
    category: "Tech & Games",
    image: influencerTech,
    tags: ["Tech", "Gaming"],
    followers: "1.5M",
    engagement: "5.2%",
    isReal: true,
  },
  {
    id: 3,
    type: "influencers",
    name: "Juliana Fernandes",
    category: "Fitness & Saúde",
    image: influencerFitness,
    tags: ["Fitness", "Wellness"],
    followers: "890K",
    engagement: "6.1%",
    isReal: true,
  },
  {
    id: 4,
    type: "influencers",
    name: "Lucas Vieira",
    category: "Viagem & Aventura",
    image: influencerTravel,
    tags: ["Travel", "Adventure"],
    followers: "1.2M",
    engagement: "4.5%",
    isReal: true,
  },
  {
    id: 11,
    type: "influencers",
    name: "Carolina Mendes",
    category: "Gastronomia",
    image: influencerGastro,
    tags: ["Food", "Receitas"],
    followers: "950K",
    engagement: "7.3%",
    isReal: true,
  },
  {
    id: 12,
    type: "influencers",
    name: "Thiago Santos",
    category: "Educação & Cursos",
    image: influencerEducation,
    tags: ["Educação", "Cursos"],
    followers: "680K",
    engagement: "8.9%",
    isReal: true,
  },
  {
    id: 13,
    type: "influencers",
    name: "Amanda Ribeiro",
    category: "Negócios",
    image: influencerBusiness,
    tags: ["Business", "Finanças"],
    followers: "1.8M",
    engagement: "5.4%",
    isReal: true,
  },
  {
    id: 14,
    type: "influencers",
    name: "Felipe Oliveira",
    category: "Lifestyle",
    image: influencerEntrepreneur,
    tags: ["Lifestyle", "Wellness"],
    followers: "720K",
    engagement: "6.7%",
    isReal: true,
  },
  // Artists
  {
    id: 5,
    type: "artists",
    name: "Luna Digital",
    category: "Arte Digital",
    image: influencerArt,
    tags: ["IA", "Digital Art"],
    followers: "450K",
    engagement: "7.2%",
    isAI: true,
  },
  {
    id: 6,
    type: "artists",
    name: "Rafael Santos",
    category: "Música",
    image: influencerMusic,
    tags: ["Música", "Performance"],
    followers: "320K",
    engagement: "8.1%",
    isReal: true,
  },
  {
    id: 7,
    type: "artists",
    name: "Maya Virtual",
    category: "3D Art",
    image: influencerWellness,
    tags: ["3D", "Motion"],
    followers: "280K",
    engagement: "6.8%",
    isAI: true,
  },
  // Avatars
  {
    id: 8,
    type: "avatars",
    name: "Alex Corporate",
    category: "Apresentador Virtual",
    image: influencerGaming,
    tags: ["Corporativo", "IA"],
    followers: "150K",
    engagement: "5.5%",
    isAI: true,
  },
  {
    id: 9,
    type: "avatars",
    name: "Sofia Tech",
    category: "Tech Virtual",
    image: influencerTech,
    tags: ["Tech", "IA"],
    followers: "200K",
    engagement: "6.3%",
    isAI: true,
  },
  {
    id: 10,
    type: "avatars",
    name: "Marcus Fitness",
    category: "Personal Virtual",
    image: influencerFitness,
    tags: ["Fitness", "IA"],
    followers: "180K",
    engagement: "7.0%",
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
    <section id="marketplace" className="relative py-24 px-6 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            Encontre o talento perfeito
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            Influenciadores, artistas e avatares IA em um só lugar
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar talentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 py-5 rounded-lg bg-white/[0.03] border-white/[0.08] focus:border-primary/30 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center gap-2 bg-transparent h-auto mb-10 flex-wrap">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-white/[0.06] data-[state=active]:border-primary/20 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2 gap-2 text-sm transition-all hover:bg-white/[0.04]"
              >
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <GlassCard className="group overflow-hidden cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        {item.isReal && (
                          <Badge className="bg-emerald-500/90 text-white text-[10px] px-2 py-0.5 font-medium border-0">
                            REAL
                          </Badge>
                        )}
                        {item.isAI && (
                          <Badge className="bg-violet-500/90 text-white text-[10px] px-2 py-0.5 font-medium border-0">
                            IA
                          </Badge>
                        )}
                      </div>
                    </div>

                    <GlassCardContent className="p-4">
                      <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mb-3">{item.category}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.followers}</span>
                        <span className="text-primary">{item.engagement}</span>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-12"
        >
          <GlassButton 
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Ver todos os talentos
            <ArrowRight className="w-4 h-4 ml-2" />
          </GlassButton>
        </motion.div>
      </div>
    </section>
  );
};
