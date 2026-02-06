import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export const FinalCTA = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[200px]" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium text-primary mb-8">
            <Zap className="w-4 h-4" />
            Comece agora mesmo
          </span>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Sua próxima foto viral{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              está a um clique
            </span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            Junte-se a milhares de creators que já transformaram suas imagens. 
            Apenas <span className="text-primary font-bold">R$21</span> por geração.
          </p>
          
          {/* CTA Button - Futuristic Glass */}
          <a href="#prompts">
            <GlassButton 
              variant="glow" 
              size="xl" 
              className="text-lg px-12 py-8 mb-8 shadow-[0_0_50px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_80px_hsl(var(--primary)/0.7)] transition-all duration-500 backdrop-blur-xl border border-primary/40"
            >
              <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
              Ver prompts por R$21
              <ArrowRight className="w-6 h-6 ml-3" />
            </GlassButton>
          </a>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span>Resultado instantâneo</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Sem cadastro necessário</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
