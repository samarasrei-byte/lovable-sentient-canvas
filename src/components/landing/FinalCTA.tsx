import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const FinalCTA = () => {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{
        background: "radial-gradient(ellipse at 50% 50%, hsl(270 60% 50% / 0.08), transparent 60%)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-4xl font-bold tracking-[-0.03em] mb-4 leading-[1.1]">
          <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            Sua próxima foto viral
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            começa agora
          </span>
        </h2>

        <p className="text-sm text-muted-foreground/60 mb-8 max-w-md mx-auto font-light">
          Milhares de creators já transformaram suas redes.
        </p>

        <a href="#prompts">
          <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98] mb-8">
            <Sparkles className="w-4 h-4" />
            Quero Minhas Fotos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground/40">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            <span>Pagamento 100% seguro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            <span>Resultado em 60 segundos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Sem cadastro necessário</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
