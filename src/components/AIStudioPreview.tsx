import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, ArrowRight, Wand2, Lock, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import templateFitness from "@/assets/template-fitness.png";
import templateBeauty from "@/assets/template-beauty.png";
import templatePerfume from "@/assets/template-perfume.png";

const templates = [
  {
    id: "fitness",
    name: "Fitness Influencer",
    description: "Academia premium • Whey Protein",
    image: templateFitness,
    category: "fitness",
  },
  {
    id: "beauty",
    name: "Beauty Store",
    description: "Loja de cosméticos • Beleza natural",
    image: templateBeauty,
    category: "beauty",
  },
  {
    id: "perfume",
    name: "Luxury Boutique",
    description: "Boutique de luxo • Perfumes premium",
    image: templatePerfume,
    category: "perfume",
  }
];

export const AIStudioPreview = () => {
  const navigate = useNavigate();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [productName, setProductName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateClick = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setProductName("");
    setShowPreview(false);
  };

  const handleSimulate = () => {
    if (!productName || productName.trim().length < 2) {
      toast.error("Digite o nome do seu produto");
      return;
    }
    setShowPreview(true);
    toast.success("Simulação pronta! Cadastre-se para gerar de verdade 🎨");
  };

  const handleCreateAccount = () => {
    navigate("/login");
  };

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Novidade: Criar com IA
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold">
            Transforme seu produto em{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              conteúdo profissional
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Escolha um template de influencer, personalize com seu produto e gere imagens e vídeos de alta qualidade com IA em segundos
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group cursor-pointer transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/20 border-border/50 hover:border-primary/50"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => handleTemplateClick(template)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                  <Badge className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                    {template.category}
                  </Badge>
                  <h3 className="text-2xl font-bold">{template.name}</h3>
                  <p className="text-sm text-gray-200">{template.description}</p>
                  
                  {/* Hover overlay */}
                  <div 
                    className={`transition-all duration-300 ${
                      hoveredTemplate === template.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <div className="pt-4 border-t border-white/20 mt-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Wand2 className="w-4 h-4" />
                        <span>Clique para personalizar</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder indicator */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  SEU PRODUTO AQUI
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">
              Como funciona?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-left mb-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mb-3">
                  1
                </div>
                <h4 className="font-semibold">Escolha o Template</h4>
                <p className="text-muted-foreground">
                  Selecione o estilo de influencer que combina com seu produto
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mb-3">
                  2
                </div>
                <h4 className="font-semibold">Personalize</h4>
                <p className="text-muted-foreground">
                  Ajuste características da modelo e adicione seu produto
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mb-3">
                  3
                </div>
                <h4 className="font-semibold">Gere & Baixe</h4>
                <p className="text-muted-foreground">
                  Crie imagens e vídeos profissionais instantaneamente
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/app/ai-studio")}
                className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Começar Agora Grátis
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="gap-2 text-lg px-8 py-6"
              >
                Ver Exemplos
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            ⚡ Simulação grátis • Geração real com cadastro • Veo 3 powered
          </p>
        </div>
      </div>

      {/* Simulation Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-primary" />
              Simule seu Produto
            </DialogTitle>
            <DialogDescription>
              Veja como seu produto ficaria com {selectedTemplate?.name}. Para gerar de verdade, faça seu cadastro!
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview Side */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Preview da Simulação</Label>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={selectedTemplate.image}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Product name overlay */}
                    {showPreview && productName && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="text-center space-y-4 p-8">
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-sm">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                              {productName}
                            </h3>
                            <Badge className="mb-4">{selectedTemplate.category}</Badge>
                            <p className="text-sm text-gray-600 mb-6">
                              Esta é uma simulação. A imagem real será gerada com seu produto integrado!
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                              <Lock className="w-4 h-4" />
                              <span>Faça login para gerar de verdade</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Watermark for simulation */}
                    {showPreview && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        SIMULAÇÃO
                      </div>
                    )}
                  </div>

                  {showPreview && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Esta é apenas uma prévia. Cadastre-se para gerar imagens reais em alta qualidade!
                      </p>
                    </div>
                  )}
                </div>

                {/* Input Side */}
                <div className="space-y-6">
                  <div className="p-6 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Template Selecionado</p>
                    <p className="text-xl font-bold">{selectedTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="product-name">Nome do seu Produto</Label>
                    <Input
                      id="product-name"
                      placeholder="Ex: WHEY PROTEIN ULTRA, Perfume Essence, Skincare Premium..."
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="text-lg h-12"
                      onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite o nome que aparecerá no produto na imagem
                    </p>
                  </div>

                  <Button
                    onClick={handleSimulate}
                    disabled={!productName || productName.trim().length < 2}
                    className="w-full h-12 text-base gap-2"
                    size="lg"
                  >
                    <Wand2 className="w-5 h-5" />
                    Ver Simulação
                  </Button>

                  {showPreview && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">🎨 Gostou do resultado?</p>
                        <p className="text-sm text-muted-foreground">
                          Crie sua conta gratuitamente e tenha acesso a:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Geração real de imagens em alta qualidade</li>
                          <li>• Personalização completa (cabelo, olhos, pele)</li>
                          <li>• Criação de vídeos com IA (Veo 3)</li>
                          <li>• Download sem marca d'água</li>
                          <li>• Galeria de todas suas criações</li>
                        </ul>
                      </div>

                      <Button
                        onClick={handleCreateAccount}
                        className="w-full h-12 text-base gap-2"
                        size="lg"
                        variant="default"
                      >
                        <Sparkles className="w-5 h-5" />
                        Criar Conta Grátis
                      </Button>

                      <Button
                        onClick={() => {
                          toast.info("Faça login para baixar suas criações!");
                          handleCreateAccount();
                        }}
                        className="w-full gap-2"
                        variant="outline"
                        disabled
                      >
                        <Download className="w-4 h-4" />
                        Baixar (Requer Cadastro)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
