import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clapperboard, Plus, ArrowRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchJobs, fetchVideos, type BatchJob } from "@/lib/batch-api";

const JOB_STATUS_LABELS: Record<BatchJob["status"], string> = {
  queued: "Na fila",
  processing: "Processando",
  completed: "Concluído",
  failed: "Com erro",
  cancelled: "Cancelado",
};

export default function BatchProductionHub() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["batch-jobs"],
    queryFn: fetchJobs,
    refetchInterval: (query) =>
      query.state.data?.some((j) => j.status === "processing" || j.status === "queued")
        ? 2000
        : false,
  });

  const { data: videos = [] } = useQuery({
    queryKey: ["batch-videos", "counts"],
    queryFn: () => fetchVideos(),
  });

  const approved = videos.filter((v) => v.status === "aprovado").length;
  const published = videos.filter((v) => v.status === "publicado").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero do painel */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-secondary/15 backdrop-blur-xl p-8 md:p-10"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-4">
            <Clapperboard className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Produção em Lote
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Até 300 vídeos personalizados por dia
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mb-6">
            Escolha segmento, tema, cliente e template — o Arcana gera o lote completo com a
            identidade da marca, pronto para revisão, download e publicação.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary shadow-glow"
          >
            <Link to="/app/producao-em-lote/nova">
              <Plus className="w-4 h-4 mr-2" />
              Começar produção
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Métricas rápidas */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: "Vídeos gerados", value: videos.length },
          { label: "Aprovados", value: approved },
          { label: "Publicados", value: published },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 text-center"
          >
            <p className="font-display text-2xl md:text-3xl font-bold">{metric.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{metric.label}</p>
          </div>
        ))}
      </section>

      {/* Produções recentes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Produções recentes</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/meus-videos">
              Ver galeria
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
            <Clapperboard className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nenhuma produção ainda. Comece a primeira agora mesmo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const progress =
                job.status === "completed"
                  ? 100
                  : Math.round((job.videos_completed / job.quantity) * 100);
              return (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{job.theme}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {job.segment} · {job.quantity} vídeos ·{" "}
                        {new Date(job.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-3 py-1 border ${
                        job.status === "completed"
                          ? "text-green-400 border-green-500/30 bg-green-500/10"
                          : job.status === "failed"
                            ? "text-destructive border-destructive/30 bg-destructive/10"
                            : "text-secondary border-secondary/30 bg-secondary/10"
                      }`}
                    >
                      {job.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : job.status === "failed" ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {JOB_STATUS_LABELS[job.status]}
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {job.videos_completed}/{job.quantity} vídeos
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
