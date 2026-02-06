import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Star, Lock, Bell, Users, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { toast } from "sonner";

// Import influencer images
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";
import influencerMusic from "@/assets/influencer-music.jpg";
import influencerGaming from "@/assets/influencer-gaming.jpg";

const influencers = [
  {
    id: 1,
    name: "@marina.style",
    category: "Fashion & Lifestyle",
    image: influencerFashion,
    followers: "2.3M",
    verified: true,
  },
  {
    id: 2,
    name: "@tech.lucas",
    category: "Tech & Games",
    image: influencerTech,
    followers: "1.5M",
    verified: true,
  },
  {
    id: 3,
    name: "@fit.juliana",
    category: "Fitness & Saúde",
    image: influencerFitness,
    followers: "890K",
    verified: true,
  },
  {
    id: 4,
    name: "@travel.vieira",
    category: "Viagem",
    image: influencerTravel,
    followers: "1.2M",
    verified: true,
  },
  {
    id: 5,
    name: "@sound.rafael",
    category: "Música",
    image: influencerMusic,
    followers: "320K",
    verified: false,
  },
  {
    id: 6,
    name: "@gamer.alex",
    category: "Gaming",
    image: influencerGaming,
    followers: "980K",
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
    <section id="influencer-marketplace" className="relative py-24 px-6 overflow-hidden">
      {/* Background with purple overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">MARKETPLACE DE INFLUENCERS</span>
            <Lock className="w-3 h-3 text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 ml-3">
            <span className="text-xs font-bold text-amber-400">EM BREVE</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            👑 Influencers Exclusivos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Marketplace de influenciadores. Criações exclusivas.
            <span className="text-primary font-medium"> Em breve.</span>
          </p>
        </motion.div>

        {/* Influencer Grid - Locked */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 opacity-60">
          {influencers.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GlassCard className="group overflow-hidden cursor-not-allowed relative">
                {/* Locked Overlay */}
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white/40" />
                </div>

                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-white text-[10px] px-2 py-0.5 font-medium border-0">
                      EM BREVE
                    </Badge>
                  </div>

                  {/* Verified Badge */}
                  {influencer.verified && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>

                <GlassCardContent className="p-3">
                  <h3 className="font-medium text-foreground text-xs truncate">
                    {influencer.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {influencer.category}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{influencer.followers}</span>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Notify CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-10"
        >
          <GlassButton
            onClick={handleNotify}
            disabled={notified}
            variant="outline"
            className="border-primary/30 hover:border-primary/50"
          >
            {notified ? (
              <>
                <Bell className="w-4 h-4 mr-2 text-success" />
                Notificação ativada!
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Me avise quando lançar
              </>
            )}
          </GlassButton>
        </motion.div>
      </div>
    </section>
  );
};