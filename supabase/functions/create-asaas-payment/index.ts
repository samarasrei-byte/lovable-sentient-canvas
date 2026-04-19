import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

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
    const { purchaseId, priceCents, customerEmail, customerName, customerCpfCnpj } = await req.json();

    if (!purchaseId || !priceCents) {
      return new Response(JSON.stringify({ error: "purchaseId and priceCents are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ASAAS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Asaas not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const asaasHeaders = {
      "Content-Type": "application/json",
      access_token: apiKey,
    };

    const safeEmail = (customerEmail || "").trim().toLowerCase() || `cliente+${purchaseId.slice(0, 8)}@arcana.app.br`;
    const safeName = customerName || "Cliente Arcana";

    // 1. Create or fetch customer
    console.log("Asaas: creating customer", { email: safeEmail, name: safeName });
    const customerRes = await fetch(`${ASAAS_BASE}/customers`, {
      method: "POST",
      headers: asaasHeaders,
      body: JSON.stringify({
        name: safeName,
        email: safeEmail,
        cpfCnpj: customerCpfCnpj || undefined,
      }),
    });
    const customerData = await customerRes.json();

    let customerId = customerData?.id;
    if (!customerRes.ok && customerData?.errors?.[0]?.code === "invalid_action") {
      // Try to find existing customer by email
      const findRes = await fetch(`${ASAAS_BASE}/customers?email=${encodeURIComponent(safeEmail)}`, {
        headers: asaasHeaders,
      });
      const findData = await findRes.json();
      customerId = findData?.data?.[0]?.id;
    }

    if (!customerId) {
      console.error("Asaas customer error:", JSON.stringify(customerData));
      return new Response(JSON.stringify({
        error: customerData?.errors?.[0]?.description || "Erro ao criar cliente Asaas",
        asaasError: customerData,
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Create PIX payment
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateStr = dueDate.toISOString().slice(0, 10);

    const paymentRes = await fetch(`${ASAAS_BASE}/payments`, {
      method: "POST",
      headers: asaasHeaders,
      body: JSON.stringify({
        customer: customerId,
        billingType: "PIX",
        value: priceCents / 100,
        dueDate: dueDateStr,
        description: `Compra Arcana #${purchaseId.slice(0, 8)}`,
        externalReference: purchaseId,
      }),
    });
    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      console.error("Asaas payment error:", JSON.stringify(paymentData));
      return new Response(JSON.stringify({
        error: paymentData?.errors?.[0]?.description || "Erro ao criar pagamento",
        asaasError: paymentData,
      }), {
        status: paymentRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Get PIX QR Code
    const qrRes = await fetch(`${ASAAS_BASE}/payments/${paymentData.id}/pixQrCode`, {
      headers: asaasHeaders,
    });
    const qrData = await qrRes.json();

    // 4. Update purchase record
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabaseAdmin
      .from("prompt_purchases")
      .update({
        payment_id: String(paymentData.id),
        payment_method: "pix",
        payment_status: paymentData.status === "RECEIVED" || paymentData.status === "CONFIRMED" ? "completed" : "pending",
      })
      .eq("id", purchaseId);

    return new Response(JSON.stringify({
      paymentId: paymentData.id,
      status: paymentData.status,
      pixCopiaECola: qrData?.payload,
      qrCodeBase64: qrData?.encodedImage,
      expiresAt: qrData?.expirationDate,
      ticketUrl: paymentData.invoiceUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Asaas payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
