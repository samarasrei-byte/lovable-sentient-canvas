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
import { ModerationAppealModal } from "./ModerationAppealModal";
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
  status?: 'empty' | 'uploading' | 'analyzing' | 'ready' | 'blocked' | 'error';
  errorMessage?: string;
  sugestoes?: string[];
  appealId?: string;
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
  seguranca?: {
    conteudo_seguro: boolean;
    motivo_bloqueio: string | null;
    sugestoes_seguranca?: string[];
    rating: string;
  };
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

const MAX_VARIANTS = 3; // 1 original + 2 free variations
const MAX_EDITS = 1;

const GeneratingStep = ({ label, delay, isQA }: { label: string; delay: number; isQA?: boolean }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-500 ${active ? (isQA ? 'text-secondary opacity-100' : 'text-primary opacity-100') : 'text-muted-foreground/40 opacity-60'}`}>
      {active ? <Check className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      <span>{label}</span>
    </div>
  );
};

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
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [appealModal, setAppealModal] = useState<{ 
    isOpen: boolean; 
    type: "upload" | "generation"; 
    photoUrl?: string; 
    reason?: string;
    index?: number;
  }>({ isOpen: false, type: "upload" });
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const checkModerationRealtime = (text: string): boolean => {
    const normalized = text.toLowerCase().trim();
    const childTerms = ["criança", "bebê", "bebe", "infantil", "menor", "criança", "child", "kid", "baby", "toddler", "minor"];
    const sexualTerms = ["nua", "nu", "pelada", "pelado", "sexo", "erótico", "erotico", "sensual", "biquini", "calcinha", "cueca", "nude", "naked", "erotic", "lingerie", "bikini", "provocativo", "provocativa"];
    
    const hasChild = childTerms.some(term => normalized.includes(term));
    const hasSexual = sexualTerms.some(term => normalized.includes(term));

    if (hasChild && hasSexual) {
      toast.error("Este tipo de solicitação não é permitido.", {
        description: "Violar nossas diretrizes pode levar ao bloqueio da conta."
      });
      return false;
    }
    return true;
  };


  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.preview && photo.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePhotoCount = photos.filter((photo) => photo.file).length;

  const formatPrice = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  // PIX copy-paste handled inline in payment UI

  const analyzeUploadedPhoto = async (index: number, imageDataUrl: string) => {
    setAnalyzingPhotoSlots((prev) => [...prev.filter((slot) => slot !== index), index]);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-person-photo', {
        body: { imageDataUrl },
      });

      if (error) throw error;

      // Handle moderation block
      if (data?.seguranca?.conteudo_seguro === false) {
        toast.error('Foto bloqueada por segurança', {
          description: data.seguranca.motivo_bloqueio || 'O conteúdo desta foto viola nossas diretrizes de segurança.',
          duration: 10000
        });
        
        // Keep the photo but mark as blocked
        setPhotos((prev) => {
          const updated = [...prev];
          updated[index] = { 
            ...updated[index],
            status: 'blocked',
            errorMessage: data.seguranca.motivo_bloqueio,
            sugestoes: data.seguranca.sugestoes_seguranca
          };
          return updated;
        });
        return;
      }

      setPhotos((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'ready' };
        return updated;
      });

      setPhotoProfiles((prev) => {
        const next = [...prev];
        next[index] = data
          ? {
              ageGroup: data.ageGroup || 'adulto',
              presentation: data.presentation || 'indefinida',
              suggestedCategory: data.suggestedCategory,
              seguranca: data.seguranca,
              audit_qualidade: data.audit_qualidade,
              analise: data.analise,
              areas_editaveis: data.areas_editaveis,
              prompt_gerado: data.prompt_gerado,
              categoria: data.categoria,
              subcategorias: data.subcategorias,
              metadados: data.metadados,
            }
          : null;
        return next;
      });

      // Auto-detect age for birthday prompts
      if (data?.metadados?.idade_detectada && isBirthdayPrompt && !formData.age) {
        setFormData(prev => ({ ...prev, age: String(data.metadados.idade_detectada) }));
      }
    } catch (error) {
      console.error('Error analyzing uploaded photo:', error);
      setPhotoProfiles((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    } finally {
      setAnalyzingPhotoSlots((prev) => prev.filter((slot) => slot !== index));
    }
  };

  const validatePhotoQuality = (img: HTMLImageElement): { ok: boolean; warning?: string } => {
    // Minimum resolution check
    if (img.width < 200 || img.height < 200) {
      return { ok: false, warning: 'Foto com resolução muito baixa. Envie uma foto com pelo menos 200x200 pixels para melhor resultado.' };
    }
    // Warn about very small photos
    if (img.width < 400 || img.height < 400) {
      return { ok: true, warning: '⚠️ Foto com resolução baixa. Quanto maior a resolução, melhor a semelhança facial.' };
    }
    return { ok: true };
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 20MB.');
      return;
    }

    // Validate file type — support HEIC with friendly message
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    const fileExt = file.name.toLowerCase().split('.').pop();
    const isHeic = fileExt === 'heic' || fileExt === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';
    
    if (!supportedTypes.includes(file.type) && !isHeic && !file.type.startsWith('image/')) {
      toast.error('Formato não suportado. Envie JPG, PNG ou HEIC.');
      return;
    }

    setUploadedPhotoUrls([]);
    setPhotoProfiles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    // Show uploading feedback
    toast.loading('Processando foto...', { id: `photo-upload-${index}` });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Validate quality
        const quality = validatePhotoQuality(img);
        if (!quality.ok) {
          toast.error(quality.warning || 'Foto não aceita.', { id: `photo-upload-${index}` });
          return;
        }
        if (quality.warning) {
          toast.warning(quality.warning, { id: `photo-upload-${index}`, duration: 5000 });
        } else {
          toast.success('Foto carregada!', { id: `photo-upload-${index}` });
        }

        const canvas = document.createElement('canvas');
        // Use higher resolution for preview to improve analysis accuracy
        const maxSize = 768;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const preview = canvas.toDataURL('image/jpeg', 0.88);

        setPhotos((prev) => {
          const updated = [...prev];
          updated[index] = { file, preview };
          return updated;
        });

        void analyzeUploadedPhoto(index, preview);
      };
      img.onerror = () => {
        // HEIC fallback: if browser can't load HEIC natively, try conversion
        if (isHeic) {
          toast.error('Seu dispositivo não suporta fotos HEIC diretamente. Por favor, tire uma foto em JPG nas configurações da câmera (Configurações → Câmera → Formatos → Mais Compatível).', { 
            id: `photo-upload-${index}`,
            duration: 8000 
          });
        } else {
          toast.error('Não foi possível carregar a foto. Tente outro arquivo.', { id: `photo-upload-${index}` });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      toast.error('Erro ao ler o arquivo. Tente novamente.', { id: `photo-upload-${index}` });
    };
    reader.readAsDataURL(file);
  };

  const addPhotoSlot = () => {
    if (photos.length >= maxPhotos) return;
    setPhotos((prev) => [...prev, { file: null, preview: '' }]);
    setPhotoProfiles((prev) => [...prev, null]);
    setUploadedPhotoUrls([]);
  };

  const removePhotoSlot = (index: number) => {
    if (photos.length <= 1) return;

    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoProfiles((prev) => prev.filter((_, i) => i !== index));
    setAnalyzingPhotoSlots((prev) => prev.filter((slot) => slot !== index).map((slot) => (slot > index ? slot - 1 : slot)));
    setUploadedPhotoUrls([]);
  };

  const handleSubmitForm = async () => {
    const hasAnyPhoto = photos.some((photo) => photo.file);

    if (prompt.required_fields.includes('photo') && !hasAnyPhoto) {
      toast.error('Por favor, envie pelo menos uma foto.');
      return;
    }

    // New: Identity Audit Validation
    const issues = photoProfiles.flatMap((profile, index) => {
      if (!profile?.audit_qualidade) return [];
      const audit = profile.audit_qualidade;
      const unconfirmed = [];
      if (audit.score_identidade < 0.8) {
        if (!qualityChecks[`${index}-identidade`]) unconfirmed.push(`A foto ${index + 1} precisa de revisão.`);
        if (!qualityChecks[`${index}-clonagem`]) unconfirmed.push(`Confirme a aceitação da semelhança facial para a foto ${index + 1}.`);
      }
      return unconfirmed;
    });

    if (issues.length > 0) {
      toast.error(issues[0], {
        description: "Complete o checklist de qualidade abaixo da foto para continuar."
      });
      return;
    }

    if ((isFamilyPrompt || isCouplePrompt || isMultiPersonPrompt) && activePhotoCount < (prompt.min_photos || 2)) {
      const label = isCouplePrompt ? 'de casal' : isFamilyPrompt ? 'de família' : 'com múltiplas pessoas';
      toast.error(`Para fotos ${label}, envie pelo menos ${prompt.min_photos || 2} fotos (uma de cada pessoa).`);
      return;
    }

    if (isBirthdayPrompt && !formData.age?.trim()) {
      toast.error('Por favor, informe a idade para o prompt de aniversário.');
      return;
    }

    if (isMesversarioPrompt && !formData.months) {
      toast.error('Por favor, selecione quantos meses o bebê está fazendo.');
      return;
    }

    if (prompt.required_fields.includes('team_name') && !formData.team_name.trim()) {
      toast.error('Por favor, informe o nome do time.');
      return;
    }

    if (prompt.required_fields.includes('name') && !formData.name.trim()) {
      toast.error('Por favor, informe seu nome.');
      return;
    }

    try {
      // Collect all custom fields for persistence
      const customFields: Record<string, unknown> = {};
      if (formData.age) customFields.age = formData.age;
      if (formData.months) customFields.months = formData.months;
      if (formData.displayName) customFields.displayName = formData.displayName;
      if (formData.description) customFields.description = formData.description;
      if (formData.team_name) customFields.team_name = formData.team_name;
      
      // Save photo profiles analysis data
      const validProfiles = photoProfiles.filter(Boolean);
      if (validProfiles.length > 0) customFields.photoProfiles = validProfiles;

      // Step 1: Create purchase record
      const { data, error } = await supabase.functions.invoke('create-prompt-purchase', {
        body: { 
          promptId: prompt.id, 
          userName: formData.name, 
          userInstagram: formData.instagram, 
          userEmail: formData.email,
          customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
        },
      });

      if (error) throw error;
      if (!data?.purchaseId) throw new Error('Compra não criada corretamente');

      const newPurchaseId = data.purchaseId;
      setPurchaseId(newPurchaseId);

      // Go to payment step with Mercado Pago PIX
      if (prompt.price_cents > 0) {
        setStep('payment');
        // Start payment AND pre-upload photos in parallel — saves seconds later
        void initPixPayment(newPurchaseId);
        void ensureUploadedPhotoUrls(newPurchaseId).catch(err => {
          console.warn('Pre-upload during payment failed, will retry on generation:', err);
        });
      } else {
        setStep('generating');
        void generateImage(newPurchaseId);
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error('Erro ao processar. Tente novamente.');
      setStep('form');
    }
  };

  const startPaymentPolling = (pId: string) => {
    // Clear any existing poll
    if (paymentPollRef.current) clearInterval(paymentPollRef.current);
    
    setVerifyingPayment(true);
    paymentPollRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-asaas-payment', {
          body: { purchaseId: pId },
        });

        if (!error && data?.paid) {
          if (paymentPollRef.current) clearInterval(paymentPollRef.current);
          setVerifyingPayment(false);
          setPaymentStatus('paid');
          toast.success('Pagamento confirmado! Iniciando geração...');
          setStep('generating');
          void generateImage(pId);
        }
      } catch (e) {
        console.error('Payment verification poll error:', e);
      }
    }, 1500);
  };

  const initPixPayment = async (pId: string, attempt = 1) => {
    setPixLoading(true);
    setPixError(null);
    try {
      const { data, error } = await supabase.functions.invoke('create-asaas-payment', {
        body: {
          purchaseId: pId,
          priceCents: prompt.price_cents,
          customerEmail: formData.email || undefined,
          customerName: formData.name || undefined,
        },
      });

      if (error) throw error;

      if (data?.error) {
        // Server returned business error — surface clearly with support fallback
        console.error('Asaas server error:', data);
        setPixError(`${data.error} — Se persistir, abra um chamado de suporte informando o ID: ${pId.slice(0, 8)}`);
        return;
      }

      if (data?.pixCopiaECola) {
        setPixData({
          copiaECola: data.pixCopiaECola,
          qrCodeUrl: data.qrCodeBase64 ? `data:image/png;base64,${data.qrCodeBase64}` : '',
          expiresAt: data.expiresAt ? new Date(data.expiresAt).getTime() / 1000 : Date.now() / 1000 + 1800,
        });
        // Persist ticketUrl as fallback in case copy/paste fails
        if (data.ticketUrl) {
          (window as unknown as { __arcanaTicketUrl?: Record<string, string> }).__arcanaTicketUrl = {
            ...((window as unknown as { __arcanaTicketUrl?: Record<string, string> }).__arcanaTicketUrl || {}),
            [pId]: data.ticketUrl,
          };
        }
        startPaymentPolling(pId);
      } else {
        throw new Error('NO_PIX_DATA');
      }
    } catch (err) {
      console.error(`Asaas payment error (attempt ${attempt}):`, err);
      // Auto-retry once after 1.5s before showing error to user
      if (attempt < 2) {
        setTimeout(() => { void initPixPayment(pId, attempt + 1); }, 1500);
        return;
      }
      setPixError(`Não conseguimos gerar o PIX agora. Tente novamente ou abra um chamado de suporte informando o ID: ${pId.slice(0, 8)}`);
      toast.error('Falha ao gerar pagamento', {
        description: 'Tente novamente ou abra um chamado',
        action: {
          label: 'Chamado',
          onClick: () => setShowSupportForm(true),
        },
      });
    } finally {
      setPixLoading(false);
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (paymentPollRef.current) clearInterval(paymentPollRef.current);
    };
  }, []);


  const convertToJpeg = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (supportedFormats.includes(file.type)) {
        resolve(file);
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) { reject(new Error('Conversion failed')); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.92);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
      img.src = url;
    });
  };

  const uploadPhotos = async (effectivePurchaseId: string): Promise<string[]> => {
    // Upload all photos IN PARALLEL for maximum speed
    const activePhotos = photos
      .map((photo, i) => ({ photo, i }))
      .filter(({ photo }) => !!photo.file);

    const uploadOne = async ({ photo, i }: { photo: PhotoSlot; i: number }): Promise<string> => {
      let convertedFile: File;
      try {
        convertedFile = await convertToJpeg(photo.file!);
      } catch {
        throw new Error(`Conversão da foto ${i + 1} falhou`);
      }

      const fileExt = convertedFile.name.split('.').pop() || 'jpg';
      const filePath = `purchases/${effectivePurchaseId}-photo${i + 1}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      let uploadData: any = null;
      let lastError: any = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        const { data, error } = await supabase.storage
          .from('user-photos')
          .upload(filePath, convertedFile, { cacheControl: '3600', upsert: false });
        if (!error) { uploadData = data; break; }
        lastError = error;
        if (attempt === 0) await new Promise(r => setTimeout(r, 800));
      }
      if (!uploadData) throw lastError || new Error(`Upload da foto ${i + 1} falhou`);

      const { data: urlData } = supabase.storage.from('user-photos').getPublicUrl(uploadData.path);
      if (!urlData.publicUrl) throw new Error(`Falha ao obter URL da foto ${i + 1}`);
      return urlData.publicUrl;
    };

    try {
      return await Promise.all(activePhotos.map(uploadOne));
    } catch (err) {
      toast.error('Falha ao enviar fotos. Verifique sua conexão.');
      throw err;
    }
  };

  const ensureUploadedPhotoUrls = async (effectivePurchaseId: string): Promise<string[]> => {
    if (!prompt.required_fields.includes('photo')) return [];
    if (uploadedPhotoUrls.length > 0) return uploadedPhotoUrls;

    const urls = await uploadPhotos(effectivePurchaseId);
    setUploadedPhotoUrls(urls);
    return urls;
  };

  // Sort photos by age group: adults first, then children/babies (matching typical prompt layout)
  // Sort photos by age group but preserve index mapping for photoProfiles
  const sortPhotosByAge = (urls: string[]): { sortedUrls: string[]; sortedProfiles: typeof photoProfiles } => {
    if (urls.length <= 1) return { sortedUrls: urls, sortedProfiles: photoProfiles };
    
    const activeSlots = photos
      .map((photo, i) => ({ index: i, hasFile: !!photo.file }))
      .filter(s => s.hasFile);
    
    const indexed = urls.map((url, i) => ({ 
      url, 
      profile: photoProfiles[activeSlots[i]?.index ?? i] 
    }));
    const adults = indexed.filter(p => !p.profile || p.profile.ageGroup === 'adulto' || p.profile.ageGroup === 'adolescente');
    const children = indexed.filter(p => p.profile && (p.profile.ageGroup === 'crianca' || p.profile.ageGroup === 'bebe'));
    
    const sorted = [...adults, ...children];
    return { sortedUrls: sorted.map(p => p.url), sortedProfiles: sorted.map(p => p.profile) };
  };

  const isBirthdayPrompt = /aniversário|aniversario|birthday/i.test(prompt.category || '') || 
    /aniversário|aniversario|birthday/i.test(prompt.name || '') ||
    prompt.required_fields.includes('age');

  const isFamilyPrompt = /família|familia|family/i.test(prompt.category || '') || 
    /família|familia|family/i.test(prompt.name || '');

  const isCouplePrompt = isCoupleInit || /casais|casal|couple/i.test(prompt.category || '') || 
    /casais|casal|couple/i.test(prompt.name || '');

  const isMesversarioPrompt = /mêsversário|mesversário|mesversario|newborn/i.test(prompt.name || '') ||
    /mêsversário|mesversário|mesversario/i.test(prompt.category || '');

  const isEventPrompt = /evento|event|promoção|promocao|festa|party/i.test(prompt.category || '') ||
    /evento|event|promoção|promocao|festa|party/i.test(prompt.name || '');

  const needsContactInfo = prompt.required_fields.includes('telefone') || 
    prompt.required_fields.includes('endereco') || prompt.required_fields.includes('data') || prompt.required_fields.includes('hora');

  const needsPersonNames = activePhotoCount > 1 || prompt.required_fields.includes('person_names');

  const hasNameInImage = /nome|name|\[NAME\]|\{nome\}/i.test(prompt.prompt_template || '') ||
    prompt.required_fields.includes('name');

  // Smart photo labels based on prompt context
  const getPhotoLabel = (index: number): string => {
    if (isCouplePrompt) {
      return ['👩 Ela (Mulher)', '👨 Ele (Homem)'][index] || `Pessoa ${index + 1}`;
    }
    if (isFamilyPrompt) {
      const minPhotos = prompt.min_photos || 2;
      if (minPhotos === 3) return ['👨 Pai', '👩 Mãe', '👶 Filho(a)'][index] || `Familiar ${index + 1}`;
      if (minPhotos >= 4) return ['👨 Pai', '👩 Mãe', '👧 Filho(a) 1', '👦 Filho(a) 2', '👴 Outro familiar'][index] || `Familiar ${index + 1}`;
      return ['👨 Pai/Mãe 1', '👩 Pai/Mãe 2'][index] || `Familiar ${index + 1}`;
    }
    // Detect children from prompt content
    const promptText = (prompt.prompt_template || '').toLowerCase();
    if (/criança|child|kid|menino|menina|bebê|baby|infant/.test(promptText) && index === 0) {
      return '👶 Criança';
    }
    if (isMultiPersonPrompt) {
      return `📸 Pessoa ${index + 1}`;
    }
    return `📸 Sua foto`;
  };

  const familyPhotoLabels = ['Pai/Mãe', 'Filho(a) 1', 'Filho(a) 2', 'Filho(a) 3', 'Outro familiar'];

  const buildGenerationBody = (referencePhotoUrls: string[], overrides: Record<string, unknown> = {}) => {
    const { sortedUrls, sortedProfiles } = sortPhotosByAge(referencePhotoUrls);
    const {
      promptTemplate: overridePromptTemplate,
      exampleImageUrl: overrideExampleImageUrl,
      style: overrideStyle,
      ...restOverrides
    } = overrides as Record<string, unknown> & {
      promptTemplate?: string;
      exampleImageUrl?: string | null;
      style?: string;
    };
    
    // Build age/position context from rich analysis
    const photoContextLines: string[] = [];
    sortedUrls.forEach((_, i) => {
      const profile = sortedProfiles[i];
      if (profile?.analise?.pessoas?.length) {
        profile.analise.pessoas.forEach((p, j) => {
          photoContextLines.push(`Foto ${i + 1} Pessoa ${j + 1}: ${p.tipo}${p.genero !== 'indefinido' ? ` ${p.genero}` : ''}${p.idade_aproximada ? ` ~${p.idade_aproximada} anos` : ''}`);
        });
        if (profile.analise.animais?.length) {
          profile.analise.animais.forEach(a => {
            photoContextLines.push(`Foto ${i + 1} Animal: ${a.tipo} (${a.descricao})`);
          });
        }
      } else if (profile) {
        photoContextLines.push(`Foto ${i + 1}: ${ageGroupLabel[profile.ageGroup] || profile.ageGroup}${profile.presentation !== 'indefinida' ? `, ${presentationLabel[profile.presentation]}` : ''}`);
      }
    });

    let template = typeof overridePromptTemplate === 'string' && overridePromptTemplate.trim().length > 0
      ? overridePromptTemplate
      : (prompt.prompt_template || '');

    // Enrich with AI-generated prompt context if available
    const firstProfileWithPrompt = photoProfiles.find(p => p?.prompt_gerado);
    if (firstProfileWithPrompt?.prompt_gerado) {
      template += `\n\nCONTEXTO DA ANÁLISE DA IMAGEM DE REFERÊNCIA:\n${firstProfileWithPrompt.prompt_gerado}`;
    }
    
    // Strip ALL leftover age/months tokens defensively (prevents words like "age" rendering in image)
    const stripTokens = (txt: string) => txt
      .replace(/\{\s*age\s*\}/gi, '')
      .replace(/\{\s*idade\s*\}/gi, '')
      .replace(/\{\s*meses?\s*\}/gi, '')
      .replace(/\{\s*months?\s*\}/gi, '')
      .replace(/\[\s*AGE\s*\]/gi, '')
      .replace(/\[\s*IDADE\s*\]/gi, '')
      .replace(/\[\s*MESES?\s*\]/gi, '')
      .replace(/\[\s*MONTHS?\s*\]/gi, '')
      .replace(/<\s*age\s*>/gi, '')
      .replace(/<\s*idade\s*>/gi, '');

    // Universal: if user picked months, always inject (even for non-mêsversário child prompts)
    if (formData.months && !isMesversarioPrompt && !isBirthdayPrompt) {
      template = template
        .replace(/\[MESES\]/g, formData.months)
        .replace(/\{meses\}/g, formData.months)
        .replace(/\{months\}/g, formData.months)
        .replace(/\{age\}/g, `${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}`)
        .replace(/\[IDADE\]/g, `${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}`);
      template += `\n\nIDADE DO BEBÊ: ${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}. Se houver decoração temática (vela, balão, banner), exiba "${formData.months}".`;
    }

    // Inject age customization for birthday prompts
    if (isBirthdayPrompt && formData.age) {
      template = template
        .replace(/\[IDADE\]/g, formData.age)
        .replace(/\{idade\}/g, formData.age)
        .replace(/\{age\}/g, formData.age);
      template += `\n\nIDADE OBRIGATÓRIA — INSTRUÇÃO CRÍTICA DE NÚMERO:
O número "${formData.age}" DEVE aparecer VISÍVEL e LEGÍVEL na imagem. 
Renderize o número "${formData.age}" de forma proeminente em pelo menos UM destes elementos: vela(s) no bolo mostrando "${formData.age}", balão metalizado dourado/prateado formando "${formData.age}", banner/faixa com "${formData.age}", topper de bolo com "${formData.age}".
A pessoa aparenta ter ${formData.age} anos de idade.
NÃO use outro número. NÃO omita o número. O número "${formData.age}" é o elemento central da composição.
Se houver bolo na cena, as velas ou topper DEVEM mostrar "${formData.age}".
IGNORE COMPLETAMENTE qualquer número, idade, texto, nome, letras ou símbolos que apareçam na imagem de exemplo/referência de estilo.
Se a imagem de exemplo mostrar "36" mas o usuário informou "${formData.age}", a imagem final DEVE mostrar apenas "${formData.age}".`;
    }

    // Inject month for foto infantil
    if (isMesversarioPrompt && formData.months) {
      template = template
        .replace(/\[MESES\]/g, formData.months)
        .replace(/\{meses\}/g, formData.months)
        .replace(/\{age\}/g, formData.months)
        .replace(/\[IDADE\]/g, formData.months);
      template += `\n\nMESES DO BEBÊ: O bebê tem ${formData.months} meses. Exiba o número "${formData.months}" como decoração/tema na imagem (vela, balão, banner, etc). NÃO use outro número.`;
    }

    // Inject team name for football/team prompts
    if (formData.team_name) {
      template = template
        .replace(/\{team_name\}/g, formData.team_name);
      template += `\n\nTIME OBRIGATÓRIO: O time é "${formData.team_name}". Use as cores oficiais, escudo e uniforme do ${formData.team_name}. NÃO use cores ou escudo de outro time.`;
    }

    const nameForImage = formData.displayName || formData.name;
    if (hasNameInImage && nameForImage) {
      template = template
        .replace(/\[NOME\]/g, nameForImage)
        .replace(/\[NAME\]/g, nameForImage)
        .replace(/\{nome\}/g, nameForImage)
        .replace(/\{name\}/g, nameForImage);
      template += `\n\nNOME NA IMAGEM: Escreva EXATAMENTE "${nameForImage}" na imagem onde houver texto decorativo, banner, placa ou similar. Grafia EXATA, sem alterações.`;
    }

    // Couple/Family/Multi-person context
    if ((isFamilyPrompt || isCouplePrompt || isMultiPersonPrompt) && sortedUrls.length > 1) {
      const multiContext = sortedUrls.map((_, i) => {
        const label = getPhotoLabel(i);
        const profile = sortedProfiles[i];
        const ageInfo = profile?.metadados?.idade_detectada ? ` (~${profile.metadados.idade_detectada} anos)` : '';
        return `Foto ${i + 1} = ${label}${ageInfo}`;
      }).join('\n');
      const contextType = isCouplePrompt ? 'COMPOSIÇÃO DO CASAL' : 'COMPOSIÇÃO FAMILIAR';
      template += `\n\n${contextType}:\n${multiContext}\nMostre TODAS as pessoas juntas na composição. Cada pessoa DEVE ser reconhecível pela foto de referência correspondente.`;
    }

    if (photoContextLines.length > 0) {
      template += `\n\nDETALHES DAS PESSOAS E ELEMENTOS DETECTADOS:\n${photoContextLines.join('\n')}\nPosicione cada pessoa de acordo com sua faixa etária e gênero detectados.`;
    }

    // Build flyerContext for Prompt Master
    const flyerContext: Record<string, unknown> = {};
    
    // Detect context type from category
    const categoryLower = (prompt.category || '').toLowerCase();
    if (isBirthdayPrompt) flyerContext.contexto = 'Aniversário';
    else if (isMesversarioPrompt) flyerContext.contexto = 'Foto Infantil';
    else if (/evento|event/i.test(categoryLower)) flyerContext.contexto = 'Evento';
    else if (/promoção|promocao/i.test(categoryLower)) flyerContext.contexto = 'Promoção';
    else if (/festa|party/i.test(categoryLower)) flyerContext.contexto = 'Festa';
    else if (categoryLower) flyerContext.contexto = prompt.category;

    // Names array
    const allNames = personNames.filter(n => n.trim());
    if (allNames.length > 0) flyerContext.nomes = allNames;
    else if (nameForImage) flyerContext.nomes = [nameForImage];

    // Ages — usa anos OU meses (mêsversário)
    const ageValue = formData.age || (formData.months ? `${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}` : '');
    if (ageValue) flyerContext.idades = [ageValue];

    // Contact info
    if (formData.telefone) flyerContext.telefone = formData.telefone;
    if (formData.endereco) flyerContext.endereco = formData.endereco;
    if (formData.instagram) flyerContext.instagram = formData.instagram;
    if (formData.data) flyerContext.data = formData.data;
    if (formData.hora) flyerContext.hora = formData.hora;
    if (formData.extras) flyerContext.extras = formData.extras;
    if (formData.description) flyerContext.tema = formData.description;

    flyerContext.qtdPessoas = sortedUrls.length;

    const safeExampleImageUrl =
      typeof overrideExampleImageUrl !== 'undefined'
        ? (overrideExampleImageUrl as string | null)
        : sortedUrls.length > 0
          ? null
          : (prompt.example_image_url || null);

    return {
      purchaseId,
      negativePrompt: prompt.negative_prompt,
      aiModel: prompt.ai_model,
      userName: formData.name,
      userInstagram: formData.instagram,
      userDescription: formData.description,
      userPhotoUrl: sortedUrls[0] || null,
      userPhotoUrls: sortedUrls.length > 0 ? sortedUrls : undefined,
      exampleImageUrl: safeExampleImageUrl || undefined,
      flyerContext: Object.keys(flyerContext).length > 0 ? flyerContext : undefined,
      style: overrideStyle || selectedStyle,
      userId: user?.id,
      ...restOverrides,
      promptTemplate: stripTokens(template),
    };
  };

  const runQAValidation = async (imageUrl: string, referenceImageUrls: string[]): Promise<{ passed: boolean; issues: string[]; is_inappropriate?: boolean }> => {
    try {
      setQaStatus('checking');

      const { data, error } = await supabase.functions.invoke('validate-generated-image', {
        body: {
          imageUrl,
          promptCategory: prompt.category,
          promptTemplate: prompt.prompt_template,
          expectedAge: isBirthdayPrompt && formData.age ? formData.age : undefined,
          expectedName: formData.name,
          expectedDescription: formData.description,
          hasReferencePhoto: referenceImageUrls.length > 0,
          numberOfPeople: Math.max(referenceImageUrls.length, activePhotoCount || 1),
          referenceImageUrls,
          styleReferenceImageUrl: prompt.example_image_url,
        },
      });

      if (error || !data) {
        console.warn('QA validation unavailable, passing by default');
        return { passed: true, issues: [] };
      }

      return { 
        passed: data.passed ?? true, 
        issues: data.issues ?? [],
        is_inappropriate: data.is_inappropriate ?? false
      };
    } catch (error) {
      console.error('QA validation failed:', error);
      return { passed: true, issues: [] };
    }
  };

  const generateImage = async (overridePurchaseId?: string, attempt = 1) => {
    try {
      const effectivePurchaseId = overridePurchaseId || purchaseId;
      if (!effectivePurchaseId) throw new Error('Compra não iniciada corretamente');

      if (attempt === 1) {
        setStep('generating');
        setQaStatus('idle');
      }

      // Step 1: Upload / Ensure photos (Progress: Receiving)
      const referencePhotoUrls = await ensureUploadedPhotoUrls(effectivePurchaseId);
      if (prompt.required_fields.includes('photo') && referencePhotoUrls.length === 0) {
        throw new Error('Nenhuma foto de referência válida foi enviada');
      }

      // Step 2: Generation (Progress: Cloning/Building)
      setQaStatus('idle'); // Starting AI part
      const body = buildGenerationBody(referencePhotoUrls);
      body.purchaseId = effectivePurchaseId;
      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body,
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Nenhuma imagem gerada');

      const newCount = generationCount + 1;
      setGenerationCount(newCount);

      let finalImageUrl = data.imageUrl;
      let qa = await runQAValidation(finalImageUrl, referencePhotoUrls);

      // Block output moderation failures immediately
      if (qa.is_inappropriate) {
        setStep('form');
        toast.error('Conteúdo bloqueado por segurança', {
          description: 'A imagem gerada violou nossas diretrizes de segurança (conteúdo inadequado ou infantilizado). Sua conta foi sinalizada para revisão.',
          duration: 10000
        });
        return;
      }

      if (!qa.passed && newCount <= 2) {
        setQaStatus('fixing');
        setQaIssues(qa.issues);
        toast.info('Ajustando qualidade automaticamente...');

        const correctionBlock = [
          'CORREÇÕES OBRIGATÓRIAS:',
          'Preserve EXATAMENTE a identidade da(s) pessoa(s) da(s) foto(s) de referência.',
          'Não troque idade aparente, rosto, formato dos olhos, nariz, boca ou cabelo.',
          ...qa.issues.map((issue) => `- ${issue}`),
        ].join('\n');

        const { data: retryData, error: retryError } = await supabase.functions.invoke('generate-prompt-image', {
          body: buildGenerationBody(referencePhotoUrls, {
            promptTemplate: `${prompt.prompt_template}\n\n${correctionBlock}`,
            negativePrompt: `${prompt.negative_prompt || ''}${prompt.negative_prompt ? ', ' : ''}${qa.issues.join(', ')}`,
          }),
        });

        if (retryError) throw retryError;

        if (retryData?.imageUrl) {
          finalImageUrl = retryData.imageUrl;
          qa = await runQAValidation(finalImageUrl, referencePhotoUrls);
          
          if (qa.is_inappropriate) {
            setStep('form');
            toast.error('Conteúdo bloqueado por segurança', {
              description: 'A imagem gerada violou nossas diretrizes de segurança.',
              duration: 10000
            });
            return;
          }
        }
      }

      if (!qa.passed) {
        setQaStatus('idle');
        setQaIssues(qa.issues);
        toast.warning('A auditoria encontrou possíveis ajustes, mas sua imagem foi entregue. Você pode gerar novamente se desejar.');
      } else {
        setQaStatus('passed');
        setQaIssues([]);
      }

      setGeneratedImage(finalImageUrl);
      setGeneratedVariants([{ url: finalImageUrl, selected: true }]);

      setStep('complete');
    } catch (error) {
      console.error('Error generating image:', error);
      const msg = error instanceof Error ? error.message : 'Erro na geração.';
      // Não jogamos o cliente de volta pro formulário (perderia dados/pagamento).
      // Mantemos no estado 'generating' com mensagem de erro + botão retry + suporte.
      toast.error(`${msg} Estamos tentando novamente automaticamente. Se persistir, fale com o suporte.`, {
        duration: 8000,
        action: {
          label: 'WhatsApp Suporte',
          onClick: () => window.open('https://wa.me/5511999999999?text=Tive%20problema%20na%20geração%20da%20foto.%20ID:%20' + (purchaseId || 'N/A'), '_blank'),
        },
      });
      setQaStatus('idle');
      setQaIssues([]);
      // Auto-retry uma vez após 3s se foi a primeira tentativa
      if (purchaseId && !(window as any).__arcanaRetried?.[purchaseId]) {
        (window as any).__arcanaRetried = { ...((window as any).__arcanaRetried || {}), [purchaseId]: true };
        setTimeout(() => {
          generateImage(purchaseId).catch(() => setStep('form'));
        }, 3000);
      } else {
        setStep('form');
      }
    }
  };

  const generateMoreVariants = async () => {
    if (generatedVariants.length >= MAX_VARIANTS) {
      toast.error(`Máximo de ${MAX_VARIANTS} variações.`);
      return;
    }

    setIsGeneratingMore(true);

    try {
      if (!purchaseId) {
        toast.error('Erro: compra não encontrada. Tente gerar novamente.');
        return;
      }
      const referencePhotoUrls = await ensureUploadedPhotoUrls(purchaseId);
      const variationIndex = generatedVariants.length + 1;

      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: buildGenerationBody(referencePhotoUrls, {
          promptTemplate: `${prompt.prompt_template}\n\nVARIAÇÃO ${variationIndex}: gere uma composição diferente, mantendo 100% da fidelidade facial e a mesma faixa etária aparente das pessoas de referência.`,
        }),
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Nenhuma variação gerada');

      let finalVariantUrl = data.imageUrl;
      let qa = await runQAValidation(finalVariantUrl, referencePhotoUrls);

      if (qa.is_inappropriate) {
        throw new Error('A variação gerada violou nossas diretrizes de segurança.');
      }

      if (!qa.passed) {
        setQaStatus('fixing');
        setQaIssues(qa.issues);

        const { data: retryData, error: retryError } = await supabase.functions.invoke('generate-prompt-image', {
          body: buildGenerationBody(referencePhotoUrls, {
            promptTemplate: `${prompt.prompt_template}\n\nVARIAÇÃO ${variationIndex}: gere uma composição diferente, mantendo 100% da fidelidade facial.\n\nCORREÇÕES OBRIGATÓRIAS:\n${qa.issues.map((issue) => `- ${issue}`).join('\n')}`,
            negativePrompt: `${prompt.negative_prompt || ''}${prompt.negative_prompt ? ', ' : ''}${qa.issues.join(', ')}`,
          }),
        });

        if (retryError) throw retryError;
        if (retryData?.imageUrl) {
          finalVariantUrl = retryData.imageUrl;
          qa = await runQAValidation(finalVariantUrl, referencePhotoUrls);
          
          if (qa.is_inappropriate) {
            throw new Error('A variação gerada violou nossas diretrizes de segurança.');
          }
        }
      }

      if (!qa.passed) {
        setQaStatus('idle');
        setQaIssues(qa.issues);
        throw new Error('A nova variação ainda não ficou fiel às fotos enviadas. Tente gerar novamente.');
      }

      setGeneratedVariants((prev) => [...prev, { url: finalVariantUrl, selected: false }]);
      setQaStatus('passed');
      setQaIssues([]);
      toast.success('Nova variação gerada!');
    } catch (error) {
      console.error('Error generating more variants:', error);
      toast.error('Erro ao gerar variação.');
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const selectVariant = (index: number) => {
    const nextUrl = generatedVariants[index]?.url;
    setGeneratedVariants((prev) => prev.map((variant, i) => ({ ...variant, selected: i === index })));
    if (nextUrl) setGeneratedImage(nextUrl);
  };

  const handleEditImage = async () => {
    if (!editInstruction.trim()) {
      toast.error('Descreva o que deseja alterar.');
      return;
    }

    if (editCount >= MAX_EDITS) {
      toast.error('Você já utilizou sua edição gratuita.');
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
        },
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Edição não gerou imagem');

      const referencePhotoUrls = await ensureUploadedPhotoUrls(purchaseId);
      const qa = await runQAValidation(data.imageUrl, referencePhotoUrls);

      if (qa.is_inappropriate) {
        throw new Error('A edição gerada violou nossas diretrizes de segurança.');
      }

      setGeneratedImage(data.imageUrl);
      setGeneratedVariants((prev) => prev.map((variant, index) => ({ ...variant, selected: index === 0 })));
      setEditInstruction('');
      setEditCount(prev => prev + 1);
      setStep('complete');
      toast.success('Imagem editada com sucesso!');
    } catch (error) {
      console.error('Error editing image:', error);
      toast.error('Erro ao editar. Tente novamente.');
    } finally {
      setIsEditing(false);
    }
  };

  const exportFormats = [
    { key: 'original', label: 'Original', ratio: null, w: 20, h: 20 },
    { key: '1:1', label: 'Feed 1:1', ratio: 1, w: 18, h: 18 },
    { key: '4:5', label: 'Post 4:5', ratio: 4 / 5, w: 16, h: 20 },
    { key: '9:16', label: 'Stories', ratio: 9 / 16, w: 12, h: 20 },
    { key: '16:9', label: 'Cover', ratio: 16 / 9, w: 20, h: 12 },
    { key: '3:4', label: 'Retrato', ratio: 3 / 4, w: 15, h: 20 },
  ];

  const handleDownload = async (urlToDownload?: string) => {
    const imageUrl = urlToDownload || generatedImage;
    if (!imageUrl) return;
    
    // Helper: fallback direct download
    const fallbackDownload = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      toast.success('Download iniciado!');
    };

    const selectedFormat = exportFormats.find(f => f.key === exportFormat);

    if (!selectedFormat?.ratio) {
      // Original format — try fetch-based download to avoid navigation issues
      try {
        const resp = await fetch(imageUrl);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        toast.success('Download iniciado!');
      } catch {
        fallbackDownload();
      }
      return;
    }

    // Cropped format — fetch as blob first to avoid CORS tainted canvas
    try {
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.src = blobUrl;
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { fallbackDownload(); return; }

        const targetRatio = selectedFormat.ratio;
        const srcRatio = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;

        if (srcRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        const maxDim = 2048;
        let outW = sw;
        let outH = sh;
        if (outW > maxDim || outH > maxDim) {
          const scale = Math.min(maxDim / outW, maxDim / outH);
          outW = Math.round(outW * scale);
          outH = Math.round(outH * scale);
        }

        canvas.width = outW;
        canvas.height = outH;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

        canvas.toBlob((canvasBlob) => {
          if (!canvasBlob) { fallbackDownload(); return; }
          const link = document.createElement('a');
          link.href = URL.createObjectURL(canvasBlob);
          link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}-${exportFormat}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          toast.success(`Download ${selectedFormat.label} iniciado!`);
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        fallbackDownload();
      };
    } catch {
      fallbackDownload();
      toast.success('Download iniciado!');
    };
  };

  const handleDownloadAll = () => {
    const selected = generatedVariants.filter((variant) => variant.selected);
    if (selected.length === 0) {
      handleDownload();
      return;
    }

    selected.forEach((variant, index) => {
      setTimeout(() => handleDownload(variant.url), index * 500);
    });
  };

  const handleSaveToProfile = async () => {
    if (!user) {
      toast.error('Faça login para salvar em seu perfil');
      return;
    }
    if (!generatedImage) return;

    try {
      const { error } = await (supabase.from('generated_images' as any).insert({
        user_id: user.id,
        image_url: generatedImage,
        template_name: prompt.name,
        original_purchase_id: purchaseId,
        is_favorite: true
      } as any) as any);

      if (error) throw error;
      toast.success('Salvo em seu perfil com sucesso! 🎉');
    } catch {
      toast.error('Erro ao salvar no perfil');
    }
  };

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authStep === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
        toast.success('Login realizado!');
      } else {
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              full_name: formData.name || 'Cliente Arcana',
            }
          }
        });
        if (error) throw error;
        toast.success('Cadastro realizado! Verifique seu e-mail.');
      }
      setAuthStep('done');
    } catch (err: any) {
      toast.error(err.message || 'Erro na autenticação');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden overscroll-contain"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full h-[100dvh] sm:h-auto sm:max-w-lg sm:px-4 sm:py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="relative overflow-hidden h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto overscroll-contain sm:rounded-2xl border border-white/[0.1] bg-[hsl(var(--background)/0.8)] backdrop-blur-2xl shadow-2xl pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:pb-0 sm:pt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Liquid Glass ambient effects */}
          <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Floating WhatsApp Help Button - Desktop/Tablet only */}
          <div className="hidden sm:block absolute bottom-6 right-6 z-50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              className="p-4 rounded-2xl bg-green-500 text-white shadow-xl shadow-green-500/30 border border-green-400/50 flex items-center gap-2 group transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap">Suporte</span>
            </motion.button>
          </div>

          <button onClick={onClose} aria-label="Fechar" className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90 transition-all backdrop-blur-md">
            <X className="w-4 h-4" />
          </button>


          <GlassCardHeader className="pb-4 pt-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg group-hover:blur-xl transition-all" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary animate-pulse" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <GlassCardTitle className="text-base sm:text-xl font-bold tracking-tight leading-tight truncate">{prompt.name}</GlassCardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] sm:text-xs border-primary/30 bg-primary/5 text-primary/80">
                    {prompt.category}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground/80">
                    {formatPrice(prompt.price_cents)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCardHeader>

          <GlassCardContent className="space-y-6 sm:space-y-8 pb-8">
            {/* Steps Progress */}
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
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 border shadow-lg ${
                          isCurrent 
                            ? 'bg-primary text-primary-foreground border-primary shadow-primary/30 scale-110' 
                            : isPast 
                              ? 'bg-primary/20 text-primary border-primary/20' 
                              : 'bg-white/5 text-muted-foreground border-white/10 opacity-50'
                        }`}>
                          {isPast ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight uppercase ${isCurrent ? 'text-primary' : 'text-muted-foreground/50'}`}>
                          {labels[index]}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className="flex-1 px-2 mb-4">
                          <div className={`h-[2px] w-full rounded-full transition-all duration-700 ${isPast ? 'bg-primary/30' : 'bg-white/5'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}


            {/* Auth Step (Inside Card) */}
            {authStep !== 'done' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">
                    {authStep === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {authStep === 'login' ? 'Acesse para salvar suas criações' : 'Salve suas fotos e acompanhe seus pedidos'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">E-mail</Label>
                      <Input 
                        type="email" 
                        required
                        value={authForm.email}
                        onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="exemplo@email.com"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Senha</Label>
                      <Input 
                        type="password" 
                        required
                        value={authForm.password}
                        onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    {authStep === 'register' && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Confirmar Senha</Label>
                        <Input 
                          type="password" 
                          required
                          value={authForm.confirmPassword}
                          onChange={e => setAuthForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="••••••••"
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                    )}
                  </div>

                  <Button disabled={authLoading} type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                    {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authStep === 'login' ? 'Entrar' : 'Criar Conta')}
                  </Button>

                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => setAuthStep(authStep === 'login' ? 'register' : 'login')}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors text-center"
                    >
                      {authStep === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre aqui'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAuthStep('done')}
                      className="text-xs text-primary/60 hover:text-primary transition-colors text-center font-medium"
                    >
                      Continuar como convidado
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {authStep === 'done' && step === 'form' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                
                {/* Safety Warning UX */}
                <div className="mx-2 flex items-start gap-3 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-tight text-destructive-foreground/90 font-medium">
                    <span className="font-bold">Aviso de Segurança:</span> Conteúdos inadequados, sexualizados ou que violem nossas diretrizes serão bloqueados automaticamente.
                  </p>
                </div>

                {prompt.required_fields.includes('photo') && (
                  <div className="space-y-4">
                    {/* Hero upload CTA — mobile-first with native full-card input overlay */}
                    {activePhotoCount === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                      >
                        {/* Futuristic LED-bordered upload card */}
                        <div className="relative overflow-hidden rounded-3xl p-[1.5px] active:scale-[0.98] transition-all duration-300 touch-manipulation">
                          {/* Animated LED border */}
                          <div className="absolute inset-0 rounded-3xl overflow-hidden">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0%,hsl(var(--primary))_20%,transparent_40%,hsl(var(--secondary))_60%,transparent_80%,hsl(var(--primary))_100%)]"
                            />
                          </div>
                          {/* Inner card */}
                          <div className="relative rounded-[calc(1.5rem-1.5px)] bg-[hsl(var(--background))] p-8 sm:p-10">
                            {/* Ambient glow effects */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-secondary/8 blur-[60px] pointer-events-none" />
                            
                            {/* Grid pattern overlay */}
                            <div className="absolute inset-0 rounded-[calc(1.5rem-1.5px)] opacity-[0.03] pointer-events-none" 
                              style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                            />

                            <div className="relative flex flex-col items-center gap-5 text-center pointer-events-none">
                              <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative"
                              >
                                {/* Icon with neon ring */}
                                <div className="relative">
                                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
                                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.35),inset_0_1px_0_hsl(var(--primary)/0.1)]">
                                    <Camera className="w-9 h-9 sm:w-11 sm:h-11 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                                  </div>
                                </div>
                                <motion.div 
                                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-background shadow-[0_0_12px_hsl(142_71%_45%/0.6)]" 
                                />
                              </motion.div>

                              <div className="space-y-2.5">
                                <h4 className="text-lg sm:text-xl font-bold text-foreground tracking-[-0.04em] leading-tight">
                                  {isCouplePrompt ? 'Fotos do casal' : isFamilyPrompt ? 'Fotos da família' : 'Envie sua melhor foto'}
                                </h4>
                                {/* Destaque das recomendações de qualidade */}
                                <div className="mx-auto max-w-[300px] rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.08] to-primary/[0.02] px-3.5 py-3 shadow-[0_0_24px_-8px_hsl(var(--primary)/0.35)]">
                                  <p className="text-[11px] sm:text-[12px] font-semibold text-primary tracking-tight mb-1.5 flex items-center justify-center gap-1.5">
                                    <Sparkles className="w-3 h-3" />
                                    Para o melhor resultado
                                  </p>
                                  <p className="text-[12px] sm:text-[13px] text-foreground/85 leading-relaxed font-medium">
                                    {isCouplePrompt
                                      ? 'Uma foto de cada pessoa. A IA vai unir vocês.'
                                      : isFamilyPrompt
                                        ? 'Uma foto separada de cada membro.'
                                        : 'Suba uma foto com boa qualidade, boa iluminação e o rosto de frente.'}
                                  </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                                  {['✅ Rosto de frente', '✅ Boa iluminação', '✅ Alta qualidade'].map(tip => (
                                    <span key={tip} className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary/85 font-semibold">{tip}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Futuristic upload button */}
                              <div className="relative group/btn">
                                <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-lg opacity-60" />
                                <div className="relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground font-semibold text-[15px] shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)]">
                                  <Upload className="w-4.5 h-4.5" />
                                  Escolher foto
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40 mt-1">
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400/40" /> JPG, PNG, HEIC</span>
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400/40" /> Até 20MB</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <input
                          id="hero-photo-upload-0"
                          ref={(el) => {
                            fileInputRefs.current[0] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(0, e)}
                          aria-label="Escolher foto para geração"
                          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 touch-manipulation"
                        />
                      </motion.div>
                    ) : (
                      /* Compact header after first upload */
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                            <Camera className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <Label className="text-xs sm:text-sm font-semibold">
                              {isCouplePrompt
                                ? `Fotos do Casal`
                                : isFamilyPrompt 
                                  ? `Fotos da Família`
                                  : isMultiPersonPrompt
                                    ? `Fotos das Pessoas`
                                    : `Sua foto`}
                            </Label>
                            <p className="text-[10px] text-muted-foreground">
                              {activePhotoCount} de {isMultiPersonPrompt ? (prompt.min_photos || 2) : maxPhotos} enviada{activePhotoCount > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        {photos.length < maxPhotos && !isMultiPersonPrompt && (
                          <button onClick={addPhotoSlot} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium px-3 py-1.5 rounded-full bg-primary/10 active:scale-95">
                            <Plus className="w-3.5 h-3.5" />
                            {isFamilyPrompt ? 'Familiar' : 'Pessoa'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Photo grid — only show when there are photos or multi-person */}
                    {(activePhotoCount > 0 || isMultiPersonPrompt) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {photos.map((photo, index) => {
                          const photoProfile = photoProfiles[index];
                          const isAnalyzing = analyzingPhotoSlots.includes(index);
                          const slotLabel = getPhotoLabel(index);

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group space-y-1.5"
                            >
                              <div
                                className={`relative rounded-2xl border transition-all overflow-hidden aspect-[3/4] active:scale-[0.97] touch-manipulation ${
                                  photo.preview 
                                    ? 'border-white/[0.08] bg-black/20 shadow-[0_4px_24px_-8px_hsl(0_0%_0%/0.5)]' 
                                    : 'border-dashed border-white/[0.12] hover:border-primary/30 bg-gradient-to-b from-white/[0.03] to-transparent'
                                }`}
                              >
                                {photo.preview ? (
                                  <>
                                    <img src={photo.preview} alt={slotLabel} className="w-full h-full object-contain" />
                                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-green-500/90 flex items-center justify-center shadow-sm ring-2 ring-background pointer-events-none">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground p-3 pointer-events-none">
                                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/[0.08]">
                                      <ImagePlus className="w-5 h-5 text-muted-foreground/40" />
                                    </div>
                                    <div className="text-center space-y-0.5">
                                      <span className="block text-[11px] font-medium text-muted-foreground/60">{slotLabel}</span>
                                      <span className="block text-[9px] text-primary/40 font-medium tracking-wide uppercase">Toque</span>
                                    </div>
                                  </div>
                                )}
                                {photo.preview && (
                                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2.5 pointer-events-none">
                                    <span className="text-[10px] text-white/80 font-medium tracking-tight">{slotLabel}</span>
                                  </div>
                                )}

                                <input
                                  id={`photo-slot-upload-${index}`}
                                  ref={(el) => {
                                    fileInputRefs.current[index] = el;
                                  }}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoUpload(index, e)}
                                  aria-label={`Escolher ${slotLabel}`}
                                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 touch-manipulation"
                                />
                              </div>

                              {photos.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePhotoSlot(index);
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 active:opacity-100 transition-opacity shadow-md z-20"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}

                              <div className="min-h-8 flex flex-wrap gap-1">
                                {isAnalyzing && (
                                  <Badge variant="outline" className="text-[10px] border-primary/30 bg-primary/10 text-primary">
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    Analisando
                                  </Badge>
                                )}
                                {photoProfile?.ageGroup && (
                                  <Badge variant="outline" className="text-[10px] border-border/60 bg-background/70">
                                    {ageGroupLabel[photoProfile.ageGroup] || photoProfile.ageGroup}
                                  </Badge>
                                )}
                                {photoProfile?.presentation && photoProfile.presentation !== 'indefinida' && (
                                  <Badge variant="outline" className="text-[10px] border-border/60 bg-background/70">
                                    {presentationLabel[photoProfile.presentation] || photoProfile.presentation}
                                  </Badge>
                                )}
                                {photoProfile?.categoria && (
                                  <Badge variant="outline" className="text-[10px] border-secondary/30 bg-secondary/10 text-secondary">
                                    {photoProfile.categoria.replace(/_/g, ' ')}
                                  </Badge>
                                )}
                                {photoProfile?.metadados?.animal && (
                                  <Badge variant="outline" className="text-[10px] border-border/60 bg-background/70">
                                    🐾 {photoProfile.metadados.animal}
                                  </Badge>
                                )}
                                {photoProfile?.metadados?.idade_detectada && (
                                  <Badge variant="outline" className="text-[10px] border-primary/30 bg-primary/10 text-primary">
                                    ~{photoProfile.metadados.idade_detectada} anos
                                  </Badge>
                                )}
                                {photoProfile?.analise && photoProfile.analise.quantidade_pessoas > 1 && (
                                  <Badge variant="outline" className="text-[10px] border-border/60 bg-background/70">
                                    👥 {photoProfile.analise.quantidade_pessoas} pessoas
                                  </Badge>
                                )}
                              </div>

                              {photoProfile?.audit_qualidade && (
                                <div className="mt-2 space-y-1.5 p-2 rounded-xl bg-black/30 border border-white/5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Audit de Identidade</span>
                                    {photoProfile.audit_qualidade.score_identidade > 0.9 ? (
                                      <Badge className="h-4 text-[9px] bg-green-500/20 text-green-400 border-green-500/30">Excelente</Badge>
                                    ) : photoProfile.audit_qualidade.score_identidade > 0.7 ? (
                                      <Badge className="h-4 text-[9px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Bom</Badge>
                                    ) : (
                                      <Badge className="h-4 text-[9px] bg-red-500/20 text-red-400 border-red-500/30">Ruim</Badge>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    <AuditItem label="Rosto visível" passed={photoProfile.audit_qualidade.rosto_detectado} />
                                    <AuditItem label="De frente" passed={photoProfile.audit_qualidade.olhando_camera} />
                                    <AuditItem label="Iluminação" passed={photoProfile.audit_qualidade.iluminacao_boa} />
                                    <AuditItem label="Sem obstruções" passed={photoProfile.audit_qualidade.sem_obstrucoes} />
                                  </div>

                                  {photoProfile.audit_qualidade.recomendacoes.length > 0 && (
                                    <div className="mt-1.5 pt-1.5 border-t border-white/5">
                                      {photoProfile.audit_qualidade.recomendacoes.map((rec, i) => (
                                        <div key={i} className="flex gap-1 items-start text-[9px] text-yellow-200/70 leading-tight">
                                          <AlertTriangle className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" />
                                          <span>{rec}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    {activePhotoCount > 0 && (
                      <p className="text-[10px] text-muted-foreground/50 text-center">
                        {isFamilyPrompt 
                          ? `${activePhotoCount} de ${maxPhotos} · Uma foto por membro da família`
                          : `${activePhotoCount} foto${activePhotoCount > 1 ? 's' : ''} enviada${activePhotoCount > 1 ? 's' : ''} · A IA preserva cada detalhe`}
                      </p>
                    )}
                  </div>
                )}
                {/* Name field — usa "Nome da criança" para prompts infantis */}
                {prompt.required_fields.includes('name') && (() => {
                  const isChildPrompt = /infantil|bebê|bebe|newborn|criança|crianca|kids|baby|aniversário|aniversario/i.test(
                    `${prompt.category || ''} ${prompt.name || ''}`
                  );
                  return (
                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm">
                        {isChildPrompt ? '👶 Nome da criança' : 'Seu nome'}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder={isChildPrompt ? 'Ex: Helena, Theo, Maria Júlia' : 'Como você quer ser chamado'}
                          className="pl-10 bg-white/5 border-white/10 text-sm"
                        />
                      </div>
                    </div>
                  );
                })()}


                {hasNameInImage && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      ✨ Nome que aparece na imagem
                    </Label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder={formData.name || "Ex: Maria, João Pedro, Baby Luna"}
                      className="bg-white/5 border-white/10 text-sm font-medium"
                    />
                    {formData.displayName && (
                      <div className="p-2 rounded-lg bg-primary/5 border border-primary/20 text-center">
                        <p className="text-[10px] text-muted-foreground mb-1">Preview do nome na imagem:</p>
                        <p className="text-sm font-bold text-primary">{formData.displayName}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      Este nome será escrito EXATAMENTE como digitado na imagem gerada (banners, placas, decorações).
                    </p>
                  </div>
                )}

                {/* Team name field */}
                {prompt.required_fields.includes('team_name') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      ⚽ Nome do Time
                    </Label>
                    <Input
                      value={formData.team_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, team_name: e.target.value }))}
                      placeholder="Ex: Flamengo, Corinthians, Palmeiras..."
                      className="bg-white/5 border-white/10 text-sm font-medium"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      O uniforme, cores e escudo do time serão aplicados automaticamente.
                    </p>
                  </div>
                )}

                {/* Instagram field */}
                {prompt.required_fields.includes('instagram') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">@Instagram</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.instagram}
                        onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                        placeholder="seu_usuario"
                        className="pl-10 bg-white/5 border-white/10 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Description field */}
                {prompt.required_fields.includes('description') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Descrição adicional</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder={isMesversarioPrompt 
                        ? "Ex: tema safari, cor rosa, fundo azul..." 
                        : isBirthdayPrompt 
                          ? "Ex: tema festa junina, cor preferida, detalhes..." 
                          : "Ex: 3 meses, 25 anos, cor do fundo..."}
                      className="w-full min-h-[60px] px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>
                )}

                {/* Smart Age Selector — Bebê/Criança/Adulto unified */}
                {(isMesversarioPrompt || isBirthdayPrompt) && (
                  <div className="space-y-3">
                    {/* Age mode toggle */}
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      {isMesversarioPrompt ? '👶 Idade do bebê' : '🎂 Idade para a imagem'}
                    </Label>

                    {/* Smart mode selector chips */}
                    {(() => {
                      const detectedAge = photoProfiles.find(p => p?.metadados?.idade_detectada)?.metadados?.idade_detectada;
                      const detectedGroup = photoProfiles.find(p => p?.ageGroup)?.ageGroup;
                      
                      // Mode driven by which field is filled (toggle works for any prompt type)
                      const hasYears = !!formData.age;
                      const hasMonths = !!formData.months;
                      const isBabyMode = hasMonths || (!hasYears && (isMesversarioPrompt || detectedGroup === 'bebe'));
                      const isChildMode = !isBabyMode && (detectedGroup === 'crianca' || (detectedAge && detectedAge <= 12));
                      
                      return (
                        <div className="space-y-3">
                          {/* Mode chips */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, age: '', months: prev.months || '1' }));
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                isBabyMode 
                                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-sm' 
                                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              <span>👶</span> Meses
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, months: '', age: prev.age || (detectedAge ? String(detectedAge) : '') }));
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                !isBabyMode 
                                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm' 
                                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              <span>🎂</span> Anos
                            </button>
                          </div>

                          {/* MONTHS mode — gorgeous grid */}
                          {isBabyMode && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                                {Array.from({ length: 24 }, (_, i) => i + 1).map((month) => {
                                  const isSelected = formData.months === String(month);
                                  return (
                                    <motion.button
                                      key={month}
                                      type="button"
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => setFormData((prev) => ({ ...prev, months: String(month), age: '' }))}
                                      className={`relative p-1.5 sm:p-2.5 rounded-xl text-center transition-all duration-200 min-h-[52px] sm:min-h-[60px] ${
                                        isSelected
                                          ? 'bg-gradient-to-br from-pink-500/30 to-purple-500/20 border-2 border-pink-400/60 shadow-lg shadow-pink-500/10 scale-[1.05]'
                                          : 'bg-white/[0.03] border border-white/[0.08] hover:border-pink-400/30 hover:bg-pink-500/5'
                                      }`}
                                    >
                                      <span className={`text-base sm:text-lg font-black block leading-none ${isSelected ? 'text-pink-300' : 'text-foreground/80'}`}>
                                        {month}
                                      </span>
                                      <span className={`text-[8px] sm:text-[9px] mt-0.5 block ${isSelected ? 'text-pink-300/80' : 'text-muted-foreground/50'}`}>
                                        {month === 1 ? 'mês' : 'meses'}
                                      </span>
                                      {isSelected && (
                                        <motion.div 
                                          layoutId="month-indicator"
                                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center"
                                        >
                                          <Check className="w-2.5 h-2.5 text-white" />
                                        </motion.div>
                                      )}
                                    </motion.button>
                                  );
                                })}
                              </div>
                              
                              {/* Visual preview */}
                              {formData.months && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }} 
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-pink-500/10 border border-pink-500/20 text-center"
                                >
                                  <p className="text-[10px] text-pink-300/60 mb-1">Vai aparecer na imagem:</p>
                                  <span className="text-2xl font-black text-pink-300">{formData.months}</span>
                                  <span className="text-sm text-pink-300/70 ml-1.5">{formData.months === '1' ? 'mês' : 'meses'}</span>
                                </motion.div>
                              )}
                              
                              <p className="text-[10px] text-muted-foreground/60">
                                O número será exibido como decoração na imagem (balão, vela, banner, etc).
                              </p>
                            </motion.div>
                          )}

                          {/* YEARS mode — smart grid with visual preview */}
                          {!isBabyMode && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Large visual preview */}
                                <div className="relative flex-shrink-0">
                                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                                    {formData.age ? (
                                      <motion.span
                                        key={formData.age}
                                        initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                        className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent"
                                      >
                                        {formData.age}
                                      </motion.span>
                                    ) : (
                                      <span className="text-3xl opacity-20">?</span>
                                    )}
                                  </div>
                                  {formData.age && (
                                    <motion.div 
                                      initial={{ scale: 0 }} 
                                      animate={{ scale: 1 }}
                                      className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                    >
                                      {Number(formData.age) <= 12 ? '👧' : Number(formData.age) <= 17 ? '🧑' : '🎂'}
                                    </motion.div>
                                  )}
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={formData.age}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value.replace(/\D/g, ''), months: '' }))}
                                    placeholder="Digite a idade"
                                    className="bg-white/5 border-white/10 text-lg font-bold text-center"
                                    maxLength={3}
                                    type="text"
                                    inputMode="numeric"
                                  />
                                  <p className="text-[10px] text-muted-foreground/60 leading-tight">
                                    {isChildMode 
                                      ? 'Idade da criança — aparecerá no bolo, velas ou decoração'
                                      : 'Este número aparecerá no bolo, velas, balões ou decoração'}
                                  </p>
                                  {isChildMode && (
                                    <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                      <p className="text-[11px] text-amber-200/90 leading-snug font-medium">
                                        ⚠️ <strong>Importante:</strong> informe a idade EXATA do bebê/criança. Para bebês com menos de 1 ano, use os <strong>meses</strong> (ex: 6 meses) no campo abaixo. Isso garante que a IA gere o tamanho e proporções corretas — um bebê de 6 meses não pode parecer uma criança de 6 anos.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Smart quick-pick — contextual age buttons */}
                              <div className="space-y-1.5">
                                {isChildMode ? (
                                  <>
                                    <p className="text-[10px] text-muted-foreground/40 font-medium">Idades rápidas — Criança</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                                        <button
                                          key={age}
                                          type="button"
                                          onClick={() => setFormData((prev) => ({ ...prev, age: String(age), months: '' }))}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            formData.age === String(age)
                                              ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20'
                                              : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                                          }`}
                                        >
                                          {age}
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-[10px] text-muted-foreground/40 font-medium">Idades populares</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {[1, 2, 3, 5, 10, 15, 18, 21, 25, 30, 40, 50, 60].map((age) => (
                                        <button
                                          key={age}
                                          type="button"
                                          onClick={() => setFormData((prev) => ({ ...prev, age: String(age), months: '' }))}
                                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                            formData.age === String(age)
                                              ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20'
                                              : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                                          }`}
                                        >
                                          {age}
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Auto-detected age hint */}
                              {detectedAge && !formData.age && (
                                <motion.button
                                  type="button"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  onClick={() => setFormData(prev => ({ ...prev, age: String(detectedAge) }))}
                                  className="w-full p-2 rounded-lg bg-accent/10 border border-accent/20 text-center hover:bg-accent/20 transition-colors"
                                >
                                  <p className="text-[10px] text-accent">
                                    🤖 IA detectou ~{detectedAge} anos — <span className="font-bold underline">Usar essa idade</span>
                                  </p>
                                </motion.button>
                              )}
                            </motion.div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* STYLE SELECTION */}
                <div className="space-y-3">
                  <Label className="text-xs sm:text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Escolha o Estilo Artístico
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedStyle('realistic')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        selectedStyle === 'realistic' 
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' 
                        : 'bg-card border-border/10 hover:bg-muted/30'
                      }`}
                    >
                      <Camera className={`w-6 h-6 ${selectedStyle === 'realistic' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="text-center">
                        <p className="text-xs font-bold">Realista</p>
                        <p className="text-[9px] text-muted-foreground">Foto profissional real</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStyle('artistic')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        selectedStyle === 'artistic' 
                        ? 'bg-secondary/10 border-secondary shadow-lg shadow-secondary/10' 
                        : 'bg-card border-border/10 hover:bg-muted/30'
                      }`}
                    >
                      <Palette className={`w-6 h-6 ${selectedStyle === 'artistic' ? 'text-secondary' : 'text-muted-foreground'}`} />
                      <div className="text-center">
                        <p className="text-xs font-bold">Artístico</p>
                        <p className="text-[9px] text-muted-foreground">Leve toque de pintura</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Per-person naming for multi-photo uploads */}
                {needsPersonNames && activePhotoCount > 1 && (
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      👥 Nome de cada pessoa na imagem
                    </Label>
                    <div className="space-y-1.5">
                      {photos.map((photo, idx) => {
                        if (!photo.file) return null;
                        const label = isFamilyPrompt ? (familyPhotoLabels[idx] || `Pessoa ${idx + 1}`) : `Pessoa ${idx + 1}`;
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            {photo.preview && (
                              <img src={photo.preview} alt={label} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            )}
                            <Input
                              value={personNames[idx] || ''}
                              onChange={(e) => {
                                setPersonNames(prev => {
                                  const next = [...prev];
                                  while (next.length <= idx) next.push('');
                                  next[idx] = e.target.value;
                                  return next;
                                });
                              }}
                              placeholder={`Nome da ${label}`}
                              className="bg-white/5 border-white/10 text-sm flex-1"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Os nomes aparecerão na imagem junto às respectivas pessoas.
                    </p>
                  </div>
                )}

                {/* Contact & Event Info fields */}
                {(needsContactInfo || isEventPrompt) && (
                  <div className="space-y-3">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      📋 Informações do flyer
                    </Label>

                    {(prompt.required_fields.includes('telefone') || isEventPrompt) && (
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">📞 Telefone</Label>
                        <Input
                          value={formData.telefone}
                          onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                          className="bg-white/5 border-white/10 text-sm"
                        />
                      </div>
                    )}


                    {(prompt.required_fields.includes('endereco') || isEventPrompt) && (
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">📍 Endereço / Local</Label>
                        <Input
                          value={formData.endereco}
                          onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                          placeholder="Rua, número, bairro..."
                          className="bg-white/5 border-white/10 text-sm"
                        />
                      </div>
                    )}

                    {(prompt.required_fields.includes('data') || isEventPrompt) && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">📅 Data</Label>
                          <Input
                            value={formData.data}
                            onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                            placeholder="25/12/2025"
                            className="bg-white/5 border-white/10 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">🕐 Hora</Label>
                          <Input
                            value={formData.hora}
                            onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                            placeholder="19:00"
                            className="bg-white/5 border-white/10 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {(prompt.required_fields.includes('extras') || isEventPrompt) && (
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">✨ Informações extras</Label>
                        <textarea
                          value={formData.extras}
                          onChange={(e) => setFormData(prev => ({ ...prev, extras: e.target.value }))}
                          placeholder="Traje: esporte fino, confirme presença, etc."
                          className="w-full min-h-[50px] px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                        />
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground">
                      Todas as informações preenchidas serão exibidas no flyer gerado.
                    </p>
                  </div>
                )}

                <GlassButton onClick={handleSubmitForm} className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar imagem {formatPrice(prompt.price_cents)}
                </GlassButton>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {paymentStatus === 'paid' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="py-12 sm:py-16 text-center space-y-6"
                  >
                    {/* Animated success ring */}
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-500/30 backdrop-blur-sm" />
                      <div className="relative w-full h-full rounded-full bg-green-500/10 border-2 border-green-500/50 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          <CheckCircle2 className="w-12 h-12 text-green-400" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Confirmed badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase">
                        ✓ Pagamento Confirmado
                      </span>
                    </motion.div>

                    {/* Main headline */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-3"
                    >
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                        Sua imagem será gerada agora
                      </h3>
                      <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
                        Nossa IA está preparando algo incrível para você ✨
                      </p>
                    </motion.div>

                    {/* Animated loader */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="flex items-center justify-center gap-3 pt-2"
                    >
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground tracking-wide">Iniciando geração...</span>
                    </motion.div>
                  </motion.div>
                ) : (
                  <>
                    {/* Price summary */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(prompt.price_cents)}</span>
                    </div>

                    {/* Payment method - PIX only */}

                    {/* PIX Tab */}
                    {(
                      <div className="space-y-3">
                        {pixLoading ? (
                          <div className="py-8 flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">Gerando QR Code PIX...</p>
                          </div>
                        ) : pixError ? (
                          <div className="py-6 text-center space-y-3">
                            <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500" />
                            <p className="text-xs text-muted-foreground px-2">{pixError}</p>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline" onClick={() => purchaseId && initPixPayment(purchaseId)}>
                                Tentar Novamente
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-primary"
                                onClick={() => window.open(`https://wa.me/5511999999999?text=Erro%20no%20pagamento.%20ID:%20${purchaseId?.slice(0, 8)}`, '_blank')}
                              >
                                💬 Falar com Suporte (WhatsApp)
                              </Button>
                            </div>
                          </div>
                        ) : pixData ? (
                          <>
                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-3">
                              <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg max-w-full">
                                {pixData.qrCodeUrl ? (
                                  <img 
                                    src={pixData.qrCodeUrl} 
                                    alt="QR Code PIX" 
                                    className="w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 max-w-full"
                                  />
                                ) : (
                                  <QRCodeSVG value={pixData.copiaECola} size={192} className="max-w-full h-auto" />
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground text-center px-2">
                                Escaneie o QR Code com o app do seu banco
                              </p>
                            </div>

                            {/* Copia e Cola */}
                            <div className="space-y-2">
                              <Label className="text-[10px] text-muted-foreground">Ou copie o código PIX:</Label>
                              <div className="relative">
                                <div className="p-2.5 pr-12 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono break-all max-h-16 overflow-y-auto">
                                  {pixData.copiaECola}
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(pixData.copiaECola);
                                    setPixCopied(true);
                                    toast.success('Código PIX copiado!');
                                    setTimeout(() => setPixCopied(false), 3000);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                  {pixCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                                </button>
                              </div>
                            </div>

                            {/* Expiration countdown */}
                            {pixData.expiresAt && (
                              <div className="text-center">
                                <p className="text-[10px] text-muted-foreground">
                                  ⏱ Expira em {Math.max(0, Math.floor((pixData.expiresAt * 1000 - Date.now()) / 60000))} minutos
                                </p>
                              </div>
                            )}
                          </>
                        ) : null}
                      </div>
                    )}


                    {/* Verification status */}
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-center gap-2 mb-1">
                        {verifyingPayment ? (
                          <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-accent" />
                        )}
                        <span className="text-xs font-semibold text-accent">
                          {verifyingPayment ? 'Aguardando confirmação do pagamento...' : 'Pagamento Seguro via PIX (Asaas)'}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Após a confirmação do pagamento, sua imagem será gerada automaticamente.
                      </p>
                    </div>

                    {/* Simulate payment button — test mode (always available) */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 text-xs"
                      onClick={() => {
                        setPaymentStatus('paid');
                        if (paymentPollRef.current) clearInterval(paymentPollRef.current);
                        toast.success('Pagamento confirmado! Iniciando geração...');
                        setStep('generating');
                        void generateImage(purchaseId || undefined);
                      }}
                    >
                      🧪 Simular Pagamento (Teste)
                    </Button>

                    {verifyingPayment && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">Verificando pagamento...</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (paymentPollRef.current) clearInterval(paymentPollRef.current);
                          setVerifyingPayment(false);
                          setStep('form');
                        }}
                        className="w-full text-xs"
                      >
                        Voltar
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}


            {step === 'generating' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="py-4 sm:py-6">
                
                {/* Hero generating state */}
                <div className="relative flex flex-col items-center mb-6">
                  {/* Animated orbiting rings */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
                    {/* Outer ring */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border border-primary/20"
                    />
                    {/* Middle ring - counter-rotate */}
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-3 rounded-full border border-secondary/15"
                    />
                    {/* Inner glow */}
                    <div className="absolute inset-5 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 backdrop-blur-sm" />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
                      </motion.div>
                    </div>
                    {/* Orbiting dot */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mt-5 space-y-1.5"
                  >
                    <h3 className="text-lg sm:text-xl font-bold tracking-[-0.03em]">
                      {qaStatus === 'checking' 
                        ? '🔍 Auditoria de Qualidade' 
                        : qaStatus === 'fixing' 
                          ? '🔧 Corrigindo Automaticamente' 
                          : '✨ Sua Imagem Está Sendo Gerada'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground/60 max-w-[300px] mx-auto leading-relaxed">
                      {qaStatus === 'fixing'
                        ? 'Nossa IA detectou melhorias possíveis e está gerando uma versão otimizada'
                        : activePhotoCount > 1 
                          ? `Processando ${activePhotoCount} fotos com clonagem facial de precisão forense`
                          : 'Cada detalhe do seu rosto está sendo replicado com precisão milimétrica'}
                    </p>
                  </motion.div>
                </div>

                {/* Progress bar component */}
                <GenerationProgressBar 
                  isGenerating={step === 'generating'} 
                  qaStatus={qaStatus} 
                  photoCount={activePhotoCount || 1} 
                />

                {/* Stay on page warning + rotating reassurance messages */}
                <StayOnPageCard photosReady={uploadedPhotoUrls.length > 0} />

                {/* QA Issues panel */}
                {qaIssues.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-secondary/8 border border-secondary/20"
                  >
                    <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Ajustes em andamento
                    </div>
                    {qaIssues.map((issue, index) => (
                      <p key={index} className="text-[10px] text-muted-foreground/60 leading-relaxed">• {issue}</p>
                    ))}
                  </motion.div>
                )}

                {/* Upsell removido conforme solicitação do produto */}
              </motion.div>
            )}

            {step === 'complete' && generatedImage && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3 sm:space-y-4">
                <div className="text-center mb-2">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-1.5" />
                  <h3 className="text-base sm:text-lg font-medium">Imagem gerada!</h3>
                </div>

                <div 
                  className="relative rounded-xl overflow-hidden border border-white/10 mx-auto transition-all duration-300 flex items-center justify-center bg-black/20"
                >
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] object-contain rounded-xl" 
                  />
                </div>

                {generatedVariants.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground text-center">Toque para selecionar • Baixe uma ou todas</p>
                    <div className="grid grid-cols-3 gap-2">
                      {generatedVariants.map((variant, index) => (
                        <button
                          key={index}
                          onClick={() => selectVariant(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${variant.selected ? 'border-primary ring-2 ring-primary/30' : 'border-white/10 hover:border-white/30'}`}
                        >
                          <img src={variant.url} alt={`Variação ${index + 1}`} className="w-full h-full object-cover" />
                          {variant.selected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Format Selector */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">📐 Formato de exportação:</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {exportFormats.map((fmt) => (
                      <button
                        key={fmt.key}
                        onClick={() => setExportFormat(fmt.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                          exportFormat === fmt.key
                            ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30'
                            : 'bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 text-foreground'
                        }`}
                      >
                        <div
                          className={`rounded-sm border-[1.5px] transition-colors flex-shrink-0 ${
                            exportFormat === fmt.key ? 'border-primary-foreground/70' : 'border-muted-foreground/40'
                          }`}
                          style={{ width: Math.round(fmt.w * 0.7), height: Math.round(fmt.h * 0.7) }}
                        />
                        <span>{fmt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Before/After toggle */}
                {photos[0]?.preview && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      className="w-full text-xs gap-2 rounded-xl"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showBeforeAfter ? 'Ver imagem gerada' : 'Comparar Antes/Depois'}
                    </Button>
                    {showBeforeAfter && (
                      <BeforeAfterSlider
                        beforeImage={photos[0].preview}
                        afterImage={generatedImage}
                        className="aspect-[4/5] w-full"
                      />
                    )}
                  </div>
                )}

                {/* WhatsApp + Name capture */}
                {/* Action Row - HD Download + Save */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadAll}
                    className="relative w-full group overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-primary to-secondary"
                  >
                    <div className="relative flex items-center justify-center gap-3 px-6 py-4 rounded-[15px] bg-background/90 group-hover:bg-background/40 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Download className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-bold">Baixar em Alta Qualidade</span>
                        <span className="block text-[10px] text-muted-foreground">4K Ultra HD • Pronto para imprimir</span>
                      </div>
                    </div>
                  </motion.button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleSaveToProfile}
                      className="rounded-xl border-primary/20 hover:bg-primary/5 h-12 gap-2"
                    >
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="text-xs">Salvar no Perfil</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSupportForm(!showSupportForm)}
                      className="rounded-xl border-border/40 h-12 gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">Preciso de ajuda</span>
                    </Button>
                  </div>
                </div>

                {/* Support Form UI inline */}
                {showSupportForm && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-muted/20 border border-border/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">Abrir chamado de suporte</h4>
                      <X className="w-4 h-4 cursor-pointer" onClick={() => setShowSupportForm(false)} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Se a imagem não ficou como esperado, descreva o problema abaixo.</p>
                    <textarea 
                      placeholder="Descreva o que houve..."
                      className="w-full text-xs p-2 rounded-lg bg-background border border-border/20 min-h-[60px]"
                      id="support-desc"
                    />
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-xs rounded-lg"
                      onClick={async () => {
                        const desc = (document.getElementById('support-desc') as HTMLTextAreaElement)?.value;
                        if (!desc) return;
                        const { error } = await (supabase.from('support_tickets' as any).insert({
                          user_id: user?.id,
                          category: 'image_error',
                          subject: `Erro na imagem: ${prompt.name}`,
                          description: desc,
                          status: 'open'
                        } as any) as any);
                        if (error) toast.error('Erro ao abrir chamado');
                        else {
                          toast.success('Chamado aberto! Nossa equipe analisará.');
                          setShowSupportForm(false);
                        }
                      }}
                    >
                      Enviar para análise
                    </Button>
                  </motion.div>
                )}

                {/* Action buttons - Variation + Edit */}
                <div className="grid grid-cols-2 gap-2">
                  <GlassButton 
                    onClick={generateMoreVariants} 
                    variant="outline" 
                    size="sm" 
                    disabled={isGeneratingMore || generatedVariants.length >= MAX_VARIANTS}
                  >
                    {isGeneratingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <ImagePlus className="w-3.5 h-3.5 mr-1" />}
                    <span className="text-[10px] sm:text-xs">
                      {isGeneratingMore ? 'Gerando...' : `+Variação (${Math.max(0, MAX_VARIANTS - generatedVariants.length)} restantes)`}
                    </span>
                  </GlassButton>
                  <GlassButton 
                    onClick={() => setStep('editing')} 
                    variant="outline" 
                    size="sm"
                    disabled={editCount >= MAX_EDITS}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    <span className="text-[10px] sm:text-xs">
                      {editCount >= MAX_EDITS ? 'Edição usada' : 'Editar (1x)'}
                    </span>
                  </GlassButton>
                </div>

                {/* Share buttons */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground font-medium">📤 Compartilhar:</p>
                  <ShareButtons imageUrl={generatedImage} title={prompt.name} compact />
                </div>

                <p className="text-[10px] text-center text-muted-foreground">
                  2 variações grátis + 1 edição por compra • Sua imagem, seus direitos 💎
                </p>

                <GlassButton onClick={onClose} variant="outline" className="w-full" size="sm">Fechar</GlassButton>
              </motion.div>
            )}

            {step === 'editing' && generatedImage && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 sm:space-y-4">
                <div className="text-center mb-1">
                  <Pencil className="w-7 h-7 text-primary mx-auto mb-1.5" />
                  <h3 className="text-base font-medium">Editar sua imagem</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Descreva o que deseja alterar</p>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mb-2">
                  <p className="text-[10px] text-amber-200/80 leading-tight">
                    ⚠️ <strong>Diretrizes:</strong> Conteúdos inadequados, sexuais ou que violem nossas regras de proteção a menores serão bloqueados automaticamente.
                  </p>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50">
                  <img src={generatedImage} alt="Current" className="w-full h-auto max-h-[35vh] sm:max-h-[40vh] object-contain" />
                </div>
                <textarea
                  value={editInstruction}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditInstruction(val);
                  }}
                  placeholder="Ex: Mude o fundo para uma praia, adicione óculos de sol..."
                  className="w-full min-h-[60px] px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <GlassButton 
                    onClick={() => {
                      if (checkModerationRealtime(editInstruction)) {
                        handleEditImage();
                      }
                    }} 
                    className="flex-1" 
                    disabled={isEditing || !editInstruction.trim()} 
                    size="sm"
                  >
                    {isEditing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Editando...' : 'Aplicar'}
                  </GlassButton>
                  <GlassButton onClick={() => setStep('complete')} variant="outline" size="sm">Voltar</GlassButton>
                </div>
              </motion.div>
            )}
          </GlassCardContent>
        </div>
      </motion.div>
    </motion.div>
  );
};
