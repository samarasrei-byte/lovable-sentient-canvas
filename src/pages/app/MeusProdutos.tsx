import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Camera,
  Plus,
  Download,
  Share2,
  Trash2,
  X,
  Loader2,
  Check,
  Wand2,
  ArrowRight,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Import showcase templates
import productDominos from "@/assets/showcase/product-dominos.png";
import productCocacola from "@/assets/showcase/product-cocacola.png";
import productSunshine from "@/assets/showcase/product-sunshine.png";
import productNike from "@/assets/showcase/product-nike.png";
import productFashion from "@/assets/showcase/product-fashion.png";
import productMcdonalds from "@/assets/showcase/product-mcdonalds.png";
import productPepsi from "@/assets/showcase/product-pepsi.png";
import productMegamare from "@/assets/showcase/product-megamare.png";

interface ProductTemplate {
  id: string;
  image: string;
  brand: string;
  category: string;
  style: string;
}

interface UserProduct {
  id: string;
  template_name: string;
  product_name: string;
  image_url: string;
  created_at: string;
}

const templates: ProductTemplate[] = [
  { id: "dominos", image: productDominos, brand: "Estilo Domino's", category: "Food & Beverage", style: "Delivery Premium" },
  { id: "cocacola", image: productCocacola, brand: "Estilo Coca-Cola", category: "Beverages", style: "Lifestyle Refrescante" },
  { id: "sunshine", image: productSunshine, brand: "Estilo Sunshine", category: "Healthy Drinks", style: "Natural & Fresh" },
  { id: "nike", image: productNike, brand: "Estilo Nike", category: "Fashion & Sports", style: "Athletic Premium" },
  { id: "fashion", image: productFashion, brand: "Estilo Fashion", category: "Luxury", style: "High Fashion" },
  { id: "mcdonalds", image: productMcdonalds, brand: "Estilo McDonald's", category: "Fast Food", style: "Fast Casual" },
  { id: "pepsi", image: productPepsi, brand: "Estilo Pepsi", category: "Beverages", style: "Bold & Modern" },
  { id: "megamare", image: productMegamare, brand: "Estilo Megamare", category: "Perfumery", style: "Luxury Fragrance" },
];

const MeusProdutos = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState<"templates" | "meus">("templates");
  const { toast } = useToast();

  useEffect(() => {
    loadUserProducts();
  }, []);

  const loadUserProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUserProducts(data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProductPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTemplate = (template: ProductTemplate) => {
    setSelectedTemplate(template);
    setShowUploadDialog(true);
    // Reset form
    setLogoFile(null);
    setLogoPreview(null);
    setProductFile(null);
    setProductPreview(null);
    setProductName("");
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !productName) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome do produto."
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Call the real AI generation edge function
      const { data, error: functionError } = await supabase.functions.invoke('generate-product-image', {
        body: {
          productName,
          templateId: selectedTemplate.id,
          templateStyle: selectedTemplate.style,
          productImageBase64: productPreview || null,
          logoImageBase64: logoPreview || null,
        }
      });

      if (functionError) {
        console.error("Function error:", functionError);
        throw new Error(functionError.message || "Erro ao chamar IA");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const generatedImageUrl = data?.image;
      
      if (!generatedImageUrl) {
        throw new Error("Nenhuma imagem foi gerada");
      }

      // Save to database
      const { error: dbError } = await supabase.from("generated_images").insert({
        user_id: user.id,
        template_name: selectedTemplate.id,
        product_name: productName,
        image_url: generatedImageUrl,
        is_public: false
      });

      if (dbError) throw dbError;

      toast({
        title: "Produto gerado com sucesso! ✨",
        description: "Sua imagem profissional está pronta na galeria."
      });

      setShowUploadDialog(false);
      loadUserProducts();
      setActiveTab("meus");

    } catch (error) {
      console.error("Error generating:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar imagem",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const { error } = await supabase
        .from("generated_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Produto excluído" });
      loadUserProducts();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Camera className="h-6 w-6 text-white" />
            </div>
            Galeria de Produtos
          </h1>
          <p className="text-muted-foreground mt-1">
            Escolha um template e crie imagens profissionais para sua marca
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        <Button
          variant={activeTab === "templates" ? "default" : "ghost"}
          onClick={() => setActiveTab("templates")}
          className="gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          Templates
        </Button>
        <Button
          variant={activeTab === "meus" ? "default" : "ghost"}
          onClick={() => setActiveTab("meus")}
          className="gap-2"
        >
          <Camera className="h-4 w-4" />
          Meus Produtos
          {userProducts.length > 0 && (
            <Badge variant="secondary" className="ml-1">{userProducts.length}</Badge>
          )}
        </Button>
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* How it works */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <span>Sua Logo</span>
              </div>
              
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              <span className="text-muted-foreground md:hidden">+</span>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-cyan-500" />
                </div>
                <span>Seu Produto</span>
              </div>
              
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              <span className="text-muted-foreground md:hidden">+</span>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-accent" />
                </div>
                <span>Template</span>
              </div>
              
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              <span className="text-muted-foreground md:hidden">=</span>
              
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-primary">Foto Pro</span>
              </div>
            </div>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <img
                  src={template.image}
                  alt={template.brand}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Plus className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-white font-semibold text-center px-4">Usar este template</p>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{template.brand}</p>
                    <p className="text-white/70 text-sm">{template.style}</p>
                  </div>
                </div>
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-xs bg-black/50 backdrop-blur-sm">
                    {template.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* My Products Tab */}
      {activeTab === "meus" && (
        <div className="space-y-6">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nenhum produto criado</h3>
              <p className="text-muted-foreground mb-6">
                Escolha um template acima e crie sua primeira imagem profissional
              </p>
              <Button onClick={() => setActiveTab("templates")}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Ver Templates
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {userProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 shadow-lg"
                >
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold">{product.product_name}</p>
                      <p className="text-white/70 text-xs">
                        {new Date(product.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Criar Produto - {selectedTemplate?.brand}
            </DialogTitle>
            <DialogDescription>
              Faça upload da sua logo e produto para gerar uma imagem profissional
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Template Preview */}
            {selectedTemplate && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <img
                  src={selectedTemplate.image}
                  alt={selectedTemplate.brand}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedTemplate.brand}</p>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.style}</p>
                  <Badge variant="outline" className="mt-1">{selectedTemplate.category}</Badge>
                </div>
              </div>
            )}

            {/* Product Name */}
            <div>
              <Label htmlFor="productName">Nome do Produto *</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Minha Pizza Premium"
                className="mt-1"
              />
            </div>

            {/* Upload Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Logo Upload */}
              <div>
                <Label>Sua Logo (opcional)</Label>
                <div className="mt-2 relative">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={(e) => {
                            e.preventDefault();
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Logo</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>

              {/* Product Upload */}
              <div>
                <Label>Seu Produto (opcional)</Label>
                <div className="mt-2 relative">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    {productPreview ? (
                      <div className="relative w-full h-full">
                        <img src={productPreview} alt="Produto" className="w-full h-full object-contain p-4" />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={(e) => {
                            e.preventDefault();
                            setProductFile(null);
                            setProductPreview(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Produto</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProductChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-accent"
              onClick={handleGenerate}
              disabled={isGenerating || !productName}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando imagem...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Gerar Imagem Profissional
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeusProdutos;
