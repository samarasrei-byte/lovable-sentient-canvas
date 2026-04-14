import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Star, TrendingUp, Layers, Linkedin, ArrowUpRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const isMobile = useIsMobile();

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
        "relative overflow-hidden transition-all duration-500 ease-out",
        "border border-border/40",
        "hover:border-primary/30 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.15)]",
        "hover:translate-y-[-3px]",
        "focus-within:ring-1 focus-within:ring-primary/30 focus-within:ring-offset-1 focus-within:ring-offset-background",
        isMobile ? "rounded-2xl bg-card/80 backdrop-blur-sm" : "rounded-xl bg-card/40",
        isFull ? "flex flex-col" : "h-full"
      )}>
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          "aspect-[4/5] w-full"
        )}>
          {prompt.example_image_url ? (
            <img
              src={prompt.example_image_url}
              alt={`Exemplo do prompt ${prompt.name}`}
              className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.08] object-cover scale-[1.02]"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <Sparkles className="w-14 h-14 text-primary/20" />
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className={cn(
              "text-[10px] px-3 py-1 font-semibold border-0 shadow-lg",
              "bg-primary/90 text-primary-foreground backdrop-blur-md"
            )}>
              {prompt.hype_text || 'Trending'}
            </Badge>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-background/60 backdrop-blur-md border border-border/30"
            )}>
              <IconComponent className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>

        </div>

        {/* Content Section */}
        <div className={cn(
          "relative flex flex-col gap-2",
          isMobile ? "p-4 pb-5" : "p-3.5"
        )}>
          {/* Category + Complexity */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-medium">
            <span className="text-muted-foreground">{prompt.category}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className={cn("flex items-center gap-1", complexity.color)}>
              <Layers className="w-2.5 h-2.5" />
              {complexity.label}
            </span>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-bold text-foreground leading-tight line-clamp-2",
            "group-hover:text-primary transition-colors duration-300",
            isMobile ? "text-lg" : "text-base"
          )}>
            {prompt.name}
          </h3>

          {/* Description */}
          <p className={cn(
            "text-muted-foreground leading-relaxed line-clamp-2",
            isMobile ? "text-sm" : "text-xs"
          )}>
            {prompt.description}
          </p>

          {/* Price + CTA */}
          <div className={cn(
            "flex items-center justify-between mt-1",
            "pt-3 border-t border-border/30"
          )}>
            <div className="flex flex-col">
              <span className={cn(
                "font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
                isMobile ? "text-lg" : "text-sm"
              )}>
                {formatPrice(prompt.price_cents || 2100)}
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              "bg-primary/10 text-primary border border-primary/20",
              "group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
            )}>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className={isMobile ? "" : "hidden sm:inline"}>Gerar</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
