import { motion } from "framer-motion";
import { Star, TrendingUp, Flame, Zap, Camera, Award } from "lucide-react";

const stats = [
  { icon: Flame, value: "47K+", label: "Fotos geradas", color: "text-destructive" },
  { icon: Camera, value: "120+", label: "Prompts exclusivos", color: "text-primary" },
  { icon: Zap, value: "<60s", label: "Tempo de geração", color: "text-secondary" },
  { icon: Award, value: "4.9", label: "Avaliação média", suffix: <Star className="w-4 h-4 fill-current inline ml-1" />, color: "text-secondary" },
];

export const SocialProofBanner = () => {
  return (
    <section className="relative py-12 border-y border-primary/10 bg-gradient-to-r from-destructive/5 via-transparent to-primary/5 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-primary/20 mb-3 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>
                {stat.value}
                {stat.suffix}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
