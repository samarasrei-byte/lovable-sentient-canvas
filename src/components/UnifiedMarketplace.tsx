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
  TrendingUp,
  CheckCircle2
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
    name: "Juliana Fernandes",
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
  {
    id: 11,
    type: "influencers",
    name: "Carolina Mendes",
    category: "Gastronomia",
    image: influencerGastro,
    tags: ["Food", "Receitas", "950K+"],
    followers: "950K",
    engagement: "7.3%",
    likes: 834,
    views: 4800,
    isReal: true,
  },
  {
    id: 12,
    type: "influencers",
    name: "Thiago Santos",
    category: "Educação & Cursos",
    image: influencerEducation,
    tags: ["Educação", "Cursos", "680K+"],
    followers: "680K",
    engagement: "8.9%",
    likes: 912,
    views: 5200,
    isReal: true,
  },
  {
    id: 13,
    type: "influencers",
    name: "Amanda Ribeiro",
    category: "Negócios & Empreendedorismo",
    image: influencerBusiness,
    tags: ["Business", "Finanças", "1.8M+"],
    followers: "1.8M",
    engagement: "5.4%",
    likes: 1023,
    views: 6100,
    isReal: true,
  },
  {
    id: 14,
    type: "influencers",
    name: "Felipe Oliveira",
    category: "Lifestyle & Bem-estar",
    image: influencerEntrepreneur,
    tags: ["Lifestyle", "Wellness", "720K+"],
    followers: "720K",
    engagement: "6.7%",
    likes: 645,
    views: 3400,
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

const stats = [
  { value: "500+", label: "Marcas Ativas", icon: CheckCircle2 },
  { value: "2M+", label: "Campanhas Geradas", icon: TrendingUp },
  { value: "98%", label: "Satisfação", icon: Star },
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
      {/* Ultra-modern background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Marketplace de Talentos</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Encontre o talento
            </span>{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              perfeito
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light mb-8">
            Influenciadores, artistas e avatares — conecte sua marca com os melhores criadores.
          </p>

          {/* Stats Bar - Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search - Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-lg mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar talentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 py-6 rounded-full bg-white/5 backdrop-blur-xl border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all text-base"
            />
          </div>
        </motion.div>

        {/* Category Tabs - Glassmorphism */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center gap-2 bg-transparent h-auto mb-10 flex-wrap">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-white/15 data-[state=active]:backdrop-blur-xl data-[state=active]:border-primary/30 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 gap-2 text-sm transition-all hover:bg-white/10"
              >
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <GlassCard className="group overflow-hidden cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badge - DARKER for visibility */}
                      <div className="absolute top-3 left-3">
                        {item.isReal && (
                          <Badge className="bg-emerald-600 text-white text-[10px] px-2.5 py-1 font-bold shadow-lg border-0">
                            REAL
                          </Badge>
                        )}
                        {item.isAI && (
                          <Badge className="bg-violet-600 text-white text-[10px] px-2.5 py-1 font-bold shadow-lg border-0">
                            IA
                          </Badge>
                        )}
                      </div>

                      {/* Stats on Hover */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-3 text-white text-xs">
                          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Heart className="w-3 h-3" /> {item.likes}
                          </span>
                          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Eye className="w-3 h-3" /> {item.views}
                          </span>
                        </div>
                      </div>
                    </div>

                    <GlassCardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mb-3">{item.category}</p>
                      
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                        <span className="font-medium">{item.followers} seguidores</span>
                        <span className="text-success font-semibold">{item.engagement} eng.</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <GlassButton 
            variant="glow"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Ver todos os talentos
            <ArrowRight className="w-5 h-5 ml-2" />
          </GlassButton>
        </motion.div>
      </div>
    </section>
  );
};
