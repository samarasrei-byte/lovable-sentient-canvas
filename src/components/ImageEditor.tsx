import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RotateCcw, Sun, Contrast, Sparkles, Droplet, FlipHorizontal, FlipVertical, RotateCw, Aperture, Palette } from "lucide-react";
import { toast } from "sonner";

interface ImageEditorProps {
  imageUrl: string;
  onDownload: (editedImage: string) => void;
}

const PRESET_FILTERS = [
  { name: 'Normal', brightness: 100, contrast: 100, saturation: 100, warmth: 0, blur: 0, grayscale: 0, vignette: 0 },
  { name: 'Cinema', brightness: 95, contrast: 120, saturation: 85, warmth: 15, blur: 0, grayscale: 0, vignette: 30 },
  { name: 'Vintage', brightness: 105, contrast: 90, saturation: 70, warmth: 30, blur: 0, grayscale: 0, vignette: 20 },
  { name: 'P&B', brightness: 100, contrast: 115, saturation: 0, warmth: 0, blur: 0, grayscale: 100, vignette: 0 },
  { name: 'HDR', brightness: 105, contrast: 135, saturation: 130, warmth: 5, blur: 0, grayscale: 0, vignette: 0 },
  { name: 'Dreamy', brightness: 110, contrast: 85, saturation: 110, warmth: 10, blur: 1, grayscale: 0, vignette: 15 },
  { name: 'Moody', brightness: 85, contrast: 125, saturation: 75, warmth: 20, blur: 0, grayscale: 0, vignette: 40 },
  { name: 'Vibrant', brightness: 102, contrast: 110, saturation: 160, warmth: 0, blur: 0, grayscale: 0, vignette: 0 },
];

export const ImageEditor = ({ imageUrl, onDownload }: ImageEditorProps) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [warmth, setWarmth] = useState(0);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [activePreset, setActivePreset] = useState('Normal');

  const getFilterStyle = () => ({
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%) blur(${blur}px) grayscale(${grayscale}%)`,
    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
  });

  const getVignetteStyle = () => ({
    background: vignette > 0
      ? `radial-gradient(circle, transparent ${100 - vignette}%, rgba(0,0,0,${vignette / 100}) 100%)`
      : 'none',
  });

  const handleReset = () => {
    setBrightness(100); setContrast(100); setSaturation(100);
    setWarmth(0); setBlur(0); setGrayscale(0); setVignette(0);
    setRotation(0); setFlipH(false); setFlipV(false);
    setActivePreset('Normal');
    toast.success("Filtros resetados!");
  };

  const applyPreset = (preset: typeof PRESET_FILTERS[0]) => {
    setBrightness(preset.brightness); setContrast(preset.contrast);
    setSaturation(preset.saturation); setWarmth(preset.warmth);
    setBlur(preset.blur); setGrayscale(preset.grayscale);
    setVignette(preset.vignette); setActivePreset(preset.name);
    toast.success(`Filtro "${preset.name}" aplicado!`);
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
        if (!ctx) return;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%) blur(${blur}px) grayscale(${grayscale}%)`;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Vignette overlay
        if (vignette > 0) {
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
          );
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

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
              <h3 className="font-bold text-base">Editor Pro</h3>
              <p className="text-xs text-muted-foreground">Filtros, presets, rotação e vinheta</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />Resetar
            </Button>
            <Button size="sm" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />Baixar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Preview */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-border shadow-lg bg-muted">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-all duration-200" style={getFilterStyle()} />
            <div className="absolute inset-0 pointer-events-none rounded-lg" style={getVignetteStyle()} />
          </div>

          {/* Transform buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFlipH(!flipH)} className="gap-1.5">
              <FlipHorizontal className="h-4 w-4" /> Espelhar H
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFlipV(!flipV)} className="gap-1.5">
              <FlipVertical className="h-4 w-4" /> Espelhar V
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRotation((r) => (r + 90) % 360)} className="gap-1.5">
              <RotateCw className="h-4 w-4" /> Girar
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="presets" className="gap-1.5 text-xs">
                <Palette className="h-3.5 w-3.5" />Presets
              </TabsTrigger>
              <TabsTrigger value="lighting" className="gap-1.5 text-xs">
                <Sun className="h-3.5 w-3.5" />Luz
              </TabsTrigger>
              <TabsTrigger value="effects" className="gap-1.5 text-xs">
                <Aperture className="h-3.5 w-3.5" />Efeitos
              </TabsTrigger>
            </TabsList>

            {/* Presets Tab */}
            <TabsContent value="presets" className="mt-4">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_FILTERS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-all ${
                      activePreset === preset.name
                        ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30'
                        : 'bg-muted/50 hover:bg-muted text-foreground border border-border'
                    }`}
                  >
                    <div className="w-10 h-10 rounded overflow-hidden border border-border/50">
                      <img
                        src={imageUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        style={{
                          filter: `brightness(${preset.brightness}%) contrast(${preset.contrast}%) saturate(${preset.saturation}%) sepia(${preset.warmth}%) grayscale(${preset.grayscale}%)`,
                        }}
                      />
                    </div>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Lighting Tab */}
            <TabsContent value="lighting" className="space-y-5 mt-4">
              <SliderControl icon={<Sun className="h-4 w-4 text-primary" />} label="Brilho" value={brightness} onChange={setBrightness} min={50} max={150} suffix="%" />
              <SliderControl icon={<Contrast className="h-4 w-4 text-primary" />} label="Contraste" value={contrast} onChange={setContrast} min={50} max={150} suffix="%" />
              <SliderControl icon={<Droplet className="h-4 w-4 text-primary" />} label="Saturação" value={saturation} onChange={setSaturation} min={0} max={200} suffix="%" />
              <SliderControl icon={<Sun className="h-4 w-4 text-primary" />} label="Temperatura" value={warmth} onChange={setWarmth} min={0} max={50} suffix="%" />
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="space-y-5 mt-4">
              <SliderControl icon={<Aperture className="h-4 w-4 text-primary" />} label="Vinheta" value={vignette} onChange={setVignette} min={0} max={80} suffix="%" />
              <SliderControl icon={<Droplet className="h-4 w-4 text-primary" />} label="Desfoque" value={blur} onChange={setBlur} min={0} max={10} suffix="px" />
              <SliderControl icon={<Contrast className="h-4 w-4 text-primary" />} label="Preto & Branco" value={grayscale} onChange={setGrayscale} min={0} max={100} suffix="%" />
            </TabsContent>
          </Tabs>

          <div className="p-3 bg-muted/30 rounded-lg border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Combine presets com ajustes manuais para resultados únicos
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

function SliderControl({ icon, label, value, onChange, min, max, suffix }: {
  icon: React.ReactNode; label: string; value: number;
  onChange: (v: number) => void; min: number; max: number; suffix: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm">{icon}{label}</Label>
        <span className="text-sm font-medium text-muted-foreground">{value}{suffix}</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => onChange(v[0])} min={min} max={max} step={1} className="w-full" />
    </div>
  );
}
