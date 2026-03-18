import { useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Shield, CreditCard, Download, TrendingUp, Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";

const features = [
  {
    icon: Sparkles,
    title: "Prompts que Viralizam",
    description: "Testados e validados em +47.000 fotos virais",
  },
  {
    icon: Clock,
    title: "Pronto em 60s",
    description: "Enquanto outros esperam dias, você já posta",
  },
  {
    icon: CreditCard,
    title: "Sem Mensalidade",
    description: "Pague só quando usar. A partir de R$21",
  },
  {
    icon: Shield,
    title: "100% Suas Fotos",
    description: "Use como quiser, onde quiser, sem restrição",
  },
  {
    icon: TrendingUp,
    title: "Qualidade de Estúdio",
    description: "Resultados que parecem sessões de R$2.000",
  },
  {
    icon: Download,
    title: "Download HD",
    description: "Alta resolução, pronta pra postar",
  },
];

export const ValueProposition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxOffset = useParallax(sectionRef, 0.1);

  return (
    <section ref={sectionRef} className="relative py-28 px-6 overflow-hidden">
      {/* Parallax background orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none"
        style={{ transform: `translate(-50%, calc(-50% + ${parallaxOffset * 0.4}px))` }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Por que o{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ARCANA
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            A plataforma que creators usam pra dominar o feed.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary/25 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-primary/80" />
              </div>
              <h3 className="text-base font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
