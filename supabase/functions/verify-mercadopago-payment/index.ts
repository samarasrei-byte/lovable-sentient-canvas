import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
      .select("id, payment_id, payment_status, payment_method")
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

    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Mercado Pago not configured", paid: false }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check payment status on Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${purchase.payment_id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const mpData = await mpResponse.json();

    if (mpData.status === "approved") {
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
      pending: "pending",
      in_process: "pending",
      rejected: "failed",
      cancelled: "cancelled",
      refunded: "refunded",
    };

    return new Response(JSON.stringify({
      paid: false,
      status: statusMap[mpData.status] || "pending",
      mpStatus: mpData.status,
      mpStatusDetail: mpData.status_detail,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify MP payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error", paid: false }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
