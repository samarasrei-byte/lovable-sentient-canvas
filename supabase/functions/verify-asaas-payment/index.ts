import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ASAAS_BASE = "https://api.asaas.com/v3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { purchaseId } = await req.json();

    if (!purchaseId) {
      return new Response(JSON.stringify({ error: "purchaseId is required", paid: false }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from("prompt_purchases")
      .select("id, payment_id, payment_status")
      .eq("id", purchaseId)
      .single();

    if (purchaseError || !purchase) {
      return new Response(JSON.stringify({ error: "Compra não encontrada", paid: false }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (purchase.payment_status === "completed") {
      return new Response(JSON.stringify({ paid: true, status: "completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!purchase.payment_id) {
      return new Response(JSON.stringify({ paid: false, status: "no_payment" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ASAAS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Asaas not configured", paid: false }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const asaasRes = await fetch(`${ASAAS_BASE}/payments/${purchase.payment_id}`, {
      headers: { access_token: apiKey },
    });
    const asaasData = await asaasRes.json();

    const paidStatuses = ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"];
    if (paidStatuses.includes(asaasData.status)) {
      await supabaseAdmin
        .from("prompt_purchases")
        .update({
          payment_status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", purchaseId);

      return new Response(JSON.stringify({ paid: true, status: "completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const statusMap: Record<string, string> = {
      PENDING: "pending",
      AWAITING_RISK_ANALYSIS: "pending",
      OVERDUE: "failed",
      REFUNDED: "refunded",
      REFUND_REQUESTED: "refunded",
      CHARGEBACK_REQUESTED: "failed",
      CHARGEBACK_DISPUTE: "failed",
      AWAITING_CHARGEBACK_REVERSAL: "failed",
      DUNNING_REQUESTED: "pending",
      DUNNING_RECEIVED: "pending",
      AWAITING_PAYMENT: "pending",
    };

    return new Response(JSON.stringify({
      paid: false,
      status: statusMap[asaasData.status] || "pending",
      asaasStatus: asaasData.status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify Asaas payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error", paid: false }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
