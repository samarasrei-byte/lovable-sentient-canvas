import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
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

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(prompts.map(p => p.category))];
    return cats.sort();
  }, [prompts]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Always prioritize prompts with images first
    result.sort((a, b) => {
      const aHasImage = a.example_image_url ? 1 : 0;
      const bHasImage = b.example_image_url ? 1 : 0;
      return bHasImage - aHasImage;
    });
    
    return result;
  }, [prompts, selectedCategory, sortBy]);

  if (loading) {
    return (
      <section id="prompts" className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return (
      <section id="prompts" className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="py-20 space-y-4">
            <Sparkles className="w-12 h-12 text-primary/30 mx-auto" />
            <p className="text-muted-foreground">Nenhum prompt disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="prompts" className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">MARKETPLACE</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Galeria de Prompts
          </h2>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Explore nossa coleção curada de prompts profissionais. 
            <span className="hidden md:inline"> Transforme suas ideias em realidade com resultados de alta qualidade.</span>
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 md:mb-10"
        >
          <PromptFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </motion.div>

        {/* Grid - Desktop: 3 columns, Mobile: Full-width vertical */}
        {isMobile ? (
          /* Mobile: Full-width cards, vertical scroll */
          <div className="space-y-6">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                onSelect={setSelectedPrompt}
                variant="full"
              />
            ))}
          </div>
        ) : (
          /* Desktop/Tablet: Grid layout */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
        )}

        {/* Results count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-10 text-muted-foreground/60 text-sm"
        >
          {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'} 
          {selectedCategory && ` em ${selectedCategory}`}
        </motion.div>
      </div>

      {/* Purchase Flow Modal */}
      {selectedPrompt && (
        <PromptPurchaseFlow
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </section>
  );
};
