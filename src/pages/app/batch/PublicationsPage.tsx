import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BatchVideoCard } from "@/components/batch/BatchVideoCard";
import { useState } from "react";
import { BatchVideoRenderer } from "@/lib/batch-video-renderer";
import { bulkUpdateVideos, fetchVideos, type BatchVideo } from "@/lib/batch-api";

export default function PublicationsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["batch-videos", "publications"],
    queryFn: () => fetchVideos(),
  });

  const scheduled = videos.filter((v) => v.scheduled_at && v.status !== "publicado");
  const published = videos.filter((v) => v.status === "publicado");
  const approved = videos.filter((v) => v.status === "aprovado");

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handlePublish = async () => {
    if (selected.size === 0) return;
    setPublishing(true);
    try {
      await bulkUpdateVideos([...selected], "publish");
      toast.success("Vídeos publicados!");
      setSelected(new Set());
      void queryClient.invalidateQueries({ queryKey: ["batch-videos"] });
    } catch {
      toast.error("Falha ao publicar.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDownload = async (video: BatchVideo) => {
    setDownloadingId(video.id);
    try {
      const blob = await new BatchVideoRenderer(video.render_config).exportWebM();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${video.title.replace(/[^\w\d]+/g, "-").slice(0, 60)}.webm`;
        anchor.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const Section = ({
    title,
    icon: Icon,
    items,
  }: {
    title: string;
    icon: React.ElementType;
    items: BatchVideo[];
  }) => (
    <section className="mb-10">
      <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
        <span className="text-xs text-muted-foreground font-normal">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border/60 p-6 text-center">
          Nada por aqui ainda.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((video) => (
            <BatchVideoCard
              key={video.id}
              video={video}
              selected={selected.has(video.id)}
              onToggleSelect={toggleSelect}
              onDownload={(v) => void handleDownload(v)}
              downloading={downloadingId === video.id}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Publicações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vídeos aprovados, agendados e publicados.
          </p>
        </div>
        {selected.size > 0 && (
          <Button
            onClick={() => void handlePublish()}
            disabled={publishing}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {publishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            Publicar {selected.size} selecionados
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Section title="Aprovados para publicar" icon={Globe} items={approved} />
          <Section title="Agendados" icon={CalendarClock} items={scheduled} />
          <Section title="Publicados" icon={Globe} items={published} />
        </>
      )}
    </div>
  );
}
