import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden min-h-[60vh] py-32 px-6 flex items-center justify-center">
      {/* Static gradient background instead of WavyBackground canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-secondary/[0.06]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/[0.04] rounded-full blur-[100px]" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
          Sua próxima foto viral{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            começa agora
          </span>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-light">
          Milhares de creators já transformaram suas redes.
        </p>

        <a href="/login">
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
      </div>
    </section>
  );
};
