import { memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clapperboard, LayoutTemplate, Database, Download, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchVideoRenderer, type BatchRenderConfig } from "@/lib/batch-video-renderer";

/** Prévia animada de um vídeo de exemplo no hero. */
const HeroPreview = memo(({ config, delay }: { config: BatchRenderConfig; delay: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new BatchVideoRenderer(config, canvasRef.current);
    let stop: (() => void) | undefined;
    const timeout = setTimeout(() => {
      void renderer.playPreview().then((s) => {
        stop = s;
      });
    }, delay);
    return () => {
      clearTimeout(timeout);
      stop?.();
    };
  }, [config, delay]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-primary/20 bg-card">
      <canvas ref={canvasRef} className="w-full aspect-[9/16] object-cover" />
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5">
        <Play className="w-3 h-3 text-primary" />
        <span className="text-[9px] font-medium text-foreground/80">AO VIVO</span>
      </div>
    </div>
  );
});

HeroPreview.displayName = "HeroPreview";

const PREVIEW_CONFIGS: BatchRenderConfig[] = [
  {
    template_id: "demo",
    template_name: "Promoção Relâmpago",
    style: "promo",
    duration_seconds: 12,
    segment: "Estética",
    theme: "50% OFF em procedimentos",
    variation_index: 3,
    brand: { name: "Studio Glow", logo_url: null, primary_color: "#7C3AED", secondary_color: "#EC4899" },
  },
  {
    template_id: "demo",
    template_name: "Lançamento",
    style: "launch",
    duration_seconds: 12,
    segment: "Fitness",
    theme: "Nova turma de treino funcional",
    variation_index: 7,
    brand: { name: "IronFit", logo_url: null, primary_color: "#0EA5E9", secondary_color: "#22C55E" },
  },
  {
    template_id: "demo",
    template_name: "Dica Rápida",
    style: "tips",
    duration_seconds: 12,
    segment: "Restaurantes",
    theme: "Combo executivo de terça",
    variation_index: 11,
    brand: { name: "Sabor & Cia", logo_url: null, primary_color: "#F59E0B", secondary_color: "#EF4444" },
  },
];

const INDICATORS = [
  { icon: LayoutTemplate, label: "Templates editáveis" },
  { icon: Database, label: "Dados personalizados" },
  { icon: Download, label: "Download em lote" },
];

export const BatchHeroSection = memo(() => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" id="producao-em-lote">
      {/* Glow de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
            <Clapperboard className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary uppercase">
              Produção em Lote
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-[-0.03em] mb-6">
            Produza{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              centenas de vídeos
            </span>{" "}
            personalizados em poucos minutos
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            Crie até <strong className="text-foreground">300 vídeos de marketing por dia</strong>{" "}
            com a identidade de cada cliente: escolha o segmento, o tema e o template — o Arcana
            gera tudo em lote, pronto para baixar e publicar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow h-12 px-8 text-base"
            >
              <Link to="/app/producao-em-lote/nova">
                Começar produção
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-border/60">
              <a href="#como-funciona">Ver como funciona</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {INDICATORS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-border/40 bg-card/60 backdrop-blur-sm px-4 py-2"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground/80">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Prévia de vídeos sendo gerados */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:max-w-none"
        >
          {PREVIEW_CONFIGS.map((config, i) => (
            <motion.div
              key={config.variation_index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className={i === 1 ? "mt-6" : ""}
            >
              <HeroPreview config={config} delay={i * 900} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

BatchHeroSection.displayName = "BatchHeroSection";
