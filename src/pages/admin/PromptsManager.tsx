import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogTrigger,
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
  Image,
  User,
  AtSign,
  FileText,
  Loader2,
  Upload,
  AlertCircle,
  Camera,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

const defaultPrompt: Partial<Prompt> = {
  name: "",
  description: "",
  category: "",
  hype_text: "",
  example_image_url: "",
  prompt_template: "",
  price_cents: 2100,
  status: "active",
  is_influencer_prompt: false,
  influencer_name: "",
  required_fields: ["photo", "name"],
  negative_prompt: "",
  ai_model: "gemini-2.5-flash-image",
  min_photos: 1,
};

const fieldOptions = [
  { id: "photo", label: "Exige upload de foto", icon: Camera, description: "Usuário deve enviar foto" },
  { id: "name", label: "Exige nome da pessoa", icon: User, description: "Nome para personalização" },
  { id: "instagram", label: "Exige @Instagram", icon: AtSign, description: "Handle do Instagram" },
  { id: "description", label: "Exige descrição adicional", icon: MessageSquare, description: "Campo de texto livre" },
];

const aiModels = [
  { id: "gemini-2.5-flash-image", name: "Gemini Flash (Rápido)", description: "Geração rápida, boa qualidade" },
  { id: "gemini-3-pro-image-preview", name: "Gemini Pro (Qualidade)", description: "Melhor qualidade, mais lento" },
];

const PromptsManager = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
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

  const canPublish = () => {
    if (!editingPrompt) return false;
    return !!(editingPrompt.example_image_url && editingPrompt.example_image_url.trim());
  };

  const handleSave = async () => {
    if (!editingPrompt?.name || !editingPrompt?.category || !editingPrompt?.prompt_template) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Validate example image for active prompts
    if (editingPrompt.status === "active" && !editingPrompt.example_image_url?.trim()) {
      toast.error("⚠️ Foto de exemplo é OBRIGATÓRIA para publicar o prompt");
      return;
    }

    setSaving(true);
    try {
      const promptData = {
        name: editingPrompt.name,
        description: editingPrompt.description,
        category: editingPrompt.category,
        hype_text: editingPrompt.hype_text,
        example_image_url: editingPrompt.example_image_url || null,
        prompt_template: editingPrompt.prompt_template,
        price_cents: editingPrompt.price_cents || 2100,
        status: editingPrompt.status || "active",
        is_influencer_prompt: editingPrompt.is_influencer_prompt || false,
        influencer_name: editingPrompt.influencer_name || null,
        required_fields: editingPrompt.required_fields || ["photo", "name"],
        negative_prompt: editingPrompt.negative_prompt || null,
        ai_model: editingPrompt.ai_model || "gemini-2.5-flash-image",
        min_photos: editingPrompt.min_photos || 1,
      };

      if (editingPrompt.id) {
        const { error } = await supabase
          .from("prompts")
          .update(promptData)
          .eq("id", editingPrompt.id);
        if (error) throw error;
        toast.success("Prompt atualizado!");
      } else {
        const { error } = await supabase
          .from("prompts")
          .insert(promptData);
        if (error) throw error;
        toast.success("Prompt criado!");
      }

      setIsDialogOpen(false);
      setEditingPrompt(null);
      fetchPrompts();
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Erro ao salvar prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este prompt?")) return;

    try {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Prompt excluído!");
      fetchPrompts();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Erro ao excluir prompt");
    }
  };

  const toggleField = (field: string) => {
    if (!editingPrompt) return;
    const fields = editingPrompt.required_fields || [];
    const newFields = fields.includes(field)
      ? fields.filter(f => f !== field)
      : [...fields, field];
    setEditingPrompt({ ...editingPrompt, required_fields: newFields });
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
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'coming_soon':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Em Breve</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Prompts</h1>
          <p className="text-muted-foreground">Configure os prompts do marketplace com foto de exemplo obrigatória</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPrompt(defaultPrompt)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {editingPrompt?.id ? "Editar Prompt" : "Novo Prompt"}
              </DialogTitle>
            </DialogHeader>
            
            {editingPrompt && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input
                        value={editingPrompt.name || ""}
                        onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                        placeholder="Ex: Cyberpunk Avatar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria *</Label>
                      <Input
                        value={editingPrompt.category || ""}
                        onChange={(e) => setEditingPrompt({ ...editingPrompt, category: e.target.value })}
                        placeholder="Ex: Cyberpunk, Fashion, Anime"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={editingPrompt.description || ""}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                      placeholder="Descrição curta do prompt para o marketplace"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Texto de Hype</Label>
                      <Input
                        value={editingPrompt.hype_text || ""}
                        onChange={(e) => setEditingPrompt({ ...editingPrompt, hype_text: e.target.value })}
                        placeholder="Ex: 🔥 +500k gerações"
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
                </div>

                {/* Example Image - REQUIRED */}
                <div className="space-y-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-primary">Foto de Exemplo (OBRIGATÓRIA)</h3>
                  </div>
                  
                  {!editingPrompt.example_image_url && (
                    <div className="flex items-center gap-2 text-amber-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Sem foto de exemplo, o prompt NÃO pode ser publicado como Ativo</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>URL da Imagem de Exemplo *</Label>
                    <Input
                      value={editingPrompt.example_image_url || ""}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, example_image_url: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className={!editingPrompt.example_image_url ? "border-amber-500/50" : "border-green-500/50"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Esta imagem será exibida no card do marketplace e representa o resultado esperado.
                    </p>
                  </div>

                  {editingPrompt.example_image_url && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <img 
                        src={editingPrompt.example_image_url} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EErro%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Prompt Template */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Template do Prompt</h3>
                  
                  <div className="space-y-2">
                    <Label>Prompt Base *</Label>
                    <Textarea
                      value={editingPrompt.prompt_template || ""}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt_template: e.target.value })}
                      placeholder="A hyper-realistic portrait of {name} in cyberpunk style... Use variáveis como {name}, {instagram}"
                      className="min-h-[150px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use variáveis: <code className="bg-muted px-1 rounded">{"{name}"}</code>, <code className="bg-muted px-1 rounded">{"{instagram}"}</code>, <code className="bg-muted px-1 rounded">{"{description}"}</code>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Prompt Negativo (Opcional)</Label>
                    <Textarea
                      value={editingPrompt.negative_prompt || ""}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, negative_prompt: e.target.value })}
                      placeholder="blurry, low quality, distorted face, extra limbs..."
                      className="min-h-[80px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      O que a IA deve EVITAR na geração.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Modelo de IA</Label>
                      <Select
                        value={editingPrompt.ai_model || "gemini-2.5-flash-image"}
                        onValueChange={(value) => setEditingPrompt({ ...editingPrompt, ai_model: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex flex-col">
                                <span>{model.name}</span>
                                <span className="text-xs text-muted-foreground">{model.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                </div>

                {/* Required Fields */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Especificações do Usuário</h3>
                  <p className="text-xs text-muted-foreground">
                    Marque quais campos o usuário deve preencher para gerar a imagem:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {fieldOptions.map((field) => (
                      <label
                        key={field.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          editingPrompt.required_fields?.includes(field.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <Checkbox
                          checked={editingPrompt.required_fields?.includes(field.id)}
                          onCheckedChange={() => toggleField(field.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <field.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{field.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {editingPrompt.required_fields?.includes("photo") && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <Label>Quantidade mínima de fotos</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={editingPrompt.min_photos || 1}
                        onChange={(e) => setEditingPrompt({ ...editingPrompt, min_photos: parseInt(e.target.value) || 1 })}
                        className="w-24"
                      />
                    </div>
                  )}
                </div>

                {/* Influencer Section */}
                <div className="space-y-4 p-4 rounded-lg border border-violet-500/30 bg-violet-500/5">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={editingPrompt.is_influencer_prompt || false}
                      onCheckedChange={(checked) => setEditingPrompt({ ...editingPrompt, is_influencer_prompt: checked })}
                    />
                    <Label className="font-medium">Prompt de Influencer</Label>
                  </div>

                  {editingPrompt.is_influencer_prompt && (
                    <div className="space-y-2">
                      <Label>Nome do Influencer</Label>
                      <Input
                        value={editingPrompt.influencer_name || ""}
                        onChange={(e) => setEditingPrompt({ ...editingPrompt, influencer_name: e.target.value })}
                        placeholder="@usuario"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {editingPrompt.status === "active" && !canPublish() && (
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Adicione foto de exemplo para publicar
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      disabled={saving || (editingPrompt.status === "active" && !canPublish())}
                    >
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingPrompt.id ? "Salvar" : "Criar"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Prompts ({prompts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Campos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prompts.map((prompt) => (
                  <TableRow key={prompt.id}>
                    <TableCell>
                      {prompt.example_image_url ? (
                        <img 
                          src={prompt.example_image_url} 
                          alt={prompt.name}
                          className="w-12 h-12 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg border border-amber-500/50 bg-amber-500/10 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        {prompt.name}
                        {prompt.is_influencer_prompt && (
                          <Badge variant="outline" className="ml-2 text-xs text-violet-400 border-violet-400/30">
                            Influencer
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{prompt.hype_text}</p>
                    </TableCell>
                    <TableCell>{prompt.category}</TableCell>
                    <TableCell>{formatPrice(prompt.price_cents)}</TableCell>
                    <TableCell>{getStatusBadge(prompt.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {prompt.required_fields?.map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPrompt(prompt);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(prompt.id)}
                        >
                          <Trash2 className="w-3 h-3" />
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
    </div>
  );
};

export default PromptsManager;