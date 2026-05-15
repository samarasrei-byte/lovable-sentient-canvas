import { MousePointer2, Upload, CreditCard, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Escolha o Estilo", description: "Navegue e escolha o estilo que combina com você", icon: MousePointer2 },
  { number: "02", title: "Envie sua Foto", description: "Upload da sua foto e preencha os dados", icon: Upload },
  { number: "03", title: "Pague via PIX", description: "Pagamento instantâneo e seguro", icon: CreditCard },
  { number: "04", title: "Baixe sua Arte", description: "Receba sua imagem IA em segundos", icon: Download },
];

export const HowItWorksNew = () => {
  return (
    <section id="como-funciona" className="py-16 md:py-28 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2">
            Como funciona
          </h2>
          <p className="text-sm text-muted-foreground/50 font-light">
            4 passos simples
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-primary/60">{step.number}</span>
              </div>
              <h3 className="font-medium text-xs text-foreground/80 mb-1">{step.title}</h3>
              <p className="text-[10px] text-muted-foreground/40 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-[10px] text-muted-foreground/30">
            <Sparkles className="w-3 h-3 text-primary/30" />
            <span>R$21 por foto · PIX instantâneo · IA de última geração</span>
          </div>
        </div>
      </div>
    </section>
  );
};
