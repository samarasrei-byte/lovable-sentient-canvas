import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Search, Download, Eye, Clock, TrendingUp,
  Image as ImageIcon, Zap, BarChart3, Star, Filter,
  ArrowUpRight, Loader2, Camera, Palette, ChevronRight,
  Activity, Package, CreditCard, Calendar
} from "lucide-react";

interface PromptPurchase {
  id: string;
  prompt_id: string;
  user_name: string | null;
  user_email: string | null;
  amount_cents: number;
  payment_status: string;
  generation_status: string;
  generated_image_url: string | null;
  created_at: string;
  prompts?: {
    name: string;
    category: string;
    example_image_url: string | null;
  };
}

interface Prompt {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  example_image_url: string | null;
  description: string | null;
  hype_text: string | null;
  status: string;
}

const StatCard = ({ icon: Icon, label, value, trend, color }: {
  icon: any; label: string; value: string; trend?: string; color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 backdrop-blur-sm"
  >
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.05]" style={{ background: color, filter: "blur(30px)" }} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-black text-foreground">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className="p-2.5 rounded-xl bg-white/[0.06]">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  </motion.div>
);

export default function PromptDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<PromptPurchase[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [purchasesRes, promptsRes] = await Promise.all([
      supabase
        .from("prompt_purchases")
        .select("*, prompts(name, category, example_image_url)")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("prompts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false }),
    ]);

    if (purchasesRes.data) setPurchases(purchasesRes.data as any);
    if (promptsRes.data) setPrompts(promptsRes.data);
    setLoading(false);
  };

  const categories = ["all", ...new Set(prompts.map(p => p.category))];
  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalRevenue = purchases.reduce((sum, p) => p.payment_status === "completed" ? sum + p.amount_cents : sum, 0);
  const completedGenerations = purchases.filter(p => p.generation_status === "completed").length;
  const pendingGenerations = purchases.filter(p => p.generation_status === "pending").length;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-500/10 text-green-400 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
      processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    const labels: Record<string, string> = {
      completed: "Concluído",
      pending: "Pendente",
      failed: "Falhou",
      processing: "Processando",
    };
    return (
      <Badge variant="outline" className={`text-[10px] ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Central de Prompts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus prompts, gerações e métricas em tempo real
          </p>
        </div>
        <Button
          onClick={() => window.location.href = "/#prompts"}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2"
        >
          <Palette className="w-4 h-4" />
          Explorar Marketplace
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Package} label="Total de Prompts" value={prompts.length.toString()} color="hsl(var(--primary))" />
        <StatCard icon={ImageIcon} label="Gerações" value={completedGenerations.toString()} trend="+12% esta semana" color="hsl(var(--secondary))" />
        <StatCard icon={Clock} label="Pendentes" value={pendingGenerations.toString()} color="hsl(var(--accent))" />
        <StatCard icon={CreditCard} label="Investido" value={`R$ ${(totalRevenue / 100).toFixed(0)}`} trend="+8% este mês" color="hsl(var(--primary))" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="catalog" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            Catálogo
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Recent generations */}
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Gerações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma geração ainda</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Explore o marketplace para começar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {purchases.slice(0, 8).map((purchase, i) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all group"
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                        {(purchase.generated_image_url || purchase.prompts?.example_image_url) ? (
                          <img
                            src={purchase.generated_image_url || purchase.prompts?.example_image_url || ""}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {purchase.prompts?.name || "Prompt"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(purchase.created_at).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-[10px] text-muted-foreground/40">•</span>
                          <span className="text-[10px] text-muted-foreground">
                            R$ {(purchase.amount_cents / 100).toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {getStatusBadge(purchase.generation_status)}
                        {purchase.generated_image_url && (
                          <a href={purchase.generated_image_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick stats row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="font-bold text-foreground">Categorias Populares</p>
              </div>
              <div className="space-y-2">
                {categories.filter(c => c !== "all").slice(0, 5).map(cat => {
                  const count = prompts.filter(p => p.category === cat).length;
                  const pct = Math.round((count / Math.max(prompts.length, 1)) * 100);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground flex-1 truncate">{cat}</span>
                      <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-secondary/10">
                  <Star className="w-4 h-4 text-secondary" />
                </div>
                <p className="font-bold text-foreground">Prompts em Destaque</p>
              </div>
              <div className="space-y-2">
                {prompts.slice(0, 4).map(prompt => (
                  <div key={prompt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                      {prompt.example_image_url ? (
                        <img src={prompt.example_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-foreground flex-1 truncate">{prompt.name}</span>
                    <span className="text-[10px] font-mono text-primary">R$ {(prompt.price_cents / 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Catalog Tab */}
        <TabsContent value="catalog" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <Input
                placeholder="Buscar prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white/[0.03] border-white/[0.06] rounded-xl"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  {cat === "all" ? "Todos" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPrompts.map((prompt, i) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl overflow-hidden hover:border-primary/20 transition-all group cursor-pointer">
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-white/[0.04]">
                    {prompt.example_image_url ? (
                      <img
                        src={prompt.example_image_url}
                        alt={prompt.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/60 backdrop-blur-sm border-white/10 text-white text-[10px]">
                        R$ {(prompt.price_cents / 100).toFixed(0)}
                      </Badge>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm font-bold text-foreground truncate">{prompt.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-[9px] bg-white/[0.03] border-white/[0.08]">
                        {prompt.category}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum prompt encontrado</p>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Histórico Completo de Gerações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">Sem histórico ainda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {purchases.map((purchase, i) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                        {(purchase.generated_image_url || purchase.prompts?.example_image_url) ? (
                          <img
                            src={purchase.generated_image_url || purchase.prompts?.example_image_url || ""}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{purchase.prompts?.name || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {purchase.user_name || purchase.user_email || "Anônimo"} • {new Date(purchase.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-mono text-muted-foreground">
                          R$ {(purchase.amount_cents / 100).toFixed(0)}
                        </span>
                        {getStatusBadge(purchase.generation_status)}
                        {purchase.generated_image_url && (
                          <a href={purchase.generated_image_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
