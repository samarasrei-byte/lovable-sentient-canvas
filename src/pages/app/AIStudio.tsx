import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Wand2, Video, Download, Sparkles, Edit3, Play, History, Trash2, Share2 } from "lucide-react";
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

interface VideoHistoryItem {
  id: string;
  product_name: string;
  template_name: string;
  image_url: string;
  video_url: string | null;
  prompt: string;
  status: string;
  created_at: string;
}

export default function AIStudio() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"template" | "customize" | "generate" | "video" | "history">("template");
  
  // Customization options
  const [hairColor, setHairColor] = useState("original");
  const [eyeColor, setEyeColor] = useState("original");
  const [skinTone, setSkinTone] = useState("original");
  const [hasTattoos, setHasTattoos] = useState("no");
  const [videoScript, setVideoScript] = useState("");
  
  // Video history
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (currentStep === "history") {
      loadVideoHistory();
    }
  }, [currentStep]);

  const loadVideoHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        toast.error("Faça login para ver seu histórico");
        return;
      }

      const { data, error } = await supabase
        .from("generated_videos")
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideoHistory(data || []);
    } catch (error) {
      console.error("Error loading video history:", error);
      toast.error("Erro ao carregar histórico");
    } finally {
      setIsLoadingHistory(false);
    }
  };

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
      // First save to database
      const { data: videoRecord, error: insertError } = await supabase
        .from("generated_videos")
        .insert({
          user_id: session.user.id,
          product_name: productName,
          template_name: selectedTemplate.name,
          image_url: generatedImage,
          prompt: videoScript,
          status: "processing"
        })
        .select()
        .single();

      if (insertError) throw insertError;

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
        // Update video record with the generated URL
        await supabase
          .from("generated_videos")
          .update({ 
            video_url: data.videoUrl,
            status: "completed"
          })
          .eq("id", videoRecord.id);

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

  const handleDownloadImage = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    
    if (!session) {
      toast.error("Faça login para baixar!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `arcana-${productName}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Download iniciado!");
      } catch (error) {
        // Fallback for data URLs
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `arcana-${productName}-${Date.now()}.png`;
        link.click();
        toast.success("Download iniciado!");
      }
    }
  };

  const handleDownloadVideo = async (videoUrl?: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    
    if (!session) {
      toast.error("Faça login para baixar!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const urlToDownload = videoUrl || generatedVideo;
    if (!urlToDownload) {
      toast.error("Nenhum vídeo disponível para download");
      return;
    }

    try {
      const response = await fetch(urlToDownload);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arcana-video-${productName || 'meu-produto'}-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download do vídeo iniciado!");
    } catch (error) {
      console.error("Error downloading video:", error);
      // Fallback: open in new tab
      window.open(urlToDownload, '_blank');
      toast.info("Vídeo aberto em nova aba. Clique com botão direito para salvar.");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from("generated_videos")
        .delete()
        .eq("id", videoId);

      if (error) throw error;
      
      setVideoHistory(prev => prev.filter(v => v.id !== videoId));
      toast.success("Vídeo removido do histórico");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Erro ao remover vídeo");
    }
  };

  const handleReeditVideo = (video: VideoHistoryItem) => {
    // Find the template
    const template = templates.find(t => t.name === video.template_name) || templates[0];
    setSelectedTemplate(template);
    setProductName(video.product_name);
    setGeneratedImage(video.image_url);
    setVideoScript(video.prompt);
    setGeneratedVideo(video.video_url);
    setCurrentStep("video");
    toast.info("Vídeo carregado para edição");
  };

  const shareVideo = (platform: string, videoUrl: string) => {
    const shareText = `Confira meu novo vídeo criado com IA no ARCANA! 🎬✨`;
    
    switch (platform) {
      case 'instagram':
        window.open('https://www.instagram.com/', '_blank');
        toast.success("Baixe o vídeo e faça upload no Instagram!");
        break;
      case 'tiktok':
        window.open('https://www.tiktok.com/upload', '_blank');
        toast.success("Baixe o vídeo e faça upload no TikTok!");
        break;
      case 'youtube':
        window.open('https://www.youtube.com/upload', '_blank');
        toast.success("Baixe o vídeo e faça upload no YouTube!");
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        toast.success("Compartilhe no X/Twitter!");
        break;
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
          <TabsList className="grid w-full grid-cols-5 lg:w-4/5 mx-auto">
            <TabsTrigger value="template">1. Template</TabsTrigger>
            <TabsTrigger value="customize">2. Personalizar</TabsTrigger>
            <TabsTrigger value="generate">3. Gerar Imagem</TabsTrigger>
            <TabsTrigger value="video">4. Criar Vídeo</TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="w-3 h-3" />
              Histórico
            </TabsTrigger>
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
                        <Button variant="outline" onClick={handleDownloadImage} className="w-full gap-2">
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
              <h2 className="text-2xl font-bold mb-2">Criar Vídeo com IA</h2>
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
                        <Label>Prompt do Vídeo</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Descreva o que você quer que aconteça no vídeo: movimentos, expressões, ações, etc.
                        </p>
                        <textarea
                          value={videoScript}
                          onChange={(e) => setVideoScript(e.target.value)}
                          placeholder="Ex: A modelo sorri e apresenta o produto com movimento suave, olhando para a câmera com expressão confiante. Zoom leve no produto no final."
                          className="w-full mt-2 min-h-[120px] p-3 rounded-md border border-input bg-background resize-none"
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {videoScript.length}/500 caracteres
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
                            Gerar Vídeo com IA
                          </>
                        )}
                      </Button>

                      {generatedVideo && (
                        <div className="space-y-4">
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            onClick={() => handleDownloadVideo()}
                          >
                            <Download className="w-4 h-4" />
                            Baixar Vídeo
                          </Button>
                          
                          <div className="border-t border-border pt-4">
                            <p className="text-sm font-medium mb-3 text-center">Compartilhar nas Redes Sociais</p>
                            <div className="flex justify-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => shareVideo('instagram', generatedVideo)}
                                className="gap-2"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                Instagram
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => shareVideo('tiktok', generatedVideo)}
                                className="gap-2"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                                TikTok
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => shareVideo('youtube', generatedVideo)}
                                className="gap-2"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                YouTube
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => shareVideo('twitter', generatedVideo)}
                                className="gap-2"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                X
                              </Button>
                            </div>
                          </div>
                        </div>
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

          {/* Step 5: Video History */}
          <TabsContent value="history" className="space-y-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Histórico de Vídeos</h2>
              <p className="text-muted-foreground">Veja todos os vídeos que você criou</p>
            </div>

            <div className="max-w-6xl mx-auto">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : videoHistory.length === 0 ? (
                <Card className="p-12 text-center">
                  <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum vídeo criado ainda</h3>
                  <p className="text-muted-foreground mb-6">
                    Comece criando seu primeiro vídeo com IA!
                  </p>
                  <Button onClick={() => setCurrentStep("template")} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Criar Primeiro Vídeo
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoHistory.map((video) => (
                    <Card key={video.id} className="overflow-hidden group">
                      <div className="relative aspect-square">
                        {video.video_url ? (
                          <video 
                            src={video.video_url} 
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        ) : (
                          <img 
                            src={video.image_url} 
                            alt={video.product_name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="flex-1 gap-1"
                              onClick={() => handleReeditVideo(video)}
                            >
                              <Edit3 className="w-3 h-3" />
                              Re-editar
                            </Button>
                            {video.video_url && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleDownloadVideo(video.video_url!)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {video.status === "processing" && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="gap-1">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                              Processando
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{video.product_name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{video.template_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(video.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        {video.video_url && (
                          <div className="flex gap-1 mt-3">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2"
                              onClick={() => shareVideo('instagram', video.video_url!)}
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
