import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Star, Lock, Bell, Users } from "lucide-react";
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

const influencerPrompts = [
  {
    id: 1,
    name: "@marina.style",
    category: "Fashion & Lifestyle",
    image: influencerFashion,
    followers: "2.3M",
    promptName: "Glamour Editorial",
  },
  {
    id: 2,
    name: "@tech.lucas",
    category: "Tech & Games",
    image: influencerTech,
    followers: "1.5M",
    promptName: "Futuristic Avatar",
  },
  {
    id: 3,
    name: "@fit.juliana",
    category: "Fitness & Saúde",
    image: influencerFitness,
    followers: "890K",
    promptName: "Athletic Portrait",
  },
  {
    id: 4,
    name: "@travel.vieira",
    category: "Viagem",
    image: influencerTravel,
    followers: "1.2M",
    promptName: "Wanderlust Style",
  },
  {
    id: 5,
    name: "@sound.rafael",
    category: "Música",
    image: influencerMusic,
    followers: "320K",
    promptName: "Rockstar Aesthetic",
  },
  {
    id: 6,
    name: "@gamer.alex",
    category: "Gaming",
    image: influencerGaming,
    followers: "980K",
    promptName: "Cyberpunk Gamer",
  },
];

export const InfluencerMarketplaceComingSoon = () => {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    toast.success("Você será notificado quando os prompts de influencers estiverem disponíveis!");
  };

  return (
    <section id="influencer-marketplace" className="relative py-24 px-6 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Star className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">EM BREVE</span>
            <Lock className="w-3 h-3 text-violet-400" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            ⭐ Prompts de Influencers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Prompts exclusivos criados por influencers. 
            <span className="text-violet-400"> Em breve você poderá usar os mesmos estilos dos seus criadores favoritos.</span>
          </p>
        </motion.div>

        {/* Influencer Grid - Locked */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 opacity-60">
          {influencerPrompts.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GlassCard className="group overflow-hidden cursor-not-allowed relative">
                {/* Locked Overlay */}
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white/50" />
                </div>

                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-violet-500/90 text-white text-[10px] px-2 py-0.5 font-medium border-0">
                      EM BREVE
                    </Badge>
                  </div>
                </div>

                <GlassCardContent className="p-3">
                  <h3 className="font-medium text-foreground text-xs truncate">
                    {influencer.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {influencer.promptName}
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
            className="border-violet-500/30 hover:border-violet-500/50"
          >
            {notified ? (
              <>
                <Bell className="w-4 h-4 mr-2 text-green-500" />
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
