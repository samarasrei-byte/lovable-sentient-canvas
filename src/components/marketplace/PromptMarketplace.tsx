import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
    <section id="prompts" className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_49.5%,hsl(var(--border)/0.1)_50%,transparent_50.5%,transparent_100%)] bg-[length:100%_80px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">AI Marketplace</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight font-display">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Galeria de
            </span>
            {' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Prompts
            </span>
          </h2>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Explore nossa coleção curada de prompts profissionais.
            <span className="hidden md:inline"> Envie sua foto e a IA gera resultados impressionantes preservando sua identidade.</span>
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 md:mb-12"
        >
          <PromptFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </motion.div>

        {/* Grid */}
        {isMobile ? (
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
          className="text-center mt-12 text-muted-foreground/60 text-sm"
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
