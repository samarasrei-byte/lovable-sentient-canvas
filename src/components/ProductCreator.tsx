import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { processImageFile, compressImageDataUrl } from "@/utils/image-processing";


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
  const [selectedImageForViewer, setSelectedImageForViewer] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const isMobile = useIsMobile();
  
  const productInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // Increased to 15MB for high res
        toast.error("Imagem muito grande. Máximo 15MB.");
        return;
      }
      
      const loadingToast = toast.loading("Processando imagem...");
      try {
        const dataUrl = await processImageFile(file);
        const compressed = await compressImageDataUrl(dataUrl);
        setRawProductImage(compressed);
        setIsCropperOpen(true);
        toast.dismiss(loadingToast);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Erro ao processar imagem.");
        toast.dismiss(loadingToast);
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await processImageFile(file);
        setLogoImage(dataUrl);
      } catch (error) {
        toast.error("Erro ao processar logo.");
      }
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
        await new Promise(r => setTimeout(r, 6000));
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download iniciado!");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[90dvh] flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center md:text-left"
      >
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 py-1 px-4 text-[10px] font-black uppercase tracking-[0.2em]">
          <Zap className="w-3.5 h-3.5 mr-2 animate-pulse" />
          Arcana Engine v2.0
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 tracking-tighter leading-[0.9] italic">
          TRANSFORME SEU PRODUTO EM <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">ARTE DIGITAL</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl font-medium">
          O motor neural Arcana cria composições de alta fidelidade que elevam sua marca ao nível das maiores grifes do mundo.
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
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-700 border ${
                step === s.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_30px_-5px_hsl(var(--primary))]" 
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
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{s.label}</span>
            </div>
            {s.id < 3 && (
              <div className={`mx-4 w-12 h-px hidden md:block ${
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
              <div className="w-full max-w-2xl p-10 rounded-[3rem] bg-card/30 backdrop-blur-3xl border border-primary/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 blur-[120px] -z-10 animate-pulse" />
                
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/20">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processando com IA Neural
                  </div>
                  <h2 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Sua visão está ganhando vida</h2>
                  <p className="text-muted-foreground font-medium">Mapeando geometrias e aplicando iluminação cinematográfica.</p>
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
              <PremiumUploadArea 
                type="product"
                image={productImage}
                onUpload={handleProductUpload}
                onRemove={() => setProductImage(null)}
                inputRef={productInputRef}
              />

              <PremiumUploadArea 
                type="logo"
                image={logoImage}
                onUpload={handleLogoUpload}
                onRemove={() => setLogoImage(null)}
                inputRef={logoInputRef}
              />
            </motion.div>
          ) : step === 2 ? (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <Card className="lg:col-span-2 rounded-[2.5rem] border-primary/10 bg-background/40 backdrop-blur-xl overflow-hidden">
                <CardHeader className="p-10 border-b border-primary/5">
                  <CardTitle className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    Configurar Motor Criativo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nome do Produto</Label>
                      <Input 
                        placeholder="Ex: iPhone 15 Pro Max"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/30 text-lg px-8 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Estética Visual</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/30 text-lg px-8 transition-all">
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-3xl bg-background/95 backdrop-blur-2xl border-primary/20">
                          {productCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="rounded-2xl py-4 cursor-pointer focus:bg-primary/10 transition-colors">
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cenário Desejado</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {scenarios.map((scn) => (
                        <motion.div 
                          key={scn.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setScenario(scn.id)}
                          className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-500 text-center flex flex-col items-center gap-3 ${
                            scenario === scn.id 
                              ? "border-primary bg-primary/10 shadow-2xl shadow-primary/20" 
                              : "border-transparent bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            scenario === scn.id ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"
                          }`}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider leading-tight">{scn.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cores Dominantes</Label>
                      <Input 
                        placeholder="Ex: Azul Meia-noite, Dourado"
                        value={brandColors}
                        onChange={(e) => setBrandColors(e.target.value)}
                        className="h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/30 text-lg px-8 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detalhes Extras</Label>
                      <Input 
                        placeholder="Ex: gotas de água, neon"
                        value={extraElements}
                        onChange={(e) => setExtraElements(e.target.value)}
                        className="h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/30 text-lg px-8 transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-primary/10 bg-muted/10 overflow-hidden flex flex-col group/preview">
                <CardHeader className="p-8">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                    <Eye className="w-4 h-4" />
                    Preview Global
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 flex-1 flex flex-col">
                  {productImage && (
                    <div className="relative flex-1 aspect-[4/5] rounded-[2rem] overflow-hidden bg-background shadow-2xl border border-white/5 flex items-center justify-center p-12 transition-all duration-700 group-hover/preview:scale-[1.02]">
                      <img src={productImage} alt="Preview" className="w-full h-full object-contain drop-shadow-2xl" />
                      {logoImage && (
                        <div className="absolute bottom-8 right-8 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                          <img src={logoImage} alt="Logo" className="w-16 h-16 object-contain" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                  <div className="mt-8 p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 blur-2xl rounded-full" />
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">IA Insight</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
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
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-xl">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <Check className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Renderização Completa!</h2>
                    <p className="text-muted-foreground font-medium text-lg">Suas variações em 4K foram geradas com fidelidade máxima.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <Button 
                    variant="ghost"
                    onClick={() => setShowComparison(!showComparison)}
                    className={`h-16 rounded-2xl px-8 gap-3 font-bold transition-all ${showComparison ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                  >
                    <Columns className="w-5 h-5" />
                    {showComparison ? 'Ocultar Comparação' : 'Comparar com Original'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => { setStep(2); setGeneratedImages([]); setShowComparison(false); }} 
                    className="h-16 rounded-2xl px-8 gap-3 border-emerald-500/20 hover:bg-emerald-500/5 transition-all font-bold"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Novas Variações
                  </Button>
                </div>
              </div>

              {showComparison && productImage && generatedImages.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="w-full max-w-4xl mx-auto mb-16"
                >
                  <Card className="p-4 rounded-[3rem] bg-background/40 backdrop-blur-xl border-primary/20 overflow-hidden shadow-2xl">
                    <div className="aspect-video relative rounded-[2rem] overflow-hidden">
                      <BeforeAfterSlider 
                        beforeImage={productImage}
                        afterImage={generatedImages[0]}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {generatedImages.map((img, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className="overflow-hidden group rounded-[2.5rem] border-transparent hover:border-primary/30 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.2)]">
                      <div className="aspect-[4/5] relative bg-background/50">
                        {/* THE FIX: object-contain instead of object-cover in preview, or add a toggle */}
                        <img 
                          src={img} 
                          alt={`Render ${index + 1}`} 
                          className="w-full h-full object-contain p-2 transition-transform duration-1000 group-hover:scale-105" 
                        />
                        
                        {/* Interaction Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-8 gap-4">
                          <Button 
                            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 gap-3 font-black uppercase tracking-tighter italic"
                            onClick={() => downloadImage(img, index)}
                          >
                            <Download className="w-5 h-5" /> Exportar 4K
                          </Button>
                          
                          <div className="flex gap-3 w-full">
                            <Button 
                              variant="secondary" 
                              onClick={() => setSelectedImageForViewer(img)}
                              className="flex-1 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border-white/20 text-white hover:bg-white/30 gap-2 font-bold"
                            >
                              <Maximize2 className="w-5 h-5" />
                              <span className="text-[10px] uppercase tracking-widest">Full</span>
                            </Button>
                          </div>
                        </div>

                        <div className="absolute top-6 left-6">
                          <Badge className="bg-black/40 backdrop-blur-xl border-white/10 text-white text-[10px] font-black py-1.5 px-4 rounded-full uppercase tracking-widest">
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
          className="mt-20 flex items-center justify-between py-10 border-t border-white/5"
        >
          {step > 1 ? (
            <Button 
              variant="ghost" 
              onClick={() => setStep(step - 1)}
              className="h-16 px-10 rounded-2xl gap-4 font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-6 h-6" /> Configurações
            </Button>
          ) : <div />}
          
          {step < 3 && (
            <Button 
              size="lg"
              onClick={() => step === 2 ? generateImages() : setStep(2)}
              disabled={step === 1 && !productImage}
              className="h-16 px-14 rounded-2xl gap-4 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_20px_50px_-15px_hsl(var(--primary)/0.5)] hover:scale-105 transition-all duration-500 active:scale-95"
            >
              {step === 2 ? (
                <>
                  <Sparkles className="w-6 h-6" /> Renderizar
                </>
              ) : (
                <>
                  Continuar <ChevronRight className="w-6 h-6" />
                </>
              )}
            </Button>
          )}
        </motion.div>
      )}

      {/* Modals & Overlays */}
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

      {/* Fullscreen Viewer */}
      <FullScreenImageViewer 
        image={selectedImageForViewer || ""}
        isOpen={!!selectedImageForViewer}
        onClose={() => setSelectedImageForViewer(null)}
        title={productName ? `Render: ${productName}` : "Arcana AI Render"}
      />
    </div>
  );
};
