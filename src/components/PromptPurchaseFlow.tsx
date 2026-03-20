import { useState, useRef, useEffect } from "react";
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
  Clock,
  Pencil,
  Plus,
  Trash2,
  Users
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

type FlowStep = 'form' | 'payment' | 'generating' | 'complete' | 'editing';

interface PhotoSlot {
  file: File | null;
  preview: string;
}

const GeneratingStep = ({ label, delay }: { label: string; delay: number }) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-500 ${active ? 'text-primary opacity-100' : 'text-muted-foreground/40 opacity-60'}`}>
      {active ? <Check className="w-3.5 h-3.5 text-primary" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      <span>{label}</span>
    </div>
  );
};


export const PromptPurchaseFlow = ({ prompt, onClose }: PromptPurchaseFlowProps) => {
  const [step, setStep] = useState<FlowStep>('form');
  const maxPhotos = prompt.min_photos && prompt.min_photos > 1 ? prompt.min_photos : 1;
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    email: '',
    description: '',
  });
  const [photos, setPhotos] = useState<PhotoSlot[]>([{ file: null, preview: '' }]);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'paid'>('pending');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 20MB.");
        return;
      }
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
          setPhotos(prev => {
            const updated = [...prev];
            updated[index] = { file, preview: canvas.toDataURL('image/jpeg', 0.85) };
            return updated;
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhotoSlot = () => {
    if (photos.length < maxPhotos) {
      setPhotos(prev => [...prev, { file: null, preview: '' }]);
    }
  };

  const removePhotoSlot = (index: number) => {
    if (photos.length > 1) {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmitForm = async () => {
    if (prompt.required_fields.includes('photo') && !photos[0].file) {
      toast.error("Por favor, envie pelo menos uma foto.");
      return;
    }
    if (prompt.required_fields.includes('name') && !formData.name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-prompt-purchase", {
        body: {
          promptId: prompt.id,
          userName: formData.name,
          userInstagram: formData.instagram,
          userEmail: formData.email,
        },
      });

      if (error) throw error;
      if (!data?.purchaseId) throw new Error("Compra não criada corretamente");

      setPurchaseId(data.purchaseId);
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('paid');
    toast.success("Pagamento confirmado!");
    setTimeout(() => {
      setStep('generating');
      void generateImage();
    }, 1000);
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo.file) continue;
      const fileExt = photo.file.name.split('.').pop();
      const filePath = `purchases/${purchaseId}-photo${i + 1}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, photo.file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error(`Error uploading photo ${i + 1}:`, uploadError);
        continue;
      }
      const { data: urlData } = supabase.storage.from('user-photos').getPublicUrl(uploadData.path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const generateImage = async () => {
    try {
      if (!purchaseId) throw new Error("Compra não iniciada corretamente");

      const uploadedUrls = await uploadPhotos();
      if (photos.some(p => p.file) && uploadedUrls.length === 0) {
        toast.error("Erro ao enviar fotos. Tentando gerar sem referência...");
      }

      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: {
          purchaseId,
          promptTemplate: prompt.prompt_template,
          negativePrompt: prompt.negative_prompt,
          aiModel: prompt.ai_model,
          userName: formData.name,
          userInstagram: formData.instagram,
          userDescription: formData.description,
          userPhotoUrl: uploadedUrls[0] || null,
          userPhotoUrls: uploadedUrls,
          exampleImageUrl: prompt.example_image_url,
        }
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error("Nenhuma imagem gerada");

      setGeneratedImage(data.imageUrl);
      setStep('complete');
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Erro na geração. Tente novamente.");
      setStep('form');
    }
  };

  const handleEditImage = async () => {
    if (!editInstruction.trim()) {
      toast.error("Descreva o que deseja alterar.");
      return;
    }
    if (!generatedImage) return;

    setIsEditing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: {
          purchaseId,
          promptTemplate: editInstruction,
          aiModel: 'google/gemini-3.1-flash-image-preview',
          editMode: true,
          sourceImageUrl: generatedImage,
          userName: formData.name,
        }
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error("Edição não gerou imagem");

      setGeneratedImage(data.imageUrl);
      setEditInstruction('');
      setStep('complete');
      toast.success("Imagem editada com sucesso!");
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error("Erro ao editar. Tente novamente.");
    } finally {
      setIsEditing(false);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg my-4"
      >
        <GlassCard className="relative overflow-hidden">
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
              {['form', 'payment', 'generating', 'complete'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-1 ${step === s || (step === 'editing' && s === 'complete') ? 'text-primary' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step === s || (step === 'editing' && s === 'complete') ? 'bg-primary text-primary-foreground' : 
                      ['form', 'payment', 'generating', 'complete'].indexOf(step === 'editing' ? 'complete' : step) > i ? 'bg-primary/20 text-primary' : 'bg-white/10'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="hidden sm:inline">{['Dados', 'PIX', 'Gerar', 'Pronto'][i]}</span>
                  </div>
                  {i < 3 && <div className="flex-1 h-px bg-white/10 mx-2 w-4 sm:w-8" />}
                </div>
              ))}
            </div>

            {/* STEP 1: Form */}
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Photo Upload - Multi support */}
                {prompt.required_fields.includes('photo') && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm flex items-center gap-2">
                        {maxPhotos > 1 ? <Users className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                        {maxPhotos > 1 ? `Fotos (${photos.length}/${maxPhotos} pessoas)` : 'Sua foto'}
                      </Label>
                      {maxPhotos > 1 && photos.length < maxPhotos && (
                        <button
                          onClick={addPhotoSlot}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Adicionar pessoa
                        </button>
                      )}
                    </div>
                    
                    <div className={`grid gap-3 ${maxPhotos > 1 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className={`relative rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden ${
                              maxPhotos > 1 ? 'aspect-square' : 'aspect-square max-w-[200px] mx-auto'
                            }`}
                          >
                            {photo.preview ? (
                              <img src={photo.preview} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                                <Upload className="w-6 h-6" />
                                <span className="text-[10px]">
                                  {maxPhotos > 1 ? `Pessoa ${index + 1}` : 'Clique para enviar'}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Remove button for multi-photo */}
                          {maxPhotos > 1 && photos.length > 1 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removePhotoSlot(index); }}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                          <input
                            ref={el => { fileInputRefs.current[index] = el; }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(index, e)}
                            className="hidden"
                          />
                        </div>
                      ))}
                    </div>

                    {maxPhotos > 1 && (
                      <p className="text-[10px] text-muted-foreground text-center">
                        Envie uma foto de cada pessoa que deve aparecer na imagem
                      </p>
                    )}
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

                  <div className="relative w-48 h-48 mx-auto bg-white rounded-xl p-3 mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-white" />
                    </div>
                    {paymentStatus === 'paid' && (
                      <div className="absolute inset-0 bg-primary/90 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-16 h-16 text-primary-foreground" />
                      </div>
                    )}
                  </div>

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
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

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
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" style={{ animationDuration: '1.2s' }} />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-secondary animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-4 rounded-full bg-white/[0.03] backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-1">Gerando sua imagem...</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A IA está analisando {photos.filter(p => p.file).length > 1 ? `suas ${photos.filter(p => p.file).length} fotos` : 'sua foto'} e criando sua arte.
                  <br />Isso pode levar até 30 segundos.
                </p>

                <div className="space-y-2 text-left max-w-[260px] mx-auto mb-6">
                  {[
                    { label: "Analisando traços faciais", delay: 0 },
                    { label: photos.filter(p => p.file).length > 1 ? "Identificando cada pessoa" : "Aplicando estilo artístico", delay: 3 },
                    { label: "Refinando detalhes", delay: 8 },
                    { label: "Finalizando imagem", delay: 15 },
                  ].map((item, i) => (
                    <GeneratingStep key={i} label={item.label} delay={item.delay} />
                  ))}
                </div>

                <GlassButton 
                  onClick={() => { setStep('generating'); generateImage(); }} 
                  variant="outline" 
                  className="mt-2"
                  size="sm"
                >
                  <Loader2 className="w-4 h-4 mr-2" />
                  Tentar novamente
                </GlassButton>

                <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Plano Mensal</span>
                  </div>
                   <p className="text-sm font-medium mb-1">
                     Faça <span className="text-primary font-bold">6 fotos por mês</span> por apenas
                   </p>
                   <p className="text-2xl font-bold text-primary mb-2">R$ 100,00<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
                   <p className="text-xs text-muted-foreground mb-3">
                     Economize comparado a compras avulsas
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
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Imagem gerada com sucesso!</h3>
                </div>

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
                  <GlassButton onClick={() => setStep('editing')} variant="outline" className="flex-1">
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </GlassButton>
                </div>

                <GlassButton onClick={onClose} variant="outline" className="w-full">
                  Fechar
                </GlassButton>

                <p className="text-xs text-center text-muted-foreground">
                  Sua imagem também foi enviada para seu email (se informado).
                </p>
              </motion.div>
            )}

            {/* STEP 5: Editing */}
            {step === 'editing' && generatedImage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-2">
                  <Pencil className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Editar sua imagem</h3>
                  <p className="text-xs text-muted-foreground">Descreva o que deseja alterar</p>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <img src={generatedImage} alt="Current" className="w-full h-full object-contain bg-black/50" />
                </div>

                <textarea
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  placeholder="Ex: Mude o fundo para uma praia, adicione óculos de sol, deixe o cabelo mais claro..."
                  className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                />

                <div className="flex gap-3">
                  <GlassButton 
                    onClick={handleEditImage} 
                    className="flex-1"
                    disabled={isEditing || !editInstruction.trim()}
                  >
                    {isEditing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isEditing ? 'Editando...' : 'Aplicar edição'}
                  </GlassButton>
                  <GlassButton onClick={() => setStep('complete')} variant="outline">
                    Voltar
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
