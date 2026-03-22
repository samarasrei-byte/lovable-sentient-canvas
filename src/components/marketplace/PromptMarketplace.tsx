import { useState, useEffect, useMemo } from "react";
import { Sparkles, Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PromptCard } from "./PromptCard";
import { PromptFilters } from "./PromptFilters";
import { PromptPurchaseFlow } from "../PromptPurchaseFlow";
import { useIsMobile } from "@/hooks/use-mobile";

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

export const PromptMarketplace = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('trending');
  const isMobile = useIsMobile();

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

  const categories = useMemo(() => {
    const cats = [...new Set(prompts.map(p => p.category))];
    return cats.sort();
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    let result = [...prompts];
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    result.sort((a, b) => {
      const aFeatured = a.is_featured ? 1 : 0;
      const bFeatured = b.is_featured ? 1 : 0;
      if (bFeatured !== aFeatured) return bFeatured - aFeatured;
      const aOrder = a.display_order ?? 999;
      const bOrder = b.display_order ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      const aHasImage = a.example_image_url ? 1 : 0;
      const bHasImage = b.example_image_url ? 1 : 0;
      return bHasImage - aHasImage;
    });
    return result;
  }, [prompts, selectedCategory, sortBy]);

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
    <section id="prompts" className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header — no motion wrapper */}
        <header className="text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
            <Zap className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Marketplace</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Galeria de{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Prompts
            </span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Explore nossa coleção curada de prompts profissionais.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-10">
          <PromptFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Grid */}
        {isMobile ? (
          <div className="space-y-5">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} onSelect={setSelectedPrompt} variant="full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} onSelect={setSelectedPrompt} variant="grid" />
            ))}
          </div>
        )}

        {/* Count */}
        <div className="text-center mt-10 text-muted-foreground/40 text-xs tracking-wide">
          {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
          {selectedCategory && ` em ${selectedCategory}`}
        </div>
      </div>

      {/* Purchase Flow Modal */}
      {selectedPrompt && (
        <PromptPurchaseFlow prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
      )}
    </section>
  );
};
