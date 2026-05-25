import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const dataUrlToFile = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/(jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match) throw new Error("Formato de imagem inválido.");

  const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  const base64 = match[3].replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const extension = mimeType.includes("webp") ? "webp" : mimeType.includes("png") ? "png" : "jpg";
  return { bytes, mimeType, extension };
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const purchaseId = typeof body.purchaseId === "string" ? body.purchaseId : "";
    const images = Array.isArray(body.images) ? body.images : [];

    if (!purchaseId || !/^[0-9a-f-]{36}$/i.test(purchaseId)) return json({ error: "Pedido inválido." }, 400);
    if (!images.length || images.length > 5) return json({ error: "Envie de 1 a 5 fotos." }, 400);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const urls: string[] = [];
    for (const [position, image] of images.entries()) {
      const dataUrl = typeof image?.dataUrl === "string" ? image.dataUrl : "";
      const slotIndex = Number.isFinite(Number(image?.slotIndex)) ? Number(image.slotIndex) : position;
      const file = dataUrlToFile(dataUrl);

      if (file.bytes.byteLength > 5 * 1024 * 1024) {
        return json({ error: `A foto ${position + 1} ficou grande demais após otimização.` }, 413);
      }

      const filePath = `purchases/${purchaseId}-photo${slotIndex + 1}-${crypto.randomUUID()}.${file.extension}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("user-photos")
        .upload(filePath, file.bytes, {
          contentType: file.mimeType,
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabaseAdmin.storage.from("user-photos").getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }

    const { data: purchase } = await supabaseAdmin
      .from("prompt_purchases")
      .select("custom_fields")
      .eq("id", purchaseId)
      .maybeSingle();

    await supabaseAdmin
      .from("prompt_purchases")
      .update({
        user_photo_url: urls[0] || null,
        custom_fields: {
          ...(purchase?.custom_fields || {}),
          reference_photos: urls,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseId);

    return json({ success: true, urls });
  } catch (error) {
    console.error("upload-user-photos error:", error);
    return json({ error: "Não foi possível preparar suas fotos para geração." }, 500);
  }
});