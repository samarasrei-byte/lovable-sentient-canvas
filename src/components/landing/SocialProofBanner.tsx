import { motion } from "framer-motion";
import { TrendingUp, Zap, Camera, Star } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "47K+", label: "Fotos geradas" },
  { icon: Camera, value: "120+", label: "Prompts exclusivos" },
  { icon: Zap, value: "<60s", label: "Tempo de geração" },
  { icon: Star, value: "4.9", label: "Avaliação média" },
];

export const SocialProofBanner = () => {
  return (
    <section className="relative py-10 overflow-hidden">
      {/* Glass strip */}
      <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-sm border-y border-white/[0.04]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-3 group-hover:border-primary/20 transition-colors duration-300">
                <stat.icon className="w-5 h-5 text-primary/70" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-0.5 tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
