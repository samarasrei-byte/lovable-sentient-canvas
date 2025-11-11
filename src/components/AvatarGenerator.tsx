import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const AvatarGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, descreva seu avatar");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      toast.success("Avatar gerado com sucesso! Em breve você poderá visualizar e personalizar.");
      setIsGenerating(false);
    }, 2000);
  };

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
                <Input
                  placeholder='Ex: "Mulher de olhos azuis, cabelos castanhos, 28 anos, corpo fitness, estilo moderno e confiante"'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-16 text-lg bg-background/50 border-primary/20 focus:border-primary/50 transition-all pl-6 pr-6"
                  disabled={isGenerating}
                />
                <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Gerando Avatar...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Gerar Influencer
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
              {[
                { label: "Ajuste de voz", icon: "🎙️" },
                { label: "Múltiplos idiomas", icon: "🌍" },
                { label: "Tom personalizado", icon: "🎭" },
                { label: "Estilo único", icon: "✨" }
              ].map((feature, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-background/30 border border-border/30 hover:border-primary/30 transition-colors">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-sm text-muted-foreground">{feature.label}</div>
                </div>
              ))}
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
                className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 text-sm text-foreground/80 transition-colors"
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
