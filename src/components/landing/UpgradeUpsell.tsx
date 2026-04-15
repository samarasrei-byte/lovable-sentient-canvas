import { Sparkles, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const UpgradeUpsell = () => {
  return (
    <section className="py-16 px-5 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(ellipse at 50% 50%, hsl(270 50% 50% / 0.1), transparent 60%)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-xl mx-auto"
      >
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] mb-5">
            <Sparkles className="w-3 h-3 text-primary/70" />
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Oferta Especial</span>
          </div>

          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2">
            Assine e economize{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              até 40%
            </span>
          </h2>

          <p className="text-xs text-muted-foreground/50 max-w-sm mx-auto mb-6 font-light">
            Em vez de pagar R$21 por foto avulsa, assine o plano mensal e gere 6 fotos profissionais por mês.
          </p>

          <div className="mb-6">
            <p className="text-[10px] text-muted-foreground/40 line-through">R$126 (6 fotos avulsas)</p>
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-3xl font-bold text-foreground tracking-tight">R$100</span>
              <span className="text-xs text-muted-foreground/40">/mês</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              "6 fotos IA por mês",
              "Download em alta qualidade",
              "Todos os estilos",
              "Cancele quando quiser",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                <CheckCircle2 className="w-3 h-3 text-primary/50" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <Link to="/login">
            <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]">
              <Camera className="w-3.5 h-3.5" />
              Assinar agora
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
