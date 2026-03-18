import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Zap, Star, Flame, TrendingUp, Layers, Linkedin, ArrowUpRight } from "lucide-react";
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
  if (fields <= 1) return { label: 'Simples', color: 'text-success' };
  if (fields <= 3) return { label: 'Médio', color: 'text-secondary' };
  return { label: 'Avançado', color: 'text-accent' };
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
      <div className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 transition-all duration-500 ease-out",
        "bg-card/50 backdrop-blur-sm",
        "hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)]",
        "hover:translate-y-[-3px]",
        "focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background",
        isFull ? "flex flex-col" : "h-full"
      )}>
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          isFull ? "aspect-[4/5] w-full" : "aspect-[4/5]"
        )}>
          {prompt.example_image_url ? (
            <img
              src={prompt.example_image_url}
              alt={`Exemplo do prompt ${prompt.name}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
              <Sparkles className="w-16 h-16 text-primary/30" />
            </div>
          )}
          
          {/* Gradient Overlay - more dramatic */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
          
          {/* Scan line effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_49%,hsl(var(--primary)/0.03)_50%,transparent_51%,transparent_100%)] bg-[length:100%_4px]" />
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Hype Badge with glow */}
            <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-3 py-1 font-semibold border-0 shadow-[0_0_12px_hsl(var(--primary)/0.4)] backdrop-blur-md">
              {prompt.hype_text || 'Trending'}
            </Badge>

            {/* Category Icon with neon border */}
            <div className="w-9 h-9 rounded-xl bg-background/60 backdrop-blur-md flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all duration-300">
              <IconComponent className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Floating CTA on hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)] border border-primary-foreground/20">
              <ArrowUpRight className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5">
            {/* Category & Complexity */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-medium">
              <span className="text-muted-foreground">{prompt.category}</span>
              <span className="w-1 h-1 rounded-full bg-primary/50" />
              <span className={cn("flex items-center gap-1", complexity.color)}>
                <Layers className="w-3 h-3" />
                {complexity.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {prompt.name}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {prompt.description}
            </p>

            {/* Footer: Price + glow line */}
            <div className="pt-3 border-t border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-bold tracking-tight">
                  {formatPrice(prompt.price_cents || 2100)}
                </span>
              </div>
              
              {/* CTA hint */}
              <span className="text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 translate-x-2 group-hover:translate-x-0">
                <Sparkles className="w-3 h-3" />
                Gerar agora
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
