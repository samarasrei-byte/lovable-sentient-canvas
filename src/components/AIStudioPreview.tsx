import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, ArrowRight, Wand2, Lock, Download, Upload, Loader2, User } from "lucide-react";
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
    prompt: "Fotografia hiper-realista de uma influenciadora fitness jovem em close médio (torso e rosto), segurando um grande pote de suplemento com o rótulo '{PRODUCT}' visível e centralizado. Mulher {HAIR_COLOR}, {HAIR_STYLE}, {EYE_COLOR}, pele {SKIN_TONE} com textura de pele realista e sardas sutis, sorriso confiante, olhar direto para a câmera, altura {HEIGHT}. Corpo tonificado e braços definidos, usando top esportivo cinza escuro e legging combinando. Ambiente: academia premium bem iluminada com equipamentos desfocados no fundo, janelas grandes à direita proporcionando luz natural difusa + luzes artificiais de teto criando highlights musculares. Iluminação cinematográfica com key light suave do lado direito e rim light sutil para definir contorno. Ultra-realista, comercial, 1024x1024. {CUSTOM_DESCRIPTION}"
  },
  {
    id: "beauty",
    name: "Beauty Store",
    description: "Loja de cosméticos • Produtos de beleza • Elegância natural",
    image: templateBeauty,
    category: "beauty",
    prompt: "Fotografia comercial hiper-realista de uma mulher {HAIR_COLOR} jovem apresentando um frasco de produto cosmético (pump) com o rótulo '{PRODUCT}' em destaque. Mulher com {HAIR_STYLE}, {EYE_COLOR}, pele {SKIN_TONE} e luminosa com acabamento natural, sorriso aberto e olhar direto para a câmera, altura {HEIGHT}. Veste camisa de tecido acetinado cor pêssego/claro, brincos pequenos dourados, maquiagem leve e impecável. Posicionamento: close de busto, frasco segurado com a mão direita próximo ao rosto (rótulo voltado para a câmera), profundidade de campo curta que desfoca as prateleiras de produtos ao fundo (ambiente de loja cosméticos). Iluminação: luz de loja suave e uniforme com highlights sutis na pele; temperatura de cor neutra. Composição: enquadramento vertical, foco nos olhos e no rótulo, textura de pele realista, dentes naturais, brilho suave. 1024x1024. {CUSTOM_DESCRIPTION}"
  },
  {
    id: "perfume",
    name: "Luxury Boutique",
    description: "Boutique de luxo • Perfumes premium • Sofisticação",
    image: templatePerfume,
    category: "perfume",
    prompt: "Fotografia editoral comercial hiper-realista de uma vendedora em boutique de perfumes segurando um frasco de perfume transparente com tampa e caixa de apresentação sobre o balcão com o rótulo '{PRODUCT}'. Mulher {HAIR_COLOR}, {HAIR_STYLE}, {EYE_COLOR}, pele {SKIN_TONE}, sobrancelhas definidas, sorriso caloroso e olhar para a câmera, altura {HEIGHT}. Usa uniforme preto elegante com bordado discreto em dourado no lado do peito. Posição: mão direita segurando o frasco elevado em frente ao peito, mão esquerda aberta em gesto de apresentação, bancada de mármore levemente refletiva à frente com caixas expositoras desfocadas ao fundo. Iluminação: luz quente de boutique, pontos de destaque sobre o produto, iluminação ambiente aconchegante, bokeh elegante nas prateleiras. Composição: frontal, simetria leve, foco nítido no rosto e no frasco, textura de pele natural. 1024x1024. {CUSTOM_DESCRIPTION}"
  }
];

export const AIStudioPreview = () => {
  const navigate = useNavigate();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(3);
  
  // Customization states
  const [hairColor, setHairColor] = useState("cabelos castanhos");
  const [eyeColor, setEyeColor] = useState("olhos castanhos");
  const [skinTone, setSkinTone] = useState("pele clara");
  const [height, setHeight] = useState("média (1,65m)");
  const [hairStyle, setHairStyle] = useState("cabelos longos e lisos");
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
      const checkGenerationLimit = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('arcana_free_generations');
      
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setGenerationsLeft(Math.max(0, 5 - data.count));
        } else {
          localStorage.setItem('arcana_free_generations', JSON.stringify({ date: today, count: 0 }));
          setGenerationsLeft(5);
        }
      } else {
        localStorage.setItem('arcana_free_generations', JSON.stringify({ date: today, count: 0 }));
      }
    };
    
    checkGenerationLimit();
  }, []);

  const handleTemplateClick = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setProductImage(null);
    setGeneratedImage(null);
    // Reset customizations
    setHairColor("cabelos castanhos");
    setEyeColor("olhos castanhos");
    setSkinTone("pele clara");
    setHeight("média (1,65m)");
    setHairStyle("cabelos longos e lisos");
    setCustomDescription("");
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

      // Apply customizations to prompt
      let customizedPrompt = selectedTemplate.prompt
        .replace('{HAIR_COLOR}', hairColor)
        .replace('{EYE_COLOR}', eyeColor)
        .replace('{SKIN_TONE}', skinTone)
        .replace('{HEIGHT}', height)
        .replace('{HAIR_STYLE}', hairStyle)
        .replace('{CUSTOM_DESCRIPTION}', customDescription ? `Detalhes adicionais: ${customDescription}` : '');

      const { data, error } = await supabase.functions.invoke("generate-product-image", {
        body: { 
          productName: "Produto",
          templateId: selectedTemplate.id,
          productImageBase64,
          templateImageBase64,
          customPrompt: customizedPrompt
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
          setGenerationsLeft(Math.max(0, 5 - newCount));
        }
        
        await supabase.from('generated_images').insert({
          template_name: selectedTemplate.name,
          product_name: "Produto",
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
        <div className="text-center mb-16 space-y-8">
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

          {/* Free Tier Badge */}
          <Card className="max-w-md mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 shadow-lg">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-foreground">Plano Gratuito</p>
                  <p className="text-sm text-muted-foreground">Teste sem compromisso</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">5</p>
                <p className="text-xs text-muted-foreground font-medium">artes/dia</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Section Header */}
        <div className="text-center mb-10 space-y-3">
          <h3 className="text-3xl md:text-4xl font-bold">Escolha seu Template</h3>
          <p className="text-lg text-muted-foreground">Selecione o estilo que melhor representa seu produto</p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group cursor-pointer transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/20 border-2 border-border/50 hover:border-primary/50 hover:scale-[1.02]"
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
          <DialogHeader className="space-y-4">
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Wand2 className="w-7 h-7 text-primary" />
                </div>
                Personalize sua Criação
              </DialogTitle>
              <DialogDescription className="text-base">
                Veja como seu produto ficaria com {selectedTemplate?.name}. Configure cada detalhe!
              </DialogDescription>
            </div>
            <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Gerações Gratuitas Hoje</p>
                    <p className="text-xs text-muted-foreground">Teste sem compromisso</p>
                  </div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/20">
                  <p className="text-2xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{generationsLeft}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">de 5 artes</p>
                </div>
              </div>
            </Card>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6">
              {/* Before/After Preview Section */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* ANTES - Template Original */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Wand2 className="w-4 h-4" />
                      </div>
                      Template Original
                    </Label>
                    <Badge variant="outline" className="text-xs">ANTES</Badge>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-border shadow-lg">
                    <img
                      src={selectedTemplate.image}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-background/90 backdrop-blur-sm text-foreground border">
                        {selectedTemplate.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* DEPOIS - Preview Personalizado */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      {generatedImage ? "Sua Criação" : "Preview ao Vivo"}
                    </Label>
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20">DEPOIS</Badge>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/50 shadow-lg bg-muted">
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
                      <div className="relative w-full h-full">
                        <img
                          src={selectedTemplate.image}
                          alt={selectedTemplate.name}
                          className="w-full h-full object-cover opacity-40 blur-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />
                        
                        {/* Live Configuration Badges */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                          <div className="bg-background/95 backdrop-blur-sm border-2 border-primary/50 rounded-2xl p-6 space-y-3 max-w-[90%] shadow-2xl">
                            <div className="flex items-center gap-2 justify-center">
                              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                              <p className="font-bold text-sm">Configurações Atuais</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Badge variant="secondary" className="text-xs justify-center py-1.5">
                                {hairColor.split(' ')[1]}
                              </Badge>
                              <Badge variant="secondary" className="text-xs justify-center py-1.5">
                                {hairStyle.split(' ')[1]} {hairStyle.split(' ')[2]}
                              </Badge>
                              <Badge variant="secondary" className="text-xs justify-center py-1.5">
                                {eyeColor.split(' ')[1]}
                              </Badge>
                              <Badge variant="secondary" className="text-xs justify-center py-1.5">
                                {skinTone.split(' ')[1]}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center">
                              Clique em "Gerar" para criar a imagem final
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {generatedImage && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lock className="w-3.5 h-3.5 mt-0.5 text-yellow-600 flex-shrink-0" />
                        <div className="space-y-1 flex-1">
                          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                            Marca d'água ARCANA
                          </p>
                          <p className="text-[10px] text-yellow-700 dark:text-yellow-300">
                            Cadastre-se para gerar sem marca d'água!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Configuration Section */}
              <div className="space-y-6">
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <p className="text-sm font-semibold uppercase tracking-wide">Personalize sua Criação</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ajuste as características e veja o preview atualizar ao vivo
                    </p>
                  </div>
                </Card>

                {/* Personalization Form */}
                <Card className="border-2 border-primary/20 shadow-lg">
                  <div className="border-b bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold">Características da Modelo</h3>
                        <p className="text-xs text-muted-foreground">
                          Configure cada detalhe
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Hair Color */}
                      <div className="space-y-2">
                        <Label htmlFor="hair-color" className="text-xs font-medium flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-primary"></div>
                          Cabelo
                        </Label>
                        <Select value={hairColor} onValueChange={setHairColor}>
                          <SelectTrigger id="hair-color" className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cabelos loiros">Loiro</SelectItem>
                            <SelectItem value="cabelos castanhos">Castanho</SelectItem>
                            <SelectItem value="cabelos ruivos">Ruivo</SelectItem>
                            <SelectItem value="cabelos pretos">Preto</SelectItem>
                            <SelectItem value="cabelos grisalhos">Grisalho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Eye Color */}
                      <div className="space-y-2">
                        <Label htmlFor="eye-color" className="text-xs font-medium flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-primary"></div>
                          Olhos
                        </Label>
                        <Select value={eyeColor} onValueChange={setEyeColor}>
                          <SelectTrigger id="eye-color" className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="olhos castanhos">Castanhos</SelectItem>
                            <SelectItem value="olhos azuis">Azuis</SelectItem>
                            <SelectItem value="olhos verdes">Verdes</SelectItem>
                            <SelectItem value="olhos pretos">Pretos</SelectItem>
                            <SelectItem value="olhos mel">Mel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Skin Tone */}
                      <div className="space-y-2">
                        <Label htmlFor="skin-tone" className="text-xs font-medium flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-primary"></div>
                          Pele
                        </Label>
                        <Select value={skinTone} onValueChange={setSkinTone}>
                          <SelectTrigger id="skin-tone" className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pele muito clara">Muito Clara</SelectItem>
                            <SelectItem value="pele clara">Clara</SelectItem>
                            <SelectItem value="pele média">Média</SelectItem>
                            <SelectItem value="pele morena">Morena</SelectItem>
                            <SelectItem value="pele negra">Negra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Height */}
                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-xs font-medium flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-primary"></div>
                          Altura
                        </Label>
                        <Select value={height} onValueChange={setHeight}>
                          <SelectTrigger id="height" className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa (1,55m)">Baixa (1,55m)</SelectItem>
                            <SelectItem value="média (1,65m)">Média (1,65m)</SelectItem>
                            <SelectItem value="alta (1,75m)">Alta (1,75m)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Hair Style - Full Width */}
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="hair-style" className="text-xs font-medium flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-primary"></div>
                          Estilo do Cabelo
                        </Label>
                        <Select value={hairStyle} onValueChange={setHairStyle}>
                          <SelectTrigger id="hair-style" className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cabelos longos e lisos">Longos e Lisos</SelectItem>
                            <SelectItem value="cabelos longos e ondulados">Longos e Ondulados</SelectItem>
                            <SelectItem value="cabelos longos e cacheados">Longos e Cacheados</SelectItem>
                            <SelectItem value="cabelos curtos e lisos">Curtos e Lisos</SelectItem>
                            <SelectItem value="cabelos curtos e ondulados">Curtos e Ondulados</SelectItem>
                            <SelectItem value="cabelos afro volumoso">Afro Volumoso</SelectItem>
                            <SelectItem value="cabelos médios e lisos">Médios e Lisos</SelectItem>
                            <SelectItem value="cabelos com franja">Com Franja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Custom Description */}
                    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
                      <div className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="p-1 rounded-lg bg-primary/10 mt-0.5">
                            <Sparkles className="w-3 h-3 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="custom-desc" className="text-xs font-medium">
                              Descrição Personalizada
                            </Label>
                            <Textarea
                              id="custom-desc"
                              placeholder="Ex: Mais jovem, sorriso largo, óculos..."
                              value={customDescription}
                              onChange={(e) => setCustomDescription(e.target.value)}
                              className="min-h-[60px] text-xs bg-background/50 border-primary/20"
                              disabled={isGenerating}
                            />
                            <p className="text-[10px] text-muted-foreground">
                              Características extras (opcional)
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>

                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Upload className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Upload do Produto</h4>
                        <p className="text-[10px] text-muted-foreground">
                          Adicione a imagem do seu produto
                        </p>
                      </div>
                    </div>
                    {productImage ? (
                      <div className="border-2 border-primary/50 rounded-lg p-3 bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border">
                              <img 
                                src={URL.createObjectURL(productImage)} 
                                alt="Preview do produto"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate max-w-[140px]">{productImage.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {(productImage.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProductImage(null)}
                            disabled={isGenerating}
                            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductUpload}
                          className="hidden"
                          id="product-upload"
                          disabled={isGenerating}
                        />
                        <label htmlFor="product-upload" className="cursor-pointer space-y-2 block">
                          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">Clique para upload</p>
                            <p className="text-[10px] text-muted-foreground">
                              PNG, JPG (máx. 5MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </Card>

                <Button
                  onClick={handleGenerate}
                  disabled={!productImage || isGenerating}
                  className="w-full h-12 text-sm font-bold gap-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90"
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
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
