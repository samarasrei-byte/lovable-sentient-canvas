import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { useParallax } from "@/hooks/use-parallax";

export const FinalCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxOffset = useParallax(sectionRef, 0.12);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      {/* Parallax orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.08] rounded-full blur-[180px] pointer-events-none"
        style={{ transform: `translate(-50%, calc(-50% + ${parallaxOffset * 0.6}px))` }}
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Sua próxima foto viral{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              começa agora
            </span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-light">
            Milhares de creators já transformaram suas redes.
          </p>

          <a href="#prompts">
            <GlassButton
              variant="glow"
              size="xl"
              className="text-lg px-12 py-8 mb-10"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Quero Minhas Fotos
              <ArrowRight className="w-5 h-5 ml-3" />
            </GlassButton>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-primary/50" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-secondary/50" />
              <span>Resultado em 60 segundos</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary/50" />
              <span>Sem cadastro necessário</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
