import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2, Camera, ChevronRight, Image } from "lucide-react";
import heic2any from "heic2any";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoService {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  themes: Array<{ id: string; name: string; description: string }>;
  price_cents: number;
  features: string[];
}

interface PhotoServiceModalProps {
  service: PhotoService;
  onClose: () => void;
}

type Step = 'theme' | 'upload' | 'details' | 'payment';

export const PhotoServiceModal = ({ service, onClose }: PhotoServiceModalProps) => {
  const [step, setStep] = useState<Step>('theme');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    months: '',
    displayName: ''
  });

  const isBirthdayTheme = /aniversário|aniversario|birthday/i.test(service.name || '') || 
    /aniversário|aniversario|birthday/i.test(service.category || '');
  const isMesversarioTheme = /foto infantil|mêsversário|mesversário|mesversario/i.test(service.name || '') || 
    /foto infantil|mêsversário|mesversário|mesversario/i.test(service.category || '');
  const hasNameInImage = /nome|name/i.test(service.name || '') || 
    service.themes?.some(t => /nome|name/i.test(t.name || '') || /nome|name/i.test(t.description || ''));

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedPhotos.length > 10) {
      toast.error("Máximo de 10 fotos permitido");
      return;
    }

    const processedFiles: File[] = [];
    for (const file of files) {
      if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        try {
          toast.info(`Convertendo foto do iPhone: ${file.name}...`);
          const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
          const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
          const convertedFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
          processedFiles.push(convertedFile);
        } catch (err) {
          console.error("HEIC conversion failed", err);
          toast.error(`Falha ao converter ${file.name}`);
          continue;
        }
      } else {
        processedFiles.push(file);
      }
    }
    setUploadedPhotos(prev => [...prev, ...processedFiles]);
  }, [uploadedPhotos]);

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedTheme || uploadedPhotos.length === 0) {
      toast.error("Selecione um tema e envie pelo menos uma foto");
      return;
    }

    if (!formData.email) {
      toast.error("Preencha seu email");
      return;
    }


    setUploading(true);

    try {
      // Upload photos to storage
      const uploadedUrls: string[] = [];
      
      for (const photo of uploadedPhotos) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${photo.name}`;
        const { data, error } = await supabase.storage
          .from('user-photos')
          .upload(fileName, photo);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('user-photos')
          .getPublicUrl(data.path);
        
        uploadedUrls.push(publicUrl);

      }

      // Build custom fields from dynamic inputs
      const customFields: Record<string, string> = {};
      if (formData.age) customFields.age = formData.age;
      if (formData.months) customFields.months = formData.months;
      if (formData.displayName) customFields.displayName = formData.displayName;

      // Create generation record
      const { error: insertError } = await supabase
        .from('photo_generations')
        .insert({
          service_id: service.id,
          user_email: formData.email,
          user_name: formData.name,
          user_phone: formData.phone,
          uploaded_photos: uploadedUrls,
          theme: selectedTheme,
          amount_cents: service.price_cents,
          payment_status: 'pending',
          generation_status: 'pending',
          custom_fields: Object.keys(customFields).length > 0 ? customFields : null
        });

      if (insertError) throw insertError;

      toast.success("Pedido criado! Você receberá instruções de pagamento por email.");
      onClose();
    } catch (error) {
      console.error("Error creating photo generation:", error);
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'theme': return !!selectedTheme;
      case 'upload': return uploadedPhotos.length > 0;
      case 'details': return !!formData.email; // Nome agora é opcional, email é obrigatório para envio
      default: return false;
    }
  };

  const nextStep = () => {
    const steps: Step[] = ['theme', 'upload', 'details', 'payment'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['theme', 'upload', 'details', 'payment'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{formatPrice(service.price_cents)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-3 bg-muted/30">
            <div className="flex items-center justify-between text-xs">
              {['Tema', 'Fotos', 'Dados', 'Pagamento'].map((label, index) => {
                const steps: Step[] = ['theme', 'upload', 'details', 'payment'];
                const isActive = steps.indexOf(step) >= index;
                return (
                  <div key={label} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`ml-2 hidden sm:inline ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                    {index < 3 && (
                      <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Theme Selection */}
            {step === 'theme' && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Escolha um tema</Label>
                <div className="grid grid-cols-2 gap-3">
                  {service.themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-xl text-left transition-all border ${
                        selectedTheme === theme.id
                          ? 'border-secondary bg-secondary/10 shadow-[0_0_20px_hsl(var(--secondary)/0.2)]'
                          : 'border-border hover:border-secondary/50 bg-muted/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{theme.description}</div>
                      {selectedTheme === theme.id && (
                        <Check className="w-4 h-4 text-secondary mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Photo Upload */}
            {step === 'upload' && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Envie suas fotos</Label>
                <p className="text-sm text-muted-foreground">
                  Envie de 1 a 10 fotos com boa iluminação e rosto visível.
                </p>
                
                <label className="block">
                  <div className="border-2 border-dashed border-secondary/30 rounded-xl p-8 text-center hover:border-secondary/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-secondary/60" />
                    <div className="text-sm font-medium">Clique ou arraste fotos aqui</div>
                    <div className="text-xs text-muted-foreground mt-1">JPG, PNG até 10MB cada</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground text-center">
                  {uploadedPhotos.length}/10 fotos selecionadas
                </div>
              </div>
            )}

            {/* Step 2.5: Dynamic Fields based on service type */}
            {step === 'upload' && (isMesversarioTheme || isBirthdayTheme || hasNameInImage) && (
              <div className="space-y-4 mt-4 pt-4 border-t border-border">
                {isMesversarioTheme && (
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      👶 Quantos meses o bebê está fazendo?
                    </Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <button
                          key={month}
                          onClick={() => setFormData(prev => ({ ...prev, months: String(month) }))}
                          className={`p-2 rounded-lg text-sm font-medium transition-all ${
                            formData.months === String(month)
                              ? 'bg-secondary text-secondary-foreground shadow-lg scale-105'
                              : 'bg-muted/50 border border-border hover:border-secondary/50 text-foreground'
                          }`}
                        >
                          {month}m
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      O número será exibido na imagem como decoração (balão, vela, banner, etc).
                    </p>
                  </div>
                )}

                {isBirthdayTheme && !isMesversarioTheme && (
                  <div className="space-y-1.5">
                    <Label className="text-sm flex items-center gap-2">
                      🎂 Idade para a imagem
                    </Label>
                    <Input
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value.replace(/\D/g, '') }))}
                      placeholder="Ex: 3"
                      maxLength={3}
                      type="text"
                      inputMode="numeric"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      A idade será exibida na imagem (vela, balão, número decorativo, etc).
                    </p>
                  </div>
                )}

                {hasNameInImage && (
                  <div className="space-y-1.5">
                    <Label className="text-sm flex items-center gap-2">
                      ✨ Nome que aparece na imagem
                    </Label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Ex: Maria, João..."
                    />
                    {formData.displayName && (
                      <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20 text-center">
                        <span className="text-xs text-muted-foreground">Preview: </span>
                        <span className="text-sm font-bold text-secondary">{formData.displayName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: User Details */}
            {step === 'details' && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Seus dados</Label>
                <p className="text-sm text-muted-foreground">
                  Enviaremos o resultado e instruções de pagamento para seu email.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">WhatsApp (opcional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 'payment' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                  <Image className="w-8 h-8 text-secondary" />
                </div>
                
                <div>
                  <h4 className="text-xl font-bold mb-2">Confirme seu pedido</h4>
                  <p className="text-sm text-muted-foreground">
                    Tema: <span className="text-foreground font-medium">
                      {service.themes.find(t => t.id === selectedTheme)?.name}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fotos: <span className="text-foreground font-medium">{uploadedPhotos.length}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="text-3xl font-bold text-secondary">
                    {formatPrice(service.price_cents)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Pagamento via PIX
                  </div>
                </div>

                <GlassButton
                  variant="neon"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar Pedido
                    </>
                  )}
                </GlassButton>
                
                <p className="text-xs text-muted-foreground">
                  Você receberá o código PIX por email para finalizar o pagamento.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== 'payment' && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-card/95">
              {step !== 'theme' ? (
                <GlassButton variant="ghost" size="sm" onClick={prevStep}>
                  Voltar
                </GlassButton>
              ) : (
                <div />
              )}
              
              <GlassButton
                variant="neon"
                size="sm"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continuar
                <ChevronRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
