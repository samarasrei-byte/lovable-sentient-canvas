import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, Image as ImageIcon, Camera, X, Loader2, Wand2, Download, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageEditorModal } from "./ImageEditorModal";

// Import showcase images
import productDominos from "@/assets/showcase/product-dominos.png";
import productCocacola from "@/assets/showcase/product-cocacola.png";
import productSunshine from "@/assets/showcase/product-sunshine.png";
import productNike from "@/assets/showcase/product-nike.png";
import productFashion from "@/assets/showcase/product-fashion.png";
import productMcdonalds from "@/assets/showcase/product-mcdonalds.png";
import productPepsi from "@/assets/showcase/product-pepsi.png";
import productMegamare from "@/assets/showcase/product-megamare.png";

interface ShowcaseItem {
  id: string;
  image: string;
  brand: string;
  category: string;
  style: string;
}

const showcaseItems: ShowcaseItem[] = [
  { id: "dominos", image: productDominos, brand: "Domino's", category: "Food & Beverage", style: "Delivery Premium" },
  { id: "cocacola", image: productCocacola, brand: "Coca-Cola", category: "Beverages", style: "Lifestyle Refrescante" },
  { id: "sunshine", image: productSunshine, brand: "Sunshine", category: "Healthy Drinks", style: "Natural & Fresh" },
  { id: "nike", image: productNike, brand: "Nike", category: "Fashion & Sports", style: "Athletic Premium" },
  { id: "fashion", image: productFashion, brand: "Fashion", category: "Luxury", style: "High Fashion" },
  { id: "mcdonalds", image: productMcdonalds, brand: "McDonald's", category: "Fast Food", style: "Fast Casual" },
  { id: "pepsi", image: productPepsi, brand: "Pepsi", category: "Beverages", style: "Bold & Modern" },
  { id: "megamare", image: productMegamare, brand: "Megamare", category: "Perfumery", style: "Luxury Fragrance" },
];

export const ProductShowcase = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ShowcaseItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleSelectTemplate = (template: ShowcaseItem) => {
    setSelectedTemplate(template);
    setShowModal(true);
    setProductName("");
    setLogoPreview(null);
    setProductPreview(null);
    setGeneratedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "product") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          setLogoPreview(reader.result as string);
        } else {
          setProductPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !productName) {
      toast.error("Por favor, preencha o nome do produto");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          productName,
          templateId: selectedTemplate.id,
          templateStyle: selectedTemplate.style,
          productImageBase64: productPreview || null,
          logoImageBase64: logoPreview || null,
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.image) {
        setGeneratedImage(data.image);
        toast.success("Imagem gerada com sucesso! ✨");
      } else {
        throw new Error("Nenhuma imagem foi gerada");
      }
    } catch (error) {
      console.error("Error generating:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao gerar imagem");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${productName || 'produto'}-arcana.png`;
      link.click();
      toast.success("Download iniciado!");
    }
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 -right-32 w-72 h-72 bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -left-32 w-72 h-72 bg-secondary/8 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Produtos Gerados por IA</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Galeria de
            </span>{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Produtos
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Clique em um template e crie sua imagem profissional em segundos com IA
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => handleSelectTemplate(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.image}
                alt={`${item.brand} - Produto gerado por IA`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Wand2 className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white font-semibold">Criar com este estilo</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-lg">{item.brand}</p>
                  <p className="text-white/70 text-sm">{item.category}</p>
                </div>
              </div>
              
              {/* Sparkle effect */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12"
        >
          <div className="flex items-center gap-8 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Sua Logo</span>
            </div>
            
            <div className="text-2xl text-muted-foreground">+</div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-cyan-500" />
              </div>
              <span className="text-sm text-muted-foreground">Seu Produto</span>
            </div>
            
            <div className="text-2xl text-muted-foreground">=</div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Foto Pro</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Generation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Criar Imagem - Estilo {selectedTemplate?.brand}
            </DialogTitle>
            <DialogDescription>
              Faça upload da sua logo e produto para gerar uma imagem profissional com IA
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!generatedImage ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 py-4"
              >
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
                    placeholder="Ex: Minha Marca Premium"
                    className="mt-1"
                  />
                </div>

                {/* Upload Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Logo Upload */}
                  <div>
                    <Label>Sua Logo (opcional)</Label>
                    <div className="mt-2 relative">
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                        {logoPreview ? (
                          <div className="relative w-full h-full">
                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-3" />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={(e) => {
                                e.preventDefault();
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
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "logo")}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Product Upload */}
                  <div>
                    <Label>Seu Produto (opcional)</Label>
                    <div className="mt-2 relative">
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                        {productPreview ? (
                          <div className="relative w-full h-full">
                            <img src={productPreview} alt="Produto" className="w-full h-full object-contain p-3" />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={(e) => {
                                e.preventDefault();
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
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "product")}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-cyan-500"
                  onClick={handleGenerate}
                  disabled={isGenerating || !productName}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Gerando com IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Gerar Imagem Profissional
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 py-4"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={generatedImage}
                    alt="Imagem gerada"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedImage(null)}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Refazer
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowEditor(true)}
                  >
                    <Sliders className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-cyan-500"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  💡 Dica: Faça login para salvar suas criações na galeria
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Image Editor Modal */}
      <ImageEditorModal
        open={showEditor}
        onOpenChange={setShowEditor}
        imageUrl={generatedImage || ""}
        productName={productName}
      />
    </section>
  );
};
