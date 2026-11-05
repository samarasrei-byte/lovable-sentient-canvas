import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import JSZip from "jszip";
import {
  CheckCheck,
  CalendarClock,
  Download,
  FileArchive,
  Loader2,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BatchVideoCard } from "@/components/batch/BatchVideoCard";
import { BatchVideoRenderer } from "@/lib/batch-video-renderer";
import {
  bulkUpdateVideos,
  fetchClients,
  fetchVideos,
  VIDEO_STATUS_LABELS,
  type BatchVideo,
  type BatchVideoStatus,
} from "@/lib/batch-api";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function MyVideos() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<BatchVideoStatus | "todos">("todos");
  const [clientId, setClientId] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      status,
      clientId: clientId === "todos" ? undefined : clientId,
      search: search.trim() || undefined,
    }),
    [status, clientId, search],
  );

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["batch-videos", filters],
    queryFn: () => fetchVideos(filters),
  });
  const { data: clients = [] } = useQuery({ queryKey: ["batch-clients"], queryFn: fetchClients });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const refresh = () => {
    setSelected(new Set());
    void queryClient.invalidateQueries({ queryKey: ["batch-videos"] });
  };

  const runBulk = async (operation: "approve" | "delete" | "schedule") => {
    if (selected.size === 0) return;
    setBusyAction(operation);
    try {
      if (operation === "schedule") {
        const input = window.prompt("Data e hora do agendamento (AAAA-MM-DD HH:mm):");
        if (!input) return;
        const date = new Date(input.replace(" ", "T"));
        if (Number.isNaN(date.getTime())) {
          toast.error("Data inválida. Use o formato AAAA-MM-DD HH:mm");
          return;
        }
        await bulkUpdateVideos([...selected], "schedule", date.toISOString());
        toast.success("Vídeos agendados!");
      } else {
        await bulkUpdateVideos([...selected], operation);
        toast.success(
          operation === "approve" ? "Vídeos aprovados!" : "Vídeos excluídos.",
        );
      }
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ação falhou.");
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownload = async (video: BatchVideo) => {
    setDownloadingId(video.id);
    try {
      const blob = await new BatchVideoRenderer(video.render_config).exportWebM();
      if (!blob) {
        toast.error("Seu navegador não suporta exportação de vídeo.");
        return;
      }
      downloadBlob(blob, `${video.title.replace(/[^\w\d]+/g, "-").slice(0, 60)}.webm`);
      toast.success("Download iniciado!");
    } catch {
      toast.error("Falha ao exportar o vídeo.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadZip = async () => {
    const chosen = videos.filter((v) => selected.has(v.id));
    if (chosen.length === 0) return;
    setBusyAction("zip");
    const zip = new JSZip();
    let exported = 0;
    try {
      for (const video of chosen) {
        const blob = await new BatchVideoRenderer(video.render_config).exportWebM();
        if (blob) {
          zip.file(
            `${String(video.variation_index + 1).padStart(3, "0")}-${video.title.replace(/[^\w\d]+/g, "-").slice(0, 50)}.webm`,
            blob,
          );
          exported++;
        }
      }
      if (exported === 0) {
        toast.error("Nenhum vídeo pôde ser exportado neste navegador.");
        return;
      }
      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob(content, `arcana-videos-${Date.now()}.zip`);
      toast.success(`ZIP com ${exported} vídeos baixado!`);
    } catch {
      toast.error("Falha ao gerar o ZIP.");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Meus Vídeos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {videos.length} vídeos · {selected.size} selecionados
          </p>
        </div>

        {/* Ações em massa */}
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            <Button
              size="sm"
              variant="outline"
              disabled={busyAction !== null}
              onClick={() => void runBulk("approve")}
            >
              <CheckCheck className="w-4 h-4 mr-1.5" />
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyAction !== null}
              onClick={() => void runBulk("schedule")}
            >
              <CalendarClock className="w-4 h-4 mr-1.5" />
              Agendar
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyAction !== null}
              onClick={() => void handleDownloadZip()}
            >
              {busyAction === "zip" ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <FileArchive className="w-4 h-4 mr-1.5" />
              )}
              Baixar ZIP
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={busyAction !== null}
              onClick={() => void runBulk("delete")}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Excluir
            </Button>
          </motion.div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="pl-9 bg-card/50 border-border/40"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as BatchVideoStatus | "todos")}>
          <SelectTrigger className="w-full sm:w-44 bg-card/50 border-border/40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {Object.entries(VIDEO_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger className="w-full sm:w-48 bg-card/50 border-border/40">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os clientes</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Galeria */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <Video className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Nenhum vídeo encontrado. Inicie uma produção em lote para encher esta galeria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {videos.map((video) => (
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

      {/* Barra de download individual em andamento */}
      {downloadingId && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 backdrop-blur-xl px-5 py-2.5 shadow-glow z-40">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-xs font-medium">
            <Download className="inline w-3 h-3 mr-1" />
            Renderizando vídeo...
          </span>
        </div>
      )}
    </div>
  );
}
