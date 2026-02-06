import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Sparkles, Flame, TrendingUp, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
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

const PromptCard = ({ prompt, index, onSelect }: { prompt: Prompt; index: number; onSelect: (p: Prompt) => void }) => {
  const IconComponent = getCategoryIcon(prompt.category);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex-shrink-0 w-[280px] sm:w-auto"
    >
      <GlassCard className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-500 h-full group">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {prompt.example_image_url ? (
            <img
              src={prompt.example_image_url}
              alt={prompt.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary/50" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Hype Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white text-xs px-3 py-1 font-bold border-0 shadow-lg">
              {prompt.hype_text || '🔥 Trending'}
            </Badge>
          </div>

          {/* Category Icon */}
          <div className="absolute top-3 right-3">
            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1.5 font-bold border-0 shadow-2xl">
              {formatPrice(prompt.price_cents || 2100)}
            </Badge>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-white text-xl mb-1 line-clamp-1">
              {prompt.name}
            </h3>
            <p className="text-white/70 text-xs uppercase tracking-wider mb-2">
              {prompt.category}
            </p>
            <p className="text-white/80 text-sm line-clamp-2 mb-4">
              {prompt.description}
            </p>
            
            <GlassButton 
              variant="holographic"
              size="default"
              className="w-full"
              onClick={() => onSelect(prompt)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar agora
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const PromptGrid = () => {
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

  if (loading) {
    return (
      <section id="prompts" className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-white/5 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return (
      <section id="prompts" className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Nenhum prompt disponível no momento.</p>
        </div>
      </section>
    );
  }

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

        {/* Mobile: Horizontal Scroll | Desktop: Grid */}
        {/* Mobile horizontal scroll */}
        <div className="sm:hidden overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-4">
            {prompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                onSelect={setSelectedPrompt}
              />
            ))}
          </div>
        </div>

        {/* Desktop/Tablet Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              index={index}
              onSelect={setSelectedPrompt}
            />
          ))}
        </div>

        {/* Prompt Counter */}
        <div className="text-center mt-8 text-muted-foreground text-sm">
          {prompts.length} prompts disponíveis
        </div>
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
