import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Zap, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Planos() {
  const plans = [
    {
      name: "Starter",
      price: "R$ 499",
      period: "/mês",
      features: ["Até 5 campanhas por mês", "Acesso a influenciadores reais", "Dashboard básico de analytics", "Suporte por email"]
    },
    {
      name: "Professional",
      price: "R$ 1.499",
      period: "/mês",
      features: ["Campanhas ilimitadas", "Acesso total a influenciadores e avatares", "Analytics avançado", "Consultoria dedicada", "Suporte 24/7"]
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      features: ["Tudo do Professional", "Curadoria premium de artistas", "Avatares ilimitados", "White-label", "API personalizada", "Gerente exclusivo"]
    }
  ];

  const planIcons = [Zap, Crown, Rocket];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Planos ARCANA</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Planos e Preços
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para sua estratégia de marketing com influencers e avatares IA
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => {
          const Icon = planIcons[i];
          const isPopular = plan.name === "Professional";
          return (
            <div key={i} className="relative group">
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-secondary border-0">
                    MAIS POPULAR
                  </Badge>
                </div>
              )}
              
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                isPopular ? 'from-primary to-secondary opacity-50' : 'from-border to-border opacity-20'
              } rounded-2xl blur group-hover:opacity-70 transition duration-500`} />
              
              <div className={`relative bg-card/60 backdrop-blur-xl border rounded-2xl p-8 h-full transition-all ${
                isPopular ? 'border-primary/50 scale-105' : 'border-border/50 hover:border-primary/30'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    i === 0 ? 'from-primary to-primary/70' : 
                    i === 1 ? 'from-secondary to-secondary/70' : 
                    'from-artist to-artist/70'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">{plan.period}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full h-12 ${
                    isPopular ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' : ''
                  }`}
                  variant={isPopular ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Falar com vendas" : "Escolher Plano"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="max-w-6xl mx-auto mt-16 p-8 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Recursos Inclusos em Todos os Planos</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Analytics em Tempo Real", desc: "Dashboards completos com métricas de performance" },
            { icon: Crown, title: "Suporte Prioritário", desc: "Atendimento especializado para suas campanhas" },
            { icon: Zap, title: "Integrações", desc: "Conecte com suas plataformas favoritas" }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="text-center p-6 rounded-xl bg-background/30 border border-border/30">
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
