import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Palette, 
  Loader2,
  Download,
  RefreshCw,
  Sliders,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
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
      // Build the prompt
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
        // Simulate generated images for demo
        setGeneratedImages([
          "/placeholder.svg",
          "/placeholder.svg",
          "/placeholder.svg",
          "/placeholder.svg"
        ]);
        setStep(3);
        toast.success("Imagens geradas!");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      toast.error("Erro ao gerar imagens. Tente novamente.");
      
      // Demo mode - show placeholders
      setGeneratedImages([
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg"
      ]);
      setStep(3);
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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
          <ImageIcon className="w-3 h-3 mr-2" />
          Criar Produto
        </Badge>
        <h1 className="text-3xl font-bold mb-2">Crie imagens incríveis do seu produto</h1>
        <p className="text-muted-foreground">
          Faça upload do seu produto e deixe a IA criar composições profissionais.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= s 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {s}
            </div>
            <span className={step >= s ? "text-foreground" : "text-muted-foreground"}>
              {s === 1 ? "Upload" : s === 2 ? "Personalizar" : "Resultado"}
            </span>
            {s < 3 && <div className="w-12 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-8">
              <input
                ref={productInputRef}
                type="file"
                accept="image/*"
                onChange={handleProductUpload}
                className="hidden"
              />
              {productImage ? (
                <div className="relative">
                  <img src={productImage} alt="Produto" className="w-full aspect-square object-contain rounded-lg" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2"
                    onClick={() => productInputRef.current?.click()}
                  >
                    Trocar
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center py-12 cursor-pointer"
                  onClick={() => productInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Upload do Produto</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Arraste uma imagem ou clique para selecionar
                  </p>
                  <Badge variant="outline" className="mt-4">Obrigatório</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-secondary/50 transition-colors">
            <CardContent className="p-8">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logoImage ? (
                <div className="relative">
                  <img src={logoImage} alt="Logo" className="w-full aspect-square object-contain rounded-lg" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    Trocar
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center py-12 cursor-pointer"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Palette className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Logo da Marca</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Adicione seu logo para aparecer na imagem
                  </p>
                  <Badge variant="outline" className="mt-4">Opcional</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Customize */}
      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Personalize sua criação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input 
                  placeholder="Ex: Perfume Essence"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cenário</Label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o cenário" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scn) => (
                      <SelectItem key={scn.id} value={scn.id}>
                        {scn.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cores da Marca (opcional)</Label>
                <Input 
                  placeholder="Ex: Dourado, Preto"
                  value={brandColors}
                  onChange={(e) => setBrandColors(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Elementos Extras (opcional)</Label>
                <Textarea 
                  placeholder="Ex: flores, pétalas, gotas de água..."
                  value={extraElements}
                  onChange={(e) => setExtraElements(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Sua imagem de produto</CardDescription>
            </CardHeader>
            <CardContent>
              {productImage && (
                <div className="aspect-square rounded-lg overflow-hidden bg-muted/50 relative">
                  <img src={productImage} alt="Preview" className="w-full h-full object-contain" />
                  {logoImage && (
                    <img 
                      src={logoImage} 
                      alt="Logo" 
                      className="absolute bottom-4 right-4 w-16 h-16 object-contain opacity-80"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Suas criações estão prontas!</h2>
              <p className="text-muted-foreground">Selecione as imagens para baixar ou editar</p>
            </div>
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Gerar novamente
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((img, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="aspect-square relative">
                  <img src={img} alt={`Variação ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => downloadImage(img, index)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Sliders className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium">Variação {index + 1}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        {step < 3 && (
          <Button 
            className="ml-auto gap-2"
            onClick={() => step === 2 ? generateImages() : setStep(2)}
            disabled={step === 1 && !productImage}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : step === 2 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Imagens
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
