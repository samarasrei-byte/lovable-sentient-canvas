import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  Instagram, 
  Youtube, 
  Music, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface OnboardingProps {
  userId: string;
  onComplete: () => void;
}

const categories = [
  "Fashion", "Tech", "Gaming", "Fitness", "Travel", "Food", 
  "Beauty", "Music", "Business", "Education", "Art", "Wellness"
];

export const InfluencerOnboarding = ({ userId, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stageName: "",
    bio: "",
    category: "",
    followersCount: "",
    engagementRate: "",
    pricePerPost: "",
    instagramHandle: "",
    tiktokHandle: "",
    youtubeHandle: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      const { error } = await supabase.from("influencers").insert({
        user_id: userId,
        stage_name: formData.stageName,
        bio: formData.bio,
        category: formData.category,
        followers_count: parseInt(formData.followersCount) || 0,
        engagement_rate: parseFloat(formData.engagementRate) || 0,
        price_per_post: parseFloat(formData.pricePerPost) || 0,
        instagram_handle: formData.instagramHandle || null,
        tiktok_handle: formData.tiktokHandle || null,
        youtube_handle: formData.youtubeHandle || null,
      });

      if (error) throw error;

      toast.success("Perfil criado com sucesso! 🎉");
      onComplete();
    } catch (error) {
      console.error("Error creating influencer profile:", error);
      toast.error("Erro ao criar perfil. Tente novamente.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Vamos começar!
              </h2>
              <p className="text-muted-foreground text-lg">
                Configure seu perfil de influencer
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stageName" className="text-base">Nome Artístico *</Label>
                <Input
                  id="stageName"
                  placeholder="Como você é conhecido?"
                  value={formData.stageName}
                  onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12 bg-card/50 border-border/50">
                    <SelectValue placeholder="Selecione sua categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="min-h-32 bg-card/50 border-border/50 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-success to-accent rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(var(--success)/0.5)]">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-success via-accent to-primary bg-clip-text text-transparent">
                Seus Números
              </h2>
              <p className="text-muted-foreground text-lg">
                Mostre seu alcance e engajamento
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="followersCount" className="text-base">Total de Seguidores *</Label>
                <Input
                  id="followersCount"
                  type="number"
                  placeholder="Ex: 50000"
                  value={formData.followersCount}
                  onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-success transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagementRate" className="text-base">Taxa de Engajamento (%) *</Label>
                <Input
                  id="engagementRate"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 5.5"
                  value={formData.engagementRate}
                  onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-success transition-all"
                />
                <p className="text-sm text-muted-foreground">
                  Likes + Comentários / Seguidores × 100
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(var(--secondary)/0.5)]">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                Redes Sociais
              </h2>
              <p className="text-muted-foreground text-lg">
                Conecte suas plataformas
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagramHandle" className="text-base flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Label>
                <Input
                  id="instagramHandle"
                  placeholder="@seuperfil"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-secondary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktokHandle" className="text-base flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  TikTok
                </Label>
                <Input
                  id="tiktokHandle"
                  placeholder="@seuperfil"
                  value={formData.tiktokHandle}
                  onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-secondary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeHandle" className="text-base flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  YouTube
                </Label>
                <Input
                  id="youtubeHandle"
                  placeholder="@seuperfil"
                  value={formData.youtubeHandle}
                  onChange={(e) => setFormData({ ...formData, youtubeHandle: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-secondary transition-all"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-destructive rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(var(--accent)/0.5)]">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent via-destructive to-primary bg-clip-text text-transparent">
                Seu Valor
              </h2>
              <p className="text-muted-foreground text-lg">
                Defina seu preço por post
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerPost" className="text-base">Preço por Post (R$) *</Label>
                <Input
                  id="pricePerPost"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1500.00"
                  value={formData.pricePerPost}
                  onChange={(e) => setFormData({ ...formData, pricePerPost: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-accent transition-all"
                />
                <p className="text-sm text-muted-foreground">
                  Você pode alterar este valor depois
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Dica de Precificação</p>
                    <p className="text-sm text-muted-foreground">
                      Uma boa referência é calcular R$10-50 por 1.000 seguidores, 
                      ajustando para cima baseado em seu engajamento e nicho.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.stageName && formData.category;
      case 2:
        return formData.followersCount && formData.engagementRate;
      case 3:
        return true; // Social media is optional
      case 4:
        return formData.pricePerPost;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_32px_hsl(var(--primary)/0.15)]">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                Configure seu Perfil
              </CardTitle>
              <CardDescription className="text-base">
                Passo {step} de {totalSteps}
              </CardDescription>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-muted"
            />
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-border/50 hover:bg-muted/50"
              >
                Voltar
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-success to-accent hover:opacity-90 shadow-[0_0_20px_hsl(var(--success)/0.4)]"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Finalizar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
