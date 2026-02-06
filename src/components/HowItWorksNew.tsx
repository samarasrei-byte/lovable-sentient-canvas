import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { 
  MousePointer2, 
  Upload, 
  Sliders, 
  Sparkles, 
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Escolha o Prompt",
    description: "Navegue pelo marketplace e escolha o estilo que combina com você",
    icon: MousePointer2,
  },
  {
    number: "2",
    title: "Envie sua Foto",
    description: "Faça upload da sua foto e preencha os dados necessários",
    icon: Upload,
  },
  {
    number: "3",
    title: "Pague via PIX",
    description: "Pagamento instantâneo e seguro via QR Code ou código PIX",
    icon: Sliders,
  },
  {
    number: "4",
    title: "Baixe sua Arte",
    description: "Receba sua imagem gerada por IA em segundos",
    icon: Download,
  },
];

export const HowItWorksNew = () => {
  return (
    <section id="como-funciona" className="relative py-24 px-6 overflow-hidden">
      {/* Ultra subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            Como funciona?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            4 passos simples para transformar sua imagem
          </p>
        </motion.div>

        {/* Steps - Clean Linear Style */}
        <GlassCard className="p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center md:text-left"
              >
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
                  {step.number}
                </div>

                <h3 className="text-lg font-medium mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connection Line - Desktop Only */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* CTA - Ultra Subtle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>R$21 por prompt • Pagamento instantâneo via PIX • IA de última geração</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
