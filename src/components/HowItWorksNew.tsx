import { useRef } from "react";
import { MousePointer2, Upload, CreditCard, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/use-parallax";

const steps = [
  { number: "01", title: "Escolha o Prompt", description: "Navegue e escolha o estilo que combina com você", icon: MousePointer2 },
  { number: "02", title: "Envie sua Foto", description: "Upload da sua foto e preencha os dados", icon: Upload },
  { number: "03", title: "Pague via PIX", description: "Pagamento instantâneo e seguro", icon: CreditCard },
  { number: "04", title: "Baixe sua Arte", description: "Receba sua imagem IA em segundos", icon: Download },
];

export const HowItWorksNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxOffset = useParallax(sectionRef, 0.08);

  return (
    <section ref={sectionRef} id="como-funciona" className="relative py-28 px-6 overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/[0.03] rounded-full blur-[150px] pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Como funciona
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            4 passos simples
          </p>
        </motion.div>

        {/* Steps — glass cards with connecting line */}
        <div className="relative">
          {/* Vertical connecting line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent -translate-x-1/2" />

          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-primary/15 transition-all duration-500 group ${
                  index % 2 === 1 ? 'md:mt-12' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-primary/20 transition-colors duration-300">
                    <span className="text-xs font-mono font-bold text-primary/60">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/50">
            <Sparkles className="w-3.5 h-3.5 text-primary/40" />
            <span>R$21 por prompt · PIX instantâneo · IA de última geração</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
