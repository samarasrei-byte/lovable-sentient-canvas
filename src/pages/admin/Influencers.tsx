import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Ban, CheckCircle, Eye, Plus, Search, Filter, Star,
  Instagram, Youtube, Users, TrendingUp, MapPin, Globe,
  DollarSign, BarChart3, Shield, Pencil, Trash2, X,
  Video, ShoppingBag, Sparkles, Bot, Mic2, UserCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const TIERS = [
  { value: "nano", label: "Nano (1K-10K)", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { value: "micro", label: "Micro (10K-50K)", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { value: "mid", label: "Mid (50K-500K)", color: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  { value: "macro", label: "Macro (500K-1M)", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { value: "mega", label: "Mega (1M+)", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
];

const CONTENT_TYPES = [
  { value: "influencer", label: "Influenciador", icon: Users },
  { value: "avatar", label: "Avatar IA", icon: Bot },
  { value: "artist", label: "Artista", icon: Mic2 },
];

const CATEGORIES = [
  "Moda", "Beleza", "Fitness", "Tecnologia", "Gaming", "Música",
  "Educação", "Gastronomia", "Viagem", "Lifestyle", "Negócios",
  "Saúde", "Entretenimento", "Esportes", "Arte", "Pets", "Família"
];

const defaultForm = {
  stage_name: "", bio: "", category: "Moda", content_type: "influencer", tier: "micro",
  followers_count: 0, engagement_rate: 0, views_count: 0, avg_likes: 0, avg_comments: 0,
  avg_shares: 0, avg_views: 0, monthly_reach: 0, cpm: 0, cpe: 0,
  audience_male_pct: 50, audience_female_pct: 50, audience_age_range: "18-34",
  instagram_handle: "", tiktok_handle: "", youtube_handle: "", website_url: "",
  price_per_post: 0, price_per_story: 0, price_per_reel: 0, price_per_video: 0, price_per_live: 0,
  city: "", state: "", country: "Brasil", niche: "", secondary_niche: "",
  is_verified: false, is_available: true, avatar_url: "", media_kit_url: "", notes: "",
  total_campaigns: 0, completion_rate: 100, avg_response_time_hours: 24, rating: 0,
};

const AdminInfluencers = () => {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...defaultForm });
  const { toast } = useToast();

  useEffect(() => { loadInfluencers(); }, []);

  const loadInfluencers = async () => {
    const { data, error } = await supabase
      .from("influencers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar" });
    } else {
      setInfluencers(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const payload: any = {
      stage_name: form.stage_name, bio: form.bio, category: form.category,
      content_type: form.content_type, tier: form.tier,
      followers_count: Number(form.followers_count), engagement_rate: Number(form.engagement_rate),
      views_count: Number(form.views_count), avg_likes: Number(form.avg_likes),
      avg_comments: Number(form.avg_comments), avg_shares: Number(form.avg_shares),
      avg_views: Number(form.avg_views), monthly_reach: Number(form.monthly_reach),
      cpm: Number(form.cpm), cpe: Number(form.cpe),
      audience_male_pct: Number(form.audience_male_pct),
      audience_female_pct: Number(form.audience_female_pct),
      audience_age_range: form.audience_age_range,
      instagram_handle: form.instagram_handle, tiktok_handle: form.tiktok_handle,
      youtube_handle: form.youtube_handle, website_url: form.website_url,
      price_per_post: Number(form.price_per_post), price_per_story: Number(form.price_per_story),
      price_per_reel: Number(form.price_per_reel), price_per_video: Number(form.price_per_video),
      price_per_live: Number(form.price_per_live),
      city: form.city, state: form.state, country: form.country,
      niche: form.niche, secondary_niche: form.secondary_niche,
      is_verified: form.is_verified, is_available: form.is_available,
      avatar_url: form.avatar_url, media_kit_url: form.media_kit_url, notes: form.notes,
      total_campaigns: Number(form.total_campaigns), completion_rate: Number(form.completion_rate),
      avg_response_time_hours: Number(form.avg_response_time_hours), rating: Number(form.rating),
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("influencers").update(payload).eq("id", editingId));
    } else {
      // For new influencers, we need a user_id - use a placeholder for admin-created entries
      payload.user_id = "00000000-0000-0000-0000-000000000000";
      ({ error } = await supabase.from("influencers").insert(payload));
    }

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: editingId ? "Atualizado!" : "Adicionado!", description: "Salvo com sucesso" });
      setShowForm(false);
      setEditingId(null);
      setForm({ ...defaultForm });
      loadInfluencers();
    }
  };

  const handleEdit = (inf: any) => {
    setEditingId(inf.id);
    setForm({
      stage_name: inf.stage_name || "", bio: inf.bio || "", category: inf.category || "Moda",
      content_type: inf.content_type || "influencer", tier: inf.tier || "micro",
      followers_count: inf.followers_count || 0, engagement_rate: inf.engagement_rate || 0,
      views_count: inf.views_count || 0, avg_likes: inf.avg_likes || 0,
      avg_comments: inf.avg_comments || 0, avg_shares: inf.avg_shares || 0,
      avg_views: inf.avg_views || 0, monthly_reach: inf.monthly_reach || 0,
      cpm: inf.cpm || 0, cpe: inf.cpe || 0,
      audience_male_pct: inf.audience_male_pct || 50, audience_female_pct: inf.audience_female_pct || 50,
      audience_age_range: inf.audience_age_range || "18-34",
      instagram_handle: inf.instagram_handle || "", tiktok_handle: inf.tiktok_handle || "",
      youtube_handle: inf.youtube_handle || "", website_url: inf.website_url || "",
      price_per_post: inf.price_per_post || 0, price_per_story: inf.price_per_story || 0,
      price_per_reel: inf.price_per_reel || 0, price_per_video: inf.price_per_video || 0,
      price_per_live: inf.price_per_live || 0,
      city: inf.city || "", state: inf.state || "", country: inf.country || "Brasil",
      niche: inf.niche || "", secondary_niche: inf.secondary_niche || "",
      is_verified: inf.is_verified || false, is_available: inf.is_available ?? true,
      avatar_url: inf.avatar_url || "", media_kit_url: inf.media_kit_url || "",
      notes: inf.notes || "", total_campaigns: inf.total_campaigns || 0,
      completion_rate: inf.completion_rate || 100, avg_response_time_hours: inf.avg_response_time_hours || 24,
      rating: inf.rating || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const { error } = await supabase.from("influencers").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "Excluído", description: "Removido com sucesso" });
      loadInfluencers();
    }
  };

  const handleBan = async (id: string) => {
    const reason = prompt("Motivo do banimento:");
    if (!reason) return;
    await supabase.from("influencers").update({ is_banned: true, ban_reason: reason, banned_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "Banido" }); loadInfluencers();
  };

  const handleUnban = async (id: string) => {
    await supabase.from("influencers").update({ is_banned: false, ban_reason: null, banned_at: null }).eq("id", id);
    toast({ title: "Desbanido" }); loadInfluencers();
  };

  const filtered = influencers.filter((inf) => {
    const matchSearch = inf.stage_name?.toLowerCase().includes(search.toLowerCase()) ||
      inf.category?.toLowerCase().includes(search.toLowerCase()) ||
      inf.niche?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || inf.content_type === filterType;
    const matchTier = filterTier === "all" || inf.tier === filterTier;
    return matchSearch && matchType && matchTier;
  });

  const getTierBadge = (tier: string) => {
    const t = TIERS.find(t => t.value === tier);
    return t ? <Badge variant="outline" className={t.color}>{t.label}</Badge> : <Badge variant="outline">{tier}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const ct = CONTENT_TYPES.find(c => c.value === type);
    if (!ct) return <Badge variant="outline">{type}</Badge>;
    const Icon = ct.icon;
    return <Badge variant="outline" className="gap-1"><Icon className="h-3 w-3" />{ct.label}</Badge>;
  };

  const formatNum = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n?.toString() || "0";
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Talentos</h1>
          <p className="text-muted-foreground">Influenciadores, Avatares IA e Artistas</p>
        </div>
        <Button onClick={() => { setEditingId(null); setForm({ ...defaultForm }); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Talento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{influencers.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{influencers.filter(i => i.content_type === "influencer").length}</p>
          <p className="text-xs text-muted-foreground">Influenciadores</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-violet-400">{influencers.filter(i => i.content_type === "avatar").length}</p>
          <p className="text-xs text-muted-foreground">Avatares IA</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{influencers.filter(i => i.content_type === "artist").length}</p>
          <p className="text-xs text-muted-foreground">Artistas</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{influencers.filter(i => i.is_verified).length}</p>
          <p className="text-xs text-muted-foreground">Verificados</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar nome, categoria, nicho..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {CONTENT_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tier" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tiers</SelectItem>
              {TIERS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="p-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhum talento encontrado</p>
          </Card>
        )}
        {filtered.map((inf) => (
          <Card key={inf.id} className="p-5 hover:border-primary/30 transition-colors">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {inf.avatar_url ? (
                  <img src={inf.avatar_url} alt={inf.stage_name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold">{inf.stage_name}</h3>
                  {inf.is_verified && <Shield className="h-4 w-4 text-blue-400" />}
                  {inf.is_banned && <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" />Banido</Badge>}
                  {getTypeBadge(inf.content_type || "influencer")}
                  {getTierBadge(inf.tier || "micro")}
                  <Badge variant="outline">{inf.category}</Badge>
                  {inf.niche && <Badge variant="outline" className="text-xs">{inf.niche}</Badge>}
                </div>

                {/* KPIs Row */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Seguidores</p>
                    <p className="font-semibold">{formatNum(inf.followers_count)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Engajamento</p>
                    <p className="font-semibold">{inf.engagement_rate}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Visualizações</p>
                    <p className="font-semibold">{formatNum(inf.views_count || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Alcance/mês</p>
                    <p className="font-semibold">{formatNum(inf.monthly_reach || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">R$/Post</p>
                    <p className="font-semibold text-emerald-400">R${inf.price_per_post}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Campanhas</p>
                    <p className="font-semibold">{inf.total_campaigns || 0}</p>
                  </div>
                </div>

                {/* Social handles */}
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  {inf.instagram_handle && <span className="flex items-center gap-1"><Instagram className="h-3 w-3" />@{inf.instagram_handle}</span>}
                  {inf.youtube_handle && <span className="flex items-center gap-1"><Youtube className="h-3 w-3" />{inf.youtube_handle}</span>}
                  {(inf.city || inf.state) && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[inf.city, inf.state].filter(Boolean).join(", ")}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(inf)}><Pencil className="h-4 w-4" /></Button>
                {inf.is_banned ? (
                  <Button variant="ghost" size="icon" onClick={() => handleUnban(inf.id)} className="text-emerald-400"><CheckCircle className="h-4 w-4" /></Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => handleBan(inf.id)} className="text-destructive"><Ban className="h-4 w-4" /></Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleDelete(inf.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Talento" : "Adicionar Novo Talento"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="audience">Audiência</TabsTrigger>
              <TabsTrigger value="pricing">Preços</TabsTrigger>
              <TabsTrigger value="extra">Extra</TabsTrigger>
            </TabsList>

            {/* BASIC */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Nome Artístico *</Label>
                  <Input value={form.stage_name} onChange={e => setForm({ ...form, stage_name: e.target.value })} placeholder="@username ou nome" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.content_type} onValueChange={v => setForm({ ...form, content_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tier</Label>
                  <Select value={form.tier} onValueChange={v => setForm({ ...form, tier: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIERS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nicho Principal</Label>
                  <Input value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} placeholder="Ex: Skincare" />
                </div>
                <div>
                  <Label>Nicho Secundário</Label>
                  <Input value={form.secondary_niche} onChange={e => setForm({ ...form, secondary_niche: e.target.value })} placeholder="Ex: Wellness" />
                </div>
                <div>
                  <Label>URL Avatar</Label>
                  <Input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <Label>Bio</Label>
                  <Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
                </div>
                <div className="col-span-2 flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_verified} onCheckedChange={v => setForm({ ...form, is_verified: v })} />
                    <Label>Verificado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_available} onCheckedChange={v => setForm({ ...form, is_available: v })} />
                    <Label>Disponível</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* KPIs */}
            <TabsContent value="kpis" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><Label>Seguidores</Label><Input type="number" value={form.followers_count} onChange={e => setForm({ ...form, followers_count: +e.target.value })} /></div>
                <div><Label>Taxa Engajamento (%)</Label><Input type="number" step="0.1" value={form.engagement_rate} onChange={e => setForm({ ...form, engagement_rate: +e.target.value })} /></div>
                <div><Label>Visualizações Totais</Label><Input type="number" value={form.views_count} onChange={e => setForm({ ...form, views_count: +e.target.value })} /></div>
                <div><Label>Média de Likes</Label><Input type="number" value={form.avg_likes} onChange={e => setForm({ ...form, avg_likes: +e.target.value })} /></div>
                <div><Label>Média de Comentários</Label><Input type="number" value={form.avg_comments} onChange={e => setForm({ ...form, avg_comments: +e.target.value })} /></div>
                <div><Label>Média de Compartilhamentos</Label><Input type="number" value={form.avg_shares} onChange={e => setForm({ ...form, avg_shares: +e.target.value })} /></div>
                <div><Label>Média de Views/Post</Label><Input type="number" value={form.avg_views} onChange={e => setForm({ ...form, avg_views: +e.target.value })} /></div>
                <div><Label>Alcance Mensal</Label><Input type="number" value={form.monthly_reach} onChange={e => setForm({ ...form, monthly_reach: +e.target.value })} /></div>
                <div><Label>CPM (R$)</Label><Input type="number" step="0.01" value={form.cpm} onChange={e => setForm({ ...form, cpm: +e.target.value })} /></div>
                <div><Label>CPE (R$)</Label><Input type="number" step="0.01" value={form.cpe} onChange={e => setForm({ ...form, cpe: +e.target.value })} /></div>
                <div><Label>Total Campanhas</Label><Input type="number" value={form.total_campaigns} onChange={e => setForm({ ...form, total_campaigns: +e.target.value })} /></div>
                <div><Label>Taxa Conclusão (%)</Label><Input type="number" step="0.1" value={form.completion_rate} onChange={e => setForm({ ...form, completion_rate: +e.target.value })} /></div>
                <div><Label>Rating (0-5)</Label><Input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} /></div>
                <div><Label>Tempo Resposta (horas)</Label><Input type="number" value={form.avg_response_time_hours} onChange={e => setForm({ ...form, avg_response_time_hours: +e.target.value })} /></div>
              </div>
            </TabsContent>

            {/* AUDIENCE */}
            <TabsContent value="audience" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>% Masculino</Label><Input type="number" value={form.audience_male_pct} onChange={e => setForm({ ...form, audience_male_pct: +e.target.value, audience_female_pct: 100 - +e.target.value })} /></div>
                <div><Label>% Feminino</Label><Input type="number" value={form.audience_female_pct} onChange={e => setForm({ ...form, audience_female_pct: +e.target.value, audience_male_pct: 100 - +e.target.value })} /></div>
                <div>
                  <Label>Faixa Etária Principal</Label>
                  <Select value={form.audience_age_range} onValueChange={v => setForm({ ...form, audience_age_range: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13-17">13-17</SelectItem>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="18-34">18-34</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45+">45+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <h3 className="font-semibold mt-4">Localização</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Cidade</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                <div><Label>Estado</Label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
                <div><Label>País</Label><Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
              </div>
              <h3 className="font-semibold mt-4">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Instagram</Label><Input value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} placeholder="@handle" /></div>
                <div><Label>TikTok</Label><Input value={form.tiktok_handle} onChange={e => setForm({ ...form, tiktok_handle: e.target.value })} placeholder="@handle" /></div>
                <div><Label>YouTube</Label><Input value={form.youtube_handle} onChange={e => setForm({ ...form, youtube_handle: e.target.value })} /></div>
                <div><Label>Website</Label><Input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." /></div>
              </div>
            </TabsContent>

            {/* PRICING */}
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><Label>R$ / Post Feed</Label><Input type="number" step="0.01" value={form.price_per_post} onChange={e => setForm({ ...form, price_per_post: +e.target.value })} /></div>
                <div><Label>R$ / Story</Label><Input type="number" step="0.01" value={form.price_per_story} onChange={e => setForm({ ...form, price_per_story: +e.target.value })} /></div>
                <div><Label>R$ / Reel</Label><Input type="number" step="0.01" value={form.price_per_reel} onChange={e => setForm({ ...form, price_per_reel: +e.target.value })} /></div>
                <div><Label>R$ / Vídeo</Label><Input type="number" step="0.01" value={form.price_per_video} onChange={e => setForm({ ...form, price_per_video: +e.target.value })} /></div>
                <div><Label>R$ / Live</Label><Input type="number" step="0.01" value={form.price_per_live} onChange={e => setForm({ ...form, price_per_live: +e.target.value })} /></div>
              </div>
            </TabsContent>

            {/* EXTRA */}
            <TabsContent value="extra" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div><Label>URL do Media Kit</Label><Input value={form.media_kit_url} onChange={e => setForm({ ...form, media_kit_url: e.target.value })} placeholder="https://..." /></div>
                <div><Label>Notas internas</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={4} placeholder="Observações internas sobre o talento..." /></div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.stage_name}>
              {editingId ? "Salvar Alterações" : "Adicionar Talento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInfluencers;
