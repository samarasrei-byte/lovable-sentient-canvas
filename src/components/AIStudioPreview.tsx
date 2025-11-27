import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, ArrowRight, Wand2, Lock, Download, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import templateFitness from "@/assets/template-fitness.png";
import templateBeauty from "@/assets/template-beauty.png";
import templatePerfume from "@/assets/template-perfume.png";

const templates = [
  {
    id: "fitness",
    name: "Fitness Influencer",
    description: "Academia premium • Whey Protein • Estilo atlético",
    image: templateFitness,
    category: "fitness",
    prompt: "Fotografia hiper-realista de uma influenciadora fitness jovem em close médio (torso e rosto), segurando um grande pote de whey protein com o rótulo '{PRODUCT}' visível e centralizado. Mulher caucasiana ruiva, cabelos longos e ondulados, pele levemente bronzeada com textura de pele realista e sardas sutis, sorriso confiante, olhar direto para a câmera. Corpo tonificado e braços definidos, usando top esportivo cinza escuro e legging combinando. Ambiente: academia premium bem iluminada com equipamentos desfocados no fundo, janelas grandes à direita proporcionando luz natural difusa + luzes artificiais de teto criando highlights musculares. Iluminação cinematográfica com key light suave do lado direito e rim light sutil para definir contorno. Ultra-realista, comercial, 1024x1024."
  },
  {
    id: "beauty",
    name: "Beauty Store",
    description: "Loja de cosméticos • Produtos de beleza • Elegância natural",
    image: templateBeauty,
    category: "beauty",
    prompt: "Fotografia comercial hiper-realista de uma mulher negra jovem apresentando um frasco de produto cosmético (pump) com o rótulo '{PRODUCT}' em destaque. Mulher com cabelo afro volumoso, textura de cachos bem definidos, pele rica e luminosa com acabamento natural, sorriso aberto e olhar direto para a câmera. Veste camisa de tecido acetinado cor pêssego/claro, brincos pequenos dourados, maquiagem leve e impecável. Posicionamento: close de busto, frasco segurado com a mão direita próximo ao rosto (rótulo voltado para a câmera), profundidade de campo curta que desfoca as prateleiras de produtos ao fundo (ambiente de loja cosméticos). Iluminação: luz de loja suave e uniforme com highlights sutis na pele; temperatura de cor neutra. Composição: enquadramento vertical, foco nos olhos e no rótulo, textura de pele realista, dentes naturais, brilho suave. 1024x1024."
  },
  {
    id: "perfume",
    name: "Luxury Boutique",
    description: "Boutique de luxo • Perfumes premium • Sofisticação",
    image: templatePerfume,
    category: "perfume",
    prompt: "Fotografia editoral comercial hiper-realista de uma vendedora em boutique de perfumes segurando um frasco de perfume transparente com tampa e caixa de apresentação sobre o balcão com o rótulo '{PRODUCT}'. Mulher caucasiana morena, cabelos lisos castanhos escuros, corte reto e sofisticado até os ombros, pele suave, sobrancelhas definidas, sorriso caloroso e olhar para a câmera. Usa uniforme preto elegante com bordado discreto em dourado no lado do peito. Posição: mão direita segurando o frasco elevado em frente ao peito, mão esquerda aberta em gesto de apresentação, bancada de mármore levemente refletiva à frente com caixas expositoras desfocadas ao fundo. Iluminação: luz quente de boutique, pontos de destaque sobre o produto, iluminação ambiente aconchegante, bokeh elegante nas prateleiras. Composição: frontal, simetria leve, foco nítido no rosto e no frasco, textura de pele natural. 1024x1024."
  }
];

export const AIStudioPreview = () => {
  const navigate = useNavigate();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(3);

  useEffect(() => {
    const checkGenerationLimit = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('arcana_free_generations');
      
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setGenerationsLeft(Math.max(0, 3 - data.count));
        } else {
          localStorage.setItem('arcana_free_generations', JSON.stringify({ date: today, count: 0 }));
          setGenerationsLeft(3);
        }
      } else {
        localStorage.setItem('arcana_free_generations', JSON.stringify({ date: today, count: 0 }));
      }
    };
    
    checkGenerationLimit();
  }, []);

  const handleTemplateClick = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setProductName("");
    setProductImage(null);
    setGeneratedImage(null);
  };

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande! Máximo 5MB");
        return;
      }
      setProductImage(file);
      toast.success("Imagem do produto carregada!");
    }
  };

  const handleGenerate = async () => {
    if (!productImage) {
      toast.error("Faça upload da imagem do seu produto");
      return;
    }

    if (generationsLeft <= 0) {
      toast.error("Você atingiu o limite diário. Crie uma conta para gerações ilimitadas!");
      return;
    }

    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      // Convert product image to base64
      const productImageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(productImage);
      });

      // Convert template image to base64 as reference
      const templateImageResponse = await fetch(selectedTemplate.image);
      const templateBlob = await templateImageResponse.blob();
      const templateImageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(templateBlob);
      });

      const { data, error } = await supabase.functions.invoke("generate-product-image", {
        body: { 
          productName: productName || "Produto",
          templateId: selectedTemplate.id,
          productImageBase64,
          templateImageBase64
        }
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImage(data.image);
        
        const today = new Date().toDateString();
        const stored = localStorage.getItem('arcana_free_generations');
        if (stored) {
          const genData = JSON.parse(stored);
          const newCount = genData.count + 1;
          localStorage.setItem('arcana_free_generations', JSON.stringify({ date: today, count: newCount }));
          setGenerationsLeft(Math.max(0, 3 - newCount));
        }
        
        await supabase.from('generated_images').insert({
          template_name: selectedTemplate.name,
          product_name: productName || "Produto",
          image_url: data.image,
          is_public: true,
          user_id: null
        });
        
        toast.success("Imagem gerada! Cadastre-se para remover a marca d'água 🎨");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
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
            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {generationsLeft} {generationsLeft === 1 ? 'geração gratuita restante' : 'gerações gratuitas restantes'} hoje
              </span>
            </div>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview Side */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Preview da Geração</Label>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {isGenerating ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <div className="text-center space-y-4">
                          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                          <div className="space-y-2">
                            <p className="text-lg font-semibold">Gerando sua imagem...</p>
                            <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
                          </div>
                        </div>
                      </div>
                    ) : generatedImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={generatedImage}
                          alt="Generated product"
                          className="w-full h-full object-cover"
                          onContextMenu={(e) => e.preventDefault()}
                          style={{ userSelect: "none", pointerEvents: "none" }}
                        />
                        
                        {/* ARCANA Watermark - Center */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center opacity-50">
                            <div className="text-6xl font-bold text-white/80 drop-shadow-2xl" style={{ 
                              textShadow: "0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)",
                              transform: "rotate(-15deg)"
                            }}>
                              ARCANA
                            </div>
                            <div className="text-sm text-white/70 font-medium">
                              Cadastre-se para remover
                            </div>
                          </div>
                        </div>

                        {/* Corner Watermarks */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                          ARCANA.AI
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                          Feito com ARCANA
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground space-y-3">
                          <img
                            src={selectedTemplate.image}
                            alt={selectedTemplate.name}
                            className="w-full h-full object-cover opacity-30 absolute inset-0"
                          />
                          <div className="relative z-10 bg-background/80 backdrop-blur-sm p-6 rounded-lg mx-4">
                            <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Sua imagem gerada aparecerá aqui</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {generatedImage && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-2">
                      <div className="flex items-start gap-2">
                        <Lock className="w-4 h-4 mt-0.5 text-yellow-600" />
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                            Marca d'água ARCANA
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">
                            Esta imagem contém marca d'água e não pode ser baixada ou copiada. Cadastre-se gratuitamente para gerar sem marca d'água e ter acesso completo!
                          </p>
                        </div>
                      </div>
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
                    <Label htmlFor="product-name">Nome do seu Produto (Opcional)</Label>
                    <Input
                      id="product-name"
                      placeholder="Ex: WHEY PROTEIN ULTRA, Perfume Essence..."
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="text-lg h-12"
                      disabled={isGenerating}
                      onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="product-upload">Upload do Produto *</Label>
                    <p className="text-xs text-muted-foreground">
                      Faça upload da imagem do seu produto para que ele apareça exatamente como você enviou na geração final.
                    </p>
                    {productImage ? (
                      <div className="border-2 border-primary rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                              <img 
                                src={URL.createObjectURL(productImage)} 
                                alt="Preview do produto"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{productImage.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(productImage.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProductImage(null)}
                            disabled={isGenerating}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductUpload}
                          className="hidden"
                          id="product-upload"
                          disabled={isGenerating}
                        />
                        <label htmlFor="product-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Clique para fazer upload (máx 5MB)
                          </p>
                        </label>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!productImage || isGenerating}
                    className="w-full h-12 text-base gap-2"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Gerar Imagem Agora
                      </>
                    )}
                  </Button>

                  {generatedImage && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">🎨 Gostou do resultado?</p>
                        <p className="text-sm text-muted-foreground">
                          Crie sua conta gratuitamente e tenha acesso a:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• ✨ Imagens <strong>SEM marca d'água</strong></li>
                          <li>• 🎬 Download em alta qualidade</li>
                          <li>• 🎨 Personalização completa (cabelo, olhos, pele)</li>
                          <li>• 🎥 Criação de vídeos com IA (Veo 3)</li>
                          <li>• 📁 Galeria de todas suas criações</li>
                        </ul>
                      </div>

                      <Button
                        onClick={handleCreateAccount}
                        className="w-full h-12 text-base gap-2"
                        size="lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        Criar Conta Grátis
                      </Button>

                      <Button
                        onClick={() => {
                          toast.error("Faça login para baixar sem marca d'água!");
                          setTimeout(() => handleCreateAccount(), 1500);
                        }}
                        className="w-full gap-2"
                        variant="outline"
                        disabled
                      >
                        <Download className="w-4 h-4" />
                        Baixar sem Marca d'água (Requer Cadastro)
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
