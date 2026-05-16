import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { promptId, userName, userInstagram, userEmail, userId, customFields } = await req.json();

    if (!promptId) {
      return new Response(JSON.stringify({ error: "promptId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: prompt, error: promptError } = await supabaseAdmin
      .from("prompts")
      .select("id, price_cents, status")
      .eq("id", promptId)
      .neq("status", "inactive")
      .maybeSingle();

    if (promptError) throw promptError;
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt não encontrado ou indisponível" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: purchase, error: insertError } = await supabaseAdmin
      .from("prompt_purchases")
      .insert({
        prompt_id: prompt.id,
        user_name: userName || null,
        user_instagram: userInstagram || null,
        user_email: userEmail || null,
        user_id: userId || null, // Optional link to authenticated user
        amount_cents: prompt.price_cents,
        payment_status: "pending",
        generation_status: "pending",
        custom_fields: customFields || null,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, purchaseId: purchase.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating prompt purchase:", error);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
