import { Clock, Shield, CreditCard, Download, TrendingUp, Sparkles } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Prompts que Viralizam", description: "Testados e validados em +47.000 fotos virais" },
  { icon: Clock, title: "Pronto em 60s", description: "Enquanto outros esperam dias, você já posta" },
  { icon: CreditCard, title: "Sem Mensalidade", description: "Pague só quando usar. A partir de R$21" },
  { icon: Shield, title: "100% Suas Fotos", description: "Use como quiser, onde quiser, sem restrição" },
  { icon: TrendingUp, title: "Qualidade de Estúdio", description: "Resultados que parecem sessões de R$2.000" },
  { icon: Download, title: "Download HD", description: "Alta resolução, pronta pra postar" },
];

export const ValueProposition = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Por que o{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ARCANA
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            A plataforma que creators usam pra dominar o feed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary/80" />
              </div>
              <h3 className="text-base font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
