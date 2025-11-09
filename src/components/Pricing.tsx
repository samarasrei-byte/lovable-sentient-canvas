import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "R$ 499",
      period: "/mês",
      description: "Perfeito para pequenas marcas começando",
      features: [
        "Até 5 campanhas por mês",
        "Acesso a influenciadores reais",
        "Dashboard básico de analytics",
        "Suporte por email",
        "1 avatar digital básico"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "R$ 1.499",
      period: "/mês",
      description: "Ideal para marcas em crescimento",
      features: [
        "Campanhas ilimitadas",
        "Acesso total a influenciadores e avatares",
        "Analytics avançado em tempo real",
        "Consultoria estratégica dedicada",
        "5 avatares digitais personalizados",
        "Integração com Live Shop",
        "Suporte prioritário 24/7"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      description: "Solução completa para grandes marcas",
      features: [
        "Tudo do Professional",
        "Avatares ilimitados",
        "White-label disponível",
        "API personalizada",
        "Gerente de conta exclusivo",
        "SLA garantido",
        "Treinamento da equipe",
        "Relatórios customizados"
      ],
      highlighted: false
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Planos que se adaptam ao seu momento
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para impulsionar suas campanhas com influenciadores e avatares digitais
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 ${
                plan.highlighted 
                  ? 'border-primary shadow-2xl shadow-primary/20 scale-105 md:scale-110' 
                  : 'hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Mais Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-10">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-lg">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-8">
                <Button 
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-primary to-secondary hover:scale-105 shadow-xl shadow-primary/30' 
                      : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.price === "Personalizado" ? "Falar com vendas" : "Começar agora"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito necessário.
          </p>
        </div>
      </div>
    </section>
  );
};
