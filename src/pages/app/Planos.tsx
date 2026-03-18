import { Check, Sparkles, Zap, Shield, Image } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Avulso",
    price: "21",
    period: "por prompt",
    tagline: "Compre quando quiser",
    features: [
      "1 prompt por compra",
      "Geração com sua foto",
      "Download em alta qualidade",
      "Sem compromisso",
    ],
    popular: false,
    cta: "Comprar agora",
  },
  {
    name: "Starter",
    price: "100",
    yearlyPrice: "80",
    period: "/mês",
    tagline: "Para quem cria sempre",
    features: [
      "6 fotos IA por mês",
      "Todos os temas disponíveis",
      "Download em alta qualidade",
      "Suporte por email",
    ],
    popular: false,
    cta: "Assinar agora",
  },
  {
    name: "Creator Pro",
    price: "220",
    yearlyPrice: "176",
    period: "/mês",
    tagline: "Criação sem limites",
    features: [
      "20 prompts por mês",
      "Fotos IA ilimitadas",
      "Todos os temas",
      "15 fotos de produto",
      "5 vídeos IA",
      "Chat prioritário",
    ],
    popular: true,
    cta: "Assinar agora",
  },
  {
    name: "Business",
    price: "1.200",
    yearlyPrice: "960",
    period: "/mês",
    tagline: "Para marcas e agências",
    features: [
      "Prompts ilimitados",
      "Tudo do Creator Pro",
      "30 vídeos IA",
      "Avatares personalizados",
      "API de integração",
      "Gerente dedicado",
    ],
    popular: false,
    cta: "Falar com vendas",
  },
];

export default function Planos() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const getPrice = (plan: (typeof plans)[0]) => {
    if (!plan.yearlyPrice) return plan.price;
    return billing === "monthly" ? plan.price : plan.yearlyPrice;
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-muted-foreground mb-5">
          <Sparkles className="w-3 h-3 text-primary" />
          7 dias grátis
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Planos de{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Prompts IA
          </span>
        </h1>

        <p className="text-muted-foreground text-base max-w-lg mx-auto font-light">
          Transforme suas fotos em imagens profissionais com IA. Escolha o plano ideal.
        </p>
      </motion.div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-1 mb-8">
        <div className="flex rounded-xl bg-muted/50 border border-border p-1">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                billing === b
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b === "monthly" ? "Mensal" : "Anual"}
            </button>
          ))}
        </div>
        {billing === "yearly" && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold border border-secondary/20">
            -20%
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative group"
          >
            {plan.popular && (
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/25 via-primary/10 to-transparent blur-sm" />
            )}

            <div
              className={`relative h-full rounded-2xl border p-6 flex flex-col transition-all duration-500 ${
                plan.popular
                  ? "border-primary/25 bg-card"
                  : "border-border bg-card/60 hover:border-primary/20 hover:bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-primary/25">
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-5 mt-1">
                <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.tagline}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-muted-foreground">R$</span>
                  <span className="text-3xl font-bold text-foreground tracking-tight">
                    {getPrice(plan)}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full h-11 rounded-xl text-sm font-medium transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                    : "border border-border bg-muted/30 text-foreground hover:bg-muted/60"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/60 pt-4">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Garantia 7 dias</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Cancele a qualquer momento</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5" />
          <span>+50.000 fotos geradas</span>
        </div>
      </div>
    </div>
  );
}
