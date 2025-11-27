import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Wand2, Video, Download, Sparkles, Edit3, Play } from "lucide-react";
import { toast } from "sonner";
import templateFitness from "@/assets/template-fitness.png";
import templateBeauty from "@/assets/template-beauty.png";
import templatePerfume from "@/assets/template-perfume.png";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

export default function AIStudio() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"template" | "customize" | "generate" | "video">("template");
  
  // Customization options
  const [hairColor, setHairColor] = useState("original");
  const [eyeColor, setEyeColor] = useState("original");
  const [skinTone, setSkinTone] = useState("original");
  const [hasTattoos, setHasTattoos] = useState("no");
  const [videoScript, setVideoScript] = useState("");

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
      toast.success("Produto carregado com sucesso!");
    }
  };

  const handleGenerateImage = async () => {
    if (!productName) {
      toast.error("Por favor, insira o nome do seu produto");
      return;
    }

    setIsGenerating(true);
    try {
      // Customize prompt based on user selections
      let customPrompt = selectedTemplate.prompt.replace("{PRODUCT}", productName);
      
      if (hairColor !== "original") {
        customPrompt += ` Cabelo ${hairColor}.`;
      }
      if (eyeColor !== "original") {
        customPrompt += ` Olhos ${eyeColor}.`;
      }
      if (skinTone !== "original") {
        customPrompt += ` Tom de pele ${skinTone}.`;
      }
      if (hasTattoos === "yes") {
        customPrompt += ` Com tatuagens visíveis nos braços.`;
      } else if (hasTattoos === "no") {
        customPrompt += ` Sem tatuagens visíveis.`;
      }

      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: { 
          prompt: customPrompt,
          productName,
          templateId: selectedTemplate.id
        }
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImage(data.image);
        setCurrentStep("video");
        toast.success("Imagem gerada com sucesso! 🎨");
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    
    if (!session) {
      toast.error("Faça login para gerar vídeos!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!videoScript || videoScript.length < 10) {
      toast.error("Por favor, escreva um texto para o vídeo (mínimo 10 caracteres)");
      return;
    }

    if (!generatedImage) {
      toast.error("Gere uma imagem primeiro!");
      return;
    }

    setIsGeneratingVideo(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-video', {
        body: { 
          imageUrl: generatedImage,
          script: videoScript,
          productName,
          duration: 6
        }
      });

      if (error) throw error;

      if (data?.videoUrl) {
        setGeneratedVideo(data.videoUrl);
        toast.success("Vídeo gerado com sucesso! 🎬");
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error("Erro ao gerar vídeo. Tente novamente.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownload = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    
    if (!session) {
      toast.error("Faça login para baixar!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `arcana-${productName}-${Date.now()}.png`;
      link.click();
      toast.success("Download iniciado!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Criar com IA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Studio de Criação IA
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transforme seu produto em conteúdo profissional com influencers virtuais de alta qualidade
          </p>
        </div>

        <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-2/3 mx-auto">
            <TabsTrigger value="template">1. Template</TabsTrigger>
            <TabsTrigger value="customize">2. Personalizar</TabsTrigger>
            <TabsTrigger value="generate">3. Gerar Imagem</TabsTrigger>
            <TabsTrigger value="video">4. Criar Vídeo</TabsTrigger>
          </TabsList>

          {/* Step 1: Template Selection */}
          <TabsContent value="template" className="space-y-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Escolha seu Template</h2>
              <p className="text-muted-foreground">Selecione o estilo que melhor representa seu produto</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-300 overflow-hidden group ${
                    selectedTemplate.id === template.id
                      ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                      : "hover:ring-2 hover:ring-primary/50"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Badge className="mb-2">{template.category}</Badge>
                      <h3 className="text-xl font-bold mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-200">{template.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button size="lg" onClick={() => setCurrentStep("customize")} className="gap-2">
                Continuar <Wand2 className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 2: Customize */}
          <TabsContent value="customize" className="space-y-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Personalize a Modelo</h2>
              <p className="text-muted-foreground">Ajuste características para criar a influencer perfeita</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-6">
                <div>
                  <Label>Nome do Produto *</Label>
                  <Input
                    placeholder="Ex: WHEY PROTEIN ULTRA"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Upload do Produto (Opcional)</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductUpload}
                      className="hidden"
                      id="product-upload"
                    />
                    <label htmlFor="product-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {productImage ? productImage.name : "Clique para fazer upload da imagem do produto"}
                      </p>
                    </label>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Cor do Cabelo</Label>
                    <Select value={hairColor} onValueChange={setHairColor}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="loiro">Loiro</SelectItem>
                        <SelectItem value="castanho">Castanho</SelectItem>
                        <SelectItem value="preto">Preto</SelectItem>
                        <SelectItem value="ruivo">Ruivo</SelectItem>
                        <SelectItem value="colorido">Colorido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cor dos Olhos</Label>
                    <Select value={eyeColor} onValueChange={setEyeColor}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="castanho">Castanho</SelectItem>
                        <SelectItem value="azul">Azul</SelectItem>
                        <SelectItem value="verde">Verde</SelectItem>
                        <SelectItem value="mel">Mel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tom de Pele</Label>
                    <Select value={skinTone} onValueChange={setSkinTone}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="claro">Claro</SelectItem>
                        <SelectItem value="médio">Médio</SelectItem>
                        <SelectItem value="bronzeado">Bronzeado</SelectItem>
                        <SelectItem value="escuro">Escuro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tatuagens</Label>
                    <Select value={hasTattoos} onValueChange={setHasTattoos}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">Sem tatuagens</SelectItem>
                        <SelectItem value="yes">Com tatuagens</SelectItem>
                        <SelectItem value="original">Original</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" onClick={() => setCurrentStep("template")}>
                Voltar
              </Button>
              <Button size="lg" onClick={() => setCurrentStep("generate")} className="gap-2">
                Continuar <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 3: Generate Image */}
          <TabsContent value="generate" className="space-y-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Gerar Imagem Profissional</h2>
              <p className="text-muted-foreground">Crie seu conteúdo com IA em segundos</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      {generatedImage ? (
                        <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Sua imagem aparecerá aqui</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-sm font-medium">Template Selecionado:</p>
                        <p className="text-lg font-bold text-primary">{selectedTemplate.name}</p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-sm font-medium">Produto:</p>
                        <p className="text-lg font-bold">{productName || "Não definido"}</p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-sm font-medium">Personalizações:</p>
                        <div className="flex flex-wrap gap-2">
                          {hairColor !== "original" && <Badge variant="secondary">Cabelo: {hairColor}</Badge>}
                          {eyeColor !== "original" && <Badge variant="secondary">Olhos: {eyeColor}</Badge>}
                          {skinTone !== "original" && <Badge variant="secondary">Pele: {skinTone}</Badge>}
                          {hasTattoos !== "original" && <Badge variant="secondary">Tatuagens: {hasTattoos === "yes" ? "Sim" : "Não"}</Badge>}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !productName}
                      className="w-full gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                      <div className="space-y-3">
                        <Button variant="outline" onClick={handleDownload} className="w-full gap-2">
                          <Download className="w-4 h-4" />
                          Baixar Imagem
                        </Button>
                        <Button onClick={() => setCurrentStep("video")} className="w-full gap-2">
                          <Video className="w-4 h-4" />
                          Criar Vídeo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Step 4: Generate Video */}
          <TabsContent value="video" className="space-y-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Criar Vídeo com Veo 3</h2>
              <p className="text-muted-foreground">Transforme sua imagem em um vídeo profissional de 6 segundos</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                {!generatedImage ? (
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">Gere uma imagem primeiro para criar um vídeo</p>
                    <Button onClick={() => setCurrentStep("generate")}>
                      Voltar para Geração
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label>Imagem Base</Label>
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img src={generatedImage} alt="Base" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Preview do Vídeo</Label>
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          {generatedVideo ? (
                            <video src={generatedVideo} controls className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p>Vídeo aparecerá aqui</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Texto/Fala do Vídeo (6 segundos)</Label>
                        <textarea
                          value={videoScript}
                          onChange={(e) => setVideoScript(e.target.value)}
                          placeholder="Digite o texto que será falado no vídeo (máximo 50 palavras para 6 segundos)"
                          className="w-full mt-2 min-h-[100px] p-3 rounded-md border border-input bg-background"
                          maxLength={300}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {videoScript.length}/300 caracteres
                        </p>
                      </div>

                      <Button
                        size="lg"
                        onClick={handleGenerateVideo}
                        disabled={isGeneratingVideo || !videoScript}
                        className="w-full gap-2"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Gerando Vídeo...
                          </>
                        ) : (
                          <>
                            <Video className="w-5 h-5" />
                            Gerar Vídeo com Veo 3
                          </>
                        )}
                      </Button>

                      {generatedVideo && (
                        <Button variant="outline" className="w-full gap-2">
                          <Download className="w-4 h-4" />
                          Baixar Vídeo
                        </Button>
                      )}
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-center">
                        ⚡ <strong>Login necessário</strong> para gerar e baixar vídeos. Cadastre-se gratuitamente!
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
