import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2, Mic, Globe, Drama, Palette, ArrowRight, Crown } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AvatarGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, descreva seu avatar");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      toast.success("Avatar gerado com sucesso!");
      setIsGenerating(false);
      setShowPlanSelection(true);
    }, 3000);
  };

  const handlePlanSelection = (plan: string) => {
    toast.success(`Plano ${plan} selecionado! Redirecionando...`);
    setTimeout(() => {
      navigate("/app/planos");
    }, 1000);
  };

  if (showPlanSelection) {
    return (
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-scale-in">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Avatar Gerado</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Escolha seu Plano
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecione o plano ideal para começar a usar seu influencer IA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "R$ 497", features: ["1 Avatar IA", "Voz básica", "Analytics básico", "Suporte por email"] },
              { name: "Professional", price: "R$ 997", features: ["3 Avatares IA", "Voz premium", "Analytics avançado", "Consultoria IA", "Suporte prioritário"], popular: true },
              { name: "Enterprise", price: "Personalizado", features: ["Avatares ilimitados", "Voz ultra-realista", "Analytics completo", "Consultoria dedicada", "Suporte VIP", "API access"] }
            ].map((plan, i) => (
              <div key={i} className="relative group">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-xs font-bold z-10">
                    MAIS POPULAR
                  </div>
                )}
                <div className={`relative bg-card/60 backdrop-blur-xl border rounded-2xl p-8 h-full transition-all ${
                  plan.popular ? 'border-primary/50 shadow-lg shadow-primary/20 scale-105' : 'border-border/50 hover:border-primary/30'
                }`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {plan.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePlanSelection(plan.name)}
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-secondary' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Escolher Plano
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Wand2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">IA Generativa</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Prompt → Influencer IA
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descreva seu avatar ideal e deixe a IA criar um influencer digital personalizado para suas campanhas
          </p>
        </div>

        {/* Generator Card */}
        <div className="relative group">
          {/* Glow border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-500" />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12">
            {/* Input area */}
            <div className="space-y-6">
              <div className="relative">
                <Textarea
                  placeholder='Ex: "Mulher de olhos azuis, cabelos castanhos, 28 anos, corpo fitness, estilo moderno e confiante, sorriso natural, cabelo ondulado, look casual-chic"'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] text-base bg-background/50 border-primary/20 focus:border-primary/50 transition-all resize-none"
                  disabled={isGenerating}
                />
                <Sparkles className="absolute right-4 top-4 w-5 h-5 text-primary/40" />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Gerando Avatar IA...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6" />
                      Gerar Influencer IA
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>

            {/* Features grid with Lucide icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
              {[
                { label: "Ajuste de voz", icon: Mic, color: "text-primary" },
                { label: "Múltiplos idiomas", icon: Globe, color: "text-secondary" },
                { label: "Tom personalizado", icon: Drama, color: "text-artist" },
                { label: "Estilo único", icon: Palette, color: "text-primary" }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="text-center p-4 rounded-lg bg-background/30 border border-border/30 hover:border-primary/30 hover:bg-background/50 transition-all group/item">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${feature.color} group-hover/item:scale-110 transition-transform`} />
                    <div className="text-sm text-muted-foreground">{feature.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Example prompts */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Exemplos populares:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Homem de 35 anos, executivo, look corporativo",
              "Mulher atlética, 25 anos, estilo fitness",
              "Artista urbano, 30 anos, streetwear"
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:scale-105 text-sm text-foreground/80 transition-all disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
