import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2, Brain, Zap, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AvatarGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, descreva seu avatar");
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("consultoria-ai", {
        body: { 
          messages: [{ role: "user", content: `Crie um avatar de influencer digital baseado nesta descrição: ${prompt}` }],
          type: 'generate-avatar'
        }
      });

      if (error) throw error;

      setGeneratedImage(data.image);
      toast.success("Avatar gerado com sucesso!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao gerar avatar. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const influencers = [
    {
      name: "Sarah Tech",
      description: "Influencer de IA: mulher, 28 anos, estilo tech minimalista, confiante, inovadora",
      image: "🤖"
    },
    {
      name: "Marcus Fit",
      description: "Homem atlético, 32 anos, personal trainer, estilo fitness motivacional",
      image: "💪"
    },
    {
      name: "Luna Fashion",
      description: "Mulher fashion, 25 anos, modelo, estilo haute couture contemporâneo",
      image: "👗"
    },
    {
      name: "Alex Gaming",
      description: "Gamer profissional, 26 anos, estilo cyberpunk futurista, energético",
      image: "🎮"
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8 animate-scale-in">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Powered by Nano Banana</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Crie Seu Influencer IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transforme ideias em realidade. Gere avatares hiper-realistas em segundos com tecnologia de ponta.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Generator Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition duration-500" />
            
            <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-10">
              <div className="space-y-6">
                <div className="relative">
                  <Textarea
                    placeholder="Descreva seu influencer ideal: estilo, personalidade, características físicas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[160px] text-lg bg-background/50 border-primary/30 focus:border-primary rounded-2xl resize-none"
                    disabled={isGenerating}
                  />
                  <div className="absolute right-4 top-4">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary hover:scale-[1.02] transition-all shadow-lg shadow-primary/50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin mr-3" />
                      Criando Magia...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6 mr-3" />
                      Gerar Agora
                    </>
                  )}
                </Button>

                {generatedImage && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-primary/50">
                      <img src={generatedImage} alt="Avatar gerado" className="w-full" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Influencer Examples */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-secondary" />
              Influencers de Exemplo
            </h3>
            
            <div className="grid gap-4">
              {influencers.map((influencer, i) => (
                <div
                  key={i}
                  onClick={() => setPrompt(influencer.description)}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 group-hover:from-primary/50 group-hover:via-secondary/50 group-hover:to-primary/50 rounded-2xl blur transition duration-300" />
                  
                  <div className="relative bg-card/70 backdrop-blur-xl border border-border/50 group-hover:border-primary/50 rounded-2xl p-6 transition-all group-hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl flex-shrink-0">
                        {influencer.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{influencer.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{influencer.description}</p>
                      </div>
                      <Wand2 className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Geração Instantânea", icon: Zap, color: "from-primary to-secondary" },
            { label: "Hiper-Realista", icon: Sparkles, color: "from-secondary to-artist" },
            { label: "Ilimitadas Variações", icon: Wand2, color: "from-artist to-primary" },
            { label: "100% Personalizado", icon: Brain, color: "from-primary to-secondary" }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300`} />
                <div className="relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center group-hover:border-primary/50 transition-all">
                  <Icon className={`w-10 h-10 mx-auto mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                  <div className="font-semibold">{feature.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
