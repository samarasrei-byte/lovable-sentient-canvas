import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Sparkles, Flame, TrendingUp, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PromptPurchaseFlow } from "./PromptPurchaseFlow";

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

// Sample images for prompts (fallback)
const sampleImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'cyberpunk':
      return Zap;
    case 'anime':
      return Star;
    case 'fashion':
      return Sparkles;
    default:
      return Flame;
  }
};

export const PromptMarketplace = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      // Parse required_fields from JSON
      const parsedPrompts = (data || []).map((p: any) => ({
        ...p,
        required_fields: Array.isArray(p.required_fields) ? p.required_fields : JSON.parse(p.required_fields || '[]')
      }));
      
      setPrompts(parsedPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  return (
    <section id="prompts" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">PROMPTS HYPADOS</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            🔥 Os prompts mais baratos da internet
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Transforme sua imagem com a mesma estética usada pelos <span className="text-primary font-medium">creators mais hypados</span>. 
            Resultados profissionais por apenas <span className="text-secondary font-bold">R$21</span>.
          </p>
        </motion.div>

        {/* Prompt Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-white/5 rounded-xl" />
                <div className="mt-3 h-4 bg-white/5 rounded w-3/4" />
                <div className="mt-2 h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {prompts.map((prompt, index) => {
              const IconComponent = getCategoryIcon(prompt.category);
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GlassCard className="group overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      {prompt.example_image_url ? (
                        <img
                          src={prompt.example_image_url}
                          alt={prompt.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Hype Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white text-[10px] px-2 py-0.5 font-bold border-0 shadow-lg">
                          {prompt.hype_text || '🔥 Trending'}
                        </Badge>
                      </div>

                      {/* Category Icon */}
                      <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Price Tag */}
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 font-bold border-0 shadow-lg">
                          {formatPrice(prompt.price_cents)}
                        </Badge>
                      </div>
                    </div>

                    <GlassCardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                        {prompt.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {prompt.category}
                      </p>
                      <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-2">
                        {prompt.description}
                      </p>
                      
                      <GlassButton 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => setSelectedPrompt(prompt)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Gerar agora
                      </GlassButton>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Purchase Flow Modal */}
        <AnimatePresence>
          {selectedPrompt && (
            <PromptPurchaseFlow
              prompt={selectedPrompt}
              onClose={() => setSelectedPrompt(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
