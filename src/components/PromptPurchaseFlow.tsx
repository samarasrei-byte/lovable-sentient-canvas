import { useState, useRef, useEffect } from "react";
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
  RefreshCw, AlertTriangle, ImagePlus, Share2, MessageCircle, Eye
} from "lucide-react";
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
  const [formData, setFormData] = useState({ name: '', instagram: '', email: '', description: '', age: '', displayName: '', months: '' });
  const isFamilyInit = /família|familia|family/i.test(prompt.category || '') || /família|familia|family/i.test(prompt.name || '');
  const initialPhotoSlots = isFamilyInit ? Math.max(prompt.min_photos || 2, 2) : 1;
  const [photos, setPhotos] = useState<PhotoSlot[]>(Array.from({ length: initialPhotoSlots }, () => ({ file: null, preview: '' })));
  const [photoProfiles, setPhotoProfiles] = useState<(PhotoProfile | null)[]>(Array.from({ length: initialPhotoSlots }, () => null));
  const [analyzingPhotoSlots, setAnalyzingPhotoSlots] = useState<number[]>([]);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'paid'>('pending');
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [qaStatus, setQaStatus] = useState<'idle' | 'checking' | 'passed' | 'fixing'>('idle');
  const [qaIssues, setQaIssues] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('original');
  const [generationCount, setGenerationCount] = useState(0);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    if (isFamilyPrompt && activePhotoCount < 2) {
      toast.error('Para fotos de família, envie pelo menos 2 fotos (uma de cada membro).');
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

    if (prompt.required_fields.includes('name') && !formData.name.trim()) {
      toast.error('Por favor, informe seu nome.');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-prompt-purchase', {
        body: { promptId: prompt.id, userName: formData.name, userInstagram: formData.instagram, userEmail: formData.email },
      });

      if (error) throw error;
      if (!data?.purchaseId) throw new Error('Compra não criada corretamente');

      setPurchaseId(data.purchaseId);
      setStep('payment');
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error('Erro ao processar. Tente novamente.');
    }
  };

  const pixCode = `00020126580014br.gov.bcb.pix0136${purchaseId?.slice(0, 32) || 'arcana-prompt-marketplace'}5204000053039865406${(prompt.price_cents / 100).toFixed(2)}5802BR5925ARCANA MARKETPLACE LTDA6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const simulatePayment = async () => {
    setPaymentStatus('checking');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPaymentStatus('paid');
    toast.success('Pagamento confirmado!');
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

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('user-photos').getPublicUrl(uploadData.path);
      if (!urlData.publicUrl) throw new Error(`Falha ao obter URL da foto ${i + 1}`);

      urls.push(urlData.publicUrl);
    }

    return urls;
  };

  const ensureUploadedPhotoUrls = async (): Promise<string[]> => {
    if (!prompt.required_fields.includes('photo')) return [];
    if (uploadedPhotoUrls.length > 0) return uploadedPhotoUrls;

    const urls = await uploadPhotos();
    setUploadedPhotoUrls(urls);
    return urls;
  };

  // Sort photos by age group: adults first, then children/babies (matching typical prompt layout)
  const sortPhotosByAge = (urls: string[]): string[] => {
    if (urls.length <= 1) return urls;
    
    const indexed = urls.map((url, i) => ({ url, profile: photoProfiles[i] }));
    const adults = indexed.filter(p => !p.profile || p.profile.ageGroup === 'adulto' || p.profile.ageGroup === 'adolescente');
    const children = indexed.filter(p => p.profile && (p.profile.ageGroup === 'crianca' || p.profile.ageGroup === 'bebe'));
    
    return [...adults, ...children].map(p => p.url);
  };

  const isBirthdayPrompt = /aniversário|aniversario|birthday/i.test(prompt.category || '') || 
    /aniversário|aniversario|birthday/i.test(prompt.name || '');

  const isFamilyPrompt = /família|familia|family/i.test(prompt.category || '') || 
    /família|familia|family/i.test(prompt.name || '');

  const isMesversarioPrompt = /mêsversário|mesversário|mesversario/i.test(prompt.category || '') || 
    /mêsversário|mesversário|mesversario/i.test(prompt.name || '');

  const hasNameInImage = /nome|name|\[NAME\]|\{nome\}/i.test(prompt.prompt_template || '') ||
    prompt.required_fields.includes('name');

  const familyPhotoLabels = ['Pai/Mãe', 'Filho(a) 1', 'Filho(a) 2', 'Filho(a) 3', 'Outro familiar'];

  const buildGenerationBody = (referencePhotoUrls: string[], overrides: Record<string, unknown> = {}) => {
    const sortedUrls = sortPhotosByAge(referencePhotoUrls);
    
    // Build age/position context from rich analysis
    const photoContextLines: string[] = [];
    sortedUrls.forEach((_, i) => {
      const profile = photoProfiles[i];
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

    let template = prompt.prompt_template || '';

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
      template += `\n\nIDADE OBRIGATÓRIA: A pessoa tem ${formData.age} anos. Exiba "${formData.age}" como idade/vela/número na imagem. NÃO use outra idade.`;
    }

    // Inject month for mesversário
    if (isMesversarioPrompt && formData.months) {
      template = template
        .replace(/\[MESES\]/g, formData.months)
        .replace(/\{meses\}/g, formData.months);
      template += `\n\nMESES DO BEBÊ: O bebê tem ${formData.months} meses. Exiba o número "${formData.months}" como decoração/tema na imagem (vela, balão, banner, etc). NÃO use outro número.`;
    }

    // Inject display name for prompts with text in image
    const nameForImage = formData.displayName || formData.name;
    if (hasNameInImage && nameForImage) {
      template = template
        .replace(/\[NOME\]/g, nameForImage)
        .replace(/\[NAME\]/g, nameForImage)
        .replace(/\{nome\}/g, nameForImage)
        .replace(/\{name\}/g, nameForImage);
      template += `\n\nNOME NA IMAGEM: Escreva EXATAMENTE "${nameForImage}" na imagem onde houver texto decorativo, banner, placa ou similar. Grafia EXATA, sem alterações.`;
    }

    // Family context
    if (isFamilyPrompt && sortedUrls.length > 1) {
      const familyContext = sortedUrls.map((_, i) => {
        const label = familyPhotoLabels[i] || `Pessoa ${i + 1}`;
        const profile = photoProfiles[i];
        const ageInfo = profile?.metadados?.idade_detectada ? ` (~${profile.metadados.idade_detectada} anos)` : '';
        return `Foto ${i + 1} = ${label}${ageInfo}`;
      }).join('\n');
      template += `\n\nCOMPOSIÇÃO FAMILIAR:\n${familyContext}\nMostre TODAS as pessoas juntas em um retrato familiar harmonioso. Cada pessoa DEVE ser reconhecível pela foto de referência correspondente.`;
    }

    if (photoContextLines.length > 0) {
      template += `\n\nDETALHES DAS PESSOAS E ELEMENTOS DETECTADOS:\n${photoContextLines.join('\n')}\nPosicione cada pessoa de acordo com sua faixa etária e gênero detectados.`;
    }

    return {
      purchaseId,
      promptTemplate: template,
      negativePrompt: prompt.negative_prompt,
      aiModel: prompt.ai_model,
      userName: formData.name,
      userInstagram: formData.instagram,
      userDescription: formData.description,
      userPhotoUrl: sortedUrls[0] || null,
      userPhotoUrls: sortedUrls.length > 0 ? sortedUrls : undefined,
      exampleImageUrl: prompt.example_image_url,
      ...overrides,
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

  const generateImage = async () => {
    try {
      if (!purchaseId) throw new Error('Compra não iniciada corretamente');

      const referencePhotoUrls = await ensureUploadedPhotoUrls();
      if (prompt.required_fields.includes('photo') && referencePhotoUrls.length === 0) {
        throw new Error('Nenhuma foto de referência válida foi enviada');
      }

      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: buildGenerationBody(referencePhotoUrls),
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

      setGeneratedImage(finalImageUrl);
      setGeneratedVariants([{ url: finalImageUrl, selected: true }]);
      setQaStatus('passed');
      setQaIssues(qa.passed ? [] : qa.issues);

      if (!qa.passed) {
        toast.warning('A auditoria encontrou pontos de atenção; revise a versão final antes de baixar.');
      }

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
      const referencePhotoUrls = await ensureUploadedPhotoUrls();
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

      setGeneratedVariants((prev) => [...prev, { url: finalVariantUrl, selected: false }]);
      setQaStatus('passed');
      setQaIssues([]);
      toast.success('Nova variação gerada!');

      if (!qa.passed) {
        toast.warning('Essa variação passou por correção automática; revise antes de baixar.');
      }
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
    { key: 'original', label: 'Original', icon: '📐', ratio: null },
    { key: '1:1', label: 'Feed 1:1', icon: '⬜', ratio: 1 },
    { key: '4:5', label: 'Post 4:5', icon: '📱', ratio: 4 / 5 },
    { key: '9:16', label: 'Stories', icon: '📲', ratio: 9 / 16 },
    { key: '16:9', label: 'Cover', icon: '🖥️', ratio: 16 / 9 },
    { key: '3:4', label: 'Retrato', icon: '🖼️', ratio: 3 / 4 },
  ];

  const handleDownload = (url?: string) => {
    const imageUrl = url || generatedImage;
    if (!imageUrl) return;

    const selectedFormat = exportFormats.find(f => f.key === exportFormat);
    if (!selectedFormat?.ratio) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      toast.success('Download iniciado!');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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

      canvas.width = Math.min(sw, 2048);
      canvas.height = Math.min(sh, 2048);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}-${exportFormat}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success(`Download ${selectedFormat.label} iniciado!`);
      }, 'image/png');
    };
    img.onerror = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `arcana-${prompt.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg my-2 sm:my-4"
      >
        <GlassCard className="relative overflow-hidden max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <GlassCardHeader className="pb-3">
            <div className="flex items-center gap-3 pr-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <GlassCardTitle className="text-base sm:text-lg truncate">{prompt.name}</GlassCardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{prompt.category}</p>
              </div>
            </div>
            <Badge className="absolute top-5 right-12 bg-primary text-primary-foreground text-xs">
              {formatPrice(prompt.price_cents)}
            </Badge>
          </GlassCardHeader>

          <GlassCardContent className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
              {['form', 'payment', 'generating', 'complete'].map((status, index) => (
                <div key={status} className="flex items-center">
                  <div className={`flex items-center gap-0.5 sm:gap-1 ${step === status || (step === 'editing' && status === 'complete') ? 'text-primary' : ''}`}>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium ${
                        step === status || (step === 'editing' && status === 'complete')
                          ? 'bg-primary text-primary-foreground'
                          : ['form', 'payment', 'generating', 'complete'].indexOf(step === 'editing' ? 'complete' : step) > index
                            ? 'bg-primary/20 text-primary'
                            : 'bg-white/10'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="hidden sm:inline">{['Dados', 'PIX', 'Gerar', 'Pronto'][index]}</span>
                  </div>
                  {index < 3 && <div className="flex-1 h-px bg-white/10 mx-1 sm:mx-2 w-3 sm:w-8" />}
                </div>
              ))}
            </div>

            {step === 'form' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {prompt.required_fields.includes('photo') && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs sm:text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {isFamilyPrompt 
                          ? `Fotos da Família (${activePhotoCount} de ${maxPhotos})`
                          : activePhotoCount > 0 
                            ? `Fotos (${activePhotoCount} enviada${activePhotoCount > 1 ? 's' : ''})` 
                            : 'Suas fotos'}
                      </Label>
                      {photos.length < maxPhotos && (
                        <button onClick={addPhotoSlot} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isFamilyPrompt ? 'Adicionar familiar' : 'Adicionar pessoa'}</span>
                          <span className="sm:hidden">{isFamilyPrompt ? '+Familiar' : '+Pessoa'}</span>
                        </button>
                      )}
                    </div>

                    {isFamilyPrompt && (
                      <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-[10px] sm:text-xs text-primary">
                          👨‍👩‍👧‍👦 Envie uma foto separada de cada membro da família. A IA vai unir todos em uma composição familiar.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {photos.map((photo, index) => {
                        const photoProfile = photoProfiles[index];
                        const isAnalyzing = analyzingPhotoSlots.includes(index);
                        const slotLabel = isFamilyPrompt 
                          ? (familyPhotoLabels[index] || `Pessoa ${index + 1}`) 
                          : `Pessoa ${index + 1}`;

                        return (
                          <div key={index} className="relative group space-y-1.5">
                            <div
                              onClick={() => fileInputRefs.current[index]?.click()}
                              className="relative rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden aspect-square"
                            >
                              {photo.preview ? (
                                <img src={photo.preview} alt={slotLabel} className="w-full h-full object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
                                  <Upload className="w-5 h-5" />
                                  <span className="text-[9px] sm:text-[10px] text-center px-1">{slotLabel}</span>
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

                    <div className="space-y-1 text-center">
                      <p className="text-[10px] text-muted-foreground">
                        {isFamilyPrompt 
                          ? `Envie de 2 a ${maxPhotos} fotos • Uma foto por membro da família`
                          : `Envie de 1 a ${maxPhotos} fotos • Cada foto = uma pessoa na imagem`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">A auditoria compara a imagem final com a referência antes de liberar o resultado</p>
                    </div>
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

                {/* Birthday age input */}
                {isBirthdayPrompt && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm flex items-center gap-2">
                      🎂 Idade para a imagem
                    </Label>
                    <Input
                      value={formData.age}
                      onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value.replace(/\D/g, '') }))}
                      placeholder="Ex: 28"
                      className="bg-white/5 border-white/10 text-sm"
                      maxLength={3}
                      type="text"
                      inputMode="numeric"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      A idade informada será usada na imagem, independente da referência.
                    </p>
                  </div>
                )}

                <GlassButton onClick={handleSubmitForm} className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar imagem — {formatPrice(prompt.price_cents)}
                </GlassButton>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">Escaneie o QR Code ou copie o código PIX</p>
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white rounded-xl p-3 mb-3">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-white" />
                    </div>
                    {paymentStatus === 'paid' && (
                      <div className="absolute inset-0 bg-primary/90 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-14 h-14 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input value={pixCode.slice(0, 40) + '...'} readOnly className="pr-12 text-xs bg-white/5 border-white/10" />
                    <button onClick={handleCopyPix} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded transition-colors">
                      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <div className="mt-3 p-2.5 rounded-lg bg-white/5 border border-white/10">
                    {paymentStatus === 'pending' && <div className="flex items-center justify-center gap-2 text-secondary"><Clock className="w-4 h-4" /><span className="text-sm">Aguardando pagamento...</span></div>}
                    {paymentStatus === 'checking' && <div className="flex items-center justify-center gap-2 text-primary"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Verificando...</span></div>}
                    {paymentStatus === 'paid' && <div className="flex items-center justify-center gap-2 text-primary"><CheckCircle2 className="w-4 h-4" /><span className="text-sm">Pagamento confirmado!</span></div>}
                  </div>
                  {paymentStatus === 'pending' && (
                    <GlassButton onClick={simulatePayment} className="w-full mt-3" variant="outline">
                      <Check className="w-4 h-4 mr-2" />Simular Pagamento (Demo)
                    </GlassButton>
                  )}
                </div>
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

                <GlassButton onClick={() => { setStep('generating'); void generateImage(); }} variant="outline" className="mt-2" size="sm">
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
                  <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-1.5" />
                  <h3 className="text-base sm:text-lg font-medium">Imagem gerada!</h3>
                </div>

                <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10">
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
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
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {exportFormats.map((fmt) => (
                      <button
                        key={fmt.key}
                        onClick={() => setExportFormat(fmt.key)}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] font-medium transition-all ${
                          exportFormat === fmt.key
                            ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30'
                            : 'bg-white/5 border border-white/10 hover:border-primary/50 text-foreground'
                        }`}
                      >
                        <span className="text-sm">{fmt.icon}</span>
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

                <div className="grid grid-cols-3 gap-2">
                  <GlassButton onClick={handleDownloadAll} className="col-span-1" size="sm">
                    <Download className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Baixar</span>
                  </GlassButton>
                  <GlassButton onClick={() => setStep('editing')} variant="outline" size="sm">
                    <Pencil className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Editar</span>
                  </GlassButton>
                  <GlassButton onClick={generateMoreVariants} variant="outline" size="sm" disabled={isGeneratingMore || generatedVariants.length >= MAX_VARIANTS}>
                    {isGeneratingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5 sm:mr-1.5" />}
                    <span className="hidden sm:inline">{isGeneratingMore ? '...' : '+Variação'}</span>
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
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <img src={generatedImage} alt="Current" className="w-full h-full object-contain bg-black/50" />
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
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
