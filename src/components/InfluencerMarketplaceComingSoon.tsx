import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Star, Lock, Bell, Users, Crown, TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { toast } from "sonner";

// Import all available influencer images
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

const influencers = [
  {
    id: 1,
    name: "@marina.style",
    category: "Fashion & Lifestyle",
    image: influencerFashion,
    followers: "2.3M",
    engagement: "8.2%",
    verified: true,
  },
  {
    id: 2,
    name: "@tech.lucas",
    category: "Tech & Games",
    image: influencerTech,
    followers: "1.5M",
    engagement: "6.8%",
    verified: true,
  },
  {
    id: 3,
    name: "@fit.juliana",
    category: "Fitness & Saúde",
    image: influencerFitness,
    followers: "890K",
    engagement: "9.1%",
    verified: true,
  },
  {
    id: 4,
    name: "@travel.vieira",
    category: "Viagem",
    image: influencerTravel,
    followers: "1.2M",
    engagement: "7.5%",
    verified: true,
  },
  {
    id: 5,
    name: "@sound.rafael",
    category: "Música",
    image: influencerMusic,
    followers: "320K",
    engagement: "12.3%",
    verified: false,
  },
  {
    id: 6,
    name: "@gamer.alex",
    category: "Gaming",
    image: influencerGaming,
    followers: "980K",
    engagement: "11.2%",
    verified: true,
  },
  {
    id: 7,
    name: "@art.designer",
    category: "Arte & Design",
    image: influencerArt,
    followers: "450K",
    engagement: "14.5%",
    verified: true,
  },
  {
    id: 8,
    name: "@ceo.mindset",
    category: "Business",
    image: influencerBusiness,
    followers: "780K",
    engagement: "5.8%",
    verified: true,
  },
  {
    id: 9,
    name: "@prof.digital",
    category: "Educação",
    image: influencerEducation,
    followers: "650K",
    engagement: "8.9%",
    verified: true,
  },
  {
    id: 10,
    name: "@startup.life",
    category: "Empreendedorismo",
    image: influencerEntrepreneur,
    followers: "1.1M",
    engagement: "7.2%",
    verified: true,
  },
  {
    id: 11,
    name: "@chef.sabores",
    category: "Gastronomia",
    image: influencerGastro,
    followers: "520K",
    engagement: "10.4%",
    verified: false,
  },
  {
    id: 12,
    name: "@wellness.zen",
    category: "Bem-estar",
    image: influencerWellness,
    followers: "380K",
    engagement: "15.1%",
    verified: true,
  },
];

export const InfluencerMarketplaceComingSoon = () => {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    toast.success("Você será notificado quando o marketplace de influencers estiver disponível!");
  };

  return (
    <section id="influencers" className="relative py-24 px-6 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] via-transparent to-primary/[0.05]" />
      
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Coming Soon Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MARKETPLACE DE INFLUENCERS</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/20 border border-primary/40 animate-pulse">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">EM BREVE</span>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Em breve —{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              O marketplace dos influenciadores
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-light leading-relaxed">
            Conecte-se com os <span className="text-primary font-medium">creators mais hypados</span> do Brasil.
            <span className="text-secondary font-medium"> Campanhas exclusivas</span>,
            <span className="text-primary font-medium"> parcerias reais</span> e
            <span className="text-secondary font-medium"> resultados extraordinários</span>.
          </p>
        </motion.div>

        {/* Influencer Grid - Locked - Now 12 influencers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-70">
          {influencers.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <GlassCard className="group overflow-hidden cursor-not-allowed relative">
                {/* Locked Overlay */}
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white/50" />
                </div>

                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="w-full h-full object-cover grayscale-[50%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/90 text-primary-foreground text-[9px] px-1.5 py-0.5 font-medium border-0">
                      EM BREVE
                    </Badge>
                  </div>

                  {/* Verified Badge */}
                  {influencer.verified && (
                    <div className="absolute top-2 right-2">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                <GlassCardContent className="p-2.5">
                  <h3 className="font-medium text-foreground text-[11px] truncate">
                    {influencer.name}
                  </h3>
                  <p className="text-[9px] text-muted-foreground truncate">
                    {influencer.category}
                  </p>
                  <div className="flex items-center justify-between mt-1.5 text-[9px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" />
                      <span>{influencer.followers}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>{influencer.engagement}</span>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-12 mb-10"
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
            <p className="text-sm text-muted-foreground">Influencers verificados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-secondary">50M+</p>
            <p className="text-sm text-muted-foreground">Alcance combinado</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Categorias</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-secondary">98%</p>
            <p className="text-sm text-muted-foreground">Taxa de satisfação</p>
          </div>
        </motion.div>

        {/* Notify CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center"
        >
          <GlassButton
            onClick={handleNotify}
            disabled={notified}
            variant="glow"
            size="lg"
            className="px-8"
          >
            {notified ? (
              <>
                <Heart className="w-5 h-5 mr-2 text-primary fill-current" />
                Você será notificado!
              </>
            ) : (
              <>
                <Bell className="w-5 h-5 mr-2" />
                Quero ser notificado quando lançar
              </>
            )}
          </GlassButton>
          <p className="text-sm text-muted-foreground mt-3">
            Seja o primeiro a saber quando o marketplace de influencers estiver disponível
          </p>
        </motion.div>
      </div>
    </section>
  );
};
