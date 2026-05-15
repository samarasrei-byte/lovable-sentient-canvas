import { Clock, Shield, CreditCard, Download, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Sparkles, title: "Prompts que Viralizam", description: "Testados e validados em milhares de fotos virais" },
  { icon: Clock, title: "Pronto em 60s", description: "Enquanto outros esperam dias, você já posta" },
  { icon: CreditCard, title: "Sem Mensalidade", description: "Pague só quando usar. A partir de R$21" },
  { icon: Shield, title: "100% Suas Fotos", description: "Use como quiser, onde quiser, sem restrição" },
  { icon: TrendingUp, title: "Qualidade de Estúdio", description: "Resultados que parecem sessões de R$2.000" },
  { icon: Download, title: "Download HD", description: "Alta resolução, pronta pra postar" },
];

export const ValueProposition = () => {
  return (
    <section className="py-16 md:py-28 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2">
            Por que escolher{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ARCANA
            </span>
          </h2>
          <p className="text-sm text-muted-foreground/50 font-light">
            A plataforma que creators usam pra dominar o feed.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
            >
              <feature.icon className="w-5 h-5 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="font-medium text-xs text-foreground/80 mb-1">{feature.title}</h3>
              <p className="text-[10px] text-muted-foreground/40 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
