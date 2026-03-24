import { Sparkles, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const UpgradeUpsell = () => {

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />

      <div className="relative max-w-4xl mx-auto">
        <div className="rounded-3xl border border-primary/20 bg-card/50 p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Oferta Especial</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Assine e economize{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              até 40%
            </span>
          </h2>

          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Em vez de pagar R$21 por foto avulsa, assine o plano mensal e gere 6 fotos profissionais por mês.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground line-through">R$126 (6 fotos avulsas)</p>
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-5xl font-black text-foreground">R$100</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              "6 fotos IA por mês",
              "Download em alta qualidade",
              "Todos os estilos disponíveis",
              "Cancele quando quiser",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shadow-lg shadow-primary/20 text-base font-bold px-10"
          >
            <Link to="/app/planos">
              <Camera className="w-5 h-5" />
              Assinar agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
