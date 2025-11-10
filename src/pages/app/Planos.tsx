import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Planos & Assinatura</h1>
        <p className="text-muted-foreground mt-2">Escolha o plano que se adapta ao seu momento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/40 transition-all">
            <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={i === 1 ? "default" : "outline"}>
              {plan.price === "Personalizado" ? "Falar com vendas" : "Escolher"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
