import { GlassButton } from "@/components/ui/glass-button";
import { Check, X, Sparkles, Crown, Zap, Users, TrendingUp, Shield, Star, Clock, Camera, Video, ShoppingBag, Image, Palette, Headphones, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────────────────────
   Planos alinhados ao produto REAL da Arcana:
   • Prompts IA (marketplace de prompts a R$21/un)
   • Fotos IA (mêsversário, profissional, produto)
   • Live Shop (avatar IA + influencer real)
   • Campanhas com influenciadores
   • Geração de vídeo IA
   • Consultoria & White-label
   ───────────────────────────────────────────── */

const plans = [
  {
    name: "Starter",
    price: "55",
    yearlyPrice: "44",
    anchor: "97",
    tagline: "Ideal para creators e pequenos negócios",
    icon: Zap,
    highlight: "5 fotos IA inclusas/mês",
    features: {
      promptsIncluded: "5 prompts/mês",
      photosIA: "5 fotos IA/mês",
      photoThemes: "Mêsversário + Profissional",
      productPhotos: "3 fotos de produto/mês",
      videoIA: false,
      liveShop: false,
      influencerCampaigns: false,
      avatarIA: false,
      templates: "Básicos",
      support: "Email",
      analytics: false,
      api: false,
      whitelabel: false,
      consultoria: false,
    },
    popular: false,
    cta: "Começar 7 dias grátis",
    ctaVariant: "outline" as const,
  },
  {
    name: "Creator Pro",
    price: "220",
    yearlyPrice: "176",
    anchor: "397",
    tagline: "Tudo para escalar sua produção de conteúdo",
    icon: Star,
    highlight: "Fotos IA ilimitadas",
    features: {
      promptsIncluded: "20 prompts/mês",
      photosIA: "Ilimitadas",
      photoThemes: "Todos os temas",
      productPhotos: "15 fotos de produto/mês",
      videoIA: "5 vídeos/mês",
      liveShop: "1 live/semana",
      influencerCampaigns: false,
      avatarIA: "1 avatar personalizado",
      templates: "Premium + Exclusivos",
      support: "Chat prioritário",
      analytics: "Básico",
      api: false,
      whitelabel: false,
      consultoria: false,
    },
    popular: true,
    cta: "Começar 7 dias grátis",
    ctaVariant: "glow" as const,
  },
  {
    name: "Business",
    price: "1.200",
    yearlyPrice: "960",
    anchor: "2.400",
    tagline: "Para marcas e agências que querem dominar",
    icon: TrendingUp,
    highlight: "Live Shop + Influencers",
    features: {
      promptsIncluded: "Ilimitados",
      photosIA: "Ilimitadas",
      photoThemes: "Todos + personalizados",
      productPhotos: "Ilimitadas",
      videoIA: "30 vídeos/mês",
      liveShop: "Lives ilimitadas",
      influencerCampaigns: "Até 10 campanhas/mês",
      avatarIA: "5 avatares personalizados",
      templates: "Ilimitados",
      support: "Gerente dedicado",
      analytics: "Avançado + Relatórios",
      api: true,
      whitelabel: false,
      consultoria: "Mensal (1h)",
    },
    popular: false,
    cta: "Falar com Especialista",
    ctaVariant: "outline" as const,
  },
  {
    name: "Enterprise",
    price: "2.000",
    yearlyPrice: "1.600",
    anchor: "4.500",
    tagline: "Solução white-label completa",
    icon: Crown,
    highlight: "Sua marca, nossa tecnologia",
    features: {
      promptsIncluded: "Ilimitados",
      photosIA: "Ilimitadas",
      photoThemes: "Todos + exclusivos da marca",
      productPhotos: "Ilimitadas",
      videoIA: "Ilimitados",
      liveShop: "Lives ilimitadas + multi-host",
      influencerCampaigns: "Campanhas ilimitadas",
      avatarIA: "Avatares ilimitados",
      templates: "Ilimitados + custom",
      support: "24/7 dedicado + SLA 99.9%",
      analytics: "BI completo + exportação",
      api: true,
      whitelabel: true,
      consultoria: "Semanal (estratégica)",
    },
    popular: false,
    cta: "Agendar Demo",
    ctaVariant: "outline" as const,
  },
];

const featureRows = [
  { key: "promptsIncluded", label: "Prompts IA inclusos", icon: Sparkles, category: "core" },
  { key: "photosIA", label: "Fotos IA (Mêsversário, Profissional)", icon: Camera, category: "core" },
  { key: "productPhotos", label: "Fotos de produto com IA", icon: Image, category: "core" },
  { key: "videoIA", label: "Vídeos animados com IA", icon: Video, category: "core" },
  { key: "liveShop", label: "Live Shop (Avatar IA + Influencer)", icon: ShoppingBag, category: "growth" },
  { key: "influencerCampaigns", label: "Campanhas com Influencers Reais", icon: Users, category: "growth" },
  { key: "avatarIA", label: "Avatares IA personalizados", icon: Palette, category: "growth" },
  { key: "templates", label: "Templates & estilos", icon: Star, category: "tools" },
  { key: "analytics", label: "Analytics & insights", icon: BarChart3, category: "tools" },
  { key: "support", label: "Suporte", icon: Headphones, category: "tools" },
  { key: "api", label: "API de integração", icon: Zap, category: "enterprise" },
  { key: "whitelabel", label: "White-label completo", icon: Crown, category: "enterprise" },
  { key: "consultoria", label: "Consultoria estratégica", icon: Shield, category: "enterprise" },
] as const;

const categoryLabels: Record<string, string> = {
  core: "Criação de Conteúdo",
  growth: "Crescimento & Vendas",
  tools: "Ferramentas",
  enterprise: "Enterprise",
};

export const PlansSection = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) return <Check className="w-4 h-4 text-primary" />;
    if (value === false) return <X className="w-3.5 h-3.5 text-muted-foreground/20" />;
    return <span className="text-xs font-medium text-foreground leading-tight">{value}</span>;
  };

  const getPrice = (plan: typeof plans[0]) => billing === "monthly" ? plan.price : plan.yearlyPrice;

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
            7 dias grátis · Sem cartão de crédito
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Pare de pagar por foto.{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Assine e crie sem limites.
            </span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-light">
            Prompts, fotos de mêsversário, fotos profissionais, Live Shop e campanhas com influencers — 
            tudo em um único plano. <strong className="text-foreground">Economize até 80%</strong> vs compra avulsa.
          </p>
        </motion.div>

        {/* Value Anchor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="px-4 py-2 rounded-xl bg-card border border-border text-sm text-center">
            <span className="text-muted-foreground">5 prompts avulsos = </span>
            <span className="text-foreground font-bold">R$105</span>
          </div>
          <span className="text-muted-foreground text-lg">→</span>
          <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-center">
            <span className="text-primary">Starter com 5 prompts + 5 fotos = </span>
            <span className="text-primary font-bold">R$55/mês</span>
          </div>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-12"
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
            <span className="absolute -top-2.5 -right-4 px-2 py-0.5 rounded-full bg-secondary/90 text-secondary-foreground text-[10px] font-bold whitespace-nowrap">
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
                       MELHOR CUSTO-BENEFÍCIO
                     </Badge>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <plan.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                  </div>
                </div>

                {/* Highlight pill */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    <Sparkles className="w-3 h-3" />
                    {plan.highlight}
                  </span>
                </div>

                {/* Price with anchor */}
                <div className="mb-1 flex items-center gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold text-foreground">{getPrice(plan)}</span>
                    <span className="text-muted-foreground text-sm">/mês</span>
                  </div>
                  <span className="text-sm text-muted-foreground line-through">R${plan.anchor}</span>
                </div>

                {billing === "yearly" && (
                  <p className="text-xs text-secondary font-medium mb-4">
                    Economize R${(
                      (parseInt(plan.price.replace(".", "")) - parseInt(plan.yearlyPrice.replace(".", ""))) * 12
                    ).toLocaleString("pt-BR")}/ano
                  </p>
                )}
                {billing !== "yearly" && <div className="mb-4" />}

                {/* Features - only included ones */}
                <div className="space-y-2.5 mb-6">
                  {featureRows.map((row) => {
                    const val = plan.features[row.key as keyof typeof plan.features];
                    if (val === false) return null;
                    return (
                      <div key={row.key} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground leading-tight">
                          <strong className="text-foreground/80">{row.label}</strong>
                          {typeof val === "string" ? `: ${val}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <GlassButton
                  className="w-full"
                  variant={plan.ctaVariant}
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
              <div className="p-6 flex flex-col justify-end">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Compare os planos</p>
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-5 text-center relative ${
                    plan.popular ? "bg-primary/[0.05]" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                  )}
                  {plan.popular && (
                    <Badge className="mb-2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 border-0">
                      MELHOR CUSTO-BENEFÍCIO
                    </Badge>
                  )}
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <plan.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-base">{plan.name}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3 leading-tight">{plan.tagline}</p>

                  {/* Highlight */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      {plan.highlight}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">R${plan.anchor}</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-xs text-muted-foreground">R$</span>
                    <span className="text-3xl font-bold">{getPrice(plan)}</span>
                    <span className="text-xs text-muted-foreground">/mês</span>
                  </div>

                  {billing === "yearly" && (
                    <p className="text-[10px] text-secondary font-medium mt-1">
                      Economize R${(
                        (parseInt(plan.price.replace(".", "")) - parseInt(plan.yearlyPrice.replace(".", ""))) * 12
                      ).toLocaleString("pt-BR")}/ano
                    </p>
                  )}

                  <GlassButton
                    className="w-full mt-3"
                    variant={plan.ctaVariant}
                    size="sm"
                    onClick={() => navigate("/login")}
                  >
                    {plan.cta}
                  </GlassButton>
                </div>
              ))}
            </div>

            {/* Feature Rows grouped by category */}
            {Object.entries(categoryLabels).map(([catKey, catLabel]) => {
              const rows = featureRows.filter((r) => r.category === catKey);
              if (rows.length === 0) return null;
              return (
                <div key={catKey}>
                  {/* Category Header */}
                  <div className="grid grid-cols-5 bg-white/[0.02] border-b border-white/[0.06]">
                    <div className="p-3 pl-5 col-span-5">
                      <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                        {catLabel}
                      </span>
                    </div>
                  </div>
                  {rows.map((row, i) => (
                    <div
                      key={row.key}
                      className={`grid grid-cols-5 ${
                        i % 2 === 0 ? "bg-white/[0.008]" : ""
                      } border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors`}
                    >
                      <div className="p-3.5 pl-5 flex items-center gap-2.5">
                        <row.icon className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                      </div>
                      {plans.map((plan) => (
                        <div
                          key={plan.name}
                          className={`p-3.5 flex items-center justify-center ${
                            plan.popular ? "bg-primary/[0.04]" : ""
                          }`}
                        >
                          {renderFeatureValue(plan.features[row.key as keyof typeof plan.features])}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Conversion Nudge: ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-10 p-6 rounded-2xl border border-primary/10 bg-primary/[0.03] text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Faça as contas:</p>
          <p className="text-base md:text-lg text-foreground font-medium">
            20 prompts avulsos (R$21 cada) = <span className="line-through text-muted-foreground">R$420/mês</span>
            {" → "}
            <strong className="text-primary">Creator Pro por R${billing === "monthly" ? "220" : "176"}/mês</strong>
            {" + fotos ilimitadas + vídeos + Live Shop"}
          </p>
          <p className="text-xs text-secondary mt-2 font-medium">
            Economia de {billing === "monthly" ? "47%" : "58%"} + funcionalidades extras inclusas
          </p>
        </motion.div>

        {/* Trust / Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 border-2 border-background"
                />
              ))}
            </div>
            <span>
              <strong className="text-foreground">2.847</strong> creators assinando
            </span>
          </div>
          <span className="hidden sm:block text-white/10">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Garantia de 7 dias — cancele e receba reembolso total</span>
          </div>
          <span className="hidden sm:block text-white/10">|</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Sem fidelidade, cancele a qualquer momento</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
