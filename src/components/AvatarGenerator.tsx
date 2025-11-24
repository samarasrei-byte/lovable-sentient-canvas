import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Wand2, Brain, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";

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
      description: "Mulher, 28 anos, tech minimalista, confiante, inovadora",
      image: influencerTech,
    },
    {
      name: "Marcus Fit",
      description: "Homem atlético, 32 anos, personal trainer, fitness motivacional",
      image: influencerFitness,
    },
    {
      name: "Luna Fashion",
      description: "Mulher fashion, 25 anos, modelo, haute couture contemporâneo",
      image: influencerFashion,
    },
    {
      name: "Ana Wellness",
      description: "Mulher, 30 anos, yoga e bem-estar, serena, inspiradora",
      image: influencerWellness,
    },
    {
      name: "Ricardo Business",
      description: "Homem, 35 anos, empreendedor, business casual, executivo",
      image: influencerBusiness,
    },
    {
      name: "Julia Travel",
      description: "Mulher, 26 anos, travel blogger, aventureira, autêntica",
      image: influencerTravel,
    }
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Powered by Nano Banana</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Crie Seu Influencer IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transforme ideias em realidade. Gere avatares hiper-realistas em segundos com tecnologia de ponta.
          </p>
        </div>

        {/* Main Generator Layout - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Input Side */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition duration-500" />
            
            <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-8 h-full flex flex-col">
              <div className="space-y-6">
                <div className="relative">
                  <Textarea
                    placeholder="Descreva seu influencer ideal: estilo, personalidade, características físicas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[300px] text-lg bg-background/50 border-primary/30 focus:border-primary rounded-2xl resize-none"
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
              </div>
            </div>
          </div>

          {/* Generated Image Side */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-primary to-secondary rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition duration-500" />
            
            <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-8 h-full flex items-center justify-center">
              {generatedImage ? (
                <div className="space-y-4 animate-scale-in w-full">
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
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Seu avatar gerado aparecerá aqui
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Influencer Examples Below */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">Influencers de Exemplo</h3>
            <p className="text-muted-foreground">Clique em um exemplo para usar como referência</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {influencers.map((influencer, i) => (
              <Card
                key={i}
                onClick={() => setPrompt(influencer.description)}
                className="group relative cursor-pointer overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full border border-primary">
                      <Wand2 className="w-5 h-5 text-primary inline mr-2" />
                      <span className="text-sm font-bold">Usar como exemplo</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <h4 className="text-xl font-bold mb-2">{influencer.name}</h4>
                  <p className="text-sm text-muted-foreground">{influencer.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};