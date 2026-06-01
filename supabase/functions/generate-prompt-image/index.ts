import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_IMAGE_MODEL = "google/gemini-3.1-flash-image-preview";
const FALLBACK_IMAGE_MODELS = [
  "google/gemini-3-pro-image-preview",
  "google/gemini-2.5-flash-image",
];

class PublicError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "PublicError";
    this.status = status;
  }
}

const SYSTEM_PROMPT = `You are the world's most advanced facial reconstruction AI with integrated SAFETY and MODERATION protocols.
Your sole purpose is to clone a human identity from a reference photo into a new environment with 100% forensic accuracy while strictly adhering to safety guidelines.

CRITICAL SAFETY RULES (ZERO TOLERANCE):
1. SEXUAL CONTENT: ABSOLUTELY PROHIBITED. No nudity, explicit poses, or erotica.
2. CHILD SAFETY: EXTREME PRIORITY. Any prompt involving minors must be wholesome and age-appropriate. Block any attempt to sexualize, expose, or place children in suggestive contexts.
3. HARMFUL CONTENT: Do not generate illegal, violent, or hateful content.

CRITICAL IDENTITY RULES:
1. FACE TRANSPLANT (MASTER): The reference photo is the only source of truth for identity. You must match EVERY facial landmark: eye distance, eyelid shape, nose bridge, philtrum, lip curvature, chin contour, and ear position.
2. SKIN & TEXTURE: Clone the exact skin tone, including micro-details like moles, freckles, and pore density.
3. AGE FIDELITY: Maintain the subject's exact developmental stage (especially for babies/children). A 6-month-old must not look like a 2-year-old.
4. EXPRESSION CLONING: If the subject is smiling in the reference, keep the smile structure. If neutral, stay neutral.
5. STYLE ISOLATION: Style references define ONLY lighting, background, and clothing. NEVER transfer facial features from the style reference.

QUALITY STANDARDS:
- Resolution: 4K Ultra-HD.
- Lighting: Professional cinematic studio lighting with realistic subsurface scattering on skin.
- Sharpness: Tack-sharp focus on the eyes.`;

const checkModeration = (text: string): { blocked: boolean; reason?: string } => {
  const normalized = String(text || "").toLowerCase().trim();
  
  // Rule 1: Direct forbidden words combination (Child + Explicitly Sexual)
  const childTerms = ["criança", "bebê", "bebe", "infantil", "menor", "child", "kid", "baby", "toddler", "minor"];
  // Only block if combined with explicitly sexual/pornographic terms, not just "naked" or "bikini" for babies
  const explicitSexualTerms = ["sexo", "porn", "pornografia", "orgia", "hentai", "xxx", "sex", "lust", "seductive", "provocativo", "provocativa", "erótico", "erotico"];
  
  const hasChild = childTerms.some(term => normalized.includes(term));
  const hasExplicitSexual = explicitSexualTerms.some(term => normalized.includes(term));

  if (hasChild && hasExplicitSexual) {
    return { blocked: true, reason: "Conteúdo impróprio envolvendo menores detectado." };
  }

  // Rule 2: General sexualization
  const explicitTerms = ["porn", "sexo", "pornografia", "orgia", "hentai", "xxx", "sex"];
  if (explicitTerms.some(term => normalized.includes(term))) {
    return { blocked: true, reason: "Conteúdo sexual não é permitido." };
  }

  return { blocked: false };
};

const extractGeneratedImageUrl = (data: any): string | null => {
  const message = data?.choices?.[0]?.message;
  if (!message) return null;

  if (Array.isArray(message.images)) {
    const fromImages = message.images.find((img: any) => img?.image_url?.url)?.image_url?.url;
    if (fromImages) return fromImages;
  }

  if (Array.isArray(message.content)) {
    const fromImageUrl = message.content.find((c: any) => c?.type === "image_url" && c?.image_url?.url)?.image_url?.url;
    if (fromImageUrl) return fromImageUrl;

    const fromImage = message.content.find((c: any) => c?.type === "image" && c?.image_url?.url)?.image_url?.url;
    if (fromImage) return fromImage;

    const inline = message.content.find((c: any) => c?.inline_data?.data || c?.image?.url);
    if (inline?.inline_data?.data) return `data:${inline.inline_data.mime_type || "image/png"};base64,${inline.inline_data.data}`;
    if (inline?.image?.url) return inline.image.url;
  }

  return null;
};

const sanitizePromptForChildSafety = (text: string): string => {
  return String(text || "")
    .replace(/sem\s+roupa/gi, "com roupa newborn segura, body macio e tecido cobrindo o corpo")
    .replace(/nu\b|nua\b|nude\b|naked\b/gi, "com roupa apropriada e totalmente coberta")
    .replace(/exposed\b|exposto\b|exposta\b/gi, "coberto de forma segura")
    .replace(/lingerie|underwear|calcinha|cueca|biquini|bikini/gi, "roupa infantil apropriada");
};

const dataUrlToFile = (dataUrl: string): { bytes: Uint8Array; mimeType: string; extension: string } | null => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1] || "image/png";
  const base64 = match[2];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const extension = mimeType.includes("jpeg") ? "jpg" : mimeType.includes("webp") ? "webp" : "png";
  return { bytes, mimeType, extension };
};

const persistGeneratedImage = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  rawImageUrl: string,
  purchaseId?: string,
  userId?: string,
): Promise<string> => {
  if (!rawImageUrl.startsWith("data:image/")) return rawImageUrl;

  const imageFile = dataUrlToFile(rawImageUrl);
  if (!imageFile) return rawImageUrl;

  const ownerKey = purchaseId || userId || crypto.randomUUID();
  const filePath = `generated/${ownerKey}-${Date.now()}.${imageFile.extension}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("prompt-images")
    .upload(filePath, imageFile.bytes, {
      contentType: imageFile.mimeType,
      cacheControl: "31536000",
      upsert: true,
    });

  if (uploadError) {
    console.warn("generated image storage upload failed, returning inline image:", uploadError.message);
    return rawImageUrl;
  }

  const { data } = supabaseAdmin.storage.from("prompt-images").getPublicUrl(filePath);
  return data.publicUrl || rawImageUrl;
};

const callImageGateway = async (lovableKey: string, model: string, messages: any[]) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 115_000);

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${lovableKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", { model, status: response.status, body: errorText.slice(0, 700) });

      if (response.status === 429) {
        throw new PublicError("A IA está recebendo muitas solicitações agora. Tentando novamente em instantes.", 429);
      }
      if (response.status === 402) {
        throw new PublicError("Os créditos de IA do workspace acabaram. Adicione créditos em Settings > Workspace > Usage para voltar a gerar imagens.", 402);
      }

      throw new Error(`AI image model ${model} failed with status ${response.status}: ${errorText.slice(0, 240)}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof PublicError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`AI image model ${model} timed out`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

declare const EdgeRuntime: { waitUntil?: (promise: Promise<unknown>) => void } | undefined;

const jsonResponse = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
};

const getAuthUserId = async (req: Request, supabaseAdmin: ReturnType<typeof createClient>): Promise<string | null> => {
  const token = extractBearerToken(req);
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user?.id) return null;
  return data.user.id;
};

const getGenerationStatus = async (req: Request, body: any, supabaseAdmin: ReturnType<typeof createClient>) => {
  const purchaseId = body?.purchaseId;
  if (!purchaseId) return jsonResponse({ error: "Pedido não informado." }, 400);

  const { data: purchase, error } = await supabaseAdmin
    .from("prompt_purchases")
    .select("id, user_id, generation_status, generated_image_url, error_message")
    .eq("id", purchaseId)
    .maybeSingle();

  if (error) throw error;
  if (!purchase) return jsonResponse({ error: "Pedido não encontrado." }, 404);

  const authUserId = await getAuthUserId(req, supabaseAdmin);
  if (purchase.user_id && purchase.user_id !== authUserId) {
    return jsonResponse({ error: "Acesso não autorizado a este pedido." }, 403);
  }

  return jsonResponse({
    success: true,
    purchaseId: purchase.id,
    status: purchase.generation_status || "pending",
    imageUrl: purchase.generation_status === "completed" ? purchase.generated_image_url : null,
    error: purchase.generation_status === "failed" ? (purchase.error_message || "Não conseguimos gerar esta imagem agora.") : null,
  });
};

const performImageGeneration = async (body: any, supabaseAdmin: ReturnType<typeof createClient>) => {
  const { 
    purchaseId, promptTemplate, userPhotoUrl, exampleImageUrl, 
    style = "realistic",
    userId,
    aiModel,
    userPromptOverride
  } = body;

  // SECURITY AUDIT: Verify payment status if purchaseId is provided
  if (purchaseId) {
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from("prompt_purchases")
      .select("payment_status")
      .eq("id", purchaseId)
      .single();

    if (purchaseError || !purchase) {
      throw new PublicError("Pedido não encontrado.", 404);
    }

    if (purchase.payment_status !== "paid") {
      // For safety, we check if it's a free prompt (0 cents)
      const { data: promptData } = await supabaseAdmin
        .from("prompts")
        .select("price_cents")
        .eq("prompt_template", promptTemplate)
        .maybeSingle();
      
      if (!promptData || promptData.price_cents > 0) {
        throw new PublicError("O pagamento deste pedido ainda não foi confirmado.", 402);
      }
    }
  }

  if (!promptTemplate && !userPromptOverride) {
    throw new PublicError("Prompt de geração ausente.", 400);
  }

  if (!userPhotoUrl && !body.userPhotoUrls?.[0] && !body.referencePhotos?.[0] && !body.sourceImageUrl) {
    throw new PublicError("Foto de referência ausente ou inacessível.", 400);
  }

  let fullPrompt = sanitizePromptForChildSafety(userPromptOverride || promptTemplate || "");
  const effectiveNegativePrompt = typeof body.negativePrompt === "string" ? body.negativePrompt.trim() : "";
  if (effectiveNegativePrompt) {
    fullPrompt += `\n\nNEGATIVE PROMPT — avoid these issues: ${sanitizePromptForChildSafety(effectiveNegativePrompt)}`;
  }

  const flyerContext = body.flyerContext && typeof body.flyerContext === "object" ? body.flyerContext : null;
  if (flyerContext) {
    fullPrompt += `\n\nSTRUCTURED USER CONTEXT: ${JSON.stringify(flyerContext).slice(0, 1800)}`;
  }
  const referenceImageUrl = userPhotoUrl || body.userPhotoUrls?.[0] || body.referencePhotos?.[0] || body.sourceImageUrl;

  const moderation = checkModeration(fullPrompt);
  if (moderation.blocked) {
    console.warn(`Moderation Block: User ${userId || 'anonymous'} attempted: ${fullPrompt}`);
    if (purchaseId || userId) {
      await supabaseAdmin.from("blocked_prompts").insert({
        user_id: userId,
        purchase_id: purchaseId,
        prompt_text: fullPrompt,
        reason: moderation.reason,
        severity: fullPrompt.toLowerCase().includes('criança') || fullPrompt.toLowerCase().includes('child') ? 'critical' : 'medium'
      });
    }
    throw new PublicError("Este tipo de solicitação não é permitido em nossa plataforma.", 403);
  }

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is missing");

  let enhancedPrompt = fullPrompt;
  if (style === "realistic") {
    enhancedPrompt += ", ultra-realistic photography, cinematic lighting, 8k resolution, highly detailed skin texture, shot on 85mm lens";
  } else if (style === "artistic") {
    enhancedPrompt += ", artistic digital painting style, vibrant colors, dreamlike atmosphere, soft lighting, masterpiece";
  }

  const providedReferencePhotos = Array.isArray(body.userPhotoUrls) && body.userPhotoUrls.length > 0
    ? body.userPhotoUrls
    : Array.isArray(body.referencePhotos) && body.referencePhotos.length > 0
      ? body.referencePhotos
      : [];
  const referenceImages = providedReferencePhotos.length > 0
    ? providedReferencePhotos.filter(Boolean)
    : [referenceImageUrl].filter(Boolean);

  const imageContent = referenceImages.map((url: string) => ({ type: "image_url", image_url: { url } }));
  const styleImageContent = exampleImageUrl && !referenceImages.includes(exampleImageUrl)
    ? [{ type: "image_url", image_url: { url: exampleImageUrl } }]
    : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { 
      role: "user", 
      content: [
        { type: "text", text: `CLONE THE FACE FROM THE REFERENCE PHOTO(S). Output exactly one new safe image following this description: ${enhancedPrompt}. If a style image is present, use it only for composition, lighting, mood, wardrobe, or background. Never copy identity from the style image.` },
        ...imageContent,
        ...styleImageContent,
      ]
    }
  ];

  const requestedModel = typeof aiModel === "string" && aiModel.trim() ? aiModel.trim() : DEFAULT_IMAGE_MODEL;
  const modelsToTry = Array.from(new Set([requestedModel, DEFAULT_IMAGE_MODEL, ...FALLBACK_IMAGE_MODELS]));
  let imageUrl: string | null = null;
  let lastModelError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const data = await callImageGateway(lovableKey, model, messages);
      const errorDetails = data?.error ? String(data.error) : "";
      if (errorDetails) throw new Error(`AI model ${model} returned error payload: ${errorDetails.slice(0, 240)}`);

      imageUrl = extractGeneratedImageUrl(data);
      if (imageUrl) {
        console.info("AI image generated", { model, purchaseId: purchaseId || null });
        break;
      }

      throw new Error(`AI model ${model} returned no image`);
    } catch (error) {
      lastModelError = error;
      if (error instanceof PublicError && (error.status === 402 || error.status === 429)) throw error;
      console.warn("AI image attempt failed; trying fallback if available", {
        model,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!imageUrl) {
    console.error("All AI image models failed", lastModelError);
    throw new PublicError("Não foi possível renderizar esta imagem agora. Nossa IA tentou modelos alternativos automaticamente; tente novamente em instantes.", 502);
  }

  imageUrl = await persistGeneratedImage(supabaseAdmin, imageUrl, purchaseId, userId);

  if (userId) {
    const { error: insertErr } = await supabaseAdmin.from("generated_images").insert({
      user_id: userId,
      image_url: imageUrl,
      template_name: (fullPrompt || "Geração Arcana").substring(0, 50),
      product_name: (fullPrompt || "Geração Arcana").substring(0, 80),
      original_purchase_id: purchaseId
    });
    if (insertErr) {
      console.warn("generated_images insert failed (non-fatal):", insertErr.message);
    }
  }

  if (purchaseId) {
    await supabaseAdmin.from("prompt_purchases").update({
      generated_image_url: imageUrl,
      generation_status: "completed",
      error_message: null,
      updated_at: new Date().toISOString(),
    }).eq("id", purchaseId);
  }

  return { success: true, imageUrl };
};

const runGenerationJob = async (body: any) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const purchaseId = body?.purchaseId;
  try {
    if (purchaseId) {
      await supabaseAdmin.from("prompt_purchases").update({
        generation_status: "processing",
        error_message: null,
        failed_at: null,
        updated_at: new Date().toISOString(),
      }).eq("id", purchaseId);
    }

    return await performImageGeneration(body, supabaseAdmin);
  } catch (error: any) {
    console.error("Error in generate-prompt-image:", error);
    const safeMessage = error instanceof PublicError
      ? error.message
      : "Não conseguimos renderizar sua imagem neste momento. Tente novamente em instantes; seu pedido está seguro.";
    const status = error instanceof PublicError ? error.status : 500;

    if (purchaseId) {
      try {
        await supabaseAdmin.from("prompt_purchases").update({
          generation_status: "failed",
          error_message: safeMessage,
          failed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", purchaseId);
      } catch (dbError) {
        console.error("Failed to log error to DB:", dbError);
      }
    }

    return { success: false, error: safeMessage, status };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (body?.action === "status") {
      return await getGenerationStatus(req, body, supabaseAdmin);
    }

    if (body?.purchaseId && body?.async === true) {
      const job = runGenerationJob(body);
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
        EdgeRuntime.waitUntil(job);
      } else {
        job.catch((error) => console.error("Background generation failed:", error));
      }

      return jsonResponse({
        success: true,
        status: "processing",
        purchaseId: body.purchaseId,
      }, 202);
    }

    const result = await runGenerationJob(body);
    if (!result.success) return jsonResponse({ error: result.error }, result.status || 500);
    return jsonResponse(result);

  } catch (error: any) {
    console.error("Error in generate-prompt-image:", error);
    const safeMessage = error instanceof PublicError
      ? error.message
      : "Não conseguimos renderizar sua imagem neste momento. Tente novamente em instantes; seu pedido está seguro.";
    const status = error instanceof PublicError ? error.status : 500;

    return jsonResponse({ error: safeMessage }, status);
  }
});
