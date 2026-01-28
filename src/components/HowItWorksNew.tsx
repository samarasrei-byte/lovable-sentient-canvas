import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { 
  MousePointer2, 
  Upload, 
  Sliders, 
  Sparkles, 
  Download,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Escolha o template",
    description: "Navegue pelo marketplace e selecione o template perfeito",
    icon: MousePointer2,
    gradient: "from-primary to-primary/50",
  },
  {
    number: "02",
    title: "Envie sua foto",
    description: "Faça upload do seu produto ou foto para personalização",
    icon: Upload,
    gradient: "from-secondary to-secondary/50",
  },
  {
    number: "03",
    title: "Personalize",
    description: "Ajuste cores, logo, cenários conforme sua marca",
    icon: Sliders,
    gradient: "from-accent to-accent/50",
  },
  {
    number: "04",
    title: "Gere com IA",
    description: "Nossa IA gera até 4 variações incríveis em segundos",
    icon: Sparkles,
    gradient: "from-success to-success/50",
  },
  {
    number: "05",
    title: "Baixe ou anime",
    description: "Salve em alta qualidade ou anime no Plano PRO",
    icon: Download,
    gradient: "from-artist to-artist/50",
  },
];

export const HowItWorksNew = () => {
  return (
    <section id="como-funciona" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-secondary/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Como Funciona</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Crie em{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              5 passos simples
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Do template à criação final em minutos. Sem conhecimento técnico necessário.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <GlassCard className="h-full group hover:border-primary/30">
                  <GlassCardContent className="p-6 text-center">
                    {/* Step Number Badge */}
                    <div className="relative inline-flex mb-5">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xs font-bold text-primary shadow-lg">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </GlassCardContent>
                </GlassCard>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <ArrowRight className="w-5 h-5 text-primary/40 rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
