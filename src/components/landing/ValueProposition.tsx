import { motion } from "framer-motion";
import { Sparkles, Clock, Shield, Zap, CreditCard, Download } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";

const features = [
  {
    icon: Sparkles,
    title: "Prompts de Elite",
    description: "Acesse os mesmos prompts usados por creators com milhões de seguidores",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Clock,
    title: "Resultado em segundos",
    description: "Geração instantânea com IA de última geração. Sem espera, sem complicação",
    gradient: "from-secondary to-primary",
  },
  {
    icon: CreditCard,
    title: "Pagamento via PIX",
    description: "Pague apenas R$21 via PIX. Sem assinatura, sem cadastro, sem surpresas",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Sua foto é processada e deletada automaticamente. Privacidade garantida",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Zap,
    title: "Qualidade Profissional",
    description: "Resultados dignos de capas de revista. A IA entende contexto e estilo",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Download,
    title: "Download Imediato",
    description: "Baixe sua imagem em alta resolução assim que o pagamento for confirmado",
    gradient: "from-secondary to-primary",
  },
];

export const ValueProposition = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            Por que o ARCANA?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Transforme sua imagem em{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              arte viral
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            A plataforma mais simples e poderosa para criar imagens de impacto. 
            Sem curva de aprendizado, sem ferramentas complicadas.
          </p>
        </motion.div>

        {/* Features Grid */}
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
