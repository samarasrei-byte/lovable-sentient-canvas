import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card";
import { Check, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "55",
    description: "Perfeito para começar",
    features: [
      "Criar imagens de produtos",
      "Criar fotos profissionais",
      "Usar templates prontos",
      "120 créditos/mês",
      "Suporte por email",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "220",
    description: "Para criadores profissionais",
    features: [
      "Tudo do Basic",
      "Animação de imagens com IA",
      "400 créditos/mês",
      "Acesso a features beta",
      "Suporte prioritário",
      "Templates exclusivos",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "1.200",
    description: "Para marcas e agências",
    features: [
      "Tudo do Pro",
      "Geração ilimitada de imagens IA",
      "Avatares IA personalizados",
      "Campanhas com influenciadores reais",
      "2.000 créditos/mês",
      "Consultoria estratégica mensal",
      "API de integração",
      "Gerente de conta dedicado",
    ],
    popular: false,
  },
  {
    name: "Enterprise",
    price: "2.000",
    description: "Solução completa white-label",
    features: [
      "Tudo do Business",
      "Créditos ilimitados",
      "White-label completo",
      "Avatares e artistas exclusivos",
      "IA treinada com sua marca",
      "Live Shop integrado",
      "SLA 99.9% garantido",
      "Suporte 24/7 dedicado",
      "Onboarding personalizado",
    ],
    popular: false,
  },
];

export const PlansSection = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="relative py-24 px-6 overflow-hidden">
      {/* Ultra subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/[0.02] to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            Planos simples e transparentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            Comece com 7 dias grátis. Cancele quando quiser.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Subtle glow for popular */}
              {plan.popular && (
                <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-xl blur-xl" />
              )}
              
              <GlassCard className={`relative h-full ${
                plan.popular 
                  ? "border-primary/20 bg-white/[0.03]" 
                  : ""
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-medium">
                      Mais Popular
                    </div>
                  </div>
                )}
                
                <GlassCardHeader className="pb-4 pt-8">
                  <h3 className="text-xl font-medium">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-semibold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">/mês</span>
                  </div>
                </GlassCardHeader>
                
                <GlassCardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <GlassButton 
                    className="w-full"
                    variant={plan.popular ? "glow" : "outline"}
                    size="lg"
                    onClick={() => navigate("/login")}
                  >
                    Começar Agora
                  </GlassButton>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
