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
    const { purchaseId, priceCents, customerEmail, customerName } = await req.json();

    if (!purchaseId || !priceCents) {
      return new Response(
        JSON.stringify({ error: "purchaseId and priceCents are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create a PIX PaymentMethod and PaymentIntent, then confirm to get the QR code
    const pm = await stripe.paymentMethods.create({
      type: "pix",
      billing_details: {
        name: (customerName || "Cliente Arcana").trim(),
        email: (customerEmail || "").trim().toLowerCase() || undefined,
      },
    });

    const intent = await stripe.paymentIntents.create({
      amount: priceCents,
      currency: "brl",
      payment_method_types: ["pix"],
      payment_method: pm.id,
      confirm: true,
      description: `Compra Arcana #${purchaseId.slice(0, 8)}`,
      metadata: { purchase_id: purchaseId },
    });

    const pix = (intent.next_action as any)?.pix_display_qr_code;
    if (!pix?.data) {
      console.error("Stripe PIX: missing QR data", JSON.stringify(intent));
      return new Response(
        JSON.stringify({ error: "Stripe não retornou QR PIX. Confirme que PIX está ativo no dashboard." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Persist payment id on the purchase
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    await supabaseAdmin
      .from("prompt_purchases")
      .update({
        payment_id: intent.id,
        payment_method: "pix",
        payment_status: intent.status === "succeeded" ? "completed" : "pending",
      })
      .eq("id", purchaseId);

    return new Response(
      JSON.stringify({
        paymentId: intent.id,
        status: intent.status,
        pixCopiaECola: pix.data,
        qrCodeBase64: null, // Stripe returns a URL, not base64
        qrCodeUrl: pix.image_url_png,
        expiresAt: pix.expires_at ? new Date(pix.expires_at * 1000).toISOString() : null,
        ticketUrl: pix.hosted_instructions_url || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error: any) {
    console.error("Stripe PIX create error:", error?.message || error);
    return new Response(
      JSON.stringify({
        error: error?.raw?.message || error?.message || "Erro ao gerar PIX no Stripe",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
