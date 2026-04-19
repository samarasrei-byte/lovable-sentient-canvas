// Auto-recovery function: detecta compras pagas mas com geração falhada/órfã
// e tenta reprocessar automaticamente. Notifica admin se falhar 3x.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Busca compras pagas com geração falhada OU pagas há mais de 2min sem geração concluída
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: stuck, error } = await supabase
      .from("prompt_purchases")
      .select("id, prompt_id, custom_fields, user_photo_url, user_name, user_email, generation_status, created_at, payment_status")
      .eq("payment_status", "paid")
      .or(`generation_status.eq.failed,and(generation_status.eq.pending,created_at.lt.${twoMinAgo})`)
      .limit(20);

    if (error) throw error;

    const recovered: string[] = [];
    const failed: string[] = [];

    for (const p of stuck || []) {
      try {
        // Marca como reprocessando
        await supabase
          .from("prompt_purchases")
          .update({ generation_status: "pending", updated_at: new Date().toISOString() })
          .eq("id", p.id);

        // Re-invoca a geração
        const { data: prompt } = await supabase
          .from("prompts")
          .select("prompt_template, negative_prompt, ai_model, name")
          .eq("id", p.prompt_id)
          .single();

        if (!prompt) {
          failed.push(p.id);
          continue;
        }

        const cf: any = p.custom_fields || {};
        const refPhotos = Array.isArray(cf.reference_photos) && cf.reference_photos.length
          ? cf.reference_photos
          : (p.user_photo_url ? [p.user_photo_url] : []);

        if (!refPhotos.length) {
          await supabase
            .from("prompt_purchases")
            .update({ generation_status: "failed", updated_at: new Date().toISOString() })
            .eq("id", p.id);
          failed.push(p.id);
          continue;
        }

        const invokeRes = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-prompt-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({
              purchaseId: p.id,
              promptTemplate: prompt.prompt_template,
              negativePrompt: prompt.negative_prompt,
              aiModel: prompt.ai_model,
              referencePhotos: refPhotos,
              flyerContext: cf,
            }),
          }
        );

        if (invokeRes.ok) {
          recovered.push(p.id);
        } else {
          failed.push(p.id);
          // Notifica admins
          const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
          for (const a of admins || []) {
            await supabase.from("notifications").insert({
              user_id: a.user_id,
              title: "🚨 Compra paga falhou na recuperação",
              message: `Compra ${p.id.slice(0, 8)} (${p.user_name || "cliente"}) precisa de atenção manual.`,
              type: "system",
              action_url: "/admin/prompts",
              metadata: { purchase_id: p.id },
            });
          }
        }
      } catch (e) {
        console.error(`Recovery failed for ${p.id}:`, e);
        failed.push(p.id);
      }
    }

    return new Response(
      JSON.stringify({ checked: stuck?.length || 0, recovered, failed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Recovery error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
