import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  StepSegment,
  StepTheme,
  StepQuantity,
  StepClient,
  StepTemplate,
  StepBrandReview,
} from "@/components/batch/wizard-steps";
import {
  createBatchJob,
  fetchClients,
  fetchJob,
  fetchTemplates,
} from "@/lib/batch-api";

const STEPS = [
  "Segmento",
  "Tema",
  "Quantidade",
  "Cliente",
  "Template",
  "Marca",
  "Gerar",
] as const;

export default function BatchWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [segment, setSegment] = useState("");
  const [theme, setTheme] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [clientId, setClientId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const wizardStartedRef = useRef(false);
  const trackedOutcomeRef = useRef<string | null>(null);

  const { data: clients = [] } = useQuery({ queryKey: ["batch-clients"], queryFn: fetchClients });
  const { data: templates = [] } = useQuery({
    queryKey: ["video-templates"],
    queryFn: fetchTemplates,
  });

  // Acompanhamento do job em tempo real (polling)
  const { data: job } = useQuery({
    queryKey: ["batch-job", jobId],
    queryFn: () => fetchJob(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) =>
      query.state.data?.status === "completed" || query.state.data?.status === "failed"
        ? false
        : 1200,
  });

  // Analytics: registra uma única vez o desfecho do job (concluído ou falhou)
  useEffect(() => {
    if (!job || !jobId || trackedOutcomeRef.current === jobId) return;
    if (job.status !== "completed" && job.status !== "failed") return;
    trackedOutcomeRef.current = jobId;
    window.__lovableEvents?.track?.(
      job.status === "completed" ? "project.batch_generation_completed" : "project.batch_generation_failed",
      { quantity: job.quantity, videos_completed: job.videos_completed, videos_failed: job.videos_failed },
    );
  }, [job, jobId]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === clientId) ?? null,
    [clients, clientId],
  );

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(segment);
      case 1:
        return theme.trim().length >= 3;
      case 2:
        return quantity > 0;
      case 3:
        return Boolean(clientId);
      case 4:
        return Boolean(templateId);
      case 5:
        return Boolean(selectedClient);
      default:
        return true;
    }
  }, [step, segment, theme, quantity, clientId, templateId, selectedClient]);

  const handleGenerate = async () => {
    setSubmitting(true);
    try {
      const result = await createBatchJob({
        segment,
        theme: theme.trim(),
        quantity,
        client_id: clientId,
        template_id: templateId,
      });
      setJobId(result.job_id);
      window.__lovableEvents?.track?.("project.batch_job_created", {
        quantity,
        segment,
      });
      toast.success("Produção iniciada!", {
        description: `${result.credits_cost} créditos utilizados.`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível iniciar a produção.");
      setSubmitting(false);
    }
  };

  /* ------- Tela de acompanhamento da geração ------- */
  if (jobId) {
    const progress = job ? Math.round((job.videos_completed / job.quantity) * 100) : 0;
    const done = job?.status === "completed";
    const failed = job?.status === "failed";
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 text-center"
        >
          {done ? (
            <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-green-400" />
          ) : (
            <Loader2 className="w-14 h-14 mx-auto mb-4 animate-spin text-primary" />
          )}
          <h2 className="font-display text-2xl font-bold mb-2">
            {done ? "Produção concluída!" : failed ? "Falha na produção" : "Gerando seus vídeos..."}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {done
              ? `${job?.videos_completed ?? 0} vídeos prontos para baixar e publicar.`
              : failed
                ? (job?.error_message ?? "Tente novamente em instantes.")
                : `${job?.videos_completed ?? 0} de ${job?.quantity ?? quantity} vídeos gerados`}
          </p>
          <Progress value={done ? 100 : progress} className="h-2 mb-6" />
          {done ? (
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/app/meus-videos")}
            >
              Ver meus vídeos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            failed && (
              <Button variant="outline" className="w-full" onClick={() => setJobId(null)}>
                Voltar e tentar de novo
              </Button>
            )
          )}
        </motion.div>
      </div>
    );
  }

  /* ------------------------ Wizard em etapas ------------------------ */
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="icon" aria-label="Voltar">
          <Link to="/app/producao-em-lote">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Nova produção em lote</h1>
          <p className="text-xs text-muted-foreground">
            Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
          </p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Conteúdo da etapa */}
      <AnimatePresence mode="wait">
        <div key={step} className="min-h-[320px]">
          {step === 0 && <StepSegment value={segment} onChange={setSegment} />}
          {step === 1 && <StepTheme value={theme} onChange={setTheme} />}
          {step === 2 && <StepQuantity value={quantity} onChange={setQuantity} />}
          {step === 3 && (
            <>
              <StepClient clients={clients} value={clientId} onChange={setClientId} />
              {clients.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Você ainda não tem clientes.{" "}
                  <Link to="/app/clientes" className="text-primary font-medium hover:underline">
                    Cadastrar o primeiro cliente
                  </Link>
                </p>
              )}
            </>
          )}
          {step === 4 && (
            <StepTemplate templates={templates} value={templateId} onChange={setTemplateId} />
          )}
          {step === 5 && selectedClient && <StepBrandReview client={selectedClient} />}
          {step === 6 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto rounded-2xl border border-border/40 bg-card/50 p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-4">Resumo da produção</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Segmento</dt>
                  <dd className="font-medium">{segment}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Tema</dt>
                  <dd className="font-medium text-right line-clamp-2">{theme}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Quantidade</dt>
                  <dd className="font-medium">{quantity} vídeos</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cliente</dt>
                  <dd className="font-medium">{selectedClient?.name}</dd>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 mt-2">
                  <dt className="text-muted-foreground">Custo total</dt>
                  <dd className="font-bold text-primary">{quantity} créditos</dd>
                </div>
              </dl>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Navegação */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => {
              if (!canAdvance) return;
              if (step === 0 && !wizardStartedRef.current) {
                wizardStartedRef.current = true;
                window.__lovableEvents?.track?.("project.batch_wizard_started", { segment });
              }
              setStep((s) => s + 1);
            }}
            disabled={!canAdvance}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            Avançar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={submitting}
            className="bg-gradient-to-r from-primary to-secondary shadow-glow"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Gerar vídeos
          </Button>
        )}
      </div>
    </div>
  );
}
