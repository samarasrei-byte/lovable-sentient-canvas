import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Star, Users, Crown, TrendingUp, Heart, Sparkles, Bot, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { toast } from "sonner";

import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";
import influencerMusic from "@/assets/influencer-music.jpg";
import influencerGaming from "@/assets/influencer-gaming.jpg";
import influencerArt from "@/assets/influencer-art.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerEducation from "@/assets/influencer-education.jpg";
import influencerEntrepreneur from "@/assets/influencer-entrepreneur.jpg";
import influencerGastro from "@/assets/influencer-gastro.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";

type TalentType = "influencer" | "artist" | "avatar";

interface Talent {
  id: number;
  name: string;
  category: string;
  image: string;
  followers: string;
  engagement: string;
  verified: boolean;
  type: TalentType;
  price?: string;
}

const talents: Talent[] = [
  // Influenciadores Reais
  { id: 1, name: "@marina.style", category: "Fashion & Lifestyle", image: influencerFashion, followers: "2.3M", engagement: "8.2%", verified: true, type: "influencer", price: "R$ 2.500" },
  { id: 2, name: "@tech.lucas", category: "Tech & Games", image: influencerTech, followers: "1.5M", engagement: "6.8%", verified: true, type: "influencer", price: "R$ 1.800" },
  { id: 3, name: "@fit.juliana", category: "Fitness & Saúde", image: influencerFitness, followers: "890K", engagement: "9.1%", verified: true, type: "influencer", price: "R$ 1.200" },
  { id: 4, name: "@travel.vieira", category: "Viagem", image: influencerTravel, followers: "1.2M", engagement: "7.5%", verified: true, type: "influencer", price: "R$ 1.500" },
  { id: 6, name: "@gamer.alex", category: "Gaming", image: influencerGaming, followers: "980K", engagement: "11.2%", verified: true, type: "influencer", price: "R$ 1.400" },
  { id: 8, name: "@ceo.mindset", category: "Business", image: influencerBusiness, followers: "780K", engagement: "5.8%", verified: true, type: "influencer", price: "R$ 2.000" },
  { id: 9, name: "@prof.digital", category: "Educação", image: influencerEducation, followers: "650K", engagement: "8.9%", verified: true, type: "influencer", price: "R$ 900" },
  { id: 10, name: "@startup.life", category: "Empreendedorismo", image: influencerEntrepreneur, followers: "1.1M", engagement: "7.2%", verified: true, type: "influencer", price: "R$ 1.600" },
  // Artistas
  { id: 5, name: "@sound.rafael", category: "Música", image: influencerMusic, followers: "320K", engagement: "12.3%", verified: true, type: "artist", price: "R$ 3.000" },
  { id: 7, name: "@art.designer", category: "Arte & Design", image: influencerArt, followers: "450K", engagement: "14.5%", verified: true, type: "artist", price: "R$ 2.800" },
  { id: 11, name: "@chef.sabores", category: "Gastronomia", image: influencerGastro, followers: "520K", engagement: "10.4%", verified: false, type: "artist", price: "R$ 1.500" },
  { id: 12, name: "@wellness.zen", category: "Bem-estar", image: influencerWellness, followers: "380K", engagement: "15.1%", verified: true, type: "artist", price: "R$ 1.800" },
  // Avatares IA
  { id: 13, name: "AVA Corporate", category: "Corporativo", image: influencerBusiness, followers: "∞", engagement: "24/7", verified: true, type: "avatar", price: "R$ 499/mês" },
  { id: 14, name: "LUNA Wellness", category: "Saúde & Bem-estar", image: influencerWellness, followers: "∞", engagement: "24/7", verified: true, type: "avatar", price: "R$ 399/mês" },
  { id: 15, name: "NEXO Tech", category: "Tecnologia", image: influencerTech, followers: "∞", engagement: "24/7", verified: true, type: "avatar", price: "R$ 599/mês" },
  { id: 16, name: "SORA Fitness", category: "Fitness", image: influencerFitness, followers: "∞", engagement: "24/7", verified: true, type: "avatar", price: "R$ 449/mês" },
];

const typeConfig: Record<TalentType, { label: string; badge: string; icon: typeof Bot; gradient: string }> = {
  avatar: { label: "AVATAR IA", badge: "bg-violet-500/90 text-white", icon: Bot, gradient: "from-violet-500/20 to-fuchsia-500/20" },
  artist: { label: "ARTISTA", badge: "bg-accent/90 text-accent-foreground", icon: Palette, gradient: "from-accent/20 to-orange-500/20" },
  influencer: { label: "INFLUENCER", badge: "bg-primary/90 text-primary-foreground", icon: Users, gradient: "from-primary/20 to-cyan-500/20" },
};

const filterTabs = [
  { id: "all", label: "Todos", icon: Crown },
  { id: "influencer", label: "Influenciadores", icon: Users },
  { id: "artist", label: "Artistas", icon: Palette },
  { id: "avatar", label: "Avatares IA", icon: Bot },
];

const pillars = [
  { icon: Bot, label: "Avatares IA", description: "Disponíveis 24/7, sem limites", color: "text-violet-400", stat: "∞", statLabel: "Sempre online" },
  { icon: Users, label: "Influenciadores", description: "Vozes autênticas com comunidades", color: "text-primary", stat: "500+", statLabel: "Verificados" },
  { icon: Palette, label: "Artistas", description: "Colaborações criativas premium", color: "text-accent", stat: "98%", statLabel: "Satisfação" },
];

export const InfluencerMarketplaceComingSoon = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all" ? talents : talents.filter((t) => t.type === activeFilter);

  const handleContract = (name: string) => {
    toast.success(`Solicitação enviada para ${name}! Entraremos em contato.`);
  };

  return (
    <section id="influencers" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] via-transparent to-secondary/[0.05]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6">
            <Crown className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MARKETPLACE DE TALENTOS
            </span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Três Universos,{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Infinitas Possibilidades
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Contrate{" "}
            <span className="text-violet-400 font-medium">Avatares IA</span>,{" "}
            <span className="text-accent font-medium">Artistas</span> ou{" "}
            <span className="text-primary font-medium">Influenciadores reais</span>{" "}
            para potencializar sua marca.
          </p>
        </motion.div>

        {/* Three Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <GlassCard key={i} className="group p-6 text-center hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <GlassCardContent className="p-0 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className={`w-7 h-7 ${pillar.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{pillar.label}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-foreground">{pillar.stat}</span>
                    <span className="text-xs text-muted-foreground ml-2">{pillar.statLabel}</span>
                  </div>
                </GlassCardContent>
              </GlassCard>
            );
          })}
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filtered.map((talent, index) => {
            const config = typeConfig[talent.type];
            return (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <GlassCard className="group overflow-hidden cursor-pointer relative hover:border-primary/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
                    <img
                      src={talent.image}
                      alt={talent.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Avatar glow ring for AI avatars */}
                    {talent.type === "avatar" && (
                      <div className="absolute inset-0 ring-2 ring-inset ring-violet-500/30 rounded-t-xl" />
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`text-[10px] px-2 py-0.5 font-bold border-0 backdrop-blur-sm ${config.badge}`}>
                        <config.icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>

                    {/* Verified */}
                    {talent.verified && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 text-primary-foreground fill-current" />
                        </div>
                      </div>
                    )}

                    {/* Bottom info on image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-semibold text-white text-sm truncate">{talent.name}</h3>
                      <p className="text-[11px] text-white/70 truncate">{talent.category}</p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                      <button
                        onClick={() => handleContract(talent.name)}
                        className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                      >
                        Contratar
                      </button>
                      {talent.price && (
                        <span className="text-white/80 text-xs font-medium">{talent.price}/post</span>
                      )}
                    </div>
                  </div>

                  {/* Card content */}
                  <GlassCardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">{talent.followers}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        {talent.type === "avatar" ? (
                          <Zap className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        <span className="font-bold">{talent.engagement}</span>
                      </div>
                    </div>
                    {talent.price && (
                      <div className={`text-center text-[11px] font-semibold py-1.5 rounded-lg bg-gradient-to-r ${config.gradient}`}>
                        {talent.type === "avatar" ? talent.price : `a partir de ${talent.price}`}
                      </div>
                    )}
                  </GlassCardContent>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-14 mb-10"
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
            <p className="text-sm text-muted-foreground">Talentos verificados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-violet-400">∞</p>
            <p className="text-sm text-muted-foreground">Avatares disponíveis</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-accent">12</p>
            <p className="text-sm text-muted-foreground">Categorias</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-secondary">98%</p>
            <p className="text-sm text-muted-foreground">Taxa de satisfação</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center"
        >
          <GlassButton variant="glow" size="lg" className="px-8">
            <Heart className="w-5 h-5 mr-2" />
            Explorar todos os talentos
          </GlassButton>
          <p className="text-sm text-muted-foreground mt-3">
            Avatares IA • Influenciadores Reais • Artistas — tudo em um só lugar
          </p>
        </motion.div>
      </div>
    </section>
  );
};
