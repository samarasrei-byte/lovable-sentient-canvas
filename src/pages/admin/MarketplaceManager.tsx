import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Palette,
  Bot,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Tag,
  Folder,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Artist {
  id: string;
  name: string;
  bio: string;
  category: string;
  skills: string[];
  price_per_hour: number;
  price_per_project: number;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  rating: number;
  total_projects: number;
}

interface AIAvatar {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  prompt: string;
  image_url?: string;
  price_per_use: number;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  total_uses: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  is_active: boolean;
  display_order: number;
}

interface MarketplaceTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  is_active: boolean;
}

const MarketplaceManager = () => {
  const [activeTab, setActiveTab] = useState("influencers");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [avatars, setAvatars] = useState<AIAvatar[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<MarketplaceTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"artist" | "avatar" | "category" | "tag">("artist");
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [artistsRes, avatarsRes, categoriesRes, tagsRes] = await Promise.all([
      supabase.from("artists").select("*").order("created_at", { ascending: false }),
      supabase.from("ai_avatars").select("*").order("created_at", { ascending: false }),
      supabase.from("marketplace_categories").select("*").order("display_order"),
      supabase.from("marketplace_tags").select("*").order("name"),
    ]);

    setArtists(artistsRes.data || []);
    setAvatars(avatarsRes.data || []);
    setCategories(categoriesRes.data || []);
    setTags(tagsRes.data || []);
    setLoading(false);
  };

  const handleCreateArtist = async () => {
    const { error } = await supabase.from("artists").insert({
      name: formData.name as string,
      bio: formData.bio as string,
      category: formData.category as string,
      skills: ((formData.skills as string) || "").split(",").map((s: string) => s.trim()),
      price_per_hour: parseFloat(formData.price_per_hour as string) || 0,
      price_per_project: parseFloat(formData.price_per_project as string) || 0,
      avatar_url: formData.avatar_url as string,
      is_active: true,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar artista" });
    } else {
      toast({ title: "Artista criado com sucesso!" });
      setShowAddDialog(false);
      setFormData({});
      loadData();
    }
  };

  const handleCreateAvatar = async () => {
    const { error } = await supabase.from("ai_avatars").insert({
      name: formData.name as string,
      description: formData.description as string,
      category: formData.category as string,
      type: formData.type as string || "influencer",
      prompt: formData.prompt as string,
      image_url: formData.image_url as string,
      price_per_use: parseFloat(formData.price_per_use as string) || 0,
      tags: ((formData.tags as string) || "").split(",").map((s: string) => s.trim()),
      personality: formData.personality as string,
      is_active: true,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar avatar" });
    } else {
      toast({ title: "Avatar IA criado com sucesso!" });
      setShowAddDialog(false);
      setFormData({});
      loadData();
    }
  };

  const handleCreateCategory = async () => {
    const slug = (formData.name as string || "").toLowerCase().replace(/\s+/g, "-");
    const { error } = await supabase.from("marketplace_categories").insert({
      name: formData.name as string,
      slug,
      description: formData.description as string,
      type: formData.type as string,
      icon: formData.icon as string,
      display_order: parseInt(formData.display_order as string) || 0,
      is_active: true,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar categoria" });
    } else {
      toast({ title: "Categoria criada!" });
      setShowAddDialog(false);
      setFormData({});
      loadData();
    }
  };

  const handleCreateTag = async () => {
    const slug = (formData.name as string || "").toLowerCase().replace(/\s+/g, "-");
    const { error } = await supabase.from("marketplace_tags").insert({
      name: formData.name as string,
      slug,
      color: formData.color as string || "#6366f1",
      is_active: true,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar tag" });
    } else {
      toast({ title: "Tag criada!" });
      setShowAddDialog(false);
      setFormData({});
      loadData();
    }
  };

  const handleToggleActive = async (table: string, id: string, currentState: boolean) => {
    const { error } = await supabase
      .from(table)
      .update({ is_active: !currentState })
      .eq("id", id);

    if (!error) {
      toast({ title: currentState ? "Item desativado" : "Item ativado" });
      loadData();
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (!error) {
      toast({ title: "Item excluído" });
      loadData();
    }
  };

  const openAddDialog = (type: "artist" | "avatar" | "category" | "tag") => {
    setDialogType(type);
    setFormData({});
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Marketplace Manager
          </h1>
          <p className="text-muted-foreground">Gerenciar influenciadores, artistas, avatares e categorias</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="influencers" className="gap-2">
            <Users className="h-4 w-4" />
            Influenciadores
          </TabsTrigger>
          <TabsTrigger value="artists" className="gap-2">
            <Palette className="h-4 w-4" />
            Artistas
          </TabsTrigger>
          <TabsTrigger value="avatars" className="gap-2">
            <Bot className="h-4 w-4" />
            Avatares IA
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Folder className="h-4 w-4" />
            Categorias
          </TabsTrigger>
        </TabsList>

        {/* Influencers Tab - Uses existing influencers table */}
        <TabsContent value="influencers" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar influenciadores..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-muted-foreground">
                Gerencie influenciadores em <a href="/admin/influencers" className="text-primary underline">Gestão de Influenciadores</a>
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar artistas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => openAddDialog("artist")}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Artista
              </Button>
            </div>
          </Card>

          <div className="grid gap-4">
            {artists.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())).map((artist) => (
              <Card key={artist.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-2xl font-bold">
                      {artist.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{artist.name}</h3>
                        {artist.is_verified && (
                          <Badge className="bg-success/10 text-success border-success">Verificado</Badge>
                        )}
                        {!artist.is_active && (
                          <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{artist.category}</p>
                      <p className="text-sm mt-2">{artist.bio}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {artist.skills?.map((skill, i) => (
                          <Badge key={i} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm text-muted-foreground">Por hora</p>
                      <p className="font-bold">R$ {artist.price_per_hour}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive("artists", artist.id, artist.is_active)}
                    >
                      {artist.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete("artists", artist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {artists.length === 0 && (
              <Card className="p-12 text-center">
                <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum artista cadastrado</h3>
                <p className="text-muted-foreground mb-4">Comece adicionando artistas ao marketplace</p>
                <Button onClick={() => openAddDialog("artist")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Artista
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* AI Avatars Tab */}
        <TabsContent value="avatars" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar avatares..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => openAddDialog("avatar")}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Avatar IA
              </Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avatars.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())).map((avatar) => (
              <Card key={avatar.id} className="p-4 relative overflow-hidden">
                {avatar.is_featured && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 text-accent fill-accent" />
                  </div>
                )}
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                  {avatar.image_url ? (
                    <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Bot className="h-16 w-16 text-primary" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{avatar.name}</h3>
                    <Badge variant="outline">{avatar.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{avatar.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {avatar.tags?.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-primary">R$ {avatar.price_per_use}/uso</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive("ai_avatars", avatar.id, avatar.is_active)}
                      >
                        {avatar.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete("ai_avatars", avatar.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {avatars.length === 0 && (
              <Card className="p-12 text-center col-span-full">
                <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum avatar IA cadastrado</h3>
                <p className="text-muted-foreground mb-4">Crie avatares IA para o marketplace</p>
                <Button onClick={() => openAddDialog("avatar")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Avatar IA
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Categories & Tags Tab */}
        <TabsContent value="config" className="space-y-6">
          {/* Categories */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Categorias</h3>
              <Button size="sm" onClick={() => openAddDialog("category")}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{cat.name}</p>
                    <Badge variant="outline">{cat.type}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive("marketplace_categories", cat.id, cat.is_active)}
                    >
                      {cat.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete("marketplace_categories", cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tags</h3>
              <Button size="sm" onClick={() => openAddDialog("tag")}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Tag className="h-4 w-4" style={{ color: tag.color }} />
                  <span>{tag.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDelete("marketplace_tags", tag.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "artist" && "Novo Artista"}
              {dialogType === "avatar" && "Novo Avatar IA"}
              {dialogType === "category" && "Nova Categoria"}
              {dialogType === "tag" && "Nova Tag"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {dialogType === "artist" && (
              <>
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={(formData.name as string) || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={(formData.bio as string) || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Input
                    value={(formData.category as string) || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="ex: Música, Design, Fotografia"
                  />
                </div>
                <div>
                  <Label>Skills (separadas por vírgula)</Label>
                  <Input
                    value={(formData.skills as string) || ""}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Photoshop, Illustrator, Video"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preço/Hora (R$)</Label>
                    <Input
                      type="number"
                      value={(formData.price_per_hour as string) || ""}
                      onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Preço/Projeto (R$)</Label>
                    <Input
                      type="number"
                      value={(formData.price_per_project as string) || ""}
                      onChange={(e) => setFormData({ ...formData, price_per_project: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>URL da Imagem</Label>
                  <Input
                    value={(formData.avatar_url as string) || ""}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateArtist} className="w-full">
                  Criar Artista
                </Button>
              </>
            )}

            {dialogType === "avatar" && (
              <>
                <div>
                  <Label>Nome do Avatar</Label>
                  <Input
                    value={(formData.name as string) || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={(formData.description as string) || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      value={(formData.category as string) || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={(formData.type as string) || "influencer"}
                      onValueChange={(v) => setFormData({ ...formData, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="influencer">Influencer IA</SelectItem>
                        <SelectItem value="artist">Artista IA</SelectItem>
                        <SelectItem value="model">Modelo IA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Prompt de Geração</Label>
                  <Textarea
                    value={(formData.prompt as string) || ""}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder="Prompt para gerar conteúdo com este avatar..."
                  />
                </div>
                <div>
                  <Label>Personalidade</Label>
                  <Input
                    value={(formData.personality as string) || ""}
                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                    placeholder="ex: Carismático, profissional, divertido"
                  />
                </div>
                <div>
                  <Label>Tags (separadas por vírgula)</Label>
                  <Input
                    value={(formData.tags as string) || ""}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preço por Uso (R$)</Label>
                    <Input
                      type="number"
                      value={(formData.price_per_use as string) || ""}
                      onChange={(e) => setFormData({ ...formData, price_per_use: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input
                      value={(formData.image_url as string) || ""}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateAvatar} className="w-full">
                  Criar Avatar IA
                </Button>
              </>
            )}

            {dialogType === "category" && (
              <>
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={(formData.name as string) || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={(formData.description as string) || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={(formData.type as string) || "influencer"}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="influencer">Influenciador</SelectItem>
                      <SelectItem value="artist">Artista</SelectItem>
                      <SelectItem value="avatar">Avatar IA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ordem de Exibição</Label>
                  <Input
                    type="number"
                    value={(formData.display_order as string) || "0"}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateCategory} className="w-full">
                  Criar Categoria
                </Button>
              </>
            )}

            {dialogType === "tag" && (
              <>
                <div>
                  <Label>Nome da Tag</Label>
                  <Input
                    value={(formData.name as string) || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Cor</Label>
                  <Input
                    type="color"
                    value={(formData.color as string) || "#6366f1"}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-12"
                  />
                </div>
                <Button onClick={handleCreateTag} className="w-full">
                  Criar Tag
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplaceManager;
