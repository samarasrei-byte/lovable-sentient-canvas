import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    gradient: "from-primary/20 to-secondary/20",
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
    gradient: "from-primary to-secondary",
  },
];

export const PlansSection = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 px-4 py-2 bg-secondary/10 border-secondary/30 text-secondary">
            Planos
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Escolha o plano ideal para você
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Comece com 7 dias grátis em qualquer plano. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`relative overflow-hidden border-2 h-full ${
                plan.popular 
                  ? "border-primary shadow-xl shadow-primary/20" 
                  : "border-border/50"
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground text-xs">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-3`}>
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground text-sm">/mês</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/login")}
                  >
                    Testar grátis por 7 dias
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
