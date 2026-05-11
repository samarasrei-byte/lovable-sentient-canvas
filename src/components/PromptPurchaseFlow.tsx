import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X, Upload, User, AtSign, Sparkles, QrCode, Copy, Check, Download,
  Loader2, CheckCircle2, Clock, Pencil, Plus, Trash2,
  RefreshCw, AlertTriangle, ImagePlus, Share2, Eye,
  Smartphone, CreditCard, Camera, Heart, Palette, FileWarning
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { GenerationProgressBar } from "./GenerationProgressBar";
import { StayOnPageCard } from "./StayOnPageCard";
import { ShareButtons } from "./ShareButtons";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { ModerationAppealModal } from "./ModerationAppealModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import heic2any from "heic2any";

// Helper for image compression and safety (Scientist approach)
const processImageForAudit = async (file: File): Promise<File> => {
  // Convert HEIC if needed
  let processedFile = file;
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    try {
      const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 }) as Blob;
      processedFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
    } catch (e) {
      console.error("HEIC conversion failed", e);
      throw new Error("Falha ao converter formato Apple (HEIC). Tente JPG ou PNG.");
    }
  }

  // Basic check for size to avoid crashing browser
  if (processedFile.size > 20 * 1024 * 1024) {
    throw new Error("Imagem muito grande (máximo 20MB).");
  }

  return processedFile;
};

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

type FlowStep = 'details' | 'upload' | 'payment' | 'generating' | 'complete' | 'editing';

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
  const [step, setStep] = useState<FlowStep>(prompt.required_fields.length > 0 ? 'details' : 'upload');
  const [authStep, setAuthStep] = useState<'login' | 'register' | 'done'>('done');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [qualityChecks, setQualityChecks] = useState<{ [key: string]: boolean }>({});
  const [generationError, setGenerationError] = useState<string | null>(null);

  // User-controlled person count (1-5). Initialized from prompt's min_photos.
  const initialPersonCount = Math.min(Math.max(prompt.min_photos || 1, 1), 5);
  const [personCount, setPersonCount] = useState<number>(initialPersonCount);
  const [aiSuggestedPersonCount, setAiSuggestedPersonCount] = useState<number | null>(null);
  const [manualPersonCount, setManualPersonCount] = useState<number | null>(null);
  const maxPhotos = manualPersonCount || aiSuggestedPersonCount || personCount;
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
  const initialPhotoSlots = Math.max(prompt.min_photos || 1, 1);
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

  // Sync photo slots with current target count: trim empty slots when reducing, ensure at least 1.
  useEffect(() => {
    const targetCount = manualPersonCount || aiSuggestedPersonCount || personCount;
    setPhotos((prev) => {
      if (prev.length === targetCount) return prev;
      if (prev.length < targetCount) {
        const toAdd = targetCount - prev.length;
        return [...prev, ...Array.from({ length: toAdd }, () => ({ file: null, preview: '' as string }))];
      }
      // Reducing: keep filled slots first, then drop empties from the end.
      const filled = prev.filter(p => p.file);
      const empties = prev.filter(p => !p.file);
      const kept = [...filled, ...empties].slice(0, targetCount);
      return kept.length > 0 ? kept : [{ file: null, preview: '' }];
    });
    setPhotoProfiles((prev) => {
      if (prev.length === targetCount) return prev;
      if (prev.length < targetCount) {
        return [...prev, ...Array.from({ length: targetCount - prev.length }, () => null)];
      }
      return prev.slice(0, targetCount);
    });
  }, [personCount, aiSuggestedPersonCount, manualPersonCount]);
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

      // AI suggestion: detect number of people in the FIRST uploaded photo
      const detectedPeople = data?.analise?.quantidade_pessoas || data?.metadados?.pessoas;
      if (index === 0 && typeof detectedPeople === 'number' && detectedPeople >= 1) {
        const suggested = Math.min(detectedPeople, 5);
        // Automática inteligente: se for 1 pessoa, trava em 1. Se for mais, permite adicionar.
        setAiSuggestedPersonCount(suggested);
        if (suggested > 1) {
          toast.success(`Detectamos ${suggested} pessoas na foto!`, {
            description: "Você pode adicionar os dados de cada uma agora."
          });
        }
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

  const handlePhotoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    // Reset the input value so re-selecting the same file re-triggers onChange
    if (e.target) e.target.value = '';

    if (!file) return;
    console.log('[Upload] file received', { name: file.name, type: file.type, size: file.size });

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 20MB.');
      return;
    }

    // Detect HEIC/HEIF (iPhone default format) — file.type is often empty on iOS
    const fileName = (file.name || '').toLowerCase();
    const fileExt = fileName.split('.').pop() || '';
    const isHeic =
      fileExt === 'heic' ||
      fileExt === 'heif' ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    // Be permissive: allow if type starts with image/ OR has known image extension OR is HEIC
    const knownExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'bmp'];
    const looksLikeImage =
      (file.type && file.type.startsWith('image/')) ||
      knownExts.includes(fileExt) ||
      isHeic;

    if (!looksLikeImage) {
      toast.error('Formato não suportado. Envie JPG, PNG ou HEIC.');
      return;
    }

    setUploadedPhotoUrls([]);
    setPhotoProfiles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    toast.loading('Processando foto...', { id: `photo-upload-${index}` });
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: 'uploading' };
      return next;
    });

    // Convert HEIC → JPEG (iPhone fix)
    if (isHeic) {
      try {
        toast.loading('Convertendo foto do iPhone (HEIC)...', { id: `photo-upload-${index}` });
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        file = new File([blob], fileName.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg',
        });
        console.log('[Upload] HEIC converted', { newSize: file.size });
      } catch (err) {
        console.error('[Upload] HEIC conversion failed', err);
        toast.error(
          'Não conseguimos converter sua foto HEIC. No iPhone vá em Ajustes → Câmera → Formatos → "Mais Compatível" e tire uma nova foto, ou escolha outra do rolo.',
          { id: `photo-upload-${index}`, duration: 9000 }
        );
        setPhotos((prev) => {
          const next = [...prev];
          next[index] = { file: null, preview: '' };
          return next;
        });
        return;
      }
    }

    // Read file with timeout safety net
    const readAsDataUrl = (f: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        const timer = setTimeout(() => reject(new Error('timeout')), 30000);
        reader.onload = (ev) => {
          clearTimeout(timer);
          resolve(ev.target?.result as string);
        };
        reader.onerror = () => {
          clearTimeout(timer);
          reject(new Error('read-error'));
        };
        reader.readAsDataURL(f);
      });

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => reject(new Error('img-timeout')), 30000);
        img.onload = () => {
          clearTimeout(timer);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timer);
          reject(new Error('img-error'));
        };
        img.src = src;
      });

    try {
      toast.loading("Processando imagem...", { id: `photo-upload-${index}` });
      
      const processedFile = await processImageForAudit(file);
      const dataUrl = await readAsDataUrl(processedFile);
      const img = await loadImage(dataUrl);

      const quality = validatePhotoQuality(img);
      if (!quality.ok) {
        toast.error(quality.warning || 'Foto não aceita.', { id: `photo-upload-${index}` });
        setPhotos((prev) => {
          const next = [...prev];
          next[index] = { file: null, preview: '' };
          return next;
        });
        return;
      }
      if (quality.warning) {
        toast.warning(quality.warning, { id: `photo-upload-${index}`, duration: 5000 });
      } else {
        toast.success('Foto pronta!', { id: `photo-upload-${index}` });
      }

      const canvas = document.createElement('canvas');
      const maxSize = 768;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const preview = canvas.toDataURL('image/jpeg', 0.88);

      setPhotos((prev) => {
        const updated = [...prev];
        updated[index] = { file: processedFile, preview, status: 'analyzing' };
        return updated;
      });

      void analyzeUploadedPhoto(index, preview);
    } catch (err: any) {
      console.error('[Upload] processing failed', err);
      const msg =
        err?.message === 'timeout' || err?.message === 'img-timeout'
          ? 'A foto demorou muito para carregar. Tente uma foto menor.'
          : 'Não foi possível carregar a foto. Tente outra imagem (JPG ou PNG).';
      toast.error(msg, { id: `photo-upload-${index}`, duration: 6000 });
      setPhotos((prev) => {
        const next = [...prev];
        next[index] = { file: null, preview: '' };
        return next;
      });
    }
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

  const handleNextStep = async () => {
    if (step === 'details') {
      if (prompt.required_fields.includes('name') && !formData.name.trim()) {
        toast.error('Por favor, informe seu nome.');
        return;
      }
      if (isBirthdayPrompt && !formData.age?.trim() && !formData.months?.trim()) {
        toast.error('Por favor, informe a idade ou os meses.');
        return;
      }
      if (prompt.required_fields.includes('team_name') && !formData.team_name.trim()) {
        toast.error('Por favor, informe o nome do time.');
        return;
      }
      setStep('upload');
      return;
    }

    if (step === 'upload') {
      // GATE: usuário precisa estar autenticado antes de pagar/gerar
      if (!user) {
        // Pré-preenche email se já digitou
        if (formData.email && !authForm.email) {
          setAuthForm((prev) => ({ ...prev, email: formData.email }));
        }
        setAuthStep('register');
        toast.info('Crie sua conta em 10 segundos para continuar', {
          description: 'Você precisa de uma conta para receber e salvar sua arte 4K.',
        });
        return;
      }
      await handleSubmitForm();
    }
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

    if (activePhotoCount < (manualPersonCount || aiSuggestedPersonCount || personCount)) {
      toast.error(`Envie ${(manualPersonCount || aiSuggestedPersonCount || personCount)} ${(manualPersonCount || aiSuggestedPersonCount || personCount) === 1 ? 'foto' : 'fotos'} (uma para cada pessoa).`);
      return;
    }

    if (isBirthdayPrompt && !formData.age?.trim() && !formData.months?.trim()) {
      toast.error('Por favor, informe a idade ou os meses para o prompt de aniversário.');
      return;
    }

    if (isMesversarioPrompt && !formData.months?.trim()) {
      toast.error('Por favor, informe quantos meses o bebê está fazendo.');
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
      setStep(prompt.required_fields.length > 0 ? 'details' : 'upload');
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

      const { data: signedData, error: signedError } = await supabase.storage
        .from('user-photos')
        .createSignedUrl(uploadData.path, 60 * 60);
      if (signedError || !signedData?.signedUrl) throw new Error(`Falha ao liberar a foto ${i + 1} para a IA`);
      return signedData.signedUrl;
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

  const isChildPrompt = /infantil|bebê|bebe|newborn|criança|crianca|kids|baby|recem|recém/i.test(`${prompt.category || ''} ${prompt.name || ''} ${prompt.prompt_template || ''}`);

  const promptHasAgeToken = /\{\s*(age|idade|months?|meses?)\s*\}|\[\s*(AGE|IDADE|MONTHS?|MESES?)\s*\]|<\s*(age|idade)\s*>/i.test(prompt.prompt_template || '');

  const showAgeMonthsField = prompt.required_fields.includes('age') || isBirthdayPrompt || isMesversarioPrompt || isChildPrompt || promptHasAgeToken;

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

    // Universal: if user picked months, always inject (including birthday/child prompts)
    if (formData.months) {
      template = template
        .replace(/\[MESES\]/g, formData.months)
        .replace(/\{meses\}/g, formData.months)
        .replace(/\{months\}/g, formData.months)
        .replace(/\{age\}/g, `${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}`)
        .replace(/\[IDADE\]/g, `${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}`);
      template += `\n\nIDADE EM MESES — INSTRUÇÃO CRÍTICA: o bebê/criança tem ${formData.months} ${formData.months === '1' ? 'mês' : 'meses'}. Preserve essa fase real de desenvolvimento. Se houver decoração temática, vela, balão, banner ou topper, exiba apenas o número "${formData.months}" como meses. NÃO escreva a palavra "age" na imagem.`;
    }

    // Generic age injection for child/infant prompts that are not birthday-specific
    if (!isBirthdayPrompt && formData.age) {
      template = template
        .replace(/\[IDADE\]/g, `${formData.age} anos`)
        .replace(/\{idade\}/g, `${formData.age} anos`)
        .replace(/\{age\}/g, `${formData.age} anos`);
      template += `\n\nIDADE OBRIGATÓRIA: a pessoa/criança da foto tem ${formData.age} anos. Preserve exatamente essa faixa etária aparente. Se houver texto decorativo de idade, use "${formData.age}". NÃO escreva a palavra "age" na imagem.`;
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
        setGenerationError(null);
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
        setStep(prompt.required_fields.length > 0 ? 'details' : 'upload');
        toast.error('Conteúdo bloqueado por segurança', {
          description: 'A imagem gerada violou nossas diretrizes de segurança. Você pode solicitar uma revisão humana.',
          duration: 15000,
          action: {
            label: 'Contestar',
            onClick: () => setAppealModal({
              isOpen: true,
              type: "generation",
              photoUrl: finalImageUrl,
              reason: "Conteúdo gerado sinalizado como inadequado.",
            })
          }
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
            setStep(prompt.required_fields.length > 0 ? 'details' : 'upload');
            toast.error('Conteúdo bloqueado por segurança', {
              description: 'A imagem gerada violou nossas diretrizes de segurança. Solicite uma revisão se achar que é um erro.',
              duration: 15000,
              action: {
                label: 'Contestar',
                onClick: () => setAppealModal({
                  isOpen: true,
                  type: "generation",
                  photoUrl: finalImageUrl,
                  reason: "Conteúdo gerado sinalizado como inadequado após correção.",
                })
              }
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
      const msg = error instanceof Error ? error.message : 'Erro inesperado na geração.';
      const isFirstAttempt = !!purchaseId && !(window as any).__arcanaRetried?.[purchaseId];

      // Erro persistente: mantém na tela 'generating' com cartão de erro visível + WhatsApp
      if (!isFirstAttempt) {
        setGenerationError(msg);
        toast.error('Não conseguimos gerar sua imagem. Fale com o suporte para resolvermos agora.', { duration: 10000 });
      } else {
        toast.info('Tivemos um problema. Tentando novamente automaticamente…', { duration: 4000 });
      }

      setQaStatus('idle');
      setQaIssues([]);

      // Auto-retry uma vez após 3s se foi a primeira tentativa
      if (isFirstAttempt && purchaseId) {
        (window as any).__arcanaRetried = { ...((window as any).__arcanaRetried || {}), [purchaseId]: true };
        setTimeout(() => {
          generateImage(purchaseId).catch((retryErr) => {
            const retryMsg = retryErr instanceof Error ? retryErr.message : 'Erro persistente na geração.';
            setGenerationError(retryMsg);
          });
        }, 3000);
      }
      // NÃO jogamos o usuário pra trás — preserva pagamento e dados
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
        toast.success('Cadastro realizado! Continuando seu pedido…');
      }
      setAuthStep('done');
      // Se o usuário estava no upload, retoma o fluxo automaticamente
      if (step === 'upload') {
        // pequeno delay pra garantir que session foi setada
        setTimeout(() => { void handleSubmitForm(); }, 300);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro na autenticação');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Dialog open={!!prompt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0A0A0B]/95 backdrop-blur-3xl border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-[32px] sm:rounded-[40px] h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <div className="relative overflow-hidden h-full flex flex-col overscroll-contain">
          {/* Ambient light effects */}
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

          <button 
            onClick={onClose} 
            aria-label="Fechar" 
            className="absolute top-4 right-4 z-[70] p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90 transition-all backdrop-blur-md group/close"
          >
            <X className="w-5 h-5 text-foreground/70 group-hover/close:text-foreground" />
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

          <GlassCardContent className="flex-1 overflow-hidden relative flex flex-col p-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Steps Progress */}
            {step !== 'complete' && (
              <div className="flex items-center justify-between px-6 max-w-lg mx-auto w-full pt-4">
                {(['details', 'upload', 'payment', 'complete'] as const).map((status, index) => {
                  const labels = ['Dados', 'Fotos', 'Pagar', 'Pronto'];
                  const stepOrder = ['details', 'upload', 'payment', 'generating', 'complete'];
                  const currentStepIndex = authStep !== 'done' ? 0 : (step === 'editing' ? 4 : stepOrder.indexOf(step));
                  const isPast = currentStepIndex > index;
                  const isCurrent = (authStep !== 'done' && index === 0) || 
                                   (authStep === 'done' && step === status) || 
                                   (step === 'generating' && status === 'payment') ||
                                   (step === 'editing' && status === 'complete');
                  
                  return (
                    <div key={status} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5 relative group shrink-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-500 border shadow-lg ${
                          isCurrent 
                            ? 'bg-primary text-primary-foreground border-primary shadow-primary/30 scale-110' 
                            : isPast 
                              ? 'bg-primary/20 text-primary border-primary/20' 
                              : 'bg-white/5 text-muted-foreground border-white/10'
                        }`}>
                          {isPast ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight uppercase ${isCurrent ? 'text-primary' : 'text-muted-foreground/50'}`}>
                          {labels[index]}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className="flex-1 px-1 sm:px-2">
                          <div className={`h-[2px] w-full rounded-full transition-all duration-700 ${isPast ? 'bg-primary/30' : 'bg-white/5'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}


            {/* Integrated Auth Flow */}
            {authStep !== 'done' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col h-full max-w-md mx-auto w-full space-y-8 py-8"
              >
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-[28px] bg-primary/20 blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 flex items-center justify-center mx-auto shadow-2xl">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight text-white uppercase">
                      {authStep === 'login' ? 'Bem-vindo' : 'Criar Conta'}
                    </h3>
                    <p className="text-sm text-muted-foreground/60 leading-relaxed">
                      {authStep === 'login' ? 'Acesse para salvar suas artes 4K' : 'Salve suas criações e acompanhe pedidos'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />
                  
                  <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-1">E-mail</Label>
                        <div className="relative group/input">
                          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
                          <Input 
                            type="email" 
                            required
                            value={authForm.email}
                            onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="seu@email.com"
                            className="pl-11 h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/[0.05] transition-all text-base"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-1">Senha</Label>
                        <div className="relative group/input">
                          <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
                          <Input 
                            type="password" 
                            required
                            value={authForm.password}
                            onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="••••••••"
                            className="pl-11 h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/[0.05] transition-all text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <GlassButton disabled={authLoading} type="submit" className="w-full h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 rounded-2xl">
                      {authLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (authStep === 'login' ? 'Acessar agora' : 'Criar minha conta')}
                    </GlassButton>

                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setAuthStep(authStep === 'login' ? 'register' : 'login')}
                        className="text-[11px] font-bold text-muted-foreground/40 hover:text-white transition-all text-center uppercase tracking-widest"
                      >
                        {authStep === 'login' ? 'Não tem conta? Registre-se' : 'Já tem uma conta? Entre'}
                      </button>
                      <p className="text-[10px] text-center text-muted-foreground/40 leading-relaxed">
                        Conta necessária para receber e salvar sua arte em 4K.
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {authStep === 'done' && step === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full max-w-xl mx-auto w-full space-y-8 py-4"
              >
                <div className="space-y-2 text-center">
                  <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {/infantil|bebê|bebe|newborn|criança|crianca|kids|baby|aniversário|aniversario/i.test(`${prompt.category || ''} ${prompt.name || ''}`) ? 'Dados da criança' : 'Seus dados'}
                  </h3>
                  <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
                    Preencha rapidamente para personalizarmos sua arte com perfeição.
                  </p>
                </div>

                <div className="space-y-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl">
                  {/* Name field */}
                  {prompt.required_fields.includes('name') && (
                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-widest font-black text-white/40 ml-1">Nome Completo</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Como aparecerá na arte"
                          className="pl-11 h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/[0.05] transition-all text-base"
                        />
                      </div>
                    </div>
                  )}

                  {/* Age/Months field */}
                  {showAgeMonthsField && (
                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-widest font-black text-white/40 ml-1">
                        {isChildPrompt || isMesversarioPrompt ? 'Idade da criança' : 'Idade'}
                      </Label>
                      <div className={cn("grid gap-4", (isChildPrompt || isMesversarioPrompt) ? "grid-cols-2" : "grid-cols-1")}>
                        <div className="relative group">
                          <Input
                            value={formData.age}
                            onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value.replace(/\D/g, ''), months: '' }))}
                            placeholder="Anos"
                            className="h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/[0.05] transition-all text-center text-lg font-bold"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-white/20">Anos</span>
                        </div>
                        {(isChildPrompt || isMesversarioPrompt) && (
                          <div className="relative group">
                            <Input
                              value={formData.months}
                              onChange={(e) => setFormData((prev) => ({ ...prev, months: e.target.value.replace(/\D/g, ''), age: '' }))}
                              placeholder="Meses"
                              className="h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/[0.05] transition-all text-center text-lg font-bold"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-white/20">Meses</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Other fields... (Instagram, etc) */}
                  {prompt.required_fields.includes('instagram') && (
                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-widest font-black text-white/40 ml-1">Instagram (Opcional)</Label>
                      <div className="relative group">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input
                          value={formData.instagram}
                          onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                          placeholder="@seuusuario"
                          className="pl-11 h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/[0.05] transition-all text-base"
                        />
                      </div>
                    </div>
                  )}

                  <GlassButton 
                    onClick={handleNextStep}
                    className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group"
                  >
                    <span className="flex items-center gap-2 group-hover:gap-4 transition-all">
                      Continuar para Fotos
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </span>
                  </GlassButton>
                </div>
              </motion.div>
            )}

            {authStep === 'done' && step === 'upload' && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full space-y-6 py-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                      <Camera className="w-6 h-6 text-primary" />
                      Escolha suas fotos
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground/60">
                      Quanto melhor a iluminação, mais parecida será a IA.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setStep('details')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/60 hover:text-white"
                  >
                    <Pencil className="w-3 h-3" />
                    Editar Dados
                  </button>
                </div>

                {/* Hero Upload Area */}
                <div className="flex-1 min-h-0 space-y-4">
                  {photos.map((photo, index) => {
                    const isHero = index === 0;
                    if (isHero) {
                      return (
                        <div key={index} className="relative">
                          {/* Gradient border wrapper */}
                          <div className="relative rounded-[28px] p-[1.5px] bg-gradient-to-br from-primary/70 via-primary/20 to-cyan-400/70">
                            <div className="relative rounded-[26px] bg-[#0F0B17] overflow-hidden">
                              {/* subtle grid background */}
                              <div
                                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                                style={{
                                  backgroundImage:
                                    'linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)',
                                  backgroundSize: '24px 24px',
                                }}
                              />
                              <input
                                type="file"
                                ref={el => fileInputRefs.current[index] = el}
                                onChange={(e) => handlePhotoUpload(index, e)}
                                accept="image/*"
                                className="hidden"
                              />

                              {photo.preview ? (
                                <div className="relative w-full aspect-square max-h-[60vh]">
                                  <img src={photo.preview} alt="Sua melhor foto" className="w-full h-full object-contain" />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const nextPhotos = [...photos];
                                      nextPhotos[index] = { file: null, preview: '' };
                                      setPhotos(nextPhotos);
                                    }}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  {analyzingPhotoSlots.includes(index) && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                      <p className="text-xs font-black uppercase tracking-widest text-primary">Analisando traços...</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="relative px-6 py-8 sm:py-10 flex flex-col items-center text-center">
                                  {/* Camera icon with green dot */}
                                  <div className="relative mb-5">
                                    <div className="w-[88px] h-[88px] rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6)]">
                                      <Camera className="w-10 h-10 text-primary" strokeWidth={1.75} />
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 ring-4 ring-[#0F0B17] shadow-[0_0_12px_hsl(142_76%_50%/0.8)]" />
                                  </div>

                                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                                    Sua melhor foto
                                  </h3>
                                  <p className="text-sm text-white/55 leading-relaxed max-w-[300px] mb-5">
                                    Rosto visível, boa iluminação, de frente.
                                    Quanto melhor a foto, mais parecido fica!
                                  </p>

                                  {/* Checklist */}
                                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-7">
                                    <span className="text-xs font-semibold text-primary/90 flex items-center gap-1.5">
                                      <span className="text-green-400">✅</span> Rosto de frente
                                    </span>
                                    <span className="text-xs font-semibold text-primary/90 flex items-center gap-1.5">
                                      <span className="text-green-400">✅</span> Boa luz
                                    </span>
                                    <span className="text-xs font-semibold text-primary/90 flex items-center gap-1.5">
                                      <span className="text-green-400">✅</span> Sem óculos escuros
                                    </span>
                                  </div>

                                  {/* Gradient CTA */}
                                  <button
                                    onClick={() => fileInputRefs.current[index]?.click()}
                                    className="w-full max-w-[340px] h-14 rounded-2xl font-black text-white text-base tracking-tight flex items-center justify-center gap-3 bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#22D3EE] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.7)] hover:shadow-[0_14px_40px_-10px_rgba(139,92,246,0.9)] active:scale-[0.99] transition-all"
                                  >
                                    <Upload className="w-5 h-5" />
                                    Escolher foto
                                  </button>

                                  {/* Format info */}
                                  <div className="flex items-center justify-center gap-5 mt-5 text-[11px] font-medium text-white/40">
                                    <span className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400/80" />
                                      JPG, PNG, HEIC
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400/80" />
                                      Até 20MB
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Additional photo slots (consistent style, smaller)
                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative group aspect-[4/5] rounded-[24px] overflow-hidden border-2 transition-all duration-500",
                          photo.file ? "border-primary/40 bg-[#0A0A0B]" : "border-white/10 bg-white/[0.02] border-dashed hover:border-primary/30"
                        )}
                      >
                        {photo.preview ? (
                          <div className="relative w-full h-full">
                            <img src={photo.preview} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextPhotos = [...photos];
                                nextPhotos[index] = { file: null, preview: '' };
                                setPhotos(nextPhotos);
                              }}
                              className="absolute top-2 right-2 p-2 rounded-full bg-red-500/30 text-white hover:bg-red-500 backdrop-blur-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Badge className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-md border-none">{getPhotoLabel(index)}</Badge>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6"
                          >
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[index] = el}
                              onChange={(e) => handlePhotoUpload(index, e)}
                              accept="image/*"
                              className="hidden"
                            />
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                              <ImagePlus className="w-7 h-7 text-primary/70" />
                            </div>
                            <p className="text-sm font-bold text-white/70">{getPhotoLabel(index)}</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1 font-black">Toque para enviar</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-[#0A0A0B] to-transparent">
                  <GlassButton 
                    onClick={handleSubmitForm}
                    disabled={activePhotoCount < (manualPersonCount || aiSuggestedPersonCount || personCount)}
                    className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group disabled:opacity-50 disabled:grayscale"
                  >
                    <span className="flex items-center gap-2 group-hover:gap-4 transition-all">
                      {activePhotoCount < (manualPersonCount || aiSuggestedPersonCount || personCount) 
                        ? `Envie mais ${ (manualPersonCount || aiSuggestedPersonCount || personCount) - activePhotoCount} fotos`
                        : `Finalizar e Pagar (${formatPrice(prompt.price_cents)})`
                      }
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </span>
                  </GlassButton>
                  <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-3 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Pagamento 100% Seguro via PIX
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col h-full max-w-md mx-auto w-full space-y-6 py-4"
              >
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
                        Estamos criando algo incrível...
                      </h3>
                      <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
                        Sua obra de arte premium está sendo processada por nossa IA. ✨
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
                                onClick={() => window.open(`https://wa.me/5511985214895?text=Erro%20no%20pagamento.%20ID:%20${purchaseId?.slice(0, 8)}`, '_blank')}
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
                          setStep(prompt.required_fields.length > 0 ? 'details' : 'upload');
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col h-full max-w-lg mx-auto w-full space-y-8 py-4"
              >
                
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

                {/* ERROR CARD (visível, com WhatsApp + Retry) */}
                {generationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-destructive/30 bg-destructive/5 backdrop-blur-xl p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-destructive/15 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-destructive">Tivemos um problema na geração</h4>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed break-words">
                          {generationError}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 leading-relaxed pt-1">
                          Seu pagamento está seguro. Podemos reprocessar agora ou nosso suporte resolve em minutos.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGenerationError(null);
                          if (purchaseId) {
                            (window as any).__arcanaRetried = { ...((window as any).__arcanaRetried || {}), [purchaseId]: false };
                            void generateImage(purchaseId);
                          }
                        }}
                        className="w-full h-12"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Tentar novamente
                      </GlassButton>
                      <button
                        onClick={() => window.open(`https://wa.me/5511985214895?text=${encodeURIComponent(`Olá! Tive problema na geração da minha foto Arcana. ID do pedido: ${purchaseId || 'N/A'}. Erro: ${generationError}`)}`, '_blank')}
                        className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#25D366]/20"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Falar no WhatsApp
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Progress bar component */}
                {!generationError && (
                  <GenerationProgressBar 
                    isGenerating={step === 'generating'} 
                    qaStatus={qaStatus} 
                    photoCount={activePhotoCount || 1} 
                  />
                )}

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
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col h-full max-w-2xl mx-auto w-full space-y-4 py-4"
              >
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

                  <div className="flex flex-col gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleSaveToProfile}
                      className="w-full rounded-2xl border-primary/20 hover:bg-primary/5 h-14 gap-3 text-sm font-bold"
                    >
                      <Heart className="w-5 h-5 text-primary fill-primary/10" />
                      Salvar imagem no meu Perfil
                    </Button>
                  </div>
                </div>


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

                <div className="flex gap-2">
                  <GlassButton onClick={onClose} variant="outline" className="flex-1" size="sm">Fechar</GlassButton>
                  <GlassButton 
                    onClick={() => { setStep(prompt.required_fields.length > 0 ? 'details' : 'upload'); setGeneratedImage(null); setGeneratedVariants([]); }} 
                    className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border-primary/20" 
                    size="sm"
                  >
                    Gerar mais variações
                  </GlassButton>
                </div>
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
            </div>
          </GlassCardContent>
        </div>
      </DialogContent>

      <ModerationAppealModal
        isOpen={appealModal.isOpen}
        onClose={() => setAppealModal(prev => ({ ...prev, isOpen: false }))}
        type={appealModal.type}
        photoUrl={appealModal.photoUrl}
        reason={appealModal.reason}
        purchaseId={purchaseId || undefined}
      />
    </Dialog>
  );
};

// Data Science Audit: Effect to clean up blobs on unmount
const useBlobCleanup = (photos: any[]) => {
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.preview && photo.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, []);
};
