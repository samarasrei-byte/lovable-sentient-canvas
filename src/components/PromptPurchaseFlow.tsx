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
  Smartphone, CreditCard, Camera
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { GenerationProgressBar } from "./GenerationProgressBar";
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
  const maxPhotos = prompt.min_photos && prompt.min_photos > 1 ? Math.min(prompt.min_photos, 5) : 5;
  const [formData, setFormData] = useState({ name: '', instagram: '', email: '', description: '', age: '', displayName: '', months: '', telefone: '', whatsapp: '', endereco: '', data: '', hora: '', extras: '', team_name: '' });
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
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const paymentPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
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
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappSaved, setWhatsappSaved] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

      setPhotoProfiles((prev) => {
        const next = [...prev];
        next[index] = data
          ? {
              ageGroup: data.ageGroup || 'adulto',
              presentation: data.presentation || 'indefinida',
              suggestedCategory: data.suggestedCategory,
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

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 20MB.');
      return;
    }

    setUploadedPhotoUrls([]);
    setPhotoProfiles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 512;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const preview = canvas.toDataURL('image/jpeg', 0.85);

        setPhotos((prev) => {
          const updated = [...prev];
          updated[index] = { file, preview };
          return updated;
        });

        void analyzeUploadedPhoto(index, preview);
      };
      img.src = event.target?.result as string;
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
        void initMercadoPagoPayment(newPurchaseId);
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
        const { data, error } = await supabase.functions.invoke('verify-mercadopago-payment', {
          body: { purchaseId: pId },
        });

        if (!error && data?.paid) {
          if (paymentPollRef.current) clearInterval(paymentPollRef.current);
          setVerifyingPayment(false);
          setPaymentStatus('paid');
          toast.success('Pagamento confirmado!');
          setTimeout(() => {
            setStep('generating');
            void generateImage(pId);
          }, 1500);
        }
      } catch (e) {
        console.error('Payment verification poll error:', e);
      }
    }, 4000);
  };

  const initMercadoPagoPayment = async (pId: string) => {
    setPixLoading(true);
    setPixError(null);
    try {
      const { data, error } = await supabase.functions.invoke('create-mercadopago-payment', {
        body: {
          purchaseId: pId,
          priceCents: prompt.price_cents,
          customerEmail: formData.email || undefined,
          customerName: formData.name || undefined,
          paymentMethod: 'pix',
        },
      });

      if (error) throw error;

      if (data?.status === 'approved') {
        setPaymentStatus('paid');
        toast.success('Pagamento aprovado!');
        setTimeout(() => {
          setStep('generating');
          void generateImage(pId);
        }, 1000);
        return;
      }

      if (data?.pixCopiaECola) {
        setPixData({
          copiaECola: data.pixCopiaECola,
          qrCodeUrl: data.qrCodeBase64 ? `data:image/png;base64,${data.qrCodeBase64}` : '',
          expiresAt: data.expiresAt ? new Date(data.expiresAt).getTime() / 1000 : Date.now() / 1000 + 1800,
        });
        startPaymentPolling(pId);
      } else {
        setPixError('Não foi possível gerar o QR Code PIX. Tente novamente.');
      }
    } catch (err) {
      console.error('Mercado Pago payment error:', err);
      setPixError('Erro ao gerar pagamento. Tente novamente.');
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


  const uploadPhotos = async (effectivePurchaseId: string): Promise<string[]> => {
    const urls: string[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo.file) continue;

      const fileExt = photo.file.name.split('.').pop();
      const filePath = `purchases/${effectivePurchaseId}-photo${i + 1}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, photo.file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('user-photos').getPublicUrl(uploadData.path);
      if (!urlData.publicUrl) throw new Error(`Falha ao obter URL da foto ${i + 1}`);

      urls.push(urlData.publicUrl);
    }

    return urls;
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

  const needsContactInfo = prompt.required_fields.includes('telefone') || prompt.required_fields.includes('whatsapp') || 
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
      ...restOverrides
    } = overrides as Record<string, unknown> & {
      promptTemplate?: string;
      exampleImageUrl?: string | null;
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

    // Ages
    if (formData.age) flyerContext.idades = [formData.age];

    // Contact info
    if (formData.telefone) flyerContext.telefone = formData.telefone;
    if (formData.whatsapp) flyerContext.whatsapp = formData.whatsapp;
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
      ...restOverrides,
      promptTemplate: template,
    };
  };

  const runQAValidation = async (imageUrl: string, referenceImageUrls: string[]): Promise<{ passed: boolean; issues: string[] }> => {
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

      return { passed: data.passed ?? true, issues: data.issues ?? [] };
    } catch (error) {
      console.error('QA validation failed:', error);
      return { passed: true, issues: [] };
    }
  };

  const generateImage = async (overridePurchaseId?: string) => {
    try {
      const effectivePurchaseId = overridePurchaseId || purchaseId;
      if (!effectivePurchaseId) throw new Error('Compra não iniciada corretamente');

      const referencePhotoUrls = await ensureUploadedPhotoUrls(effectivePurchaseId);
      if (prompt.required_fields.includes('photo') && referencePhotoUrls.length === 0) {
        throw new Error('Nenhuma foto de referência válida foi enviada');
      }

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
        }
      }

      if (!qa.passed) {
        // QA warns but does NOT block — show issues as warning, deliver the image anyway
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
      toast.error(error instanceof Error ? error.message : 'Erro na geração. Tente novamente.');
      setQaStatus('idle');
      setQaIssues([]);
      setStep('form');
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

      setGeneratedImage(data.imageUrl);
      setGeneratedVariants((prev) => prev.map((variant, index) => ({ ...variant, selected: index === 0 })));
      setEditInstruction('');
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

  const handleDownload = async (url?: string) => {
    const imageUrl = url || generatedImage;
    if (!imageUrl) return;

    const selectedFormat = exportFormats.find(f => f.key === exportFormat);
    
    // Helper: fallback direct download
    const fallbackDownload = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      toast.success('Download iniciado!');
    };

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
    if (!whatsappSaved) {
      toast.error('Deixe seu WhatsApp para baixar a imagem!');
      return;
    }
    const selected = generatedVariants.filter((variant) => variant.selected);
    if (selected.length === 0) {
      handleDownload();
      return;
    }

    selected.forEach((variant, index) => {
      setTimeout(() => handleDownload(variant.url), index * 500);
    });
  };

  const handleSaveWhatsapp = async () => {
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.length < 10) {
      toast.error('Digite um número de WhatsApp válido');
      return;
    }
    try {
      if (purchaseId) {
        await supabase
          .from('prompt_purchases')
          .update({ custom_fields: { whatsapp: cleaned } } as any)
          .eq('id', purchaseId);
      }
      setWhatsappSaved(true);
      toast.success('WhatsApp salvo! Agora você pode baixar sua imagem 🎉');
    } catch {
      setWhatsappSaved(true);
    }
  };

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
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
        className="w-full h-full sm:h-auto sm:max-w-lg sm:px-4 sm:py-4"
      >
        <div className="relative overflow-hidden h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto overscroll-contain sm:rounded-xl border border-white/[0.06] bg-[hsl(var(--background))] sm:bg-white/[0.02] sm:backdrop-blur-md">
          <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <GlassCardHeader className="pb-3">
            <div className="flex items-center gap-3 pr-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <GlassCardTitle className="text-base sm:text-lg leading-tight">{prompt.name}</GlassCardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{prompt.category}</p>
              </div>
            </div>
            <Badge className="absolute top-5 right-12 bg-primary text-primary-foreground text-xs">
              {formatPrice(prompt.price_cents)}
            </Badge>
          </GlassCardHeader>

          <GlassCardContent className="space-y-4 sm:space-y-6">
            {/* Progress steps */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
              {(['form', 'payment', 'generating', 'complete'] as const).map((status, index) => {
                const labels = ['Dados', 'Pagar', 'Gerar', 'Pronto'];
                const stepOrder = ['form', 'payment', 'generating', 'complete'];
                const currentStepIndex = step === 'editing' ? 3 : stepOrder.indexOf(step);
                const isActive = currentStepIndex >= index;
                const isCurrent = (step === status) || (step === 'editing' && status === 'complete');
                return (
                  <div key={status} className="flex items-center">
                    <div className={`flex items-center gap-0.5 sm:gap-1 ${isCurrent ? 'text-primary' : ''}`}>
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : isActive
                              ? 'bg-primary/20 text-primary'
                              : 'bg-white/10'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-[9px] sm:text-xs">{labels[index]}</span>
                    </div>
                    {index < 3 && <div className="flex-1 h-px bg-white/10 mx-1 sm:mx-2 w-3 sm:w-8" />}
                  </div>
                );
              })}
            </div>

            {step === 'form' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {prompt.required_fields.includes('photo') && (
                  <div className="space-y-3">
                    {/* Upload lead/instruction */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <Camera className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">
                            {isCouplePrompt ? 'Envie as fotos do casal' : isFamilyPrompt ? 'Envie as fotos da família' : 'Envie uma foto nítida do rosto'}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isCouplePrompt
                              ? 'Uma foto de cada pessoa. A IA vai unir os dois na composição.'
                              : isFamilyPrompt
                                ? 'Uma foto separada de cada membro da família.'
                                : 'Foto de frente, boa iluminação e rosto visível. A IA preserva cada detalhe.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs sm:text-sm flex items-center gap-2">
                        <ImagePlus className="w-4 h-4 text-primary" />
                        {isCouplePrompt
                          ? `Fotos do Casal (${activePhotoCount}/${prompt.min_photos || 2})`
                          : isFamilyPrompt 
                            ? `Fotos da Família (${activePhotoCount}/${maxPhotos})`
                            : isMultiPersonPrompt
                              ? `Fotos das Pessoas (${activePhotoCount}/${prompt.min_photos || 2})`
                              : activePhotoCount > 0 
                                ? `${activePhotoCount} foto${activePhotoCount > 1 ? 's' : ''} enviada${activePhotoCount > 1 ? 's' : ''}` 
                                : 'Suas fotos'}
                      </Label>
                      {photos.length < maxPhotos && !isMultiPersonPrompt && (
                        <button onClick={addPhotoSlot} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isFamilyPrompt ? 'Adicionar familiar' : 'Adicionar pessoa'}</span>
                          <span className="sm:hidden">{isFamilyPrompt ? '+Familiar' : '+Pessoa'}</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {photos.map((photo, index) => {
                        const photoProfile = photoProfiles[index];
                        const isAnalyzing = analyzingPhotoSlots.includes(index);
                        const slotLabel = getPhotoLabel(index);

                        return (
                          <div key={index} className="relative group space-y-1.5">
                            <div
                              onClick={() => fileInputRefs.current[index]?.click()}
                              className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden aspect-[3/4] ${
                                photo.preview 
                                  ? 'border-primary/30 bg-black/20' 
                                  : 'border-white/20 hover:border-primary/50 bg-gradient-to-br from-white/[0.03] to-white/[0.01]'
                              }`}
                            >
                              {photo.preview ? (
                                <img src={photo.preview} alt={slotLabel} className="w-full h-full object-contain" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground p-3">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-primary/60" />
                                  </div>
                                  <span className="text-[10px] sm:text-xs text-center font-medium text-muted-foreground/70">{slotLabel}</span>
                                  <span className="text-[9px] text-muted-foreground/40">Toque para enviar</span>
                                </div>
                              )}
                              {photo.preview && (
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                                  <span className="text-[9px] text-white font-medium">{slotLabel}</span>
                                </div>
                              )}
                            </div>

                            {photos.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePhotoSlot(index);
                                }}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}

                            <input
                              ref={(el) => {
                                fileInputRefs.current[index] = el;
                              }}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(index, e)}
                              className="hidden"
                            />

                            <div className="min-h-10 flex flex-wrap gap-1">
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
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center">
                      {isFamilyPrompt 
                        ? `Envie de 2 a ${maxPhotos} fotos · Uma foto por membro da família`
                        : `Envie de 1 a ${maxPhotos} fotos · Cada foto = uma pessoa na imagem`}
                    </p>
                  </div>
                )}

                {/* Name field */}
                {prompt.required_fields.includes('name') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Seu nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Como você quer ser chamado"
                        className="pl-10 bg-white/5 border-white/10 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Display name for image text - shown when prompt has text in image */}
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

                {/* Mesversário months selector */}
                {isMesversarioPrompt && (
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      👶 Quantos meses o bebê está fazendo?
                    </Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <button
                          key={month}
                          onClick={() => setFormData((prev) => ({ ...prev, months: String(month) }))}
                          className={`p-2 rounded-lg text-sm font-medium transition-all ${
                            formData.months === String(month)
                              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                              : 'bg-white/5 border border-white/10 hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {month} {month === 1 ? 'mês' : 'meses'}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      O número será exibido na imagem como decoração (balão, vela, banner, etc).
                    </p>
                  </div>
                )}

                {/* Birthday age input with visual preview */}
                {isBirthdayPrompt && (
                  <div className="space-y-3">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      🎂 Qual idade vai aparecer na imagem?
                    </Label>
                    
                    {/* Visual number preview */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                          {formData.age ? (
                            <motion.span
                              key={formData.age}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent"
                            >
                              {formData.age}
                            </motion.span>
                          ) : (
                            <span className="text-3xl opacity-30">?</span>
                          )}
                        </div>
                        {formData.age && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                            🎂
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <Input
                          value={formData.age}
                          onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value.replace(/\D/g, '') }))}
                          placeholder="Ex: 30"
                          className="bg-white/5 border-white/10 text-lg font-bold text-center"
                          maxLength={3}
                          type="text"
                          inputMode="numeric"
                        />
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          Este número aparecerá no bolo, velas, balões ou decoração da imagem — exatamente como você digitar.
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick age buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {[1, 2, 3, 5, 10, 15, 18, 21, 25, 30, 40, 50].map((age) => (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, age: String(age) }))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            formData.age === String(age)
                              ? 'bg-primary text-primary-foreground scale-105'
                              : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                          }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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

                    {(prompt.required_fields.includes('whatsapp') || isEventPrompt) && (
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">💬 WhatsApp</Label>
                        <Input
                          value={formData.whatsapp}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
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
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="py-8 text-center space-y-4"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-500">Pagamento Confirmado!</h3>
                      <p className="text-xs text-muted-foreground mt-1">Sua imagem será gerada agora...</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Iniciando geração...</span>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Price summary */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(prompt.price_cents)}</span>
                    </div>

                    {/* Payment method tabs */}
                    <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                      <button
                        onClick={() => setPaymentTab('pix')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-medium transition-all ${
                          paymentTab === 'pix'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        PIX (Instantâneo)
                      </button>
                      <button
                        onClick={() => setPaymentTab('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-medium transition-all ${
                          paymentTab === 'card'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Cartão
                      </button>
                    </div>

                    {/* PIX Tab */}
                    {paymentTab === 'pix' && (
                      <div className="space-y-3">
                        {pixLoading ? (
                          <div className="py-8 flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">Gerando QR Code PIX...</p>
                          </div>
                        ) : pixError ? (
                          <div className="py-6 text-center space-y-3">
                            <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500" />
                            <p className="text-xs text-muted-foreground">PIX indisponível no momento. Use cartão de crédito.</p>
                            <Button size="sm" variant="outline" onClick={() => setPaymentTab('card')}>
                              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                              Pagar com Cartão
                            </Button>
                          </div>
                        ) : pixData ? (
                          <>
                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-3">
                              <div className="bg-white p-3 rounded-xl shadow-lg">
                                {pixData.qrCodeUrl ? (
                                  <img 
                                    src={pixData.qrCodeUrl} 
                                    alt="QR Code PIX" 
                                    className="w-48 h-48 sm:w-56 sm:h-56"
                                  />
                                ) : (
                                  <QRCodeSVG value={pixData.copiaECola} size={224} />
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground text-center">
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

                    {/* Card Tab */}
                    {paymentTab === 'card' && (
                      <div className="space-y-3">
                        {stripeCheckoutUrl ? (
                          <GlassButton
                            onClick={() => window.open(stripeCheckoutUrl, '_blank')}
                            className="w-full"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pagar com Cartão via Stripe
                          </GlassButton>
                        ) : pixLoading ? (
                          <div className="py-6 flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">Preparando pagamento...</p>
                          </div>
                        ) : (
                          <div className="py-6 text-center">
                            <p className="text-xs text-muted-foreground">Cartão indisponível. Tente PIX.</p>
                          </div>
                        )}
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
                          {verifyingPayment ? 'Aguardando confirmação do pagamento...' : 'Pagamento Seguro via Stripe'}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Após a confirmação do pagamento, sua imagem será gerada automaticamente.
                      </p>
                    </div>

                    {verifyingPayment && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">Verificando pagamento no Stripe...</span>
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-6 sm:py-8 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" style={{ animationDuration: '1.2s' }} />
                  <div className="absolute inset-2 rounded-full bg-white/[0.03] backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-semibold mb-1">
                  {qaStatus === 'checking' ? 'Validando qualidade...' : qaStatus === 'fixing' ? 'Corrigindo automaticamente...' : 'Gerando sua imagem...'}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {qaStatus === 'fixing'
                    ? 'Problemas detectados, gerando versão corrigida...'
                    : `A IA está ${activePhotoCount > 1 ? `processando ${activePhotoCount} fotos` : 'criando sua arte'}.`}
                </p>

                <GenerationProgressBar 
                  isGenerating={step === 'generating'} 
                  qaStatus={qaStatus} 
                  photoCount={activePhotoCount || 1} 
                />

                {qaIssues.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-left">
                    <div className="flex items-center gap-1.5 text-secondary text-xs font-medium mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />Corrigindo:
                    </div>
                    {qaIssues.map((issue, index) => (
                      <p key={index} className="text-[10px] text-muted-foreground">• {issue}</p>
                    ))}
                  </div>
                )}

                <GlassButton onClick={() => { setStep('generating'); void generateImage(purchaseId || undefined); }} variant="outline" className="mt-2" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />Tentar novamente
                </GlassButton>

                <div className="mt-5 p-3 sm:p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs sm:text-sm font-semibold text-primary">Plano Mensal</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium mb-1">
                    <span className="text-primary font-bold">6 fotos/mês</span> por apenas
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-primary mb-2">R$ 100<span className="text-[10px] text-muted-foreground font-normal">/mês</span></p>
                  <GlassButton onClick={() => window.open('/app/planos', '_blank')} className="w-full text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" />Quero assinar
                  </GlassButton>
                </div>
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

                {/* WhatsApp capture */}
                {!whatsappSaved ? (
                  <div className="space-y-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span>Deixe seu WhatsApp para baixar</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Fique por dentro das novidades e promoções do Arcana! 🚀
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                        className="flex-1 text-sm bg-background/50"
                        maxLength={16}
                      />
                      <GlassButton onClick={handleSaveWhatsapp} size="sm" disabled={whatsapp.replace(/\D/g, '').length < 10}>
                        <Check className="w-3.5 h-3.5 mr-1" />
                        OK
                      </GlassButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-primary p-2 rounded-lg bg-primary/5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WhatsApp salvo! Obrigado 💚</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <GlassButton onClick={handleDownloadAll} className="col-span-1" size="sm" disabled={!whatsappSaved}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    <span className="text-[10px] sm:text-xs">Baixar</span>
                  </GlassButton>
                  <GlassButton onClick={() => setStep('editing')} variant="outline" size="sm">
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    <span className="text-[10px] sm:text-xs">Editar</span>
                  </GlassButton>
                  <GlassButton onClick={generateMoreVariants} variant="outline" size="sm" disabled={isGeneratingMore || generatedVariants.length >= MAX_VARIANTS}>
                    {isGeneratingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <ImagePlus className="w-3.5 h-3.5 mr-1" />}
                    <span className="text-[10px] sm:text-xs">{isGeneratingMore ? '...' : '+Variação'}</span>
                  </GlassButton>
                </div>

                {/* Share buttons */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground font-medium">📤 Compartilhar:</p>
                  <ShareButtons imageUrl={generatedImage} title={prompt.name} compact />
                </div>

                <p className="text-[10px] text-center text-muted-foreground">
                  Até {MAX_VARIANTS} versões por compra para manter qualidade e custo sob controle
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
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50">
                  <img src={generatedImage} alt="Current" className="w-full h-auto max-h-[35vh] sm:max-h-[40vh] object-contain" />
                </div>
                <textarea
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  placeholder="Ex: Mude o fundo para uma praia, adicione óculos de sol..."
                  className="w-full min-h-[60px] px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <GlassButton onClick={handleEditImage} className="flex-1" disabled={isEditing || !editInstruction.trim()} size="sm">
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
