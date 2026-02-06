import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Loader2
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
};

const fieldOptions = [
  { id: "photo", label: "Foto", icon: Image },
  { id: "name", label: "Nome", icon: User },
  { id: "instagram", label: "Instagram", icon: AtSign },
  { id: "email", label: "Email", icon: FileText },
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

  const handleSave = async () => {
    if (!editingPrompt?.name || !editingPrompt?.category || !editingPrompt?.prompt_template) {
      toast.error("Preencha todos os campos obrigatórios");
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
          <p className="text-muted-foreground">Configure os prompts do marketplace</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPrompt(defaultPrompt)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPrompt?.id ? "Editar Prompt" : "Novo Prompt"}
              </DialogTitle>
            </DialogHeader>
            
            {editingPrompt && (
              <div className="space-y-4 py-4">
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
                      placeholder="Ex: Cyberpunk"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={editingPrompt.description || ""}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                    placeholder="Descrição curta do prompt"
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
                    <Label>Preço (centavos)</Label>
                    <Input
                      type="number"
                      value={editingPrompt.price_cents || 2100}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, price_cents: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL da Imagem de Exemplo</Label>
                  <Input
                    value={editingPrompt.example_image_url || ""}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, example_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Template do Prompt *</Label>
                  <Textarea
                    value={editingPrompt.prompt_template || ""}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt_template: e.target.value })}
                    placeholder="Use {name} e {instagram} como variáveis"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {"{name}"}, {"{instagram}"}
                  </p>
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

                <div className="space-y-3">
                  <Label>Campos Obrigatórios</Label>
                  <div className="flex flex-wrap gap-2">
                    {fieldOptions.map((field) => (
                      <Button
                        key={field.id}
                        type="button"
                        variant={editingPrompt.required_fields?.includes(field.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleField(field.id)}
                      >
                        <field.icon className="w-3 h-3 mr-1" />
                        {field.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={editingPrompt.is_influencer_prompt || false}
                    onCheckedChange={(checked) => setEditingPrompt({ ...editingPrompt, is_influencer_prompt: checked })}
                  />
                  <Label>Prompt de Influencer</Label>
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

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingPrompt.id ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
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
                    <TableCell className="font-medium">
                      <div>
                        {prompt.name}
                        {prompt.is_influencer_prompt && (
                          <Badge variant="outline" className="ml-2 text-xs">
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
                      <div className="flex gap-1">
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
