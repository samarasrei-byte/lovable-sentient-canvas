import { Camera, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PremiumServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    features: string[];
    themes: Array<{ name: string }>;
  };
  onClick: () => void;
  isFirst?: boolean;
}

export const PremiumServiceCard = ({ service, onClick, isFirst }: PremiumServiceCardProps) => {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
  };

  return (
    <GlassCard 
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        isFirst ? "border-primary/50 shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] md:col-span-2" : "border-border/40 hover:border-primary/30"
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      <GlassCardContent className="p-8 relative z-10">
        <div className={cn(
          "flex flex-col md:flex-row gap-8 items-start",
          isFirst ? "md:items-center" : ""
        )}>
          {/* Icon & Status */}
          <div className="flex-shrink-0">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110",
              isFirst 
                ? "bg-gradient-to-br from-primary to-secondary border-primary/20 shadow-lg shadow-primary/20" 
                : "bg-white/5 border-white/10"
            )}>
              <Camera className={cn("w-10 h-10", isFirst ? "text-white" : "text-primary")} />
            </div>
            {isFirst && (
              <div className="mt-4 flex justify-center">
                <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  MAIS POPULAR
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow space-y-4">
            <div className="flex items-center gap-3">
              <h3 className={cn(
                "font-black tracking-tight",
                isFirst ? "text-3xl md:text-4xl" : "text-2xl"
              )}>
                {service.name}
              </h3>
              {isFirst && <ShieldCheck className="w-6 h-6 text-green-500" />}
            </div>

            <p className="text-muted-foreground text-lg font-light max-w-2xl leading-relaxed">
              {service.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {service.themes.slice(0, 5).map((theme, i) => (
                <span key={i} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                  {theme.name}
                </span>
              ))}
              {service.themes.length > 5 && (
                <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                  +{service.themes.length - 5} TEMAS
                </span>
              )}
            </div>
          </div>

          {/* CTA & Pricing */}
          <div className={cn(
            "flex-shrink-0 w-full md:w-auto flex flex-col items-center md:items-end justify-center space-y-4 p-6 rounded-2xl border bg-white/[0.02]",
            isFirst ? "border-primary/20 bg-primary/5" : "border-white/5"
          )}>
            <div className="text-center md:text-right">
              <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-1 font-bold">Investimento</div>
              <div className="text-4xl font-black text-foreground">
                {formatPrice(service.price_cents)}
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">Taxas de processamento inclusas</div>
            </div>

            <GlassButton 
              variant={isFirst ? "neon" : "outline"} 
              className={cn(
                "w-full md:w-56 h-14 text-base font-bold transition-all",
                isFirst ? "hover:scale-105 shadow-xl shadow-primary/20" : ""
              )}
              onClick={onClick}
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </GlassButton>
            
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 font-medium">
              <Zap className="w-3 h-3" />
              Processamento Instantâneo via IA
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};