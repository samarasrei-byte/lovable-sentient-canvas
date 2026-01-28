import { TrendingUp, Users, Target, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

export const SuccessCases = () => {
  const cases = [
    {
      brand: "TechFlow",
      influencer: "Sara Tech",
      metric: "+340%",
      description: "Aumento em conversões",
      icon: TrendingUp,
    },
    {
      brand: "FitLife",
      influencer: "Marcus Fit",
      metric: "2.5M",
      description: "Impressões totais",
      icon: Users,
    },
    {
      brand: "Luxe Fashion",
      influencer: "Luna Fashion",
      metric: "+520%",
      description: "ROI da campanha",
      icon: Target,
    },
    {
      brand: "Zen Wellness",
      influencer: "Ana Wellness",
      metric: "95%",
      description: "Taxa de engajamento",
      icon: Award,
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            Resultados comprovados
          </h2>
          <p className="text-muted-foreground text-lg font-light max-w-xl mx-auto">
            Marcas reais, resultados extraordinários
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cases.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard className="h-full p-6 text-center group">
                  <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <p className="text-3xl font-semibold text-foreground mb-1">
                    {item.metric}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  
                  <div className="pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground/80">{item.brand}</span> com {item.influencer}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
