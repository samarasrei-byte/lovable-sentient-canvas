import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Sparkles, Flame, TrendingUp, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react";
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

export const PromptCarousel = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % prompts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + prompts.length) % prompts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentPrompt = prompts[currentIndex];

  if (loading) {
    return (
      <section id="prompts" className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="aspect-[4/5] md:aspect-[3/4] bg-white/5 rounded-3xl max-w-lg mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return (
      <section id="prompts" className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">Nenhum prompt disponível no momento.</p>
        </div>
      </section>
    );
  }

  const IconComponent = getCategoryIcon(currentPrompt?.category || '');

  return (
    <section id="prompts" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
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

        {/* Main Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {prompts.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-primary/30 hover:border-primary/50 transition-all duration-300"
                aria-label="Prompt anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-primary/30 hover:border-primary/50 transition-all duration-300"
                aria-label="Próximo prompt"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Card Container */}
          <div className="max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPrompt?.id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <GlassCard className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-500 shadow-[0_0_60px_hsl(var(--primary)/0.15)]">
                  {/* Large Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {currentPrompt?.example_image_url ? (
                      <img
                        src={currentPrompt.example_image_url}
                        alt={currentPrompt.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Sparkles className="w-24 h-24 text-primary/50" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Hype Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white text-sm px-4 py-1.5 font-bold border-0 shadow-lg">
                        {currentPrompt?.hype_text || '🔥 Trending'}
                      </Badge>
                    </div>

                    {/* Category Icon */}
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-primary text-primary-foreground text-xl px-5 py-2 font-bold border-0 shadow-2xl">
                        {formatPrice(currentPrompt?.price_cents || 2100)}
                      </Badge>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-bold text-white text-2xl md:text-3xl mb-2">
                        {currentPrompt?.name}
                      </h3>
                      <p className="text-white/70 text-sm uppercase tracking-wider mb-3">
                        {currentPrompt?.category}
                      </p>
                      <p className="text-white/80 text-base line-clamp-2 mb-6">
                        {currentPrompt?.description}
                      </p>
                      
                      <GlassButton 
                        variant="holographic"
                        size="lg"
                        className="w-full text-lg py-6"
                        onClick={() => setSelectedPrompt(currentPrompt)}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar agora por {formatPrice(currentPrompt?.price_cents || 2100)}
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {prompts.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {prompts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? "w-8 h-3 bg-primary" 
                      : "w-3 h-3 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Ir para prompt ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Prompt Counter */}
          <div className="text-center mt-4 text-muted-foreground text-sm">
            {currentIndex + 1} de {prompts.length} prompts
          </div>
        </div>
      </div>

      {/* Purchase Flow Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <PromptPurchaseFlow
            prompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
