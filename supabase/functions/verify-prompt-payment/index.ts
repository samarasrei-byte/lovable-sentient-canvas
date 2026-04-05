import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
      return new Response(JSON.stringify({ error: "purchaseId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get purchase record with payment_id (Stripe session ID)
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

    // Already confirmed
    if (purchase.payment_status === "completed") {
      return new Response(JSON.stringify({ paid: true, status: "completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No Stripe session linked yet
    if (!purchase.payment_id) {
      return new Response(JSON.stringify({ paid: false, status: "no_session" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check Stripe session status
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe not configured", paid: false }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const session = await stripe.checkout.sessions.retrieve(purchase.payment_id);

    if (session.payment_status === "paid") {
      // Update purchase record
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

    // Map Stripe statuses
    const statusMap: Record<string, string> = {
      unpaid: "pending",
      no_payment_required: "completed",
    };

    return new Response(JSON.stringify({ 
      paid: session.payment_status === "no_payment_required",
      status: statusMap[session.payment_status] || "pending",
      stripeStatus: session.status, // "open", "complete", "expired"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error", paid: false }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
