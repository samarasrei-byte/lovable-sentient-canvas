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
    const { purchaseId, priceCents, customerEmail, customerName, paymentMethod } = await req.json();

    if (!purchaseId || !priceCents) {
      return new Response(JSON.stringify({ error: "purchaseId and priceCents are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Mercado Pago not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const method = paymentMethod || "pix";

    // Avoid self-payment block: MP rejects when payer email == account owner email
    let payerEmail = (customerEmail || "").trim().toLowerCase();
    if (!payerEmail || payerEmail.endsWith("@arcana.com") || payerEmail.endsWith("@arcana.com.br")) {
      // Generate a unique synthetic email tied to the purchase
      payerEmail = `cliente+${purchaseId.slice(0, 8)}@compradores-arcana.com`;
    }

    // Create payment via Mercado Pago API
    const mpBody: Record<string, unknown> = {
      transaction_amount: priceCents / 100,
      description: `Compra #${purchaseId.slice(0, 8)}`,
      payment_method_id: method,
      payer: {
        email: payerEmail,
        first_name: customerName || "Cliente",
      },
      metadata: {
        purchase_id: purchaseId,
      },
    };

    console.log("MP request:", JSON.stringify({ amount: priceCents / 100, method, payerEmail }));

    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": purchaseId,
      },
      body: JSON.stringify(mpBody),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Mercado Pago error:", JSON.stringify(mpData));
      return new Response(JSON.stringify({ 
        error: mpData.message || "Erro ao criar pagamento",
        mpError: mpData,
      }), {
        status: mpResponse.status,
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
        payment_id: String(mpData.id),
        payment_method: method,
        payment_status: mpData.status === "approved" ? "completed" : "pending",
      })
      .eq("id", purchaseId);

    // Build response based on payment method
    const result: Record<string, unknown> = {
      paymentId: mpData.id,
      status: mpData.status,
      statusDetail: mpData.status_detail,
    };

    if (method === "pix") {
      const pixInfo = mpData.point_of_interaction?.transaction_data;
      result.pixCopiaECola = pixInfo?.qr_code;
      result.qrCodeBase64 = pixInfo?.qr_code_base64;
      result.ticketUrl = pixInfo?.ticket_url;
      result.expiresAt = mpData.date_of_expiration;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("MP payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
