import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Instagram,
  Youtube,
  Globe,
  DollarSign,
  Users,
  Star,
  Award,
  Sparkles,
  Loader2
} from "lucide-react";

export default function InfluencerPerfil() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stage_name: "",
    bio: "",
    category: "",
    price_per_post: 0,
    followers_count: 0,
    engagement_rate: 0,
    instagram_handle: "",
    youtube_handle: "",
    tiktok_handle: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: influencer } = await supabase
        .from("influencers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (influencer) {
        setFormData({
          stage_name: influencer.stage_name || "",
          bio: influencer.bio || "",
          category: influencer.category || "",
          price_per_post: influencer.price_per_post || 0,
          followers_count: influencer.followers_count || 0,
          engagement_rate: influencer.engagement_rate || 0,
          instagram_handle: influencer.instagram_handle || "",
          youtube_handle: influencer.youtube_handle || "",
          tiktok_handle: influencer.tiktok_handle || ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("influencers")
        .update(formData)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Meu Perfil</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Informações do Perfil
        </h1>
        <p className="text-muted-foreground mt-2">Gerencie suas informações e métricas</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informações Básicas
            </CardTitle>
            <CardDescription>Seus dados principais como influenciador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage_name">Nome Artístico</Label>
                <Input
                  id="stage_name"
                  value={formData.stage_name}
                  onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Tech, Fashion, Fitness"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_post">Preço por Post (R$)</Label>
                <Input
                  id="price_per_post"
                  type="number"
                  step="0.01"
                  value={formData.price_per_post}
                  onChange={(e) => setFormData({ ...formData, price_per_post: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers_count">Número de Seguidores</Label>
                <Input
                  id="followers_count"
                  type="number"
                  value={formData.followers_count}
                  onChange={(e) => setFormData({ ...formData, followers_count: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="engagement_rate">Taxa de Engajamento (%)</Label>
              <Input
                id="engagement_rate"
                type="number"
                step="0.1"
                value={formData.engagement_rate}
                onChange={(e) => setFormData({ ...formData, engagement_rate: parseFloat(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Preview do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center text-2xl font-bold text-white">
                  {formData.stage_name.charAt(0) || "?"}
                </div>
                <h3 className="text-xl font-bold">{formData.stage_name || "Seu Nome"}</h3>
                <p className="text-sm text-muted-foreground">{formData.category || "Categoria"}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Seguidores
                  </span>
                  <span className="font-semibold">{formData.followers_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-4 h-4" />
                    Engajamento
                  </span>
                  <span className="font-semibold">{formData.engagement_rate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Por Post
                  </span>
                  <span className="font-semibold">R$ {formData.price_per_post.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redes Sociais */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Redes Sociais
          </CardTitle>
          <CardDescription>Conecte suas redes sociais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_handle" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagram_handle"
                value={formData.instagram_handle}
                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                placeholder="@seu_usuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_handle" className="flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube
              </Label>
              <Input
                id="youtube_handle"
                value={formData.youtube_handle}
                onChange={(e) => setFormData({ ...formData, youtube_handle: e.target.value })}
                placeholder="@seu_canal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_handle" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                TikTok
              </Label>
              <Input
                id="tiktok_handle"
                value={formData.tiktok_handle}
                onChange={(e) => setFormData({ ...formData, tiktok_handle: e.target.value })}
                placeholder="@seu_usuario"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={handleSave}
          disabled={saving}
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
