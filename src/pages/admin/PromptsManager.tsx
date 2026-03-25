import { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PromptFromScreenshot } from "@/components/admin/PromptFromScreenshot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Wand2,
  Eye,
  Upload,
  X,
  Zap,
  Crop,
  Camera,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Pin,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ImageCropModal } from "@/components/admin/ImageCropModal";

interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
  hype_text: string;
  example_image_url: string | null;
  prompt_template: string;
  price_cents: number;
  status: string;
  is_influencer_prompt: boolean;
  influencer_name: string | null;
  required_fields: string[];
  negative_prompt: string | null;
  ai_model: string;
  min_photos: number;
  created_at: string;
  display_order: number;
  is_featured: boolean;
}

// Auto-detect categories and settings from prompt text
const analyzePrompt = (promptText: string): Partial<Prompt> => {
  const lowerPrompt = promptText.toLowerCase();
  
  // Detect category
  let category = "Geral";
  if (lowerPrompt.includes("cyberpunk") || lowerPrompt.includes("neon") || lowerPrompt.includes("futuristic")) category = "Cyberpunk";
  else if (lowerPrompt.includes("anime") || lowerPrompt.includes("manga")) category = "Anime";
  else if (lowerPrompt.includes("fashion") || lowerPrompt.includes("vogue") || lowerPrompt.includes("editorial")) category = "Fashion";
  else if (lowerPrompt.includes("instagram") || lowerPrompt.includes("influencer") || lowerPrompt.includes("social")) category = "Social Media";
  else if (lowerPrompt.includes("vintage") || lowerPrompt.includes("retro")) category = "Vintage";
  else if (lowerPrompt.includes("fitness") || lowerPrompt.includes("gym") || lowerPrompt.includes("athletic")) category = "Fitness";
  else if (lowerPrompt.includes("art") || lowerPrompt.includes("painting") || lowerPrompt.includes("artistic")) category = "Arte";
  else if (lowerPrompt.includes("professional") || lowerPrompt.includes("business") || lowerPrompt.includes("corporate")) category = "Profissional";
  
  // Detect required fields from variables in prompt
  const requiredFields: string[] = ["photo"];
  if (promptText.includes("{name}") || promptText.includes("[NOME]") || lowerPrompt.includes("name")) requiredFields.push("name");
  if (promptText.includes("{instagram}") || promptText.includes("[INSTAGRAM]") || lowerPrompt.includes("@")) requiredFields.push("instagram");
  if (promptText.includes("{description}") || promptText.includes("[DESCRIÇÃO]")) requiredFields.push("description");
  
  // Generate name from first few words or key concept
  let name = "";
  const concepts = ["cyberpunk", "anime", "fashion", "vintage", "neon", "instagram", "viral", "portrait", "avatar", "profile"];
  for (const concept of concepts) {
    if (lowerPrompt.includes(concept)) {
      name = concept.charAt(0).toUpperCase() + concept.slice(1) + " Style";
      break;
    }
  }
  if (!name) name = "Custom Prompt";
  
  // Generate hype text
  const hypeTexts = ["🔥 +500k gerações", "⚡ Trending", "💎 Premium", "🚀 Viral", "✨ Top Creator"];
  const hypeText = hypeTexts[Math.floor(Math.random() * hypeTexts.length)];
  
  // Generate description
  const description = `Transforme sua foto com estilo ${category.toLowerCase()}. Resultado profissional em segundos.`;
  
  return {
    name,
    category,
    description,
    hype_text: hypeText,
    required_fields: requiredFields,
    price_cents: 2100,
    status: "active",
    ai_model: "gemini-2.5-flash-image",
    min_photos: 1,
  };
};

// Live Preview Card Component
const LivePreviewCard = ({ prompt, imageUrl }: { prompt: Partial<Prompt>; imageUrl: string | null }) => {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
        <AnimatePresence mode="wait">
          {imageUrl ? (
            <motion.img
              key={imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <ImageIcon className="w-12 h-12 text-muted-foreground/40 mb-2" />
              <span className="text-xs text-muted-foreground">Anexe uma imagem</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <AnimatePresence>
          {prompt.category && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-3 left-3"
            >
              <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs px-2 py-0.5">
                {prompt.category}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Status Badge */}
        <AnimatePresence>
          {prompt.status && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute top-3 right-3"
            >
              <Badge 
                className={`border-0 text-xs px-2 py-0.5 ${
                  prompt.status === 'active' 
                    ? 'bg-green-500/90 text-white' 
                    : prompt.status === 'coming_soon'
                    ? 'bg-secondary/90 text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {prompt.status === 'active' ? 'Ativo' : prompt.status === 'coming_soon' ? 'Em Breve' : 'Inativo'}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Price Badge - Bottom */}
        <div className="absolute bottom-3 right-3">
          <motion.div
            key={prompt.price_cents}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30"
          >
            <Zap className="w-3.5 h-3.5" />
            {formatPrice(prompt.price_cents || 2100)}
          </motion.div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        <AnimatePresence mode="wait">
          <motion.h3
            key={prompt.name || "placeholder"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="font-semibold text-foreground text-base truncate"
          >
            {prompt.name || "Nome do prompt..."}
          </motion.h3>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={prompt.hype_text || "hype"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-primary font-medium"
          >
            {prompt.hype_text || "🔥 Hype text..."}
          </motion.p>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={prompt.description?.slice(0, 20) || "desc"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground line-clamp-2"
          >
            {prompt.description || "Descrição aparecerá aqui..."}
          </motion.p>
        </AnimatePresence>
        
        {/* Required Fields */}
        <div className="flex flex-wrap gap-1 pt-2">
          {(prompt.required_fields || ["photo"]).map((field) => (
            <Badge key={field} variant="outline" className="text-[10px] px-1.5 py-0">
              {field === "photo" ? "📷 Foto" : field === "name" ? "✏️ Nome" : field === "instagram" ? "📱 @" : field}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Category presets with default prices
const CATEGORY_PRESETS: Record<string, { label: string; defaultPrice: number; icon: string }> = {
  "Geral": { label: "Geral", defaultPrice: 2100, icon: "✨" },
  "Fashion": { label: "Fashion", defaultPrice: 2100, icon: "👗" },
  "Cyberpunk": { label: "Cyberpunk", defaultPrice: 2100, icon: "⚡" },
  "Anime": { label: "Anime", defaultPrice: 2100, icon: "🎌" },
  "Arte": { label: "Arte", defaultPrice: 2100, icon: "🎨" },
  "Social Media": { label: "Social Media", defaultPrice: 2100, icon: "📱" },
  "LinkedIn": { label: "LinkedIn", defaultPrice: 2100, icon: "💼" },
  "Profissional": { label: "Profissional", defaultPrice: 7000, icon: "📸" },
  "Corporativo": { label: "Corporativo", defaultPrice: 7000, icon: "🏢" },
  "Família": { label: "Família", defaultPrice: 5800, icon: "👨‍👩‍👧‍👦" },
  "Mêsversário": { label: "Mêsversário", defaultPrice: 5800, icon: "👶" },
  "Mêsversário & Aniversário": { label: "Mêsversário & Aniversário", defaultPrice: 5800, icon: "🎂" },
  "Fotografia Profissional": { label: "Fotografia Profissional", defaultPrice: 7000, icon: "📷" },
  "Hypando": { label: "Hypando", defaultPrice: 2100, icon: "🔥" },
};

const PromptsManager = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [draggedPromptId, setDraggedPromptId] = useState<string | null>(null);
  const [dragOverPromptId, setDragOverPromptId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group prompts by category
  const groupedPrompts = prompts.reduce((acc, prompt) => {
    const cat = prompt.category || "Geral";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prompt);
    return acc;
  }, {} as Record<string, Prompt[]>);

  const filteredPrompts = activeCategory === "all" 
    ? prompts 
    : prompts.filter(p => p.category === activeCategory);

  const categories = Object.keys(groupedPrompts);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const parsed = (data || []).map((p: any) => ({
        ...p,
        required_fields: Array.isArray(p.required_fields) ? p.required_fields : JSON.parse(p.required_fields || '[]')
      }));
      
      setPrompts(parsed);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast.error("Erro ao carregar prompts");
    } finally {
      setLoading(false);
    }
  };

  const processFile = useCallback(async (file: File, skipCrop = false) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 20MB");
      return;
    }

    // If not skipping crop, open crop modal
    if (!skipCrop) {
      setFileToCrop(file);
      setCropModalOpen(true);
      return;
    }

    setUploading(true);

    try {
      // Create local preview (não revogar aqui; revogamos ao substituir/remover)
      const nextPreview = URL.createObjectURL(file);
      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextPreview;
      });

      // Generate unique filename (with safe fallbacks)
      const extFromName = file.name.includes(".") ? file.name.split(".").pop() : null;
      const extFromType = file.type.includes("/") ? file.type.split("/")[1] : null;
      const fileExt = (extFromName || extFromType || "jpg").replace("jpeg", "jpg");

      const uuid =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const fileName = `${uuid}.${fileExt}`;
      const filePath = `prompts/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("prompt-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("prompt-images")
        .getPublicUrl(filePath);

      setEditingPrompt((prev) =>
        prev
          ? {
              ...prev,
              example_image_url: urlData.publicUrl,
            }
          : null
      );

      toast.success("✅ Imagem enviada com sucesso!");
    } catch (error: any) {
      console.error("Upload error:", error);
      const msg =
        typeof error?.message === "string" && error.message
          ? error.message
          : "Erro ao enviar imagem. Tente novamente.";
      toast.error(msg);
      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleCropComplete = useCallback((croppedFile: File) => {
    setCropModalOpen(false);
    setFileToCrop(null);
    processFile(croppedFile, true); // Skip crop since already cropped
  }, [processFile]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  // Clipboard paste handler (Ctrl+V) — anexado diretamente no modal/zona de upload
  const handlePaste = useCallback(
    (e: any) => {
      const items = e?.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type?.startsWith("image/")) {
          e.preventDefault?.();
          const file = items[i].getAsFile?.();
          if (file) {
            toast.info("📋 Imagem detectada do clipboard!");
            processFile(file);
          }
          break;
        }
      }
    },
    [processFile]
  );

  const handleRemoveImage = () => {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setEditingPrompt((prev) =>
      prev
        ? {
            ...prev,
            example_image_url: null,
          }
        : null
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePromptChange = (promptText: string) => {
    if (!editingPrompt) return;
    
    // Auto-analyze when prompt is long enough
    if (promptText.length > 50 && !editingPrompt.id) {
      const analyzed = analyzePrompt(promptText);
      setEditingPrompt({
        ...editingPrompt,
        prompt_template: promptText,
        ...(!editingPrompt.name && { name: analyzed.name }),
        ...(!editingPrompt.category && { category: analyzed.category }),
        ...(!editingPrompt.description && { description: analyzed.description }),
        ...(!editingPrompt.hype_text && { hype_text: analyzed.hype_text }),
        required_fields: analyzed.required_fields,
      });
    } else {
      setEditingPrompt({ ...editingPrompt, prompt_template: promptText });
    }
  };

  const handleSave = async () => {
    if (!editingPrompt?.prompt_template) {
      toast.error("Cole o prompt primeiro");
      return;
    }

    if (!editingPrompt?.example_image_url?.trim()) {
      toast.error("⚠️ Foto de exemplo é OBRIGATÓRIA");
      return;
    }

    // Auto-fill missing fields
    const analyzed = analyzePrompt(editingPrompt.prompt_template);
    
    setSaving(true);
    try {
      const promptData = {
        name: editingPrompt.name || analyzed.name || "Novo Prompt",
        description: editingPrompt.description || analyzed.description || "",
        category: editingPrompt.category || analyzed.category || "Geral",
        hype_text: editingPrompt.hype_text || analyzed.hype_text || "🔥 Novo",
        example_image_url: editingPrompt.example_image_url,
        prompt_template: editingPrompt.prompt_template,
        price_cents: editingPrompt.price_cents || 2100,
        status: editingPrompt.status || "active",
        is_influencer_prompt: false,
        influencer_name: null,
        required_fields: editingPrompt.required_fields || analyzed.required_fields || ["photo", "name"],
        negative_prompt: editingPrompt.negative_prompt || null,
        ai_model: editingPrompt.ai_model || "gemini-2.5-flash-image",
        min_photos: editingPrompt.min_photos || 1,
      };

      if (editingPrompt.id) {
        const { data: result, error } = await supabase.functions.invoke("manage-prompt", {
          body: { action: "update", promptId: editingPrompt.id, promptData }
        });
        if (error) throw error;
        if (result?.error) throw new Error(result.error);
        toast.success("Prompt atualizado!");
      } else {
        const { data: result, error } = await supabase.functions.invoke("manage-prompt", {
          body: { action: "insert", promptData }
        });
        if (error) throw error;
        if (result?.error) throw new Error(result.error);
        toast.success("Prompt criado com sucesso!");
      }

      setIsDialogOpen(false);
      setEditingPrompt(null);
      setShowAdvanced(false);
      setImagePreview(null);
      fetchPrompts();
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Erro ao salvar prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: result, error } = await supabase.functions.invoke("manage-prompt", {
        body: { action: "delete", promptId: id }
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      toast.success("Prompt excluído!");
      setDeleteConfirmId(null);
      fetchPrompts();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Erro ao excluir prompt");
    }
  };

  const sortPromptsByOrder = (items: Prompt[]) => {
    return [...items].sort((a, b) => {
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const buildUpdatedPromptOrder = (reorderedVisiblePrompts: Prompt[]) => {
    const availableOrders = [...filteredPrompts]
      .map((prompt) => prompt.display_order)
      .sort((a, b) => a - b);

    const reorderedWithDisplayOrder = reorderedVisiblePrompts.map((prompt, index) => ({
      ...prompt,
      display_order: availableOrders[index] ?? prompt.display_order,
    }));

    const updatedPromptMap = new Map(
      reorderedWithDisplayOrder.map((prompt) => [prompt.id, prompt])
    );

    return sortPromptsByOrder(
      prompts.map((prompt) => updatedPromptMap.get(prompt.id) ?? prompt)
    );
  };

  const persistPromptOrder = async (updatedPrompts: Prompt[]) => {
    const previousPrompts = prompts;
    const changedPrompts = updatedPrompts.filter((prompt) => {
      const existingPrompt = previousPrompts.find((item) => item.id === prompt.id);
      return existingPrompt && existingPrompt.display_order !== prompt.display_order;
    });

    if (changedPrompts.length === 0) return;

    setPrompts(updatedPrompts);
    setReordering(true);

    try {
      const results = await Promise.all(
        changedPrompts.map((prompt) =>
          supabase.functions.invoke("manage-prompt", {
            body: {
              action: "update",
              promptId: prompt.id,
              promptData: { display_order: prompt.display_order },
            },
          })
        )
      );

      const failedRequest = results.find((result: any) => result.error || result.data?.error);
      if (failedRequest?.error) throw failedRequest.error;
      if (failedRequest?.data?.error) throw new Error(failedRequest.data.error);

      toast.success("Ordem atualizada!");
    } catch (error) {
      console.error("Error reordering:", error);
      setPrompts(previousPrompts);
      toast.error("Erro ao reordenar");
      fetchPrompts();
    } finally {
      setReordering(false);
    }
  };

  const handleReorder = async (promptId: string, direction: 'up' | 'down') => {
    const currentIndex = filteredPrompts.findIndex((prompt) => prompt.id === promptId);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filteredPrompts.length) return;

    const reorderedVisiblePrompts = [...filteredPrompts];
    const [movedPrompt] = reorderedVisiblePrompts.splice(currentIndex, 1);
    reorderedVisiblePrompts.splice(targetIndex, 0, movedPrompt);

    await persistPromptOrder(buildUpdatedPromptOrder(reorderedVisiblePrompts));
  };

  const handlePromptDragStart = (event: React.DragEvent<HTMLButtonElement>, promptId: string) => {
    setDraggedPromptId(promptId);
    setDragOverPromptId(promptId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", promptId);
  };

  const handlePromptDragOver = (event: React.DragEvent<HTMLTableRowElement>, promptId: string) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (draggedPromptId && draggedPromptId !== promptId) {
      setDragOverPromptId(promptId);
    }
  };

  const handlePromptDragEnter = (promptId: string) => {
    if (draggedPromptId && draggedPromptId !== promptId) {
      setDragOverPromptId(promptId);
    }
  };

  const handlePromptDragEnd = () => {
    setDraggedPromptId(null);
    setDragOverPromptId(null);
  };

  const handlePromptDrop = async (event: React.DragEvent<HTMLTableRowElement>, targetPromptId: string) => {
    event.preventDefault();

    const sourcePromptId = draggedPromptId || event.dataTransfer.getData("text/plain");
    if (!sourcePromptId || sourcePromptId === targetPromptId) {
      handlePromptDragEnd();
      return;
    }

    const sourceIndex = filteredPrompts.findIndex((prompt) => prompt.id === sourcePromptId);
    const targetIndex = filteredPrompts.findIndex((prompt) => prompt.id === targetPromptId);

    if (sourceIndex < 0 || targetIndex < 0) {
      handlePromptDragEnd();
      return;
    }

    const reorderedVisiblePrompts = [...filteredPrompts];
    const [movedPrompt] = reorderedVisiblePrompts.splice(sourceIndex, 1);
    reorderedVisiblePrompts.splice(targetIndex, 0, movedPrompt);

    handlePromptDragEnd();
    await persistPromptOrder(buildUpdatedPromptOrder(reorderedVisiblePrompts));
  };

  const handleAnalyzePhoto = async () => {
    const imageUrl = editingPrompt?.example_image_url;
    if (!imageUrl) {
      toast.error("Anexe uma foto primeiro");
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-person-photo", {
        body: { imageUrl },
      });

      if (error) throw error;

      // Map analysis to prompt fields
      const categoryMap: Record<string, string> = {
        aniversario: "Mêsversário & Aniversário",
        linkedin: "LinkedIn",
        profissional: "Profissional",
        corporativo: "Corporativo",
        familia: "Família",
        individual: "Geral",
        casal: "Geral",
        pet: "Geral",
        social: "Social Media",
      };

      const suggestedCatMap: Record<string, string> = {
        mesversario: "Mêsversário",
        infantil: "Mêsversário & Aniversário",
        retrato_pessoal: "Geral",
        linkedin_profissional: "LinkedIn",
        aniversario: "Mêsversário & Aniversário",
        familia: "Família",
        casal: "Geral",
      };

      const detectedCategory = suggestedCatMap[data?.suggestedCategory] || categoryMap[data?.categoria] || "Geral";
      
      // Build a smart title from the analysis
      const contextLabels: Record<string, string> = {
        aniversario: "Aniversário",
        profissional: "Profissional",
        familia: "Família",
        casal: "Casal",
        individual: "Retrato",
        social: "Social",
        pet: "Pet",
      };
      const contextLabel = contextLabels[data?.analise?.contexto] || "Retrato";
      const genderLabel = data?.presentation === "feminina" ? "Feminino" : data?.presentation === "masculina" ? "Masculino" : "";
      const autoTitle = `${contextLabel} ${genderLabel} ${detectedCategory !== "Geral" ? "- " + detectedCategory : ""}`.trim();

      // Build description from prompt_gerado
      const autoDesc = data?.prompt_gerado
        ? data.prompt_gerado.slice(0, 200) + (data.prompt_gerado.length > 200 ? "..." : "")
        : data?.summary || "";

      setEditingPrompt((prev) =>
        prev
          ? {
              ...prev,
              name: prev.name && prev.name !== "Custom Prompt" ? prev.name : autoTitle,
              category: detectedCategory,
              description: prev.description || autoDesc,
              price_cents: CATEGORY_PRESETS[detectedCategory]?.defaultPrice || prev.price_cents || 2100,
            }
          : null
      );

      toast.success(`✅ Análise concluída! Categoria: ${detectedCategory}`);
    } catch (error) {
      console.error("Error analyzing photo:", error);
      toast.error("Erro ao analisar foto com IA");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleToggleFeatured = async (prompt: Prompt) => {
    try {
      const newFeatured = !prompt.is_featured;
      const updateData: any = { is_featured: newFeatured };
      
      // When starring, also set category to Hypando
      if (newFeatured) {
        updateData.category = "Hypando";
      }

      const { error } = await supabase.functions.invoke("manage-prompt", {
        body: { action: "update", promptId: prompt.id, promptData: updateData },
      });

      if (error) throw error;

      toast.success(newFeatured ? "🔥 Prompt movido para Hypando!" : "Prompt removido dos destaques");
      fetchPrompts();
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Erro ao alterar destaque");
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Ativo</Badge>;
      case 'coming_soon':
        return <Badge className="bg-secondary/20 text-secondary border-secondary/30">Em Breve</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inativo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const openNewPrompt = (category?: string) => {
    const preset = category ? CATEGORY_PRESETS[category] : undefined;
    setEditingPrompt({
      prompt_template: "",
      example_image_url: "",
      category: category || "",
      price_cents: preset?.defaultPrice || 2100,
      status: "active",
      required_fields: ["photo", "name"],
      ai_model: "gemini-2.5-flash-image",
      min_photos: 1,
    });
    setShowAdvanced(false);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const openEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowAdvanced(true);
    setImagePreview(prompt.example_image_url);
    setIsDialogOpen(true);
  };

  const displayImage = imagePreview || editingPrompt?.example_image_url;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Prompts</h1>
          <p className="text-muted-foreground">Anexe a foto + cole o prompt e a IA preenche o resto</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setScreenshotModalOpen(true)} className="gap-2">
            <Camera className="w-4 h-4" />
            Print → Prompt
          </Button>
          <GlassButton variant="neon" onClick={() => openNewPrompt()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Prompt
          </GlassButton>
        </div>
      </div>
      {/* Dialog com Preview em Tempo Real */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-5xl max-h-[90vh] overflow-y-auto"
          onPaste={handlePaste}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              {editingPrompt?.id ? "Editar Prompt" : "Novo Prompt — Modo Rápido"}
            </DialogTitle>
          </DialogHeader>
          
          {editingPrompt && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 py-4">
              {/* Form - 3 columns */}
              <div className="lg:col-span-3 space-y-6">
                {/* Step 1: Foto de Exemplo - UPLOAD */}
                <div className="space-y-3 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <Label className="text-base font-semibold">1. Anexar Foto de Exemplo *</Label>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Upload area with drag & drop */}
                  {!displayImage ? (
                    <div 
                      tabIndex={0}
                      role="button"
                      onClick={() => fileInputRef.current?.click()}
                      onPaste={handlePaste}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                        isDragOver 
                          ? 'border-primary bg-primary/10 scale-[1.02]' 
                          : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">Enviando imagem...</p>
                        </>
                      ) : isDragOver ? (
                        <>
                          <Upload className="w-10 h-10 text-primary animate-bounce" />
                          <p className="text-sm text-primary font-medium">Solte a imagem aqui!</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground text-center">
                            <span className="font-medium text-primary">Clique para anexar</span> ou arraste a imagem
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG até 5MB</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={displayImage} 
                          alt="Preview" 
                          className="w-24 h-24 object-cover rounded-lg border-2 border-primary/30"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Trocar imagem
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => {
                            // Re-crop from existing URL - would need original file
                            toast.info("Para recortar, troque a imagem e use o recorte no upload");
                          }}
                        >
                          <Crop className="w-3 h-3" />
                          Recortar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Prompt */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    <Label className="text-base font-semibold">2. Cole o Prompt *</Label>
                  </div>
                  <Textarea
                    value={editingPrompt.prompt_template || ""}
                    onChange={(e) => handlePromptChange(e.target.value)}
                    placeholder="Cole aqui o prompt completo... A IA vai identificar categoria, nome e campos automaticamente."
                    className="min-h-[150px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variáveis como <code className="bg-muted px-1 rounded">{"{name}"}</code> ou <code className="bg-muted px-1 rounded">[NOME]</code> para personalização
                  </p>
                </div>

                {/* Auto-detected info */}
                {editingPrompt.prompt_template && editingPrompt.prompt_template.length > 50 && (
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">✨ Detectado automaticamente:</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {showAdvanced ? "Ocultar" : "Editar"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{editingPrompt.name || "Nome..."}</Badge>
                      <Badge variant="outline">{editingPrompt.category || "Categoria..."}</Badge>
                      <Badge variant="outline">{editingPrompt.hype_text || "Hype..."}</Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {formatPrice(editingPrompt.price_cents || 2100)}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Advanced options (hidden by default) */}
                {showAdvanced && (
                  <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="text-sm font-semibold text-muted-foreground">Editar campos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input
                          value={editingPrompt.name || ""}
                          onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                          placeholder="Nome do prompt"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                          value={editingPrompt.category || "Geral"}
                          onValueChange={(value) => {
                            if (value === "__nova__") {
                              setNewCategoryName("");
                              setEditingPrompt({ ...editingPrompt, category: "__nova__" });
                              return;
                            }
                            const preset = CATEGORY_PRESETS[value];
                            setNewCategoryName("");
                            setEditingPrompt({ 
                              ...editingPrompt, 
                              category: value,
                              ...(preset && !editingPrompt.id ? { price_cents: preset.defaultPrice } : {})
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {/* All known categories (presets + dynamic from DB) */}
                            {[...new Set([...Object.keys(CATEGORY_PRESETS), ...categories])].sort().map((key) => {
                              const preset = CATEGORY_PRESETS[key];
                              return (
                                <SelectItem key={key} value={key}>
                                  {preset?.icon || "📁"} {preset?.label || key}
                                </SelectItem>
                              );
                            })}
                            <SelectItem value="__nova__">➕ Nova Categoria...</SelectItem>
                          </SelectContent>
                        </Select>
                        {editingPrompt.category === "__nova__" && (
                          <Input
                            autoFocus
                            placeholder="Nome da nova categoria"
                            value={newCategoryName}
                            onChange={(e) => {
                              setNewCategoryName(e.target.value);
                              if (e.target.value.trim()) {
                                setEditingPrompt({ ...editingPrompt, category: e.target.value.trim() });
                              }
                            }}
                            onBlur={() => {
                              if (newCategoryName.trim()) {
                                setEditingPrompt({ ...editingPrompt, category: newCategoryName.trim() });
                              }
                            }}
                            className="mt-2"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Hype Text</Label>
                        <Input
                          value={editingPrompt.hype_text || ""}
                          onChange={(e) => setEditingPrompt({ ...editingPrompt, hype_text: e.target.value })}
                          placeholder="🔥 Trending"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          value={(editingPrompt.price_cents || 2100) / 100}
                          onChange={(e) => setEditingPrompt({ ...editingPrompt, price_cents: Math.round(parseFloat(e.target.value) * 100) })}
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editingPrompt.description || ""}
                        onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                        placeholder="Descrição para o marketplace"
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={editingPrompt.status || "active"}
                        onValueChange={(value) => setEditingPrompt({ ...editingPrompt, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="coming_soon">Em Breve</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving || uploading}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Sparkles className="w-4 h-4 mr-2" />
                    {editingPrompt.id ? "Salvar" : "Criar Prompt"}
                  </Button>
                </div>
              </div>

              {/* Live Preview - 2 columns */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Preview em Tempo Real
                </div>
                <LivePreviewCard 
                  prompt={editingPrompt} 
                  imageUrl={displayImage || null}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Assim ficará o card no marketplace
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Table */}
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
        >
          Todos ({prompts.length})
        </Button>
        {Object.entries(CATEGORY_PRESETS).map(([key, preset]) => {
          const count = groupedPrompts[key]?.length || 0;
          return (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(key)}
            >
              {preset.icon} {preset.label} ({count})
            </Button>
          );
        })}
        {/* Show other categories not in presets */}
        {categories.filter(c => !CATEGORY_PRESETS[c]).map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat} ({groupedPrompts[cat]?.length || 0})
          </Button>
        ))}
      </div>

      {/* Category Cards with "Add Prompt" shortcuts */}
      {activeCategory !== "all" && CATEGORY_PRESETS[activeCategory] && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {CATEGORY_PRESETS[activeCategory].icon} {CATEGORY_PRESETS[activeCategory].label}
              </h3>
              <p className="text-sm text-muted-foreground">
                Preço padrão: {formatPrice(CATEGORY_PRESETS[activeCategory].defaultPrice)} · {groupedPrompts[activeCategory]?.length || 0} prompts
              </p>
            </div>
            <GlassButton variant="neon" onClick={() => openNewPrompt(activeCategory)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Prompt em {CATEGORY_PRESETS[activeCategory].label}
            </GlassButton>
          </CardContent>
        </Card>
      )}

      {/* Prompts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Prompts ({filteredPrompts.length})
            {reordering && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Arraste pela alça para reorganizar e clique na foto para fixar em destaque.
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum prompt nesta categoria</p>
              <Button className="mt-4" onClick={() => openNewPrompt(activeCategory !== "all" ? activeCategory : undefined)}>
                Criar prompt
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[170px]">Ordem</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrompts.map((prompt, idx) => (
                  <TableRow
                    key={prompt.id}
                    onDragOver={(event) => handlePromptDragOver(event, prompt.id)}
                    onDragEnter={() => handlePromptDragEnter(prompt.id)}
                    onDrop={(event) => handlePromptDrop(event, prompt.id)}
                    className={[
                      prompt.is_featured ? "border-l-2 border-l-primary bg-primary/5" : "",
                      draggedPromptId === prompt.id ? "opacity-50" : "",
                      dragOverPromptId === prompt.id && draggedPromptId !== prompt.id ? "bg-accent/40" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          draggable={!reordering}
                          disabled={reordering}
                          onDragStart={(event) => handlePromptDragStart(event, prompt.id)}
                          onDragEnd={handlePromptDragEnd}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Arrastar para reordenar ${prompt.name}`}
                          title="Arrastar para reordenar"
                        >
                          {draggedPromptId === prompt.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <GripVertical className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleReorder(prompt.id, 'up')}
                              disabled={idx === 0 || reordering}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleReorder(prompt.id, 'down')}
                              disabled={idx === filteredPrompts.length - 1 || reordering}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {dragOverPromptId === prompt.id && draggedPromptId !== prompt.id ? "Solte aqui" : "Arraste"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="relative group/img cursor-pointer"
                        onClick={() => handleToggleFeatured(prompt)}
                        title={prompt.is_featured ? "Clique para remover destaque" : "Clique para fixar em destaque"}
                      >
                        {prompt.example_image_url ? (
                          <img 
                            src={prompt.example_image_url} 
                            alt={prompt.name}
                            className={`w-14 h-14 object-cover rounded-lg transition-all ${
                              prompt.is_featured 
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                                : "group-hover/img:ring-2 group-hover/img:ring-primary/40 group-hover/img:ring-offset-1 group-hover/img:ring-offset-background"
                            }`}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          prompt.is_featured 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                            : "bg-muted/80 text-muted-foreground opacity-0 group-hover/img:opacity-100"
                        }`}>
                          <Star className={`w-3 h-3 ${prompt.is_featured ? "fill-current" : ""}`} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium flex items-center gap-1.5">
                          {prompt.is_featured && <Pin className="w-3.5 h-3.5 text-primary" />}
                          {prompt.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {prompt.hype_text}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {CATEGORY_PRESETS[prompt.category]?.icon || "✨"} {prompt.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatPrice(prompt.price_cents)}
                    </TableCell>
                    <TableCell>{getStatusBadge(prompt.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditPrompt(prompt)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setDeleteConfirmId(prompt.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Image Crop Modal */}
      {fileToCrop && (
        <ImageCropModal
          open={cropModalOpen}
          onOpenChange={(open) => {
            setCropModalOpen(open);
            if (!open) setFileToCrop(null);
          }}
          imageFile={fileToCrop}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Screenshot to Prompt Modal */}
      <PromptFromScreenshot
        open={screenshotModalOpen}
        onClose={() => setScreenshotModalOpen(false)}
        onPromptCreated={fetchPrompts}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O prompt será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PromptsManager;
