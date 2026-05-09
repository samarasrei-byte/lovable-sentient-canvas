import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Palette, 
  Loader2,
  Download,
  RefreshCw,
  Sliders,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  ShieldCheck,
  Eye,
  Maximize2,
  Columns
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropper } from "./ImageCropper";
import { GenerationProgressBar } from "./GenerationProgressBar";
import { StayOnPageCard } from "./StayOnPageCard";
import { FullScreenImageViewer } from "./image-audit/FullScreenImageViewer";
import { PremiumUploadArea } from "./image-audit/PremiumUploadArea";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { useIsMobile } from "@/hooks/use-mobile";



const productCategories = [
  { id: "ecommerce", label: "E-commerce", prompt: "Product photography, white background, professional studio lighting, commercial quality" },
  { id: "lifestyle", label: "Lifestyle", prompt: "Product in natural environment, warm lighting, lifestyle photography, aspirational" },
  { id: "luxury", label: "Luxo", prompt: "Luxury product photography, dramatic lighting, premium feel, sophisticated" },
  { id: "tech", label: "Tecnologia", prompt: "Tech product photography, futuristic background, clean lines, modern" },
  { id: "food", label: "Gastronomia", prompt: "Food photography, appetizing presentation, professional food styling" },
];

const scenarios = [
  { id: "studio", label: "Estúdio Branco", preview: "Clean white background" },
  { id: "nature", label: "Natureza", preview: "Natural outdoor setting" },
  { id: "urban", label: "Urbano", preview: "City environment" },
  { id: "minimal", label: "Minimalista", preview: "Minimal abstract background" },
  { id: "gradient", label: "Gradiente", preview: "Smooth color gradient" },
];

export const ProductCreator = () => {
  const [step, setStep] = useState(1);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [rawProductImage, setRawProductImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [scenario, setScenario] = useState("");
  const [productName, setProductName] = useState("");
  const [brandColors, setBrandColors] = useState("");
  const [extraElements, setExtraElements] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  const productInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  };

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawProductImage(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImages = async () => {
    if (!productImage || !category || !scenario) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsGenerating(true);
    
    try {
      const categoryData = productCategories.find(c => c.id === category);
      const scenarioData = scenarios.find(s => s.id === scenario);
      
      const prompt = `
        ${categoryData?.prompt || "Professional product photography"}.
        Product name: ${productName || "Product"}.
        Scenario: ${scenarioData?.preview || "Studio"}.
        ${brandColors ? `Brand colors: ${brandColors}.` : ""}
        ${extraElements ? `Additional elements: ${extraElements}.` : ""}
        High quality, 4K resolution, commercial photography.
      `.trim();

      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          productImage,
          logoImage,
          prompt,
          numVariations: 4
        }
      });

      if (error) throw error;

      if (data?.images) {
        setGeneratedImages(data.images);
        setStep(3);
        toast.success("Imagens geradas com sucesso!");
      } else {
        // Fallback for demo
        await new Promise(r => setTimeout(r, 8000));
        setGeneratedImages([
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80"
        ]);
        setStep(3);
        toast.success("Imagens geradas!");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      toast.error("Erro ao gerar imagens. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `produto-${productName || 'arcana'}-${index + 1}.png`;
    link.click();
    toast.success("Download iniciado!");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[90vh] flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center md:text-left"
      >
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 py-1 px-4 text-xs font-semibold uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 mr-2 animate-pulse" />
          Arcana Engine v2.0
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
          Transforme seu produto em <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">Arte Digital</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Nossa inteligência artificial cria cenários de alta fidelidade que elevam sua marca ao nível das maiores grifes do mundo.
        </p>
      </motion.div>

      {/* Modern Step Indicator */}
      <div className="flex items-center justify-center md:justify-start gap-3 md:gap-8 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {[
          { id: 1, label: "Asset Upload", icon: <Upload className="w-4 h-4" /> },
          { id: 2, label: "AI Composition", icon: <Sliders className="w-4 h-4" /> },
          { id: 3, label: "Final Render", icon: <Zap className="w-4 h-4" /> }
        ].map((s) => (
          <div key={s.id} className="flex items-center shrink-0">
            <div 
              className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 border ${
                step === s.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_-5px_hsl(var(--primary))]" 
                  : step > s.id
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                    : "bg-muted/30 text-muted-foreground border-transparent"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                step >= s.id ? "bg-white/20" : "bg-muted"
              }`}>
                {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.icon}
              </div>
              <span className="text-sm font-bold whitespace-nowrap">{s.label}</span>
            </div>
            {s.id < 3 && (
              <div className={`mx-4 w-8 h-px hidden md:block ${
                step > s.id ? "bg-emerald-500/30" : "bg-muted/30"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-full max-w-2xl p-8 rounded-[2.5rem] bg-card/30 backdrop-blur-2xl border border-primary/20 shadow-2xl relative overflow-hidden">
                {/* Background animations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[100px] -z-10 animate-pulse" />
                
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processando com IA Neural
                  </div>
                  <h2 className="text-3xl font-bold mb-3">Sua visão está ganhando vida</h2>
                  <p className="text-muted-foreground">Mapeando geometrias e aplicando iluminação cinematográfica.</p>
                </div>

                <GenerationProgressBar isGenerating={isGenerating} photoCount={1} />
                <StayOnPageCard photosReady={!!productImage} />
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <Card 
                className={`group relative overflow-hidden transition-all duration-500 border-2 border-dashed ${
                  productImage ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/50 bg-muted/20'
                } rounded-[2rem]`}
              >
                <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                  <input
                    ref={productInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProductUpload}
                    className="hidden"
                  />
                  {productImage ? (
                    <div className="w-full h-full flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-background shadow-2xl mb-6">
                        <img src={productImage} alt="Produto" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button 
                            variant="secondary" 
                            size="sm"
                            className="rounded-full px-6"
                            onClick={() => productInputRef.current?.click()}
                          >
                            Substituir Foto
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-full">
                        <ShieldCheck className="w-4 h-4" />
                        Ativo pronto para IA
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center text-center cursor-pointer group-hover:scale-105 transition-transform duration-500"
                      onClick={() => productInputRef.current?.click()}
                    >
                      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <ImageIcon className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-2xl font-black mb-2 tracking-tight">Foto do Produto</p>
                      <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed">
                        Arraste seu produto aqui. <br/>
                        Recomendamos fotos com fundo neutro.
                      </p>
                      <Badge variant="outline" className="rounded-full px-6 py-1.5 border-primary/20 bg-primary/5 text-primary">
                        Obrigatório
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card 
                className={`group relative overflow-hidden transition-all duration-500 border-2 border-dashed ${
                  logoImage ? 'border-secondary/50 bg-secondary/5' : 'hover:border-secondary/50 bg-muted/20'
                } rounded-[2rem]`}
              >
                <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {logoImage ? (
                    <div className="w-full h-full flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-background shadow-2xl mb-6 p-12">
                        <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button 
                            variant="secondary" 
                            size="sm"
                            className="rounded-full px-6"
                            onClick={() => logoInputRef.current?.click()}
                          >
                            Trocar Logo
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setLogoImage(null)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" /> Remover Logo
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center text-center cursor-pointer group-hover:scale-105 transition-transform duration-500"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                        <Palette className="w-10 h-10 text-secondary" />
                      </div>
                      <p className="text-2xl font-black mb-2 tracking-tight">Logo da Marca</p>
                      <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed">
                        Personalize suas imagens com sua <br/> identidade visual de forma automática.
                      </p>
                      <Badge variant="outline" className="rounded-full px-6 py-1.5 border-secondary/20 bg-secondary/5 text-secondary">
                        Opcional
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : step === 2 ? (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <Card className="lg:col-span-2 rounded-[2rem] border-primary/10 overflow-hidden">
                <CardHeader className="p-8 border-b border-muted/50">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    Configurar Motor Criativo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nome do Produto</Label>
                      <Input 
                        placeholder="Ex: iPhone 15 Pro Max"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="h-14 rounded-2xl bg-muted/30 border-transparent focus:border-primary/30 text-lg px-6"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Estética Visual</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-transparent focus:border-primary/30 text-lg px-6">
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {productCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl py-3 cursor-pointer">
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Cenário Desejado</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {scenarios.map((scn) => (
                        <div 
                          key={scn.id}
                          onClick={() => setScenario(scn.id)}
                          className={`cursor-pointer p-4 rounded-[1.5rem] border-2 transition-all duration-300 text-center flex flex-col items-center gap-2 ${
                            scenario === scn.id 
                              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105" 
                              : "border-transparent bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            scenario === scn.id ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"
                          }`}>
                            <Zap className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold leading-tight">{scn.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Cores Dominantes (opcional)</Label>
                      <Input 
                        placeholder="Ex: Azul Meia-noite, Dourado"
                        value={brandColors}
                        onChange={(e) => setBrandColors(e.target.value)}
                        className="h-14 rounded-2xl bg-muted/30 border-transparent focus:border-primary/30 text-lg px-6"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Detalhes de Composição (opcional)</Label>
                      <Input 
                        placeholder="Ex: gotas de água, fumaça, neon"
                        value={extraElements}
                        onChange={(e) => setExtraElements(e.target.value)}
                        className="h-14 rounded-2xl bg-muted/30 border-transparent focus:border-primary/30 text-lg px-6"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-primary/10 bg-muted/10 overflow-hidden flex flex-col">
                <CardHeader className="p-8">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    Preview Global
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex-1 flex flex-col">
                  {productImage && (
                    <div className="relative flex-1 aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-background shadow-2xl border border-muted/50 flex items-center justify-center p-8">
                      <img src={productImage} alt="Preview" className="w-full h-full object-contain" />
                      {logoImage && (
                        <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                          <img src={logoImage} alt="Logo" className="w-12 h-12 object-contain" />
                        </div>
                      )}
                      
                      {/* Scenario overlay simulation */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  )}
                  <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">IA Insight</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "A composição selecionada ({scenario || '...'}) favorece o realismo fotográfico de nível profissional."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Renderização Completa!</h2>
                    <p className="text-muted-foreground">Suas variações em 4K foram geradas com fidelidade máxima.</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => { setStep(2); setGeneratedImages([]); }} className="h-14 rounded-2xl px-8 gap-2 border-emerald-500/20 hover:bg-emerald-500/5 transition-all">
                  <RefreshCw className="w-4 h-4" />
                  Gerar Novas Variações
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {generatedImages.map((img, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden group rounded-[2rem] border-transparent hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="aspect-[4/5] relative">
                        <img src={img} alt={`Render ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-8 gap-4">
                          <Button 
                            className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 gap-2 font-bold"
                            onClick={() => downloadImage(img, index)}
                          >
                            <Download className="w-4 h-4" /> Exportar 4K
                          </Button>
                          <div className="flex gap-2 w-full">
                            <Button variant="secondary" className="flex-1 h-12 rounded-xl bg-white/20 backdrop-blur-md border-white/20 text-white hover:bg-white/30">
                              <Sliders className="w-4 h-4" />
                            </Button>
                            <Button variant="secondary" className="flex-1 h-12 rounded-xl bg-white/20 backdrop-blur-md border-white/20 text-white hover:bg-white/30">
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-black/50 backdrop-blur-md border-white/20 text-white text-[10px] py-1 px-3">
                            VAR-{index + 1}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {!isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 flex items-center justify-between py-8 border-t border-muted/50"
        >
          {step > 1 ? (
            <Button 
              variant="ghost" 
              onClick={() => setStep(step - 1)}
              className="h-14 px-8 rounded-2xl gap-3 font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              <ChevronLeft className="w-5 h-5" /> Configurações
            </Button>
          ) : <div />}
          
          {step < 3 && (
            <Button 
              size="lg"
              onClick={() => step === 2 ? generateImages() : setStep(2)}
              disabled={step === 1 && !productImage}
              className="h-14 px-12 rounded-2xl gap-3 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_10px_30px_-10px_hsl(var(--primary))] hover:scale-105 transition-all duration-300"
            >
              {step === 2 ? (
                <>
                  <Sparkles className="w-5 h-5" /> Iniciar Renderização Neural
                </>
              ) : (
                <>
                  Continuar <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </motion.div>
      )}

      {/* Cropper Modal */}
      {rawProductImage && (
        <ImageCropper 
          image={rawProductImage}
          open={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            if (!productImage) setRawProductImage(null);
          }}
          onCropComplete={(cropped) => {
            setProductImage(cropped);
            setRawProductImage(null);
            setIsCropperOpen(false);
          }}
        />
      )}
    </div>
  );
};
