import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2, Sparkles, Wand2, Upload, CheckCircle, ClipboardPaste, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PromptFromScreenshotProps {
  open: boolean;
  onClose: () => void;
  onPromptCreated: () => void;
}

type Step = "upload" | "review" | "generating" | "done";

export const PromptFromScreenshot = ({ open, onClose, onPromptCreated }: PromptFromScreenshotProps) => {
  const [step, setStep] = useState<Step>("upload");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [referencePhotoPreview, setReferencePhotoPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [promptName, setPromptName] = useState("");
  const [promptCategory, setPromptCategory] = useState("Geral");
  const [promptPrice, setPromptPrice] = useState(2100);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setStep("upload");
    setScreenshotPreview(null);
    setReferencePhotoPreview(null);
    setExtractedText("");
    setGeneratedImageUrl(null);
    setLoading(false);
    setPromptName("");
    setPromptCategory("Geral");
    setPromptPrice(2100);
    setSaving(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleScreenshotUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Envie apenas imagens");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setScreenshotPreview(dataUrl);
      extractPromptFromScreenshot(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleReferencePhotoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Envie apenas imagens");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setReferencePhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleScreenshotUpload(file);
        return;
      }
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleScreenshotUpload(file);
  }, []);

  const extractPromptFromScreenshot = async (imageDataUrl: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("prompt-from-screenshot", {
        body: { screenshotUrl: imageDataUrl, action: "extract" }
      });

      if (error) throw error;
      if (!data?.extractedText) throw new Error("Não foi possível extrair texto da imagem");

      setExtractedText(data.extractedText);
      
      const words = data.extractedText.split(" ").slice(0, 4).join(" ");
      setPromptName(words.length > 30 ? words.substring(0, 30) + "..." : words);
      
      const lower = data.extractedText.toLowerCase();
      if (lower.includes("cyberpunk") || lower.includes("neon")) setPromptCategory("Cyberpunk");
      else if (lower.includes("anime") || lower.includes("manga")) setPromptCategory("Anime");
      else if (lower.includes("fashion") || lower.includes("editorial")) setPromptCategory("Fashion");
      else if (lower.includes("linkedin") || lower.includes("professional")) setPromptCategory("LinkedIn");
      else if (lower.includes("fitness") || lower.includes("gym")) setPromptCategory("Fitness");
      
      setStep("review");
      toast.success("Texto extraído com sucesso!");
    } catch (err: any) {
      console.error("Extract error:", err);
      toast.error("Erro ao extrair texto: " + (err.message || "Tente novamente"));
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!referencePhotoPreview) {
      toast.error("Suba uma foto de referência antes de gerar");
      return;
    }
    setStep("generating");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("prompt-from-screenshot", {
        body: { 
          promptText: extractedText, 
          referenceImageUrl: referencePhotoPreview,
          action: "generate" 
        }
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error("Falha na geração da imagem");

      setGeneratedImageUrl(data.imageUrl);
      setStep("done");
      toast.success("Imagem gerada com sucesso!");
    } catch (err: any) {
      console.error("Generate error:", err);
      toast.error("Erro ao gerar imagem: " + (err.message || "Tente novamente"));
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  const saveAsPrompt = async () => {
    if (!extractedText || !generatedImageUrl) return;
    setSaving(true);

    try {
      let finalImageUrl = generatedImageUrl;
      if (generatedImageUrl.startsWith("data:")) {
        const base64 = generatedImageUrl.split(",")[1];
        const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const fileName = `screenshot-gen-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("prompt-images")
          .upload(fileName, byteArray, { contentType: "image/png", upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("prompt-images").getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      const requiredFields: string[] = ["photo"];
      if (extractedText.includes("{name}")) requiredFields.push("name");
      if (extractedText.includes("{instagram}")) requiredFields.push("instagram");
      if (extractedText.includes("{description}")) requiredFields.push("description");

      const hypeTexts = ["🔥 +500k gerações", "⚡ Trending", "💎 Premium", "🚀 Viral", "✨ Top Creator"];
      const hypeText = hypeTexts[Math.floor(Math.random() * hypeTexts.length)];

      const promptData = {
        name: promptName || "Prompt from Screenshot",
        description: `Gerado automaticamente a partir de screenshot. ${extractedText.substring(0, 100)}...`,
        category: promptCategory,
        hype_text: hypeText,
        example_image_url: finalImageUrl,
        prompt_template: extractedText,
        price_cents: promptPrice,
        status: "active",
        required_fields: requiredFields,
        ai_model: "gemini-2.5-flash-image",
        min_photos: 1,
        is_influencer_prompt: false,
      };

      const { data: result, error: insertError } = await supabase.functions.invoke("manage-prompt", {
        body: { action: "insert", promptData }
      });

      if (insertError) throw insertError;
      if (result?.error) throw new Error(result.error);

      toast.success("Prompt salvo no marketplace!");
      onPromptCreated();
      handleClose();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error("Erro ao salvar: " + (err.message || "Tente novamente"));
    } finally {
      setSaving(false);
    }
  };

  const categories = ["Geral", "Cyberpunk", "Anime", "Fashion", "LinkedIn", "Fitness", "Social Media", "Vintage", "Arte", "Profissional", "Hypando", "Copa do Mundo", "Animais"];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onPaste={handlePaste}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Criar Prompt a partir de Imagem de Referência
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Upload screenshot */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Suba a <strong>imagem de referência</strong> do prompt. A IA vai extrair o texto e criar o prompt automaticamente.
              </p>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
                onClick={() => document.getElementById("screenshot-input")?.click()}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Extraindo texto da imagem de referência...</p>
                  </div>
                ) : screenshotPreview ? (
                  <img src={screenshotPreview} alt="Screenshot" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <ClipboardPaste className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-medium">Cole um print aqui (Ctrl+V)</p>
                    <p className="text-xs text-muted-foreground">ou arraste / clique para fazer upload</p>
                  </div>
                )}
                <input
                  id="screenshot-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleScreenshotUpload(file);
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Review text + upload reference photo */}
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Screenshot preview */}
                {screenshotPreview && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img src={screenshotPreview} alt="Screenshot" className="w-full h-32 object-cover" />
                    <p className="text-[10px] text-center text-muted-foreground py-1">Print original</p>
                  </div>
                )}
                
                {/* Details */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Nome do Prompt</Label>
                    <Input
                      value={promptName}
                      onChange={(e) => setPromptName(e.target.value)}
                      placeholder="Nome do prompt"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Categoria</Label>
                    <Select value={promptCategory} onValueChange={setPromptCategory}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Preço (centavos)</Label>
                    <Input
                      type="number"
                      value={promptPrice}
                      onChange={(e) => setPromptPrice(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs">Prompt Extraído (edite se necessário)</Label>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={4}
                  className="text-sm font-mono"
                />
              </div>

              {/* Reference photo upload */}
              <div>
                <Label className="text-xs font-semibold">📸 Suba a foto de referência para gerar a imagem de exemplo</Label>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Esta foto + o prompt extraído serão usados para gerar a imagem de exemplo do marketplace.
                </p>
                <div
                  className="border-2 border-dashed border-accent/40 rounded-xl p-6 text-center cursor-pointer hover:border-accent/70 hover:bg-accent/5 transition-all"
                  onClick={() => document.getElementById("reference-photo-input")?.click()}
                >
                  {referencePhotoPreview ? (
                    <div className="flex items-center gap-4">
                      <img src={referencePhotoPreview} alt="Referência" className="w-24 h-24 object-cover rounded-lg" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-accent">Foto carregada ✓</p>
                        <p className="text-[11px] text-muted-foreground">Clique para trocar</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus className="w-8 h-8 text-accent/60" />
                      <p className="text-sm">Clique para subir a foto de referência</p>
                    </div>
                  )}
                  <input
                    id="reference-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleReferencePhotoUpload(file);
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { reset(); }} className="flex-1">
                  Voltar
                </Button>
                <Button 
                  onClick={generateImage} 
                  disabled={!referencePhotoPreview}
                  className="flex-1 gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Gerar Imagem de Exemplo
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Generating */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <p className="font-medium">Gerando imagem com prompt + foto de referência...</p>
              <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </motion.div>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Imagem gerada com sucesso!</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {generatedImageUrl && (
                  <div className="rounded-lg overflow-hidden border border-primary/30">
                    <img src={generatedImageUrl} alt="Generated" className="w-full aspect-[4/5] object-cover" />
                    <p className="text-[10px] text-center text-muted-foreground py-1">Imagem gerada</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={promptName}
                      onChange={(e) => setPromptName(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Categoria</Label>
                    <Select value={promptCategory} onValueChange={setPromptCategory}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Preço</Label>
                    <Input
                      type="number"
                      value={promptPrice}
                      onChange={(e) => setPromptPrice(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Prompt</Label>
                    <p className="text-xs text-muted-foreground line-clamp-3 font-mono">{extractedText}</p>
                  </div>
                </div>
              </div>

              {/* Trocar foto de referência e regenerar */}
              <div className="p-3 rounded-lg border border-dashed border-accent/40 bg-accent/5">
                <Label className="text-xs font-semibold">📸 Trocar foto de referência e regenerar</Label>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Suba outra foto para gerar uma nova imagem de exemplo com o mesmo prompt.
                </p>
                <div
                  className="border border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:border-accent/60 hover:bg-accent/5 transition-all"
                  onClick={() => document.getElementById("redo-reference-input")?.click()}
                >
                  {referencePhotoPreview ? (
                    <div className="flex items-center gap-3 justify-center">
                      <img src={referencePhotoPreview} alt="Ref" className="w-16 h-16 object-cover rounded-lg" />
                      <p className="text-xs text-muted-foreground">Clique para trocar</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <ImagePlus className="w-6 h-6 text-accent/60" />
                      <p className="text-xs">Subir nova foto de referência</p>
                    </div>
                  )}
                  <input
                    id="redo-reference-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleReferencePhotoUpload(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("review")} className="flex-1 gap-2">
                  <Wand2 className="w-4 h-4" />
                  Regenerar
                </Button>
                <Button onClick={saveAsPrompt} disabled={saving} className="flex-1 gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Salvar no Marketplace
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
