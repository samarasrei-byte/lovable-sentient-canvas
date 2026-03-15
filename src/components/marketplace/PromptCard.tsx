import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Zap, Star, Flame, TrendingUp, Layers, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
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
}

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onSelect: (prompt: Prompt) => void;
  variant?: 'grid' | 'full';
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'cyberpunk':
      return Zap;
    case 'anime':
      return Star;
    case 'fashion':
      return Sparkles;
    case 'trending':
      return TrendingUp;
    case 'linkedin':
      return Linkedin;
    default:
      return Flame;
  }
};

const getComplexityLevel = (prompt: Prompt): { label: string; color: string } => {
  const fields = prompt.required_fields?.length || 0;
  if (fields <= 1) return { label: 'Simples', color: 'text-green-400' };
  if (fields <= 3) return { label: 'Médio', color: 'text-yellow-400' };
  return { label: 'Avançado', color: 'text-orange-400' };
};

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100);
};

export const PromptCard = ({ prompt, index, onSelect, variant = 'grid' }: PromptCardProps) => {
  const IconComponent = getCategoryIcon(prompt.category);
  const complexity = getComplexityLevel(prompt);
  const isFull = variant === 'full';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
      className={cn(
        "group cursor-pointer",
        isFull && "w-full"
      )}
      onClick={() => onSelect(prompt)}
      role="button"
      tabIndex={0}
      aria-label={`Ver prompt ${prompt.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(prompt)}
    >
      <GlassCard className={cn(
        "overflow-hidden border-white/[0.06] transition-all duration-500 ease-out",
        "hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)]",
        "hover:translate-y-[-2px]",
        "focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background",
        isFull ? "flex flex-col" : "h-full"
      )}>
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5",
          isFull ? "aspect-[4/5] w-full" : "aspect-[4/5]"
        )}>
          {prompt.example_image_url ? (
            <img
              src={prompt.example_image_url}
              alt={`Exemplo do prompt ${prompt.name}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary/30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Hype Badge */}
            <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 text-white text-[10px] px-2.5 py-0.5 font-semibold border-0 shadow-lg backdrop-blur-sm">
              {prompt.hype_text || '🔥 Trending'}
            </Badge>

            {/* Category Icon */}
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
              <IconComponent className="w-4 h-4 text-white/90" />
            </div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Category & Complexity */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
              <span className="text-white/60">{prompt.category}</span>
              <span className="text-white/30">•</span>
              <span className={cn("flex items-center gap-1", complexity.color)}>
                <Layers className="w-3 h-3" />
                {complexity.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2 group-hover:text-primary/90 transition-colors">
              {prompt.name}
            </h3>

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
              {prompt.description}
            </p>

            {/* Footer: Price + CTA hint */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-white/50 text-xs font-medium">
                {formatPrice(prompt.price_cents || 2100)}
              </span>
              
              {/* Implicit CTA - appears on hover */}
              <span className="text-primary/80 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gerar
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
};
