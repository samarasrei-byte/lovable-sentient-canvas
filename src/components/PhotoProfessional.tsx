import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Loader2,
  Download,
  RefreshCw,
  Sliders,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { processAndUploadImage } from "@/utils/upload-utils";


// Import template images
import templateBeauty from "@/assets/template-beauty.png";
import templateFitness from "@/assets/template-fitness.png";
import templatePerfume from "@/assets/template-perfume.png";

const templates = [
  { 
    id: "fashion-studio", 
    name: "Studio Fashion", 
    category: "Moda",
    image: templateBeauty,
    description: "Cenário de estúdio profissional para moda",
    credits: 4
  },
  { 
    id: "fitness-outdoor", 
    name: "Fitness Outdoor", 
    category: "Fitness",
    image: templateFitness,
    description: "Ambiente fitness ao ar livre",
    credits: 4
  },
  { 
    id: "corporate", 
    name: "Corporativo", 
    category: "Business",
    image: templatePerfume,
    description: "Ambiente corporativo profissional",
    credits: 3
  },
  { 
    id: "lifestyle", 
    name: "Lifestyle Home", 
    category: "Lifestyle",
    image: "/placeholder.svg",
    description: "Ambiente residencial aconchegante",
    credits: 3
  },
  { 
    id: "luxury", 
    name: "Luxo Premium", 
    category: "Luxo",
    image: "/placeholder.svg",
    description: "Cenário de luxo sofisticado",
    credits: 5
  },
  { 
    id: "nature", 
    name: "Natureza", 
    category: "Outdoor",
    image: "/placeholder.svg",
    description: "Cenário natural e orgânico",
    credits: 4
  },
];

export const PhotoProfessional = () => {
  const [step, setStep] = useState(1);
  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserPhotoPreview(URL.createObjectURL(file));
      setStep(2);
      setIsUploading(true);
      
      const { url, error } = await processAndUploadImage(file);
      setIsUploading(false);
      
      if (error) {
        toast.error(error);
        setStep(1);
        setUserPhotoPreview(null);
        return;
      }
      setUserPhotoUrl(url);
    }
  };


  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const generatePhoto = async () => {
    if (!userPhotoUrl || !selectedTemplate) {
      if (!userPhotoUrl && isUploading) {
        toast.error("Aguarde o processamento da foto...");
      } else {
        toast.error("Selecione uma foto e um template");
      }
      return;
    }


    setIsGenerating(true);
    
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          userPhotoUrl,

          templateId: selectedTemplate,
          templateName: template?.name,
          type: 'photo-professional'
        }
      });

      if (error) throw error;

      if (data?.images) {
        setGeneratedImages(data.images);
      } else {
        // Demo mode
        setGeneratedImages([
          template?.image || "/placeholder.svg",
          "/placeholder.svg",
        ]);
      }
      setStep(3);
      toast.success("Foto profissional gerada!");
    } catch (error) {
      console.error("Error generating photo:", error);
      
      // Demo mode
      const template = templates.find(t => t.id === selectedTemplate);
      setGeneratedImages([
        template?.image || "/placeholder.svg",
        "/placeholder.svg",
      ]);
      setStep(3);
      toast.success("Foto profissional gerada!");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `foto-profissional-${index + 1}.png`;
    link.click();
    toast.success("Download iniciado!");
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/30">
          <Camera className="w-3 h-3 mr-2" />
          Foto Profissional
        </Badge>
        <h1 className="text-3xl font-bold mb-2">Crie fotos profissionais em segundos</h1>
        <p className="text-muted-foreground">
          Envie sua foto e escolha um template. A IA faz todo o trabalho.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= s 
                ? "bg-secondary text-secondary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {s}
            </div>
            <span className={step >= s ? "text-foreground" : "text-muted-foreground"}>
              {s === 1 ? "Sua Foto" : s === 2 ? "Template" : "Resultado"}
            </span>
            {s < 3 && <div className="w-12 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Step 1: Upload Photo */}
      {step === 1 && (
        <Card className="max-w-xl mx-auto border-dashed border-2 hover:border-secondary/50 transition-colors">
          <CardContent className="p-12">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div 
              className="flex flex-col items-center justify-center cursor-pointer"
              onClick={() => photoInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-xl font-medium mb-2">Envie sua foto</p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                A IA irá remover o fundo e aplicar no template escolhido
              </p>
              <Button>Selecionar Foto</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Template */}
      {step === 2 && (
        <div className="space-y-6">
          {/* User Photo Preview */}
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border">
            {userPhotoPreview && (
              <img src={userPhotoPreview} alt="Sua foto" className="w-20 h-20 rounded-lg object-cover" />

            )}
            <div className="flex-1">
              <p className="font-medium">Sua foto foi carregada!</p>
              <p className="text-sm text-muted-foreground">Agora escolha um template abaixo</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
              Trocar foto
            </Button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? "ring-2 ring-secondary shadow-lg" 
                    : "hover:border-secondary/50"
                }`}
                onClick={() => selectTemplate(template.id)}
              >
                <div className="aspect-[3/4] relative">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Check className="w-6 h-6 text-secondary-foreground" />
                      </div>
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2">{template.credits} créd.</Badge>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sua foto profissional está pronta!</h2>
              <p className="text-muted-foreground">Template: {selectedTemplateData?.name}</p>
            </div>
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Gerar novamente
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedImages.map((img, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="aspect-[3/4] relative">
                  <img src={img} alt={`Resultado ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button onClick={() => downloadImage(img, index)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="secondary">
                      <Sliders className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && step < 3 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        {step === 2 && (
          <Button 
            className="ml-auto gap-2"
            onClick={generatePhoto}
            disabled={!selectedTemplate || isUploading || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Foto Profissional
              </>
            )}
          </Button>
        )}
        {step === 3 && (
          <Button 
            className="ml-auto"
            onClick={() => {
              setStep(1);
              setUserPhotoPreview(null);
              setUserPhotoUrl(null);

              setSelectedTemplate(null);
              setGeneratedImages([]);
            }}
          >
            Criar Nova Foto
          </Button>
        )}
      </div>
    </div>
  );
};
