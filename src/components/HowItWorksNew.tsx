import { MousePointer2, Upload, CreditCard, Download, Sparkles } from "lucide-react";

const steps = [
  { number: "01", title: "Escolha o Prompt", description: "Navegue e escolha o estilo que combina com você", icon: MousePointer2 },
  { number: "02", title: "Envie sua Foto", description: "Upload da sua foto e preencha os dados", icon: Upload },
  { number: "03", title: "Pague via PIX", description: "Pagamento instantâneo e seguro", icon: CreditCard },
  { number: "04", title: "Baixe sua Arte", description: "Receba sua imagem IA em segundos", icon: Download },
];

export const HowItWorksNew = () => {
  return (
    <section id="como-funciona" className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Como funciona
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            4 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/15 transition-all duration-300 group ${
                index % 2 === 1 ? 'md:mt-12' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-primary/20 transition-colors duration-300">
                  <span className="text-xs font-mono font-bold text-primary/60">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/50">
            <Sparkles className="w-3.5 h-3.5 text-primary/40" />
            <span>R$21 por prompt · PIX instantâneo · IA de última geração</span>
          </div>
        </div>
      </div>
    </section>
  );
};
