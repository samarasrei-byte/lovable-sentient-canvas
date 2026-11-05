import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_QUANTITIES = [50, 100, 200, 300] as const;
const CREDITS_PER_VIDEO = 1;
const INSERT_CHUNK_SIZE = 50;

const CreateJobSchema = z.object({
  action: z.literal("create_job"),
  segment: z.string().min(1).max(120),
  theme: z.string().min(3).max(500),
  quantity: z.number().int().refine((n) => (ALLOWED_QUANTITIES as readonly number[]).includes(n), {
    message: "quantity must be one of 50, 100, 200, 300",
  }),
  client_id: z.string().uuid(),
  template_id: z.string().uuid(),
});

const BulkUpdateSchema = z.object({
  action: z.literal("bulk_update"),
  video_ids: z.array(z.string().uuid()).min(1).max(300),
  operation: z.enum(["approve", "delete", "schedule", "publish", "back_to_review"]),
  scheduled_at: z.string().datetime().optional(),
});

const RetryFailedSchema = z.object({
  action: z.literal("retry_failed"),
  job_id: z.string().uuid(),
});

const RequestSchema = z.discriminatedUnion("action", [
  CreateJobSchema,
  BulkUpdateSchema,
  RetryFailedSchema,
]);

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return jsonResponse({ error: "Não autenticado." }, 401);
    }

    const rawBody = await req.json().catch(() => null);
    const parsed = RequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonResponse(
        { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
        400,
      );
    }

    const service = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = parsed.data;

    if (body.action === "create_job") {
      return await handleCreateJob(service, user.id, body);
    }
    if (body.action === "bulk_update") {
      return await handleBulkUpdate(service, user.id, body);
    }
    return await handleRetryFailed(service, user.id, body);
  } catch (err) {
    console.error("[batch-production] unexpected error:", err);
    return jsonResponse({ error: "Erro interno. Tente novamente." }, 500);
  }
});

type ServiceClient = ReturnType<typeof createClient>;

async function handleCreateJob(
  service: ServiceClient,
  userId: string,
  body: z.infer<typeof CreateJobSchema>,
): Promise<Response> {
  // 1. Validate client ownership
  const { data: client, error: clientError } = await service
    .from("batch_clients")
    .select("id, name, brand_name, logo_url, primary_color, secondary_color")
    .eq("id", body.client_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (clientError || !client) {
    return jsonResponse({ error: "Cliente não encontrado." }, 404);
  }

  // 2. Validate template
  const { data: template, error: templateError } = await service
    .from("video_templates")
    .select("id, name, duration_seconds, config")
    .eq("id", body.template_id)
    .eq("is_active", true)
    .maybeSingle();

  if (templateError || !template) {
    return jsonResponse({ error: "Template não encontrado ou inativo." }, 404);
  }

  const creditsCost = body.quantity * CREDITS_PER_VIDEO;

  // 3. Create the job first (so we can reference it in the credit ledger)
  const { data: job, error: jobError } = await service
    .from("batch_jobs")
    .insert({
      user_id: userId,
      client_id: client.id,
      template_id: template.id,
      segment: body.segment,
      theme: body.theme,
      quantity: body.quantity,
      credits_per_video: CREDITS_PER_VIDEO,
      credits_cost: creditsCost,
      status: "processing",
    })
    .select("id")
    .single();

  if (jobError || !job) {
    console.error("[batch-production] job insert failed:", jobError);
    return jsonResponse({ error: "Não foi possível criar a produção." }, 500);
  }

  // 4. Consume credits (service_role is allowed by the RPC guard)
  const { data: consumed, error: creditsError } = await service.rpc("consume_credits", {
    p_user_id: userId,
    p_amount: creditsCost,
    p_description: `Produção em lote: ${body.quantity} vídeos (${template.name})`,
    p_reference_id: job.id,
    p_reference_type: "batch_job",
  });

  if (creditsError || consumed !== true) {
    await service.from("batch_jobs").delete().eq("id", job.id);
    return jsonResponse(
      { error: `Créditos insuficientes. Você precisa de ${creditsCost} créditos para esta produção.` },
      402,
    );
  }

  // 5. Generate the video records in chunks, updating progress for realtime UX
  try {
    let completed = 0;
    for (let start = 0; start < body.quantity; start += INSERT_CHUNK_SIZE) {
      const chunkSize = Math.min(INSERT_CHUNK_SIZE, body.quantity - start);
      const rows = Array.from({ length: chunkSize }, (_, i) => {
        const variationIndex = start + i;
        return {
          job_id: job.id,
          user_id: userId,
          client_id: client.id,
          title: `${client.brand_name ?? client.name} · ${body.theme} · #${variationIndex + 1}`,
          status: "concluido" as const,
          variation_index: variationIndex,
          render_config: {
            template_id: template.id,
            template_name: template.name,
            style: (template.config as Record<string, unknown>)?.style ?? "promo",
            duration_seconds: template.duration_seconds,
            segment: body.segment,
            theme: body.theme,
            variation_index: variationIndex,
            brand: {
              name: client.brand_name ?? client.name,
              logo_url: client.logo_url,
              primary_color: client.primary_color,
              secondary_color: client.secondary_color,
            },
          },
        };
      });

      const { error: insertError } = await service.from("batch_videos").insert(rows);
      if (insertError) throw insertError;

      completed += chunkSize;
      await service
        .from("batch_jobs")
        .update({ videos_completed: completed })
        .eq("id", job.id);
    }

    await service
      .from("batch_jobs")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", job.id);

    return jsonResponse({ job_id: job.id, videos_created: completed, credits_cost: creditsCost });
  } catch (err) {
    console.error("[batch-production] generation failed, refunding:", err);
    await service.rpc("add_credits", {
      p_user_id: userId,
      p_amount: creditsCost,
      p_type: "refund",
      p_description: `Reembolso: falha na produção em lote ${job.id}`,
    });
    await service
      .from("batch_jobs")
      .update({ status: "failed", error_message: "Falha ao gerar os vídeos. Créditos estornados." })
      .eq("id", job.id);
    return jsonResponse({ error: "Falha ao gerar os vídeos. Seus créditos foram estornados." }, 500);
  }
}

async function handleBulkUpdate(
  service: ServiceClient,
  userId: string,
  body: z.infer<typeof BulkUpdateSchema>,
): Promise<Response> {
  if (body.operation === "delete") {
    const { error, count } = await service
      .from("batch_videos")
      .delete({ count: "exact" })
      .in("id", body.video_ids)
      .eq("user_id", userId);
    if (error) {
      console.error("[batch-production] bulk delete failed:", error);
      return jsonResponse({ error: "Falha ao excluir os vídeos." }, 500);
    }
    return jsonResponse({ updated: count ?? 0 });
  }

  const updates: Record<string, unknown> = {};
  if (body.operation === "approve") updates.status = "aprovado";
  if (body.operation === "publish") {
    updates.status = "publicado";
    updates.published_at = new Date().toISOString();
  }
  if (body.operation === "back_to_review") updates.status = "concluido";
  if (body.operation === "schedule") {
    if (!body.scheduled_at) {
      return jsonResponse({ error: "scheduled_at é obrigatório para agendar." }, 400);
    }
    updates.scheduled_at = body.scheduled_at;
  }

  const { error, count } = await service
    .from("batch_videos")
    .update(updates, { count: "exact" })
    .in("id", body.video_ids)
    .eq("user_id", userId);

  if (error) {
    console.error("[batch-production] bulk update failed:", error);
    return jsonResponse({ error: "Falha ao atualizar os vídeos." }, 500);
  }
  return jsonResponse({ updated: count ?? 0 });
}

async function handleRetryFailed(
  service: ServiceClient,
  userId: string,
  body: z.infer<typeof RetryFailedSchema>,
): Promise<Response> {
  const { error, count } = await service
    .from("batch_videos")
    .update({ status: "concluido", error_message: null }, { count: "exact" })
    .eq("job_id", body.job_id)
    .eq("user_id", userId)
    .eq("status", "erro");

  if (error) {
    console.error("[batch-production] retry failed:", error);
    return jsonResponse({ error: "Falha ao reprocessar os vídeos." }, 500);
  }
  return jsonResponse({ retried: count ?? 0 });
}
