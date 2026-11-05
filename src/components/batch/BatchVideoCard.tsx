import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, Loader2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BatchVideoRenderer } from "@/lib/batch-video-renderer";
import { VIDEO_STATUS_LABELS, type BatchVideo, type BatchVideoStatus } from "@/lib/batch-api";

const STATUS_STYLES: Record<BatchVideoStatus, string> = {
  aguardando: "bg-muted text-muted-foreground border-border",
  processando: "bg-secondary/15 text-secondary border-secondary/30",
  concluido: "bg-primary/15 text-primary border-primary/30",
  erro: "bg-destructive/15 text-destructive border-destructive/30",
  aprovado: "bg-green-500/15 text-green-400 border-green-500/30",
  publicado: "bg-accent/15 text-accent border-accent/30",
};

const thumbnailCache = new Map<string, string>();

interface BatchVideoCardProps {
  video: BatchVideo;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onDownload: (video: BatchVideo) => void;
  downloading?: boolean;
}

export const BatchVideoCard = memo(
  ({ video, selected, onToggleSelect, onDownload, downloading }: BatchVideoCardProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(
      thumbnailCache.get(video.id) ?? null,
    );
    const [hovering, setHovering] = useState(false);

    // Miniatura estática (gerada uma vez e cacheada)
    useEffect(() => {
      if (thumbnail) return;
      let cancelled = false;
      const renderer = new BatchVideoRenderer(video.render_config);
      renderer
        .renderThumbnail()
        .then((dataUrl) => {
          if (cancelled) return;
          thumbnailCache.set(video.id, dataUrl);
          setThumbnail(dataUrl);
        })
        .catch(() => undefined);
      return () => {
        cancelled = true;
      };
    }, [video.id, video.render_config, thumbnail]);

    // Prévia animada ao passar o mouse / tocar
    useEffect(() => {
      if (!hovering || !canvasRef.current) return;
      const renderer = new BatchVideoRenderer(video.render_config, canvasRef.current);
      let stop: (() => void) | undefined;
      void renderer.playPreview().then((s) => {
        stop = s;
      });
      return () => stop?.();
    }, [hovering, video.render_config]);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "group relative rounded-2xl border bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-200",
          selected
            ? "border-primary shadow-lg shadow-primary/20 ring-1 ring-primary/40"
            : "border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
        )}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Preview 9:16 */}
        <div
          className="relative aspect-[9/16] bg-muted/40 cursor-pointer"
          onClick={() => onToggleSelect(video.id)}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                hovering ? "opacity-0" : "opacity-100",
              )}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/40" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              hovering ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Checkbox de seleção */}
          <button
            type="button"
            aria-label={selected ? "Desmarcar vídeo" : "Selecionar vídeo"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(video.id);
            }}
            className={cn(
              "absolute top-2 left-2 w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
              selected
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-background/60 border-border/60 text-transparent backdrop-blur-sm",
            )}
          >
            <Check className="w-4 h-4" />
          </button>

          {/* Status */}
          <Badge
            variant="outline"
            className={cn("absolute top-2 right-2 text-[10px] backdrop-blur-sm", STATUS_STYLES[video.status])}
          >
            {VIDEO_STATUS_LABELS[video.status]}
          </Badge>

          {video.scheduled_at && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-foreground/80 bg-background/60 backdrop-blur-sm rounded-md px-2 py-1">
              <Calendar className="w-3 h-3" />
              {new Date(video.scheduled_at).toLocaleDateString("pt-BR")}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-3 flex items-center gap-2">
          <p className="flex-1 text-xs font-medium truncate" title={video.title}>
            {video.title}
          </p>
          <button
            type="button"
            aria-label="Baixar vídeo"
            disabled={downloading}
            onClick={() => onDownload(video)}
            className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>
    );
  },
);

BatchVideoCard.displayName = "BatchVideoCard";
