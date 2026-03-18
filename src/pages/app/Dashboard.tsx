import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, Zap, TrendingUp, Star, Clock,
  Image as ImageIcon, CreditCard, Eye, ShoppingCart,
  Download, ChevronRight, Crown, Gift, Flame, Camera,
  ArrowUpRight, Package, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const [promptsRes, purchasesRes, creditsRes] = await Promise.all([
      supabase.from("prompts").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(12),
      supabase.from("prompt_purchases").select("*, prompts(name, example_image_url)").order("created_at", { ascending: false }).limit(10),
      user ? supabase.from("user_credits").select("credits_balance").eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data);
    if (purchasesRes.data) setPurchases(purchasesRes.data as any);
    if (creditsRes.data) setCredits((creditsRes.data as any)?.credits_balance || 0);
    setLoading(false);
  };

  const totalSpent = purchases.reduce((s, p) => s + p.amount_cents, 0);
  const completedCount = purchases.filter(p => p.generation_status === "completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ===== HERO BANNER ===== */}
      <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10 border border-white/[0.06] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-[60px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold uppercase tracking-wider">
                <Flame className="w-3 h-3 mr-1" /> Em alta
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
              Transforme fotos em{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">obras de arte</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Escolha um prompt, envie sua foto e receba uma imagem profissional gerada por IA em segundos.
            </p>
          </div>
          <Button
            onClick={() => navigate("/app/prompt-dashboard")}
            className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shadow-lg shadow-primary/20 text-sm font-semibold px-6"
          >
            <ShoppingCart className="w-4 h-4" />
            Ver todos os prompts
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: CreditCard, label: "Créditos", value: credits.toString(), sub: "disponíveis", color: "text-primary" },
          { icon: ImageIcon, label: "Fotos Geradas", value: completedCount.toString(), sub: "concluídas", color: "text-green-400" },
          { icon: Package, label: "Pedidos", value: purchases.length.toString(), sub: "total", color: "text-blue-400" },
          { icon: TrendingUp, label: "Investido", value: `R$ ${(totalSpent / 100).toFixed(0)}`, sub: "em prompts", color: "text-secondary" },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp(0.1 + i * 0.05)}>
            <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.06]">
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

      {/* ===== FEATURED PROMPTS — SHOP ===== */}
      <motion.div {...fadeUp(0.3)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Prompts em Destaque</h2>
            <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
              {prompts.length} disponíveis
            </Badge>
          </div>
          <button
            onClick={() => navigate("/app/prompt-dashboard")}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            Ver todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {prompts.slice(0, 8).map((prompt, i) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.04 }}
            >
              <Card
                className="bg-white/[0.02] border-white/[0.06] rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = "/#prompts"}
              >
                {/* Image */}
                <div className="aspect-[4/5] relative overflow-hidden bg-white/[0.04]">
                  {prompt.example_image_url ? (
                    <img
                      src={prompt.example_image_url}
                      alt={prompt.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Camera className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}

                  {/* Price overlay */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 backdrop-blur-md border-white/10 text-white font-bold text-xs px-2 py-0.5 shadow-xl">
                      R$ {(prompt.price_cents / 100).toFixed(0)}
                    </Badge>
                  </div>

                  {/* Hot badge for first 3 */}
                  {i < 3 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500/90 text-white text-[9px] border-0 gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Hot
                      </Badge>
                    </div>
                  )}

                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* CTA overlay on hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Zap className="w-3.5 h-3.5" />
                      Gerar Agora
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-bold text-foreground truncate">{prompt.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {prompt.hype_text || prompt.category}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== TWO COLUMNS: Recent + Upsell ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent generations — 3 cols */}
        <motion.div {...fadeUp(0.5)} className="lg:col-span-3">
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl">
            <div className="p-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Suas Gerações Recentes</h3>
              </div>
              <button
                onClick={() => navigate("/app/prompt-dashboard")}
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                Ver todas →
              </button>
            </div>
            <div className="px-5 pb-5">
              {purchases.length === 0 ? (
                <div className="text-center py-10">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma geração ainda</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Escolha um prompt acima para começar!</p>
                  <Button
                    onClick={() => window.location.href = "/#prompts"}
                    variant="outline"
                    className="mt-4 rounded-xl text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Sparkles className="w-3 h-3" />
                    Explorar Prompts
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {purchases.slice(0, 5).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                        {(p.generated_image_url || p.prompts?.example_image_url) ? (
                          <img src={p.generated_image_url || p.prompts?.example_image_url || ""} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground/30" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{p.prompts?.name || "Prompt"}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] ${
                        p.generation_status === "completed" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {p.generation_status === "completed" ? "Pronto" : "Pendente"}
                      </Badge>
                      {p.generated_image_url && (
                        <a href={p.generated_image_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-3 h-3" />
                          </Button>
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Upsell / Plans — 2 cols */}
        <motion.div {...fadeUp(0.6)} className="lg:col-span-2 space-y-3">
          {/* Upgrade CTA */}
          <Card className="bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 border-primary/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-[50px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Pacote Creator Pro</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">30 gerações/mês + prioridade na fila + suporte VIP</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-black text-foreground">R$ 220</span>
                <span className="text-xs text-muted-foreground">/mês</span>
              </div>
              <Button
                onClick={() => navigate("/app/planos")}
                className="w-full bg-primary hover:bg-primary/90 rounded-xl text-xs font-bold gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Fazer Upgrade
              </Button>
            </div>
          </Card>

          {/* Quick stats */}
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold text-foreground">Suas Métricas</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Taxa de conclusão", value: purchases.length > 0 ? `${Math.round((completedCount / purchases.length) * 100)}%` : "—", color: "bg-green-400" },
                { label: "Prompt mais usado", value: purchases.length > 0 ? (purchases[0]?.prompts?.name?.slice(0, 18) || "—") : "—", color: "bg-primary" },
                { label: "Economia vs. fotógrafo", value: totalSpent > 0 ? `R$ ${Math.round((totalSpent / 100) * 4)}` : "—", color: "bg-secondary" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Gift / referral */}
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">Indique e ganhe</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ganhe 5 créditos por cada amigo</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
