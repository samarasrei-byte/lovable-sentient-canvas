import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Sun, 
  Contrast, 
  Palette, 
  RotateCcw, 
  Download, 
  X,
  Thermometer
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  productName?: string;
  onSave?: (editedImageUrl: string) => void;
}

export const ImageEditorModal = ({
  open,
  onOpenChange,
  imageUrl,
  productName = "imagem",
  onSave,
}: ImageEditorModalProps) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [warmth, setWarmth] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (open && imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setOriginalImage(img);
      };
      img.src = imageUrl;
    }
  }, [open, imageUrl]);

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      applyFilters();
    }
  }, [originalImage, brightness, contrast, saturation, warmth]);

  const applyFilters = () => {
    if (!originalImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply CSS filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    // Draw the image
    ctx.drawImage(originalImage, 0, 0);

    // Apply warmth manually if needed
    if (warmth !== 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Increase red channel and decrease blue for warmth
        data[i] = Math.min(255, data[i] + warmth);     // Red
        data[i + 2] = Math.max(0, data[i + 2] - warmth); // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement("a");
    link.download = `${productName}-editado.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleSave = () => {
    if (!canvasRef.current || !onSave) return;
    const editedImageUrl = canvasRef.current.toDataURL("image/png");
    onSave(editedImageUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Editor de Imagem
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Image Preview */}
          <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl overflow-hidden min-h-[300px]">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[400px] object-contain rounded-lg"
            />
          </div>

          {/* Controls */}
          <div className="w-full lg:w-72 space-y-6 overflow-y-auto">
            {/* Brightness */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  Brilho
                </Label>
                <span className="text-xs text-muted-foreground">{brightness}%</span>
              </div>
              <Slider
                value={[brightness]}
                onValueChange={([value]) => setBrightness(value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm">
                  <Contrast className="h-4 w-4 text-purple-500" />
                  Contraste
                </Label>
                <span className="text-xs text-muted-foreground">{contrast}%</span>
              </div>
              <Slider
                value={[contrast]}
                onValueChange={([value]) => setContrast(value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm">
                  <Palette className="h-4 w-4 text-pink-500" />
                  Saturação
                </Label>
                <span className="text-xs text-muted-foreground">{saturation}%</span>
              </div>
              <Slider
                value={[saturation]}
                onValueChange={([value]) => setSaturation(value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Warmth */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  Temperatura
                </Label>
                <span className="text-xs text-muted-foreground">
                  {warmth > 0 ? `+${warmth}` : warmth}
                </span>
              </div>
              <Slider
                value={[warmth]}
                onValueChange={([value]) => setWarmth(value)}
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                Resetar
              </Button>

              <Button
                className="w-full gap-2 bg-gradient-to-r from-primary to-cyan-500"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Baixar Editada
              </Button>

              {onSave && (
                <Button
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={handleSave}
                >
                  Salvar Alterações
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
