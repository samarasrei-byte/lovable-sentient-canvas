import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PromptCard } from "@/components/marketplace/PromptCard";
import { PromptPurchaseFlow } from "@/components/PromptPurchaseFlow";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2, Sparkles, Search, X, ChevronRight, Briefcase, Palette, Zap, Star, Flame, Heart, Shield, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
  hype_text: string;
  example_image_url: string | null;
  price_cents: number;
  status: string;
  required_fields: string[];
  is_influencer_prompt: boolean;
  influencer_name: string | null;
  prompt_template?: string;
  negative_prompt?: string | null;
  ai_model?: string;
  min_photos?: number;
  is_featured?: boolean;
  display_order?: number;
}

const CATEGORY_HERO: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  accentGlow: string;
  icon: React.ReactNode;
  badge: string;
  bgPattern: string;
  relatedCategories: string[];
}> = {
  linkedin: {
    title: "LinkedIn & Profissional",
    subtitle: "Fotos que fecham negócios",
    description: "Transforme sua presença digital com headshots executivos de nível CEO. Fotos profissionais que transmitem autoridade, credibilidade e confiança — perfeitas para LinkedIn, portfólios e apresentações corporativas.",
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    accentGlow: "bg-blue-500/20",
    icon: <Briefcase className="w-6 h-6" />,
    badge: "PREMIUM CORPORATE",
    bgPattern: "radial-gradient(ellipse at 20% 50%, hsl(210 80% 50% / 0.15), transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(185 60% 50% / 0.1), transparent 50%)",
    relatedCategories: ["LinkedIn", "Corporativo"],
  },
  fashion: {
    title: "Fashion & Editorial",
    subtitle: "Alta costura digital",
    description: "Looks de passarela, editoriais de moda e fotos dignas de revista. Crie visuais que capturam a essência do estilo com iluminação cinematográfica e poses de modelo profissional.",
    gradient: "from-pink-500 via-rose-400 to-amber-300",
    accentGlow: "bg-pink-500/20",
    icon: <Sparkles className="w-6 h-6" />,
    badge: "HAUTE COUTURE",
    bgPattern: "radial-gradient(ellipse at 70% 30%, hsl(330 70% 50% / 0.15), transparent 50%), radial-gradient(ellipse at 20% 80%, hsl(45 80% 50% / 0.08), transparent 50%)",
    relatedCategories: ["Fashion"],
  },
  anime: {
    title: "Anime & Manga",
    subtitle: "Seu alter ego em anime",
    description: "Transforme-se em personagem de anime com estilos que vão do Studio Ghibli ao Shonen Jump. Arte digital de alta fidelidade que preserva seus traços únicos no universo 2D.",
    gradient: "from-violet-500 via-fuchsia-400 to-pink-400",
    accentGlow: "bg-violet-500/20",
    icon: <Star className="w-6 h-6" />,
    badge: "OTAKU EDITION",
    bgPattern: "radial-gradient(ellipse at 30% 40%, hsl(270 70% 60% / 0.15), transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(330 60% 50% / 0.1), transparent 50%)",
    relatedCategories: ["Anime"],
  },
  cyberpunk: {
    title: "Cyberpunk & Futurista",
    subtitle: "O futuro é agora",
    description: "Neon, hologramas e estética sci-fi. Mergulhe no universo cyberpunk com fotos ultra-futuristas que combinam tecnologia e estilo em cenários de tirar o fôlego.",
    gradient: "from-cyan-400 via-teal-400 to-emerald-500",
    accentGlow: "bg-cyan-500/20",
    icon: <Zap className="w-6 h-6" />,
    badge: "NEON DISTRICT",
    bgPattern: "radial-gradient(ellipse at 50% 30%, hsl(180 80% 50% / 0.12), transparent 50%), radial-gradient(ellipse at 20% 80%, hsl(150 60% 40% / 0.08), transparent 50%)",
    relatedCategories: ["Cyberpunk"],
  },
  arte: {
    title: "Arte & Criativo",
    subtitle: "Onde a imaginação ganha vida",
    description: "Estilos artísticos únicos — de óleo sobre tela a aquarela digital, pop art e surrealismo. Transforme suas fotos em verdadeiras obras de arte.",
    gradient: "from-amber-400 via-orange-400 to-red-400",
    accentGlow: "bg-amber-500/20",
    icon: <Palette className="w-6 h-6" />,
    badge: "MASTERPIECE",
    bgPattern: "radial-gradient(ellipse at 60% 40%, hsl(35 80% 50% / 0.15), transparent 50%), radial-gradient(ellipse at 30% 70%, hsl(0 70% 50% / 0.08), transparent 50%)",
    relatedCategories: ["Arte"],
  },
  aniversario: {
    title: "Aniversário & Família",
    subtitle: "Momentos que duram para sempre",
    description: "Convites, cards temáticos e fotos especiais para aniversários, mesversários e momentos em família. Designs encantadores que eternizam cada celebração.",
    gradient: "from-yellow-400 via-orange-300 to-pink-400",
    accentGlow: "bg-yellow-500/20",
    icon: <Heart className="w-6 h-6" />,
    badge: "CELEBRATION",
    bgPattern: "radial-gradient(ellipse at 40% 50%, hsl(40 80% 50% / 0.12), transparent 50%), radial-gradient(ellipse at 70% 30%, hsl(330 60% 50% / 0.08), transparent 50%)",
    relatedCategories: ["Aniversário", "Família", "Mêsversário", "Kids"],
  },
  politica: {
    title: "Política & Campanha",
    subtitle: "Imagem é poder",
    description: "Material visual de campanha com qualidade profissional. Fotos de candidatos, santinhos digitais e peças de comunicação política que transmitem liderança e confiança.",
    gradient: "from-emerald-500 via-green-400 to-teal-400",
    accentGlow: "bg-emerald-500/20",
    icon: <Shield className="w-6 h-6" />,
    badge: "CAMPANHA",
    bgPattern: "radial-gradient(ellipse at 50% 50%, hsl(152 55% 48% / 0.12), transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(175 60% 40% / 0.08), transparent 50%)",
    relatedCategories: ["Política"],
  },
  hypados: {
    title: "Hypados 🔥",
    subtitle: "Os mais pedidos do momento",
    description: "A seleção curada dos prompts mais populares e mais vendidos da plataforma. Tendências que estão viralizando e gerando resultados incríveis para nossos usuários.",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    accentGlow: "bg-orange-500/20",
    icon: <Flame className="w-6 h-6" />,
    badge: "TRENDING NOW",
    bgPattern: "radial-gradient(ellipse at 50% 30%, hsl(25 80% 50% / 0.15), transparent 50%), radial-gradient(ellipse at 30% 70%, hsl(0 70% 50% / 0.1), transparent 50%)",
    relatedCategories: ["Hypando"],
  },
  geral: {
    title: "Coleção Geral",
    subtitle: "Para todas as ocasiões",
    description: "Nossa coleção diversificada de prompts para qualquer situação — casais, social media, eventos e muito mais. Encontre o prompt perfeito para cada momento.",
    gradient: "from-primary via-secondary to-accent",
    accentGlow: "bg-primary/20",
    icon: <Wand2 className="w-6 h-6" />,
    badge: "ALL-IN-ONE",
    bgPattern: "radial-gradient(ellipse at 40% 40%, hsl(271 65% 56% / 0.12), transparent 50%), radial-gradient(ellipse at 70% 60%, hsl(185 60% 50% / 0.08), transparent 50%)",
    relatedCategories: ["Geral", "Social Media", "Foto de casais", "Copa do Mundo", "Evento"],
  },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_HERO);

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const heroConfig = CATEGORY_HERO[slug || ""] || CATEGORY_HERO.geral;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPrompts();
  }, [slug]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("prompts")
        .select("*")
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true });

      if (slug === "hypados") {
        query = query.or("category.eq.Hypando,is_featured.eq.true");
      } else {
        const related = heroConfig.relatedCategories;
        if (related.length === 1) {
          query = query.eq("category", related[0]);
        } else {
          query = query.in("category", related);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      setPrompts(
        (data || []).map((p: any) => ({
          ...p,
          required_fields: Array.isArray(p.required_fields)
            ? p.required_fields
            : JSON.parse(p.required_fields || "[]"),
        }))
      );
    } catch (err) {
      console.error("Error fetching category prompts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return prompts;
    const q = searchQuery.toLowerCase();
    return prompts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.hype_text?.toLowerCase().includes(q)
    );
  }, [prompts, searchQuery]);

  const otherCategories = ALL_CATEGORIES.filter((c) => c !== slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{ background: heroConfig.bgPattern }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className={cn("absolute top-20 -left-20 w-72 h-72 rounded-full blur-[100px] opacity-30", heroConfig.accentGlow)} />
        <div className={cn("absolute bottom-10 -right-20 w-96 h-96 rounded-full blur-[120px] opacity-20", heroConfig.accentGlow)} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-16 md:pt-12 md:pb-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Marketplace
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
                <span className="text-foreground">{heroConfig.icon}</span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  {heroConfig.badge}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 leading-[1.1]">
                <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", heroConfig.gradient)}>
                  {heroConfig.title}
                </span>
              </h1>

              <p className="text-xl md:text-2xl font-light text-foreground/80 mb-4">
                {heroConfig.subtitle}
              </p>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                {heroConfig.description}
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className={cn("text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent", heroConfig.gradient)}>
                      {loading ? "..." : prompts.length}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-1">Prompts</div>
                  </div>
                  <div>
                    <div className={cn("text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent", heroConfig.gradient)}>
                      4K
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-1">Qualidade</div>
                  </div>
                  <div>
                    <div className={cn("text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent", heroConfig.gradient)}>
                      IA
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-1">Gemini</div>
                  </div>
                  <div>
                    <div className={cn("text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent", heroConfig.gradient)}>
                      ∞
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-1">Estilos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar em ${heroConfig.title}...`}
            className="pl-11 pr-10 py-3 bg-white/[0.04] border-white/[0.08] rounded-xl text-sm placeholder:text-muted-foreground/40 focus:border-primary/40 focus:bg-white/[0.06] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground/60" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground/50 text-sm">
              {searchQuery ? "Nenhum prompt encontrado." : "Nenhum prompt nesta categoria ainda."}
            </p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mb-6">
                {filteredPrompts.length} resultado{filteredPrompts.length !== 1 ? "s" : ""} para "{searchQuery}"
              </p>
            )}

            <div
              className={cn(
                "grid gap-5",
                isMobile
                  ? "grid-cols-1 px-1"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              )}
            >
              {filteredPrompts.map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={index}
                  onSelect={setSelectedPrompt}
                  variant="grid"
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <h2 className="text-xl md:text-2xl font-bold mb-6 tracking-tight">
          Explore outras categorias
        </h2>
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        )}>
          {otherCategories.map((catSlug) => {
            const cat = CATEGORY_HERO[catSlug];
            return (
              <Link
                key={catSlug}
                to={`/categoria/${catSlug}`}
                className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 p-4"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: cat.bgPattern }}
                />
                <div className="relative z-10 flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-foreground",
                    cat.accentGlow
                  )}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {cat.title.replace(" 🔥", "")}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 truncate">
                      {cat.badge}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/60 transition-colors flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {selectedPrompt && (
        <PromptPurchaseFlow
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
};

export default CategoryPage;
