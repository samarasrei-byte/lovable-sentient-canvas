import { useState, useEffect, useMemo, useRef } from "react";
import { Sparkles, Loader2, Zap, Search, ChevronRight, Flame, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PromptCard } from "./PromptCard";
import { PromptPurchaseFlow } from "../PromptPurchaseFlow";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  'Hypados': { icon: '🔥', label: 'Hypados' },
  'LinkedIn': { icon: '💼', label: 'LinkedIn' },
  'Profissional': { icon: '📸', label: 'Fotos Profissionais' },
  'Social Media': { icon: '📱', label: 'Social Media' },
  'Aniversário': { icon: '🎂', label: 'Aniversário' },
  'Família': { icon: '👨‍👩‍👧‍👦', label: 'Família' },
  'Kids': { icon: '🧒', label: 'Kids' },
  'Mêsversário': { icon: '👶', label: 'Mêsversário' },
  'Fashion': { icon: '👗', label: 'Fashion' },
  'Anime': { icon: '🎌', label: 'Anime' },
  'Cyberpunk': { icon: '⚡', label: 'Cyberpunk' },
  'Corporativo': { icon: '🏢', label: 'Corporativo' },
  'Arte': { icon: '🎨', label: 'Arte' },
  'Geral': { icon: '✨', label: 'Geral' },
  'Evento': { icon: '🎉', label: 'Evento' },
};

const MAX_FEATURED = 20;
const MAX_PER_CATEGORY = 8;

export const PromptMarketplace = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("status", "active")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsedPrompts = (data || []).map((p: any) => ({
        ...p,
        required_fields: Array.isArray(p.required_fields)
          ? p.required_fields
          : JSON.parse(p.required_fields || '[]')
      }));

      setPrompts(parsedPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Featured / hypados: is_featured first, then top by display_order
  const featuredPrompts = useMemo(() => {
    const sorted = [...prompts].sort((a, b) => {
      const af = a.is_featured ? 1 : 0;
      const bf = b.is_featured ? 1 : 0;
      if (bf !== af) return bf - af;
      return (a.display_order ?? 999) - (b.display_order ?? 999);
    });
    return sorted.slice(0, MAX_FEATURED);
  }, [prompts]);

  // Group prompts by category
  const categoryGroups = useMemo(() => {
    const groups: Record<string, Prompt[]> = {};
    for (const p of prompts) {
      const cat = p.category || 'Outros';
      if (!groups[cat]) groups[cat] = [];
      if (groups[cat].length < MAX_PER_CATEGORY) {
        groups[cat].push(p);
      }
    }
    // Sort categories by config order, then alphabetical
    const configOrder = Object.keys(CATEGORY_CONFIG);
    return Object.entries(groups).sort(([a], [b]) => {
      const ai = configOrder.indexOf(a);
      const bi = configOrder.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [prompts]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return prompts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.hype_text?.toLowerCase().includes(q)
    );
  }, [prompts, searchQuery]);

  const scrollToSection = (cat: string) => {
    setActiveSection(cat);
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <section id="prompts" className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return (
      <section id="prompts" className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center py-20 space-y-4">
          <Sparkles className="w-10 h-10 text-primary/20 mx-auto" />
          <p className="text-muted-foreground/60">Nenhum prompt disponível no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="prompts" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5">
            <Zap className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Marketplace</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Galeria de{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Prompts
            </span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed mb-8">
            Explore nossa coleção curada de prompts profissionais.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prompts..."
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
        </header>

        {/* Search Results */}
        {searchResults !== null ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
              </h3>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Limpar busca
              </button>
            </div>
            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}>
              {searchResults.map((prompt, index) => (
                <PromptCard key={prompt.id} prompt={prompt} index={index} onSelect={setSelectedPrompt} variant="grid" />
              ))}
            </div>
            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground/50 text-sm">Nenhum prompt encontrado.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Category Navigation Pills */}
            <div className="mb-10">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex items-center gap-2 pb-2">
                  <button
                    onClick={() => window.scrollTo({ top: document.getElementById('prompts')?.offsetTop || 0, behavior: 'smooth' })}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
                      "border border-primary/30 bg-primary/10 text-primary"
                    )}
                  >
                    <Flame className="w-3 h-3 inline mr-1.5" />
                    Hypados
                  </button>
                  {categoryGroups.map(([cat]) => {
                    const config = CATEGORY_CONFIG[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => scrollToSection(cat)}
                        className={cn(
                          "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
                          "border backdrop-blur-sm",
                          activeSection === cat
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-white/[0.03] text-muted-foreground border-white/10 hover:bg-white/[0.06] hover:text-foreground"
                        )}
                      >
                        {config?.icon && <span className="mr-1.5">{config.icon}</span>}
                        {config?.label || cat}
                      </button>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" className="h-1" />
              </ScrollArea>
            </div>

            {/* 🔥 HYPADOS Section — Top 20 */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                    Hypados
                  </h3>
                  <p className="text-xs text-muted-foreground/60">Os prompts mais populares</p>
                </div>
              </div>

              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              )}>
                {featuredPrompts.map((prompt, index) => (
                  <PromptCard key={prompt.id} prompt={prompt} index={index} onSelect={setSelectedPrompt} variant="grid" />
                ))}
              </div>
            </div>

            {/* Category Sections — 8 each */}
            {categoryGroups.map(([category, catPrompts]) => {
              const config = CATEGORY_CONFIG[category];
              return (
                <div
                  key={category}
                  ref={(el) => { sectionRefs.current[category] = el; }}
                  className="mb-14 scroll-mt-24"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-base">
                        {config?.icon || '✨'}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                          {config?.label || category}
                        </h3>
                        <p className="text-[11px] text-muted-foreground/50">{catPrompts.length} prompts</p>
                      </div>
                    </div>
                  </div>

                  {isMobile ? (
                    <ScrollArea className="w-full">
                      <div className="flex gap-3 pb-3">
                        {catPrompts.map((prompt, index) => (
                          <div key={prompt.id} className="w-[200px] flex-shrink-0">
                            <PromptCard prompt={prompt} index={index} onSelect={setSelectedPrompt} variant="grid" />
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="h-1" />
                    </ScrollArea>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {catPrompts.map((prompt, index) => (
                        <PromptCard key={prompt.id} prompt={prompt} index={index} onSelect={setSelectedPrompt} variant="grid" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Total */}
        <div className="text-center mt-10 text-muted-foreground/30 text-xs tracking-wide">
          {prompts.length} prompts disponíveis
        </div>
      </div>

      {/* Purchase Flow Modal */}
      {selectedPrompt && (
        <PromptPurchaseFlow prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
      )}
    </section>
  );
};
