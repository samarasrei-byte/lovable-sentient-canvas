import { Check, Sparkles, Zap, Shield, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
  { name: "Avulso", price: "21", period: "por prompt", tagline: "Compre quando quiser", features: ["1 prompt por compra", "Geração com sua foto", "Download em alta qualidade", "Sem compromisso"], popular: false, cta: "Comprar agora" },
  { name: "Starter", price: "100", yearlyPrice: "80", period: "/mês", tagline: "Para quem cria sempre", features: ["6 fotos IA por mês", "Todos os temas disponíveis", "Download em alta qualidade", "Suporte por email"], popular: false, cta: "Começar grátis" },
  { name: "Creator Pro", price: "220", yearlyPrice: "176", period: "/mês", tagline: "Criação sem limites", features: ["20 prompts por mês", "Fotos IA ilimitadas", "Todos os temas", "15 fotos de produto", "5 vídeos IA", "Chat prioritário"], popular: true, cta: "Começar grátis" },
  { name: "Business", price: "1.200", yearlyPrice: "960", period: "/mês", tagline: "Para marcas e agências", features: ["Prompts ilimitados", "Tudo do Creator Pro", "30 vídeos IA", "Avatares personalizados", "API de integração", "Gerente dedicado"], popular: false, cta: "Falar com vendas" },
];

export const PlansSection = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const getPrice = (plan: typeof plans[0]) => {
    if (!plan.yearlyPrice) return plan.price;
    return billing === "monthly" ? plan.price : plan.yearlyPrice;
  };

  return (
    <section id="planos" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-muted-foreground mb-5">
            <Sparkles className="w-3 h-3 text-primary/70" />
            7 dias grátis
          </div>

          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2">
            Planos de{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Prompts IA
            </span>
          </h2>

          <p className="text-sm text-muted-foreground/50 max-w-md mx-auto font-light">
            Transforme suas fotos em imagens profissionais com IA.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-1 mb-10">
          <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300",
                  billing === b
                    ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground/50 hover:text-foreground"
                )}
              >
                {b === "monthly" ? "Mensal" : "Anual"}
              </button>
            ))}
          </div>
          {billing === "yearly" && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[9px] font-bold border border-secondary/20">
              -20%
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {plan.popular && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-sm" />
              )}

              <div
                className={cn(
                  "relative h-full rounded-2xl border p-5 flex flex-col transition-all duration-300",
                  plan.popular
                    ? "border-primary/20 bg-white/[0.04]"
                    : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider shadow-lg shadow-primary/25">
                      Popular
                    </span>
                  </div>
                )}

                <div className="mb-4 mt-1">
                  <h3 className="text-sm font-semibold text-foreground/80">{plan.name}</h3>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">{plan.tagline}</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] text-muted-foreground/40">R$</span>
                    <span className="text-2xl font-bold text-foreground tracking-tight">{getPrice(plan)}</span>
                    <span className="text-[10px] text-muted-foreground/40">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2 h-2 text-primary/70" />
                      </div>
                      <span className="text-[11px] text-muted-foreground/50 leading-tight">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className={cn(
                    "w-full h-10 rounded-xl text-xs font-medium transition-all duration-300 active:scale-[0.98]",
                    plan.popular
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                      : "border border-white/[0.08] bg-white/[0.03] text-foreground/70 hover:bg-white/[0.06] hover:border-white/[0.14]"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground/30">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            <span>Garantia 7 dias</span>
          </div>
          <span className="text-white/[0.04]">·</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            <span>Cancele a qualquer momento</span>
          </div>
          <span className="text-white/[0.04]">·</span>
          <div className="flex items-center gap-1.5">
            <Image className="w-3 h-3" />
            <span>+50.000 fotos geradas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
