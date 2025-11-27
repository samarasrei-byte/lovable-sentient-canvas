import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RotateCcw, Sun, Contrast, Sparkles, Droplet } from "lucide-react";
import { toast } from "sonner";

interface ImageEditorProps {
  imageUrl: string;
  onDownload: (editedImage: string) => void;
}

export const ImageEditor = ({ imageUrl, onDownload }: ImageEditorProps) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [warmth, setWarmth] = useState(0);

  const getFilterStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%)`,
    };
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
    toast.success("Filtros resetados!");
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%)`;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `arcana-edited-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.success("Download iniciado!");
            }
          }, 'image/png');
        }
      };
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error("Erro ao fazer download.");
    }
  };

  return (
    <Card className="border-2 border-primary/20 overflow-hidden">
      <div className="bg-muted/30 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base">Ajustar Imagem</h3>
              <p className="text-xs text-muted-foreground">
                Personalize iluminação e filtros
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border-2 border-border shadow-lg bg-muted">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              style={getFilterStyle()}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="lighting" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lighting" className="gap-2">
                <Sun className="h-4 w-4" />
                Iluminação
              </TabsTrigger>
              <TabsTrigger value="color" className="gap-2">
                <Droplet className="h-4 w-4" />
                Cor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lighting" className="space-y-6 mt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm">
                    <Sun className="h-4 w-4 text-primary" />
                    Brilho
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {brightness}%
                  </span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(v) => setBrightness(v[0])}
                  min={50}
                  max={150}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm">
                    <Contrast className="h-4 w-4 text-primary" />
                    Contraste
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {contrast}%
                  </span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(v) => setContrast(v[0])}
                  min={50}
                  max={150}
                  step={1}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="color" className="space-y-6 mt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm">
                    <Droplet className="h-4 w-4 text-primary" />
                    Saturação
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {saturation}%
                  </span>
                </div>
                <Slider
                  value={[saturation]}
                  onValueChange={(v) => setSaturation(v[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm">
                    <Sun className="h-4 w-4 text-primary" />
                    Temperatura
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {warmth > 0 ? `+${warmth}` : warmth}%
                  </span>
                </div>
                <Slider
                  value={[warmth]}
                  onValueChange={(v) => setWarmth(v[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="p-4 bg-muted/30 rounded-lg border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Ajuste os controles e veja as mudanças em tempo real
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
