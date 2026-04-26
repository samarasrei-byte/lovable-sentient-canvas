import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  X, Upload, User, AtSign, Sparkles, QrCode, Copy, Check, Download,
  Loader2, CheckCircle2, Clock, Pencil, Plus, Trash2,
  RefreshCw, AlertTriangle, ImagePlus, Share2, MessageCircle, Eye,
  Smartphone, CreditCard, Camera, Heart, Palette
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { GenerationProgressBar } from "./GenerationProgressBar";
import { StayOnPageCard } from "./StayOnPageCard";
import { ShareButtons } from "./ShareButtons";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
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

interface GeneratedVariant {
  url: string;
  selected: boolean;
}

interface AnalisePersona {
  label: string;
  tipo: string;
  genero: string;
  idade_aproximada?: number;
}

interface AreaEditavel {
  tipo: string;
  label: string;
  descricao?: string;
  valor?: string | number;
  editavel?: boolean;
}

interface PhotoProfile {
  ageGroup: string;
  presentation: string;
  suggestedCategory?: string;
  audit_qualidade?: {
    rosto_detectado: boolean;
    olhando_camera: boolean;
    iluminacao_boa: boolean;
    rosto_centralizado: boolean;
    sem_obstrucoes: boolean;
    resolucao_ok: boolean;
    score_identidade: number;
    recomendacoes: string[];
  };
  analise?: {
    quantidade_pessoas: number;
    pessoas: AnalisePersona[];
    contexto: string;
    animais: { tipo: string; descricao: string }[];
  };
  areas_editaveis?: AreaEditavel[];
  prompt_gerado?: string;
  categoria?: string;
  subcategorias?: string[];
  metadados?: {
    pessoas: number;
    criancas: number;
    adultos: number;
    idosos: number;
    homens: number;
    mulheres: number;
    idade_detectada: number | null;
    animal: string | null;
  };
}

const MAX_VARIANTS = 3;
const MAX_EDITS = 1;

const AuditItem = ({ label, passed }: { label: string; passed: boolean }) => (
  <div className="flex items-center gap-1">
    {passed ? (
      <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
    ) : (
      <X className="w-2.5 h-2.5 text-red-400" />
    )}
    <span className={`text-[9px] ${passed ? 'text-white/80' : 'text-red-300/80 font-medium'}`}>{label}</span>
  </div>
);

const ageGroupLabel: Record<string, string> = {
  bebe: 'Bebê',
  crianca: 'Criança',
  adolescente: 'Adolescente',
  adulto: 'Adulto',
};

const presentationLabel: Record<string, string> = {
  masculina: 'Apresentação masc.',
  feminina: 'Apresentação fem.',
  indefinida: 'Apresentação indefinida',
};

export const PromptPurchaseFlow = ({ prompt, onClose }: PromptPurchaseFlowProps) => {
  const [step, setStep] = useState<FlowStep>('form');
  const [authStep, setAuthStep] = useState<'login' | 'register' | 'done'>('done');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [qualityChecks, setQualityChecks] = useState<{ [key: string]: boolean }>({});

  const maxPhotos = prompt.min_photos && prompt.min_photos > 1 ? Math.min(prompt.min_photos, 5) : 5;
  const [formData, setFormData] = useState({ 
    name: '', 
    instagram: '', 
    email: '', 
    description: '', 
    age: '', 
    displayName: '', 
    months: '', 
    telefone: '', 
    endereco: '', 
    data: '', 
    hora: '', 
    extras: '', 
    team_name: '' 
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFormData(prev => ({ 
          ...prev, 
          email: session.user.email ?? prev.email,
          name: session.user.user_metadata?.full_name ?? prev.name
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [personNames, setPersonNames] = useState<string[]>([]);
  const isFamilyInit = /família|familia|family/i.test(prompt.category || '') || /família|familia|family/i.test(prompt.name || '');
  const isCoupleInit = /casais|casal|couple/i.test(prompt.category || '') || /casais|casal|couple/i.test(prompt.name || '');
  const isMultiPersonPrompt = (prompt.min_photos || 1) >= 2;
  const initialPhotoSlots = isMultiPersonPrompt ? Math.max(prompt.min_photos || 2, 2) : isFamilyInit ? Math.max(prompt.min_photos || 2, 2) : 1;
  const [photos, setPhotos] = useState<PhotoSlot[]>(Array.from({ length: initialPhotoSlots }, () => ({ file: null, preview: '' })));
  const [photoProfiles, setPhotoProfiles] = useState<(PhotoProfile | null)[]>(Array.from({ length: initialPhotoSlots }, () => null));
  const [analyzingPhotoSlots, setAnalyzingPhotoSlots] = useState<number[]>([]);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'paid'>('pending');
  
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const paymentPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const [pixData, setPixData] = useState<{ copiaECola: string; qrCodeUrl: string; expiresAt: number } | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [qaStatus, setQaStatus] = useState<'idle' | 'checking' | 'passed' | 'fixing'>('idle');
  const [qaIssues, setQaIssues] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('original');
  const [generationCount, setGenerationCount] = useState(0);
  const [editCount, setEditCount] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<'realistic' | 'artistic'>('realistic');
  const [showSupportForm, setShowSupportForm] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.preview && photo.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, []);

  const activePhotoCount = photos.filter((photo) => photo.file).length;
  const formatPrice = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  const analyzeUploadedPhoto = async (index: number, imageDataUrl: string) => {
    setAnalyzingPhotoSlots((prev) => [...prev.filter((slot) => slot !== index), index]);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-person-photo', {
        body: { imageDataUrl },
      });
      if (error) throw error;
      setPhotoProfiles((prev) => {
        const next = [...prev];
        next[index] = data;
        return next;
      });
    } catch (error) {
      console.error('Error analyzing uploaded photo:', error);
    } finally {
      setAnalyzingPhotoSlots((prev) => prev.filter((slot) => slot !== index));
    }
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setPhotos((prev) => {
        const updated = [...prev];
        updated[index] = { file, preview };
        return updated;
      });
      void analyzeUploadedPhoto(index, preview);
    };
    reader.readAsDataURL(file);
  };

  const addPhotoSlot = () => {
    if (photos.length >= maxPhotos) return;
    setPhotos((prev) => [...prev, { file: null, preview: '' }]);
    setPhotoProfiles((prev) => [...prev, null]);
  };

  const removePhotoSlot = (index: number) => {
    if (photos.length <= 1) return;
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoProfiles((prev) => prev.filter((_, i) => i !== index));
  };

  const runQAValidation = async (imageUrl: string, referenceImageUrls: string[]): Promise<{ passed: boolean; issues: string[] }> => {
    try {
      setQaStatus('checking');
      const { data, error } = await supabase.functions.invoke('validate-generated-image', {
        body: { imageUrl, promptCategory: prompt.category, referenceImageUrls },
      });
      if (error || !data) return { passed: true, issues: [] };
      return { passed: data.passed ?? true, issues: data.issues ?? [] };
    } catch (error) {
      return { passed: true, issues: [] };
    }
  };

  const generateImage = async (pId?: string, isRetry = false) => {
    const currentId = pId || purchaseId;
    if (!currentId) return;

    if (!isRetry) {
      setStep('generating');
      setQaStatus('idle');
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: {
          purchaseId: currentId,
          promptTemplate: prompt.prompt_template,
          userPhotoUrl: photos[0]?.preview,
          exampleImageUrl: prompt.example_image_url,
          style: selectedStyle,
          userId: user?.id
        },
      });

      if (error) throw error;
      
      const qa = await runQAValidation(data.imageUrl, [photos[0]?.preview].filter(Boolean));
      if (!qa.passed && !isRetry) {
        setQaStatus('fixing');
        setQaIssues(qa.issues);
        setTimeout(() => generateImage(currentId, true), 2000);
        return;
      }

      setGeneratedImage(data.imageUrl);
      setGeneratedVariants([{ url: data.imageUrl, selected: true }]);
      setStep('complete');
      setGenerationCount(prev => prev + 1);
      toast.success('Imagem gerada com sucesso!');
    } catch (error) {
      console.error('Generation error:', error);
      if (!isRetry) {
        toast.error('Erro na geração. Tentando novamente...');
        setTimeout(() => generateImage(currentId, true), 2000);
      } else {
        toast.error('Não foi possível gerar a imagem.');
        setStep('form');
      }
    }
  };

  const handleSubmitForm = async () => {
    const { data, error } = await supabase.functions.invoke('create-prompt-purchase', {
      body: { promptId: prompt.id, userName: formData.name },
    });
    if (error) throw error;
    setPurchaseId(data.purchaseId);
    setStep('payment');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authStep === 'login') {
        await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
      } else {
        await supabase.auth.signUp({ email: authForm.email, password: authForm.password });
      }
      setAuthStep('done');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        className="w-full h-[100dvh] sm:h-auto sm:max-w-lg sm:px-4 sm:py-4"
      >
        <div className="relative overflow-hidden h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto sm:rounded-2xl border border-white/[0.1] bg-[hsl(var(--background)/0.8)] backdrop-blur-2xl shadow-2xl pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>

          <GlassCardHeader className="pb-4 pt-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border border-white/10">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div>
                <GlassCardTitle className="text-base font-bold">{prompt.name}</GlassCardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary/80">{prompt.category}</Badge>
                  <span className="text-sm font-semibold">{formatPrice(prompt.price_cents)}</span>
                </div>
              </div>
            </div>
          </GlassCardHeader>

          <GlassCardContent className="space-y-6 pb-8">
            {authStep === 'done' && (
              <div className="flex items-center justify-between px-2">
                {(['form', 'payment', 'generating', 'complete'] as const).map((status, index) => {
                  const labels = ['Fotos', 'Pagar', 'Gerar', 'Pronto'];
                  const stepOrder = ['form', 'payment', 'generating', 'complete'];
                  const currentStepIndex = step === 'editing' ? 3 : stepOrder.indexOf(step);
                  const isPast = currentStepIndex > index;
                  const isCurrent = (step === status) || (step === 'editing' && status === 'complete');
                  
                  return (
                    <div key={status} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5 relative group">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${isCurrent ? 'bg-primary text-primary-foreground border-primary' : isPast ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                          {isPast ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-primary' : 'text-muted-foreground/50'}`}>{labels[index]}</span>
                      </div>
                      {index < 3 && <div className={`flex-1 h-[2px] mx-2 ${isPast ? 'bg-primary/30' : 'bg-white/5'}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 'form' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Fotos de Referência</Label>
                    <button onClick={addPhotoSlot} className="text-xs text-primary hover:underline">Adicionar foto</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative aspect-[3/4] rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                        {photo.preview ? (
                          <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImagePlus className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(index, e)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSubmitForm} className="w-full bg-primary hover:bg-primary/90">Continuar</Button>
              </motion.div>
            )}

            {step === 'generating' && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <h3 className="text-lg font-bold">Gerando sua imagem...</h3>
                <p className="text-sm text-muted-foreground">Isso pode levar alguns instantes.</p>
                {qaStatus === 'fixing' && <p className="text-xs text-yellow-500">Ajustando qualidade...</p>}
              </div>
            )}

            {step === 'complete' && generatedImage && (
              <div className="space-y-4">
                <img src={generatedImage} alt="Result" className="w-full rounded-2xl" />
                <Button onClick={() => handleDownload(generatedImage, prompt.name)} className="w-full gap-2">
                  <Download className="w-4 h-4" /> Baixar Imagem
                </Button>
              </div>
            )}
          </GlassCardContent>
        </div>
      </motion.div>
    </motion.div>
  );
};
