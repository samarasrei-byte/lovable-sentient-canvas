import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Award, Globe, Shield } from "lucide-react";

const stats = [
  {
    value: "500+",
    label: "Marcas",
    icon: Users,
  },
  {
    value: "2M+",
    label: "Campanhas",
    icon: Zap,
  },
  {
    value: "98%",
    label: "Satisfação",
    icon: Award,
  },
  {
    value: "15k+",
    label: "Criadores",
    icon: Globe,
  },
  {
    value: "+340%",
    label: "ROI Médio",
    icon: TrendingUp,
  },
  {
    value: "24/7",
    label: "Online",
    icon: Shield,
  }
];

export const SocialProofStats = () => {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center group"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
