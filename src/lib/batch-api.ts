import { supabase } from "@/integrations/supabase/client";
import type { BatchRenderConfig } from "@/lib/batch-video-renderer";

/* ------------------------------- Tipos ------------------------------- */

export interface BatchClient {
  id: string;
  user_id: string;
  name: string;
  brand_name: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  whatsapp: string | null;
  notes: string | null;
  created_at: string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  config: Record<string, unknown>;
  display_order: number;
}

export type BatchJobStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";

export interface BatchJob {
  id: string;
  user_id: string;
  client_id: string | null;
  template_id: string | null;
  segment: string;
  theme: string;
  quantity: number;
  credits_cost: number;
  status: BatchJobStatus;
  videos_completed: number;
  videos_failed: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export type BatchVideoStatus =
  | "aguardando"
  | "processando"
  | "concluido"
  | "erro"
  | "aprovado"
  | "publicado";

export interface BatchVideo {
  id: string;
  job_id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  status: BatchVideoStatus;
  video_url: string | null;
  thumbnail_url: string | null;
  render_config: BatchRenderConfig;
  variation_index: number;
  error_message: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
}

export const VIDEO_STATUS_LABELS: Record<BatchVideoStatus, string> = {
  aguardando: "Aguardando",
  processando: "Processando",
  concluido: "Concluído",
  erro: "Com erro",
  aprovado: "Aprovado",
  publicado: "Publicado",
};

export const BATCH_SEGMENTS = [
  "Estética e Beleza",
  "Fitness e Saúde",
  "Restaurantes e Delivery",
  "Imobiliárias",
  "Moda e Vestuário",
  "Pet Shop",
  "Clínicas e Consultórios",
  "Educação e Cursos",
  "Tecnologia",
  "Automotivo",
  "Varejo e E-commerce",
  "Serviços Locais",
] as const;

export const BATCH_QUANTITIES = [50, 100, 200, 300] as const;

/* ------------------------------ Consultas ----------------------------- */

export async function fetchClients(): Promise<BatchClient[]> {
  const { data, error } = await supabase
    .from("batch_clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BatchClient[];
}

export async function createClientRecord(
  payload: Pick<BatchClient, "name"> &
    Partial<Omit<BatchClient, "id" | "user_id" | "created_at" | "name">>,
): Promise<BatchClient> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Você precisa estar logado.");
  const { data, error } = await supabase
    .from("batch_clients")
    .insert({ ...payload, user_id: auth.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as BatchClient;
}

export async function updateClientRecord(id: string, payload: Partial<BatchClient>): Promise<void> {
  const { error } = await supabase.from("batch_clients").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteClientRecord(id: string): Promise<void> {
  const { error } = await supabase.from("batch_clients").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchTemplates(): Promise<VideoTemplate[]> {
  const { data, error } = await supabase
    .from("video_templates")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as VideoTemplate[];
}

export async function fetchJobs(): Promise<BatchJob[]> {
  const { data, error } = await supabase
    .from("batch_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as BatchJob[];
}

export async function fetchJob(id: string): Promise<BatchJob> {
  const { data, error } = await supabase.from("batch_jobs").select("*").eq("id", id).single();
  if (error) throw error;
  return data as BatchJob;
}

export interface VideoFilters {
  status?: BatchVideoStatus | "todos";
  clientId?: string;
  search?: string;
}

export async function fetchVideos(filters: VideoFilters = {}): Promise<BatchVideo[]> {
  let query = supabase
    .from("batch_videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (filters.status && filters.status !== "todos") query = query.eq("status", filters.status);
  if (filters.clientId) query = query.eq("client_id", filters.clientId);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as BatchVideo[];
}

/* ------------------------------- Ações -------------------------------- */

export interface CreateJobPayload {
  segment: string;
  theme: string;
  quantity: number;
  client_id: string;
  template_id: string;
}

export async function invokeBatchAction<T>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("batch-production", { body: payload });
  if (error) {
    const message =
      (data as { error?: string } | null)?.error ??
      (typeof error.message === "string" ? error.message : "Erro ao processar a solicitação.");
    throw new Error(message);
  }
  if ((data as { error?: string })?.error) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

export function createBatchJob(payload: CreateJobPayload) {
  return invokeBatchAction<{ job_id: string; videos_created: number; credits_cost: number }>({
    action: "create_job",
    ...payload,
  });
}

export function bulkUpdateVideos(
  videoIds: string[],
  operation: "approve" | "delete" | "schedule" | "publish" | "back_to_review",
  scheduledAt?: string,
) {
  return invokeBatchAction<{ updated: number }>({
    action: "bulk_update",
    video_ids: videoIds,
    operation,
    scheduled_at: scheduledAt,
  });
}
