import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Camera, Shirt, Upload, X, CheckCircle2, Loader2, 
  Sparkles, ImagePlus, AlertTriangle, Lightbulb, Download, RotateCcw
} from "lucide-react";

interface UploadSlot {
  file: File | null;
  preview: string | null;
}

const FutebolGenerator = () => {
  const [facePhoto, setFacePhoto] = useState<UploadSlot>({ file: null, preview: null });
  const [jerseyPhoto, setJerseyPhoto] = useState<UploadSlot>({ file: null, preview: null });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);
  const jerseyInputRef = useRef<HTMLInputElement>(null);

  const bothUploaded = !!facePhoto.file && !!jerseyPhoto.file;

  const handleFileSelect = useCallback((type: "face" | "jersey", file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Envie apenas imagens (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 10MB.");
      return;
    }
    const preview = URL.createObjectURL(file);
    if (type === "face") setFacePhoto({ file, preview });
    else setJerseyPhoto({ file, preview });
  }, []);

  const clearSlot = (type: "face" | "jersey") => {
    if (type === "face") {
      if (facePhoto.preview) URL.revokeObjectURL(facePhoto.preview);
      setFacePhoto({ file: null, preview: null });
    } else {
      if (jerseyPhoto.preview) URL.revokeObjectURL(jerseyPhoto.preview);
      setJerseyPhoto({ file: null, preview: null });
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleGenerate = async () => {
    if (!facePhoto.file || !jerseyPhoto.file) {
      toast.error("⚠️ Você precisa enviar sua foto e a camisa do time para continuar.");
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setGeneratedImage(null);

    try {
      const [faceB64, jerseyB64] = await Promise.all([
        toBase64(facePhoto.file),
        toBase64(jerseyPhoto.file),
      ]);
      setProgress(30);

      const promptTemplate = `Gere um retrato hiper-realista de um jogador de futebol profissional em um vestiário de clube.

INSTRUÇÕES OBRIGATÓRIAS:
1. A PESSOA na imagem DEVE ser EXATAMENTE idêntica à pessoa da FOTO DE REFERÊNCIA DO ROSTO (primeira imagem). Preservar 100% dos traços faciais, tom de pele, formato dos olhos, nariz, boca, mandíbula, cabelo e todas as características.
2. O jogador DEVE estar vestindo a CAMISA DO TIME mostrada na segunda imagem de referência. Reproduza fielmente as cores, escudo, patrocínios e design da camisa.
3. O cenário deve ser um vestiário profissional decorado com as cores e identidade visual do time da camisa — armários com uniformes, iluminação temática, escudo do time nas paredes.
4. O jogador deve estar sentado em um banco do vestiário, segurando uma bola de futebol com uma mão, olhando diretamente para a câmera com expressão confiante.
5. Iluminação cinematográfica profissional, estilo editorial esportivo, qualidade 8K.
6. A imagem deve parecer uma foto real de bastidores de um clube profissional.`;

      const { data, error } = await supabase.functions.invoke("generate-prompt-image", {
        body: {
          promptTemplate,
          userPhotoUrls: [faceB64],
          exampleImageUrl: jerseyB64,
          aiModel: "google/gemini-3.1-flash-image-preview",
        },
      });

      setProgress(90);

      if (error) throw new Error(error.message || "Erro ao gerar imagem");
      if (!data?.imageUrl) throw new Error("Nenhuma imagem foi gerada. Tente novamente.");

      setGeneratedImage(data.imageUrl);
      setProgress(100);
      toast.success("🎉 Sua foto foi gerada com sucesso!");
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = "minha-foto-jogador.png";
    a.click();
  };

  const UploadCard = ({
    type,
    label,
    description,
    icon: Icon,
    slot,
    inputRef,
  }: {
    type: "face" | "jersey";
    label: string;
    description: string;
    icon: typeof Camera;
    slot: UploadSlot;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <Card
      className={`relative border-2 border-dashed transition-all duration-300 overflow-hidden group ${
        slot.file
          ? "border-green-500/50 bg-green-500/5"
          : "border-border hover:border-primary/50 bg-card/50 hover:bg-card/80"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileSelect(type, f);
          e.target.value = "";
        }}
      />

      {slot.preview ? (
        <div className="relative aspect-square">
          <img
            src={slot.preview}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <button
            onClick={() => clearSlot(type)}
            className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground rounded-full p-1.5 hover:bg-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-foreground text-sm font-medium">{label}</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-8 w-full aspect-square cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold text-base">{label}</p>
            <p className="text-muted-foreground text-xs mt-1 max-w-[180px]">{description}</p>
          </div>
          <div className="flex items-center gap-1.5 text-primary/70 text-xs mt-1">
            <Upload className="w-3.5 h-3.5" />
            <span>Clique para enviar</span>
          </div>
        </button>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Gerador com IA
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Crie sua foto como jogador profissional
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Envie sua foto e a camisa do seu time para gerar sua imagem personalizada
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <UploadCard
            type="face"
            label="Sua foto"
            description="Foto do rosto, boa iluminação, de frente"
            icon={Camera}
            slot={facePhoto}
            inputRef={faceInputRef as React.RefObject<HTMLInputElement>}
          />
          <UploadCard
            type="jersey"
            label="Camisa do time"
            description="Parte frontal da camisa visível"
            icon={Shirt}
            slot={jerseyPhoto}
            inputRef={jerseyInputRef as React.RefObject<HTMLInputElement>}
          />
        </div>

        {/* Tip */}
        <div className="flex items-start gap-2.5 bg-muted/50 border border-border rounded-xl px-4 py-3 mb-6">
          <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Dica:</strong> quanto melhor a qualidade das imagens, mais realista será o resultado.
          </p>
        </div>

        {/* Progress */}
        {isGenerating && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-foreground font-medium">
                Criando seu vestiário profissional...
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Isso pode levar até 30 segundos
            </p>
          </div>
        )}

        {/* Generate Button */}
        {!generatedImage && (
          <Button
            onClick={handleGenerate}
            disabled={!bothUploaded || isGenerating}
            className="w-full h-14 text-base font-semibold rounded-xl gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-40"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                Gerar minha foto
              </>
            )}
          </Button>
        )}

        {!bothUploaded && !isGenerating && !generatedImage && (
          <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Envie as duas fotos para ativar o botão</span>
          </div>
        )}

        {/* Result */}
        {generatedImage && (
          <div className="mt-6 space-y-4">
            <Card className="overflow-hidden border-primary/20">
              <img
                src={generatedImage}
                alt="Sua foto como jogador profissional"
                className="w-full"
              />
            </Card>
            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1 h-12 gap-2 rounded-xl" size="lg">
                <Download className="w-5 h-5" />
                Baixar imagem
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedImage(null);
                  setProgress(0);
                }}
                className="h-12 px-4 rounded-xl"
                size="lg"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutebolGenerator;
