import { motion } from "framer-motion";
import { Sparkles, Clock, Shield, Zap, CreditCard, Download, Flame, TrendingUp } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";

const features = [
  {
    icon: Flame,
    title: "Prompts que Viralizam",
    description: "Os mesmos prompts que geraram +47.000 fotos virais. Testados, validados e prontos pra bombar",
    gradient: "from-destructive to-secondary",
  },
  {
    icon: Clock,
    title: "Pronto em 60 Segundos",
    description: "Sua foto profissional gerada em menos de 1 minuto. Enquanto outros esperam dias, você já posta",
    gradient: "from-secondary to-primary",
  },
  {
    icon: CreditCard,
    title: "Sem Mensalidade",
    description: "Pague só quando usar. PIX instantâneo, sem cadastro, sem surpresas. A partir de R$21",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Shield,
    title: "Privacidade Total",
    description: "Sua foto é processada e deletada automaticamente. Ninguém vê, ninguém salva",
    gradient: "from-secondary to-primary",
  },
  {
    icon: TrendingUp,
    title: "Qualidade de Estúdio",
    description: "Resultados que parecem sessões de R$2.000. LinkedIn, Instagram, TikTok — tudo coberto",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Download,
    title: "Download HD Imediato",
    description: "Baixe em alta resolução no mesmo instante. Pronta pra postar e colher os likes",
    gradient: "from-secondary to-primary",
  },
];

export const ValueProposition = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-sm font-bold text-destructive mb-6">
            <Flame className="w-4 h-4" />
            Por que o ARCANA domina?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight">
            As fotos de IA{" "}
            <span className="bg-gradient-to-r from-destructive via-secondary to-primary bg-clip-text text-transparent">
              mais insanas do Brasil
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Não é mais uma ferramenta genérica. É a plataforma que creators usam pra{" "}
            <span className="text-secondary font-bold">dominar o feed</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard className="h-full hover:border-primary/30 transition-all duration-300 group">
                <GlassCardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
