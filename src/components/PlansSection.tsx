import { GlassButton } from "@/components/ui/glass-button";
import { Check, X, Sparkles, Crown, Zap, Users, TrendingUp, Shield, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Basic",
    price: "55",
    monthlyPrice: "55",
    yearlyPrice: "44",
    description: "Para quem está começando",
    icon: Zap,
    color: "primary",
    features: {
      credits: "120/mês",
      imageGen: true,
      photoProf: true,
      templates: "Básicos",
      videoAnim: false,
      avatarIA: false,
      campaigns: false,
      consultoria: false,
      whitelabel: false,
      api: false,
      support: "Email",
      sla: false,
    },
    popular: false,
    cta: "Começar Grátis",
    savings: null,
  },
  {
    name: "Pro",
    price: "220",
    monthlyPrice: "220",
    yearlyPrice: "176",
    description: "O mais escolhido por creators",
    icon: Star,
    color: "primary",
    features: {
      credits: "400/mês",
      imageGen: true,
      photoProf: true,
      templates: "Exclusivos",
      videoAnim: true,
      avatarIA: false,
      campaigns: false,
      consultoria: false,
      whitelabel: false,
      api: false,
      support: "Prioritário",
      sla: false,
    },
    popular: true,
    cta: "Começar Grátis",
    savings: "Economize R$528/ano",
  },
  {
    name: "Business",
    price: "1.200",
    monthlyPrice: "1.200",
    yearlyPrice: "960",
    description: "Para marcas e agências",
    icon: TrendingUp,
    color: "secondary",
    features: {
      credits: "2.000/mês",
      imageGen: true,
      photoProf: true,
      templates: "Ilimitados",
      videoAnim: true,
      avatarIA: true,
      campaigns: true,
      consultoria: "Mensal",
      whitelabel: false,
      api: true,
      support: "Gerente dedicado",
      sla: false,
    },
    popular: false,
    cta: "Falar com Vendas",
    savings: "Economize R$2.880/ano",
  },
  {
    name: "Enterprise",
    price: "2.000",
    monthlyPrice: "2.000",
    yearlyPrice: "1.600",
    description: "Solução completa white-label",
    icon: Crown,
    color: "secondary",
    features: {
      credits: "Ilimitados",
      imageGen: true,
      photoProf: true,
      templates: "Ilimitados",
      videoAnim: true,
      avatarIA: true,
      campaigns: true,
      consultoria: "Semanal",
      whitelabel: true,
      api: true,
      support: "24/7 dedicado",
      sla: true,
    },
    popular: false,
    cta: "Falar com Vendas",
    savings: "Economize R$4.800/ano",
  },
];

const featureRows = [
  { key: "credits", label: "Créditos", icon: Zap },
  { key: "imageGen", label: "Geração de imagens IA", icon: Sparkles },
  { key: "photoProf", label: "Fotos profissionais", icon: Star },
  { key: "templates", label: "Templates", icon: Star },
  { key: "videoAnim", label: "Animação de vídeo IA", icon: TrendingUp },
  { key: "avatarIA", label: "Avatares IA personalizados", icon: Users },
  { key: "campaigns", label: "Campanhas com influencers", icon: Users },
  { key: "consultoria", label: "Consultoria estratégica", icon: Shield },
  { key: "whitelabel", label: "White-label completo", icon: Crown },
  { key: "api", label: "API de integração", icon: Zap },
  { key: "support", label: "Suporte", icon: Shield },
  { key: "sla", label: "SLA 99.9% garantido", icon: Shield },
] as const;

export const PlansSection = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) return <Check className="w-4 h-4 text-emerald-400" />;
    if (value === false) return <X className="w-4 h-4 text-muted-foreground/30" />;
    return <span className="text-sm font-medium text-foreground">{value}</span>;
  };

  return (
    <section id="planos" className="relative py-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            7 dias grátis em todos os planos
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Invista no crescimento{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              do seu negócio
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            Compare e escolha o plano ideal. Cancele quando quiser.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-white/[0.03] text-muted-foreground border border-white/[0.08] hover:bg-white/[0.06]"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
              billing === "yearly"
                ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-white/[0.03] text-muted-foreground border border-white/[0.08] hover:bg-white/[0.06]"
            }`}
          >
            Anual
            <span className="absolute -top-2.5 -right-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold">
              -20%
            </span>
          </button>
        </motion.div>

        {/* ── Cards Grid (mobile) ── */}
        <div className="md:hidden space-y-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -inset-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-2xl blur-lg" />
              )}

              <div
                className={`relative rounded-2xl border p-6 transition-all ${
                  plan.popular
                    ? "border-primary/30 bg-white/[0.05]"
                    : "border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 border-0 shadow-lg shadow-primary/30">
                      ⭐ MAIS POPULAR
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-${plan.color}/10 border border-${plan.color}/20 flex items-center justify-center`}>
                    <plan.icon className={`w-5 h-5 text-${plan.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-4xl font-bold text-foreground">
                    {billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-muted-foreground text-sm">/mês</span>
                </div>

                {billing === "yearly" && plan.savings && (
                  <p className="text-xs text-emerald-400 font-medium mb-4">{plan.savings}</p>
                )}
                {(!plan.savings || billing !== "yearly") && <div className="mb-4" />}

                <div className="space-y-3 mb-6">
                  {featureRows.map((row) => {
                    const val = plan.features[row.key];
                    if (val === false) return null;
                    return (
                      <div key={row.key} className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {row.label}
                          {typeof val === "string" && val !== "true" ? `: ${val}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <GlassButton
                  className="w-full"
                  variant={plan.popular ? "glow" : "outline"}
                  size="lg"
                  onClick={() => navigate("/login")}
                >
                  {plan.cta}
                </GlassButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Comparison Table (desktop) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden md:block"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.01] backdrop-blur-sm overflow-hidden">
            {/* Plan Headers */}
            <div className="grid grid-cols-5 border-b border-white/[0.06]">
              <div className="p-6 flex items-end">
                <p className="text-sm text-muted-foreground font-medium">Compare os planos</p>
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-6 text-center relative ${
                    plan.popular ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                  )}
                  {plan.popular && (
                    <Badge className="mb-3 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 border-0">
                      RECOMENDADO
                    </Badge>
                  )}
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <plan.icon className={`w-4 h-4 text-${plan.color}`} />
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-xs text-muted-foreground">R$</span>
                    <span className="text-3xl font-bold">
                      {billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-xs text-muted-foreground">/mês</span>
                  </div>

                  {billing === "yearly" && plan.savings && (
                    <p className="text-[11px] text-emerald-400 font-medium mt-1">{plan.savings}</p>
                  )}

                  <GlassButton
                    className="w-full mt-4"
                    variant={plan.popular ? "glow" : "outline"}
                    size="default"
                    onClick={() => navigate("/login")}
                  >
                    {plan.cta}
                  </GlassButton>
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            {featureRows.map((row, i) => (
              <div
                key={row.key}
                className={`grid grid-cols-5 ${
                  i % 2 === 0 ? "bg-white/[0.01]" : ""
                } ${i < featureRows.length - 1 ? "border-b border-white/[0.04]" : ""}`}
              >
                <div className="p-4 flex items-center gap-2.5">
                  <row.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                </div>
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 flex items-center justify-center ${
                      plan.popular ? "bg-primary/[0.04]" : ""
                    }`}
                  >
                    {renderFeatureValue(plan.features[row.key])}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof / Urgency */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 border-2 border-background"
                />
              ))}
            </div>
            <span>
              <strong className="text-foreground">2.847</strong> creators já assinam
            </span>
          </div>
          <span className="hidden sm:block text-white/10">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Garantia de 7 dias ou seu dinheiro de volta</span>
          </div>
          <span className="hidden sm:block text-white/10">|</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Cancele a qualquer momento</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
