import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { WavyBackground } from "@/components/ui/wavy-background";

export const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden">
      <WavyBackground
        containerClassName="min-h-[70vh] py-32 px-6"
        className="max-w-3xl mx-auto text-center"
        colors={[
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "#818cf8",
          "#22d3ee",
        ]}
        waveWidth={40}
        blur={12}
        speed="slow"
        waveOpacity={0.3}
        backgroundFill="hsl(var(--background))"
      >
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
      </WavyBackground>
    </section>
  );
};
