import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { purchaseId } = await req.json();
    if (!purchaseId) {
      return new Response(
        JSON.stringify({ error: "purchaseId is required", paid: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: purchase } = await supabaseAdmin
      .from("prompt_purchases")
      .select("id, payment_id, payment_status")
      .eq("id", purchaseId)
      .single();

    if (!purchase) {
      return new Response(
        JSON.stringify({ error: "Compra não encontrada", paid: false }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured", paid: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const intent = await stripe.paymentIntents.retrieve(purchase.payment_id);

    if (intent.status === "succeeded") {
      await supabaseAdmin
        .from("prompt_purchases")
        .update({ payment_status: "completed", updated_at: new Date().toISOString() })
        .eq("id", purchaseId);
      return new Response(JSON.stringify({ paid: true, status: "completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const failedStatuses = ["canceled", "requires_payment_method"];
    const status = failedStatuses.includes(intent.status) ? "failed" : "pending";

    return new Response(
      JSON.stringify({ paid: false, status, stripeStatus: intent.status }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Verify Stripe PIX error:", error?.message || error);
    return new Response(
      JSON.stringify({
        error: error?.message || "Unknown error",
        paid: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
