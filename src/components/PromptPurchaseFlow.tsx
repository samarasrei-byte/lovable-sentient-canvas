import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Upload, 
  User, 
  AtSign, 
  Sparkles, 
  QrCode, 
  Copy, 
  Check, 
  Download,
  Loader2,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
  price_cents: number;
  required_fields: string[];
  prompt_template?: string;
  negative_prompt?: string | null;
  ai_model?: string;
  min_photos?: number;
  example_image_url?: string | null;
}

interface PromptPurchaseFlowProps {
  prompt: Prompt;
  onClose: () => void;
}

type FlowStep = 'form' | 'payment' | 'generating' | 'complete';

export const PromptPurchaseFlow = ({ prompt, onClose }: PromptPurchaseFlowProps) => {
  const [step, setStep] = useState<FlowStep>('form');
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    email: '',
    description: '',
    photo: null as File | null,
    photoPreview: ''
  });
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'paid'>('pending');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      // Create optimized preview: resize to max 400px for instant render
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 400;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setFormData(prev => ({
            ...prev,
            photo: file,
            photoPreview: canvas.toDataURL('image/jpeg', 0.85)
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async () => {
    // Validate required fields
    if (prompt.required_fields.includes('photo') && !formData.photo) {
      toast.error("Por favor, envie sua foto.");
      return;
    }
    if (prompt.required_fields.includes('name') && !formData.name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }

    try {
      // Create purchase record
      const { data, error } = await supabase
        .from("prompt_purchases")
        .insert({
          prompt_id: prompt.id,
          user_name: formData.name,
          user_instagram: formData.instagram,
          user_email: formData.email,
          amount_cents: prompt.price_cents,
          payment_status: 'pending',
          generation_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      setPurchaseId(data.id);
      setStep('payment');
    } catch (error) {
      console.error("Error creating purchase:", error);
      toast.error("Erro ao processar. Tente novamente.");
    }
  };

  const pixCode = `00020126580014br.gov.bcb.pix0136${purchaseId?.slice(0, 32) || 'arcana-prompt-marketplace'}5204000053039865406${(prompt.price_cents / 100).toFixed(2)}5802BR5925ARCANA MARKETPLACE LTDA6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const simulatePayment = async () => {
    setPaymentStatus('checking');
    
    // Simulate payment verification (in production, this would poll an API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPaymentStatus('paid');
    toast.success("Pagamento confirmado!");
    
    // Update purchase status
    if (purchaseId) {
      await supabase
        .from("prompt_purchases")
        .update({ payment_status: 'paid' })
        .eq("id", purchaseId);
    }

    // Start generation
    setTimeout(() => {
      setStep('generating');
      generateImage();
    }, 1000);
  };

  const generateImage = async () => {
    try {
      // Update generation status
      if (purchaseId) {
        await supabase
          .from("prompt_purchases")
          .update({ generation_status: 'generating' })
          .eq("id", purchaseId);
      }

      // Upload user photo to storage if provided
      let uploadedPhotoUrl: string | null = null;
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const filePath = `purchases/${purchaseId || Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(filePath, formData.photo, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
          toast.error("Erro ao enviar foto. Tentando gerar sem referência...");
        } else {
          const { data: urlData } = supabase.storage
            .from('user-photos')
            .getPublicUrl(uploadData.path);
          uploadedPhotoUrl = urlData.publicUrl;
        }

        // Also update the purchase record with the user photo
        if (purchaseId && uploadedPhotoUrl) {
          await supabase
            .from("prompt_purchases")
            .update({ user_photo_url: uploadedPhotoUrl })
            .eq("id", purchaseId);
        }
      }

      // Call the generate edge function with the uploaded photo URL and example image
      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: {
          purchaseId,
          promptTemplate: prompt.prompt_template,
          negativePrompt: prompt.negative_prompt,
          aiModel: prompt.ai_model,
          userName: formData.name,
          userInstagram: formData.instagram,
          userDescription: formData.description,
          userPhotoUrl: uploadedPhotoUrl,
          exampleImageUrl: prompt.example_image_url,
        }
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error("Nenhuma imagem gerada");

      setGeneratedImage(data.imageUrl);
      
      // Update purchase with generated image
      if (purchaseId) {
        await supabase
          .from("prompt_purchases")
          .update({ 
            generation_status: 'completed',
            generated_image_url: data.imageUrl 
          })
          .eq("id", purchaseId);
      }

      setStep('complete');
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Erro na geração. Tente novamente.");
      
      // Update status to failed
      if (purchaseId) {
        await supabase
          .from("prompt_purchases")
          .update({ generation_status: 'failed' })
          .eq("id", purchaseId);
      }
      
      // Go back to form step instead of showing fake image
      setStep('form');
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      toast.success("Download iniciado!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <GlassCardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <GlassCardTitle className="text-lg">{prompt.name}</GlassCardTitle>
                <p className="text-sm text-muted-foreground">{prompt.category}</p>
              </div>
            </div>
            <Badge className="absolute top-6 right-14 bg-primary text-primary-foreground">
              {formatPrice(prompt.price_cents)}
            </Badge>
          </GlassCardHeader>

          <GlassCardContent className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className={`flex items-center gap-1 ${step === 'form' ? 'text-primary' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === 'form' ? 'bg-primary text-primary-foreground' : 
                  ['payment', 'generating', 'complete'].includes(step) ? 'bg-primary/20 text-primary' : 'bg-white/10'
                }`}>
                  1
                </div>
                <span className="hidden sm:inline">Dados</span>
              </div>
              <div className="flex-1 h-px bg-white/10 mx-2" />
              <div className={`flex items-center gap-1 ${step === 'payment' ? 'text-primary' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === 'payment' ? 'bg-primary text-primary-foreground' : 
                  ['generating', 'complete'].includes(step) ? 'bg-primary/20 text-primary' : 'bg-white/10'
                }`}>
                  2
                </div>
                <span className="hidden sm:inline">PIX</span>
              </div>
              <div className="flex-1 h-px bg-white/10 mx-2" />
              <div className={`flex items-center gap-1 ${step === 'generating' ? 'text-primary' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === 'generating' ? 'bg-primary text-primary-foreground' : 
                  step === 'complete' ? 'bg-primary/20 text-primary' : 'bg-white/10'
                }`}>
                  3
                </div>
                <span className="hidden sm:inline">Gerar</span>
              </div>
              <div className="flex-1 h-px bg-white/10 mx-2" />
              <div className={`flex items-center gap-1 ${step === 'complete' ? 'text-primary' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === 'complete' ? 'bg-primary text-primary-foreground' : 'bg-white/10'
                }`}>
                  4
                </div>
                <span className="hidden sm:inline">Pronto</span>
              </div>
            </div>

            {/* STEP 1: Form */}
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Photo Upload */}
                {prompt.required_fields.includes('photo') && (
                  <div className="space-y-2">
                    <Label className="text-sm">Sua foto</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative aspect-square max-w-[200px] mx-auto rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
                    >
                      {formData.photoPreview ? (
                        <img 
                          src={formData.photoPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Upload className="w-8 h-8" />
                          <span className="text-xs">Clique para enviar</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Name */}
                {prompt.required_fields.includes('name') && (
                  <div className="space-y-2">
                    <Label className="text-sm">Seu nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Como você quer ser chamado"
                        className="pl-10 bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                )}

                {/* Instagram */}
                {prompt.required_fields.includes('instagram') && (
                  <div className="space-y-2">
                    <Label className="text-sm">@Instagram</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.instagram}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="seu_usuario"
                        className="pl-10 bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                {prompt.required_fields.includes('description') && (
                  <div className="space-y-2">
                    <Label className="text-sm">Descrição adicional</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o que você quer na imagem..."
                      className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>
                )}

                <GlassButton onClick={handleSubmitForm} className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar imagem - {formatPrice(prompt.price_cents)}
                </GlassButton>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Escaneie o QR Code ou copie o código PIX
                  </p>

                  {/* QR Code Placeholder */}
                  <div className="relative w-48 h-48 mx-auto bg-white rounded-xl p-3 mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-white" />
                    </div>
                    {paymentStatus === 'paid' && (
                      <div className="absolute inset-0 bg-green-500/90 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>

                  {/* PIX Code */}
                  <div className="relative">
                    <Input
                      value={pixCode.slice(0, 40) + '...'}
                      readOnly
                      className="pr-12 text-xs bg-white/5 border-white/10"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    {paymentStatus === 'pending' && (
                      <div className="flex items-center justify-center gap-2 text-secondary">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Aguardando pagamento...</span>
                      </div>
                    )}
                    {paymentStatus === 'checking' && (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Verificando pagamento...</span>
                      </div>
                    )}
                    {paymentStatus === 'paid' && (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Pagamento confirmado!</span>
                      </div>
                    )}
                  </div>

                  {/* Simulate Payment Button (for demo) */}
                  {paymentStatus === 'pending' && (
                    <GlassButton 
                      onClick={simulatePayment} 
                      className="w-full mt-4"
                      variant="outline"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Simular Pagamento (Demo)
                    </GlassButton>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Generating */}
            {step === 'generating' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="py-8 text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-violet-500 animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Gerando sua imagem...</h3>
                <p className="text-sm text-muted-foreground">
                  A IA está criando sua arte personalizada.
                  <br />Isso pode levar alguns segundos.
                </p>

                {/* Retry button */}
                <GlassButton 
                  onClick={() => { setStep('generating'); generateImage(); }} 
                  variant="outline" 
                  className="mt-4"
                >
                  <Loader2 className="w-4 h-4 mr-2" />
                  Tentar novamente
                </GlassButton>

                {/* Subscription upsell */}
                <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Plano Mensal</span>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Faça <span className="text-primary font-bold">10 fotos por mês</span> por apenas
                  </p>
                  <p className="text-2xl font-bold text-primary mb-2">R$ 100,00<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Economize até 50% comparado a compras avulsas
                  </p>
                  <GlassButton 
                    onClick={() => window.open('/app/planos', '_blank')}
                    className="w-full text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Quero assinar agora
                  </GlassButton>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Complete */}
            {step === 'complete' && generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Imagem gerada com sucesso!</h3>
                </div>

                {/* Generated Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <GlassButton onClick={handleDownload} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </GlassButton>
                  <GlassButton onClick={onClose} variant="outline" className="flex-1">
                    Fechar
                  </GlassButton>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Sua imagem também foi enviada para seu email (se informado).
                </p>
              </motion.div>
            )}
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
