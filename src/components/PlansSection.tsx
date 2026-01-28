import { Badge } from "@/components/ui/badge";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card";
import { Check, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Arcana BASIC",
    price: "55",
    description: "Perfeito para começar a criar",
    features: [
      "Criar imagens de produtos",
      "Criar fotos profissionais",
      "Usar templates prontos",
      "Criar com influenciadores",
      "Criar com avatares e artistas",
      "120 créditos/mês",
    ],
    icon: Sparkles,
    popular: false,
  },
  {
    name: "Arcana PRO",
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
    icon: Crown,
    popular: true,
  },
];

export const PlansSection = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      
      {/* Floating elements */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/8 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Crown className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Planos</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Escolha o plano{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              ideal
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Comece com 7 dias grátis em qualquer plano. Cancele quando quiser.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Glow effect for popular */}
              {plan.popular && (
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />
              )}
              
              <GlassCard className={`relative h-full ${
                plan.popular 
                  ? "border-primary/40 bg-white/8" 
                  : "border-white/10"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1.5 text-xs font-semibold shadow-lg">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <GlassCardHeader className="pb-4 pt-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    plan.popular 
                      ? "bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30" 
                      : "bg-white/10 border border-white/10"
                  }`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">/mês</span>
                  </div>
                </GlassCardHeader>
                
                <GlassCardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.popular 
                            ? "bg-success/20 text-success" 
                            : "bg-white/10 text-muted-foreground"
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <GlassButton 
                    className="w-full"
                    variant={plan.popular ? "glow" : "default"}
                    size="lg"
                    onClick={() => navigate("/login")}
                  >
                    Testar grátis por 7 dias
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
