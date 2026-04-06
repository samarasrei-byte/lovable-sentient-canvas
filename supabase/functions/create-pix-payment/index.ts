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
    const { purchaseId, priceCents, customerEmail, customerName } = await req.json();

    if (!purchaseId || !priceCents) {
      return new Response(JSON.stringify({ error: "purchaseId and priceCents are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing customer
    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Create PaymentIntent with PIX + confirm immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceCents,
      currency: "brl",
      payment_method_types: ["pix"],
      payment_method_data: { type: "pix" },
      confirm: true,
      customer: customerId,
      metadata: {
        purchase_id: purchaseId,
        customer_name: customerName || "",
        customer_email: customerEmail || "",
      },
    });

    // Extract PIX QR code info from next_action
    const pixAction = paymentIntent.next_action?.pix_display_qr_code;
    
    if (!pixAction) {
      console.error("No PIX QR code in response:", JSON.stringify(paymentIntent.next_action));
      return new Response(JSON.stringify({ 
        error: "PIX QR code not generated. Check Stripe PIX configuration.",
        status: paymentIntent.status,
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update purchase record with payment info
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabaseAdmin
      .from("prompt_purchases")
      .update({
        payment_id: paymentIntent.id,
        payment_method: "pix",
        payment_status: "pending",
      })
      .eq("id", purchaseId);

    return new Response(JSON.stringify({
      paymentIntentId: paymentIntent.id,
      pixCopiaECola: pixAction.data, // The copy-paste PIX code
      qrCodeUrl: pixAction.image_url_png || pixAction.image_url_svg,
      expiresAt: pixAction.expires_at,
      hostedUrl: pixAction.hosted_instructions_url,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("PIX payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
