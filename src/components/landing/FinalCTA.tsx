import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Flame } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export const FinalCTA = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-primary/5 to-background" />
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-sm font-bold text-accent mb-8 animate-pulse">
            <Flame className="w-4 h-4" />
            Não fique de fora
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Sua próxima foto viral{" "}
            <span className="bg-gradient-to-r from-destructive via-secondary to-primary bg-clip-text text-transparent">
              começa agora
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            Milhares de creators já transformaram suas redes com nossas fotos IA.{" "}
            <span className="text-destructive font-bold">Você vai ficar de fora?</span>
          </p>
          
          <a href="#prompts">
            <GlassButton 
              variant="aurora" 
              size="xl" 
              className="text-lg px-12 py-8 mb-8 transition-all duration-500 shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
            >
              <Flame className="w-6 h-6 mr-3 animate-pulse" />
              Quero Minhas Fotos Virais
              <ArrowRight className="w-6 h-6 ml-3" />
            </GlassButton>
          </a>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span>Resultado em 60 segundos</span>
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
