import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, Zap, TrendingUp, Star, Clock,
  Image as ImageIcon, CreditCard, Eye, ShoppingCart,
  Download, ChevronRight, Crown, Gift, Flame, Camera,
  Package, Loader2, Palette, Users, Video, UserCircle,
  Target, FileText, Wallet, Activity, Lock, Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MemoryGallery } from "@/components/MemoryGallery";

interface Prompt {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  example_image_url: string | null;
  hype_text: string | null;
  description: string | null;
}

interface Purchase {
  id: string;
  prompt_id: string;
  amount_cents: number;
  generation_status: string;
  generated_image_url: string | null;
  created_at: string;
  prompts?: { name: string; example_image_url: string | null };
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function Dashboard() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const [promptsRes, purchasesRes, creditsRes, profileRes] = await Promise.all([
      supabase.from("prompts").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(12),
      supabase.from("prompt_purchases").select("*, prompts(name, example_image_url)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      user ? supabase.from("user_credits").select("credits_balance").eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
      user ? supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data);
    if (purchasesRes.data) setPurchases(purchasesRes.data as any);
    if (creditsRes.data) setCredits((creditsRes.data as any)?.credits_balance || 0);
    if (profileRes.data) setUserName((profileRes.data as any)?.full_name?.split(" ")[0] || "");
    setLoading(false);
  };

  const totalSpent = purchases.reduce((s, p) => s + p.amount_cents, 0);
  const completedCount = purchases.filter(p => p.generation_status === "completed").length;

  const comingSoonFeatures = [
    { icon: Users, label: "Talentos", desc: "Encontre influenciadores ideais" },
    { icon: Video, label: "Live Shop", desc: "Vendas ao vivo com IA" },
    { icon: UserCircle, label: "Avatar Studio", desc: "Crie avatares com IA" },
    { icon: Target, label: "Campanhas", desc: "Gerencie suas campanhas" },
    { icon: FileText, label: "Contratos", desc: "Contratos inteligentes" },
    { icon: Wallet, label: "Pagamentos", desc: "Gestão financeira" },
    { icon: Activity, label: "Monitoramento", desc: "Métricas em tempo real" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ===== GREETING + HERO ===== */}
      <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-card to-secondary/10 border border-border/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-secondary/8 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">
            {userName ? `Olá, ${userName}! 👋` : "Bem-vindo! 👋"}
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
            Crie fotos incríveis com{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Escolha um estilo no marketplace, envie sua foto e receba uma imagem profissional em segundos.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button
              onClick={() => navigate("/app/prompt-dashboard")}
              className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shadow-lg shadow-primary/20 text-sm font-semibold px-6"
            >
              <ShoppingCart className="w-4 h-4" />
              Explorar Marketplace
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate("/app/ai-studio")}
              variant="outline"
              className="rounded-xl gap-2 text-sm border-border/30"
            >
              <Sparkles className="w-4 h-4" />
              IA Studio
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: CreditCard, label: "Créditos", value: credits.toString(), sub: "disponíveis", color: "text-primary", bg: "bg-primary/10" },
          { icon: ImageIcon, label: "Fotos Geradas", value: completedCount.toString(), sub: "concluídas", color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { icon: Package, label: "Pedidos", value: purchases.length.toString(), sub: "total", color: "text-blue-400", bg: "bg-blue-400/10" },
          { icon: TrendingUp, label: "Investido", value: `R$${(totalSpent / 100).toFixed(0)}`, sub: "em prompts", color: "text-secondary", bg: "bg-secondary/10" },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp(0.08 + i * 0.04)}>
            <Card className="bg-card/50 border-border/20 rounded-2xl p-4 hover:border-border/40 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ===== MAIN GRID: Prompts + Side ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Featured Prompts (2 cols) */}
        <motion.div {...fadeUp(0.25)} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Prompts em Destaque</h2>
              <Badge variant="outline" className="text-[9px] border-primary/30 text-primary ml-1">
                {prompts.length} ativos
              </Badge>
            </div>
            <button
              onClick={() => navigate("/app/prompt-dashboard")}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              Ver todos <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {prompts.slice(0, 6).map((prompt, i) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04 }}
              >
                <Card
                  className="bg-card/50 border-border/20 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/categoria/${prompt.category.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-muted/20">
                    {prompt.example_image_url ? (
                      <img
                        src={prompt.example_image_url}
                        alt={prompt.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground/15" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/60 backdrop-blur-md border-0 text-white font-bold text-[10px] px-2">
                        R${(prompt.price_cents / 100).toFixed(0)}
                      </Badge>
                    </div>
                    {i < 2 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-500/90 text-white text-[8px] border-0 gap-0.5 px-1.5">
                          <Flame className="w-2.5 h-2.5" /> Hot
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-xl">
                        <Zap className="w-3 h-3" /> Gerar
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-bold text-foreground truncate">{prompt.name}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 truncate">
                      {prompt.hype_text || prompt.category}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Activity + Upsell */}
        <motion.div {...fadeUp(0.35)} className="space-y-4">
          {/* Recent Activity */}
          <Card className="bg-card/50 border-border/20 rounded-2xl">
            <div className="p-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Atividade Recente</h3>
              </div>
            </div>
            <div className="px-4 pb-4">
              {purchases.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-8 h-8 text-muted-foreground/15 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Nenhuma geração ainda</p>
                  <Button
                    onClick={() => navigate("/app/prompt-dashboard")}
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-xl text-[10px] gap-1 border-primary/30 text-primary"
                  >
                    <Sparkles className="w-3 h-3" /> Começar
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {purchases.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/5 hover:bg-muted/10 border border-border/10 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted/10 flex-shrink-0">
                        {(p.generated_image_url || p.prompts?.example_image_url) ? (
                          <img src={p.generated_image_url || p.prompts?.example_image_url || ""} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-3.5 h-3.5 text-muted-foreground/20" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">{p.prompts?.name || "Prompt"}</p>
                        <p className="text-[9px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <Badge variant="outline" className={`text-[8px] px-1.5 ${
                        p.generation_status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {p.generation_status === "completed" ? "✓" : "⏳"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Upgrade Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/5 border-primary/15 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">Creator Pro</h3>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">30 gerações/mês + prioridade + suporte VIP</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-lg font-black text-foreground">R$220</span>
                <span className="text-[10px] text-muted-foreground">/mês</span>
              </div>
              <Button
                onClick={() => navigate("/app/planos")}
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 rounded-xl text-[10px] font-bold gap-1"
              >
                <Zap className="w-3 h-3" /> Fazer Upgrade
              </Button>
            </div>
          </Card>

          {/* Referral */}
          <Card className="bg-card/50 border-border/20 rounded-2xl p-4 cursor-pointer hover:border-border/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <Gift className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-foreground">Indique e ganhe</p>
                <p className="text-[9px] text-muted-foreground">5 créditos por amigo</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ===== MEMORY GALLERY ===== */}
      <motion.div {...fadeUp(0.45)}>
        <MemoryGallery />
      </motion.div>

      {/* ===== COMING SOON SECTION ===== */}
      <motion.div {...fadeUp(0.5)}>
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-secondary" />
          <h2 className="text-base font-bold text-foreground">Em Breve</h2>
          <Badge className="text-[9px] bg-secondary/10 text-secondary border-secondary/20">
            Novidades chegando
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {comingSoonFeatures.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.04 }}
            >
              <Card className="bg-card/30 border-border/15 rounded-2xl p-4 opacity-60 hover:opacity-80 transition-all cursor-default">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-muted/10">
                    <feature.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-bold text-foreground">{feature.label}</p>
                      <Lock className="w-2.5 h-2.5 text-muted-foreground/40" />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
