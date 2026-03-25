import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Star, TrendingUp, Layers, Linkedin, ArrowUpRight } from "lucide-react";
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
    case 'cyberpunk': return Zap;
    case 'anime': return Star;
    case 'fashion': return Sparkles;
    case 'trending': return TrendingUp;
    case 'linkedin': return Linkedin;
    default: return Sparkles;
  }
};

const getComplexityLevel = (prompt: Prompt): { label: string; color: string } => {
  const fields = prompt.required_fields?.length || 0;
  if (fields <= 1) return { label: 'Simples', color: 'text-primary/60' };
  if (fields <= 3) return { label: 'Médio', color: 'text-secondary/70' };
  return { label: 'Avançado', color: 'text-accent/70' };
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
    <article
      className={cn("group cursor-pointer", isFull && "w-full")}
      onClick={() => onSelect(prompt)}
      role="button"
      tabIndex={0}
      aria-label={`Ver prompt ${prompt.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(prompt)}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 ease-out",
        "bg-white/[0.02] border border-white/[0.05]",
        "hover:border-white/[0.12] hover:bg-white/[0.04]",
        "hover:translate-y-[-2px]",
        "focus-within:ring-1 focus-within:ring-primary/30 focus-within:ring-offset-1 focus-within:ring-offset-background",
        isFull ? "flex flex-col" : "h-full"
      )}>
        {/* Image */}
        <div className={cn("relative overflow-hidden", isFull ? "aspect-[4/5] w-full" : "aspect-[4/5]")}>
          {prompt.example_image_url ? (
            <img
              src={prompt.example_image_url}
              alt={`Exemplo do prompt ${prompt.name}`}
              className="w-full h-full object-contain sm:object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <Sparkles className="w-12 h-12 text-primary/15" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className="bg-white/[0.08] text-foreground/80 text-[10px] px-3 py-1 font-medium border border-white/[0.08]">
              {prompt.hype_text || 'Trending'}
            </Badge>
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
              <IconComponent className="w-3.5 h-3.5 text-primary/60" />
            </div>
          </div>

          {/* Hover CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <div className="w-12 h-12 rounded-full bg-white/[0.1] flex items-center justify-center border border-white/[0.15]">
              <ArrowUpRight className="w-5 h-5 text-foreground/80" />
            </div>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-medium">
              <span className="text-muted-foreground/60">{prompt.category}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
              <span className={cn("flex items-center gap-1", complexity.color)}>
                <Layers className="w-2.5 h-2.5" />
                {complexity.label}
              </span>
            </div>

            <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-2 group-hover:text-primary/90 transition-colors duration-300">
              {prompt.name}
            </h3>

            <p className="text-muted-foreground/60 text-xs leading-relaxed line-clamp-2">
              {prompt.description}
            </p>

            <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold tracking-tight">
                {formatPrice(prompt.price_cents || 2100)}
              </span>
              <span className="text-primary/60 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                Gerar agora
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
