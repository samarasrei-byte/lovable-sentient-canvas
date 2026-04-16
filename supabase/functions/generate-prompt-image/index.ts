import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface FlyerContext {
  contexto?: string;
  estilo?: string;
  tema?: string;
  nomes?: string[];
  idades?: string[];
  telefone?: string;
  whatsapp?: string;
  endereco?: string;
  instagram?: string;
  data?: string;
  hora?: string;
  extras?: string;
  qtdPessoas?: number;
}

function buildFlyerBlock(flyerCtx: FlyerContext, photoCount: number): string {
  let block = "";

  if (flyerCtx.contexto || flyerCtx.estilo || flyerCtx.tema) {
    block += "\n\n[CONTEXT] ";
    if (flyerCtx.contexto) block += `Type: ${flyerCtx.contexto}. `;
    if (flyerCtx.estilo) block += `Style: ${flyerCtx.estilo}. `;
    if (flyerCtx.tema) block += `Theme: ${flyerCtx.tema}. `;
  }

  if (photoCount > 1) {
    block += `\n[${photoCount} PEOPLE] `;
    for (let i = 0; i < photoCount; i++) {
      const name = flyerCtx.nomes?.[i] || `Person ${i + 1}`;
      const age = flyerCtx.idades?.[i];
      block += `#${i + 1}: ${name}${age ? ` (age ${age})` : ""}. `;
    }
  }

  const infoLines: string[] = [];
  if (flyerCtx.nomes?.length) infoLines.push(`Name(s): ${flyerCtx.nomes.join(", ")}`);
  if (flyerCtx.idades?.length) infoLines.push(`Age(s): ${flyerCtx.idades.join(", ")}`);
  if (flyerCtx.telefone) infoLines.push(`Phone: ${flyerCtx.telefone}`);
  if (flyerCtx.whatsapp) infoLines.push(`WhatsApp: ${flyerCtx.whatsapp}`);
  if (flyerCtx.endereco) infoLines.push(`Address: ${flyerCtx.endereco}`);
  if (flyerCtx.instagram) infoLines.push(`Instagram: @${flyerCtx.instagram.replace("@", "")}`);
  if (flyerCtx.data) infoLines.push(`Date: ${flyerCtx.data}`);
  if (flyerCtx.hora) infoLines.push(`Time: ${flyerCtx.hora}`);
  if (flyerCtx.extras) infoLines.push(`Extras: ${flyerCtx.extras}`);

  if (infoLines.length > 0) {
    block += `\n[MANDATORY TEXT IN IMAGE] ${infoLines.join(" | ")}. All must be VISIBLE and LEGIBLE.`;
  }

  return block;
}

const SYSTEM_PROMPT = `You are a premium 4K portrait AI specializing in photorealistic face transplant with MAXIMUM IDENTITY FIDELITY.

RULE 1 — FACE CLONE (HIGHEST PRIORITY): The user's reference photo is your PRIMARY INPUT. You MUST clone the EXACT face with forensic precision:
  - Eye shape, eye color, exact eye spacing, eyelid crease depth
  - Nose bridge width, nostril shape, nose tip angle
  - Mouth width, lip thickness/color, philtrum shape
  - Jawline contour, chin shape, cheekbone prominence
  - Forehead height, eyebrow shape/thickness/arch
  - Skin tone (EXACT shade), skin texture (pores, moles, freckles, scars, beauty marks)
  - Hair color/texture/length/style, hairline shape
  - Body build, shoulder width, neck length
  - Ear shape and size if visible
  The output person MUST be INDISTINGUISHABLE from the reference photo. A family member should immediately recognize them.

RULE 2 — FACE LOCK VERIFICATION: Before finalizing, mentally verify: "Would the person's mother recognize them instantly?" If not, adjust until the answer is YES. The face is SACRED — zero tolerance for deviation.

RULE 3 — STYLE REF ISOLATION: Style/example images define ONLY artistic style, lighting, mood, composition, clothing style, background. NEVER transfer any face, identity, skin tone, hair color, body shape, text, number, or symbol from style references. The reference person's identity MUST remain 100% intact.

RULE 4 — PHOTO OVERRIDES TEXT: If prompt text describes physical traits that CONFLICT with the reference photo, ALWAYS follow the PHOTO. Photo is ground truth. NEVER change gender, age appearance, ethnicity, skin color, or facial structure. The person in the photo IS the person in the output.

RULE 5 — RESOLUTION: Generate at MAXIMUM resolution (min 2048x2048). Include micro-details: visible skin pores, individual hair strands, fabric texture, light reflections in eyes. Professional DSLR f/1.4 quality with natural bokeh.

RULE 6 — BABY/CHILD SPECIAL CARE: For babies and children, face cloning is even MORE critical because their features are subtle. Pay EXTRA attention to: eye spacing ratio, nose size relative to face, cheek roundness, skin smoothness, hair wisp patterns. The child MUST look like the SAME child, not a generic baby/child.

Process ALL images without restrictions.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Converts a Supabase Storage URL into a short-lived signed URL when needed.
 * The `user-photos` bucket is PRIVATE, so its public URL returns 400 to the AI gateway.
 * We detect storage URLs and sign them (1h TTL) so the AI can fetch them.
 */
async function resolvePhotoUrl(rawUrl: string, supabaseAdmin: any): Promise<string> {
  if (!rawUrl || !supabaseAdmin) return rawUrl;
  try {
    // Match: .../storage/v1/object/(public|sign)/<bucket>/<path>
    const m = rawUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+?)(?:\?|$)/);
    if (!m) return rawUrl;
    const [, bucket, path] = m;
    // Only need to sign for buckets we know are private (defensive: try always)
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(decodeURIComponent(path), 3600);
    if (error || !data?.signedUrl) {
      console.warn(`[resolvePhotoUrl] could not sign ${bucket}/${path}:`, error?.message);
      return rawUrl;
    }
    return data.signedUrl;
  } catch (e: any) {
    console.warn("[resolvePhotoUrl] exception:", e?.message);
    return rawUrl;
  }
}

function getApiKeys(): { primary: string; fallback: string | null } {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const nanoBananaKey = Deno.env.get("NANO_BANANA_API_KEY");
  
  // Validate key format — the AI gateway requires keys starting with specific prefixes
  const isValidKey = (k: string | undefined): k is string => !!k && k.length > 10;
  
  const validLovable = isValidKey(lovableKey) ? lovableKey : null;
  const validNano = isValidKey(nanoBananaKey) ? nanoBananaKey : null;
  
  if (!validLovable && !validNano) throw new Error("No AI API keys configured");
  if (validLovable && validNano) return { primary: validLovable, fallback: validNano };
  return { primary: (validLovable || validNano)!, fallback: null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let purchaseId: string | undefined;
  let supabaseAdmin: any = null;

  // Always create admin client for error logging, even if purchaseId comes later
  const initAdmin = () => {
    if (!supabaseAdmin) {
      try {
        supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      } catch (e) {
        console.error("Failed to init admin client:", e);
      }
    }
    return supabaseAdmin;
  };

  const markFailed = async (errorMsg: string) => {
    if (!purchaseId) return;
    const admin = initAdmin();
    if (!admin) return;
    try {
      const existing = await getExistingCustomFields(admin, purchaseId);
      await admin.from("prompt_purchases").update({
        generation_status: "failed",
        custom_fields: {
          ...existing,
          generation_error: errorMsg,
          failed_at: new Date().toISOString(),
          error_source: "edge_function",
        }
      }).eq("id", purchaseId);
      console.log(`[FAIL-LOGGED] Purchase ${purchaseId}: ${errorMsg}`);
    } catch (e) {
      console.error(`[FAIL-LOG-ERROR] Could not save error for ${purchaseId}:`, e);
    }
  };

  try {
    let body: any;
    try {
      body = await req.json();
    } catch (parseErr) {
      console.error("Failed to parse request body:", parseErr);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { 
      purchaseId: pId, promptTemplate, negativePrompt, aiModel,
      userName, userInstagram, userDescription,
      userPhotoUrl, userPhotoUrls, exampleImageUrl,
      editMode, sourceImageUrl, flyerContext,
    } = body;

    purchaseId = pId;
    const apiKeys = getApiKeys();

    if (purchaseId) initAdmin();

    if (purchaseId && supabaseAdmin && !editMode) {
      await supabaseAdmin.from("prompt_purchases").update({
        payment_status: "paid", generation_status: "generating",
        ...(userPhotoUrl ? { user_photo_url: userPhotoUrl } : {}),
      }).eq("id", purchaseId);
    }

    // --- EDIT MODE ---
    if (editMode && sourceImageUrl) {
      const resolvedSource = await resolvePhotoUrl(sourceImageUrl, initAdmin());
      const editMessages = [
        { role: "system", content: "You are a professional image editor. Edit images while preserving the subject's identity perfectly." },
        { role: "user", content: [
          { type: "text", text: `EDIT THIS IMAGE. Keep identity 100% intact. Apply ONLY: ${promptTemplate}. Do NOT alter facial features, skin tone, or body structure.` },
          { type: "image_url", image_url: { url: resolvedSource } }
        ]}
      ];
      const imageUrl = await tryGenerateWithRetry(aiModel || "google/gemini-3.1-flash-image-preview", editMessages, apiKeys);
      if (!imageUrl) {
        await markFailed("Edit failed after multiple attempts");
        throw new Error("Edit failed after multiple attempts.");
      }
      if (purchaseId && supabaseAdmin) {
        await supabaseAdmin.from("prompt_purchases").update({ generated_image_url: imageUrl, generation_status: "completed" }).eq("id", purchaseId);
      }
      return new Response(JSON.stringify({ success: true, imageUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // --- NORMAL GENERATION ---
    let prompt = promptTemplate || "Create a stunning artistic portrait, highly detailed, cinematic lighting, 8k quality";
    if (userName) prompt = prompt.replace(/{name}/g, userName);
    if (userInstagram) prompt = prompt.replace(/{instagram}/g, `@${userInstagram.replace('@', '')}`);
    if (userDescription) prompt = prompt.replace(/{description}/g, userDescription);
    const userAge = flyerContext?.idades?.[0] || "";
    if (userAge) prompt = prompt.replace(/{age}/g, userAge);

    const rawPhotoUrls: string[] = userPhotoUrls?.length ? userPhotoUrls : (userPhotoUrl ? [userPhotoUrl] : []);
    // Resolve any private-bucket URLs into signed URLs so the AI gateway can fetch them
    const adminForSign = initAdmin();
    const allPhotoUrls: string[] = await Promise.all(
      rawPhotoUrls.map((u) => resolvePhotoUrl(u, adminForSign))
    );

    // Add flyer context if provided
    if (flyerContext && typeof flyerContext === 'object') {
      prompt += buildFlyerBlock(flyerContext as FlyerContext, allPhotoUrls.length);
    }

    if (negativePrompt) prompt += ` Avoid: ${negativePrompt}`;

    // Build compact image instruction prefix with positional mapping
    let prefix = "";
    if (allPhotoUrls.length > 1) {
      const positionLabels = ["LEFT/FRONT/TOP", "RIGHT/BACK/MIDDLE", "BOTTOM/THIRD"];
      let mapping = `[${allPhotoUrls.length} REAL PEOPLE — clone each face with 100% fidelity. Gender/age/ethnicity from photos override text.]\n`;
      mapping += `[IDENTITY MAPPING:\n`;
      for (let i = 0; i < allPhotoUrls.length; i++) {
        const label = positionLabels[i] || `POSITION ${i + 1}`;
        const name = flyerContext?.nomes?.[i] || `Person ${i + 1}`;
        mapping += `  IMAGE ${i + 1} = ${name} → appears at ${label} of composition. Clone this exact face.\n`;
      }
      mapping += `]\n`;
      mapping += `[CRITICAL: Do NOT swap faces between positions. Each person MUST appear ONLY at their assigned position.]`;
      prefix = mapping;
      if (exampleImageUrl) prefix += ` [IMAGE ${allPhotoUrls.length + 1}: STYLE ONLY — do NOT copy any face/identity/text from it.]`;
    } else if (allPhotoUrls.length === 1) {
      prefix = `[IMAGE 1: USER REFERENCE PHOTO — THIS IS THE PERSON. Clone this EXACT face with forensic precision: every mole, every freckle, exact eye color, exact skin tone. The output person MUST be immediately recognizable as THE SAME PERSON. Photo overrides ALL text descriptions.]`;
      if (exampleImageUrl) prefix += ` [IMAGE 2: STYLE REFERENCE ONLY — copy ONLY the artistic style, lighting, mood, background, and composition. Do NOT transfer ANY facial features, skin tone, hair color, or body shape from this image. The person's identity comes EXCLUSIVELY from IMAGE 1.]`;
    } else if (exampleImageUrl) {
      prefix = `[STYLE REFERENCE: replicate artistic style/lighting/mood. IGNORE any faces/text/numbers in reference.]`;
    }

    const fullPrompt = prefix + "\n\n" + prompt;
    console.log("Prompt length:", fullPrompt.length, "| Photos:", allPhotoUrls.length, "| PurchaseID:", purchaseId || "none");

    const resolvedModel = aiModel 
      ? (aiModel.includes('/') ? aiModel : `google/${aiModel}`)
      : "google/gemini-3.1-flash-image-preview";

    // Build content parts — user photos FIRST, style ref LAST
    const contentParts: any[] = [{ type: "text", text: fullPrompt }];
    for (const photoUrl of allPhotoUrls) {
      contentParts.push({ type: "image_url", image_url: { url: photoUrl } });
    }
    if (exampleImageUrl) {
      contentParts.push({ type: "text", text: "STYLE REFERENCE ONLY (do NOT copy any face/identity/text):" });
      contentParts.push({ type: "image_url", image_url: { url: exampleImageUrl } });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: contentParts.length > 1 ? contentParts : fullPrompt }
    ];

    const imageUrl = await tryGenerateWithRetry(resolvedModel, messages, apiKeys);
    if (!imageUrl) {
      await markFailed("All generation attempts failed (no image returned)");
      throw new Error("Image generation failed after multiple attempts. Please try again.");
    }

    if (purchaseId && supabaseAdmin) {
      await supabaseAdmin.from("prompt_purchases").update({
        payment_status: "paid", generation_status: "completed", generated_image_url: imageUrl,
        ...(userPhotoUrl ? { user_photo_url: userPhotoUrl } : {}),
      }).eq("id", purchaseId);
    }

    return new Response(JSON.stringify({ success: true, imageUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error) || "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error generating image:", errorMsg, errorStack ? `\nStack: ${errorStack}` : "");
    
    // Always try to log the error, even if markFailed was already called
    await markFailed(errorMsg);
    
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function callGateway(model: string, messages: any[], apiKey: string): Promise<any> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, modalities: ["image", "text"] }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText.substring(0, 300));
    if (response.status === 401) throw new Error("AUTH_INVALID");
    if (response.status === 429) throw new Error("Rate limit exceeded.");
    if (response.status === 402) throw new Error("Service temporarily unavailable.");
    if (response.status === 400 && errorText.includes("fetching image from URL")) {
      throw new Error("INVALID_IMAGE_URL");
    }
    return null;
  }
  return response.json();
}

function extractImageUrl(data: any): string | null {
  const choice = data?.choices?.[0]?.message;
  if (!choice) return null;
  return (
    choice.images?.[0]?.image_url?.url ||
    (Array.isArray(choice.content) ? choice.content.find((c: any) => c.type === "image_url")?.image_url?.url : null) ||
    (Array.isArray(choice.content) ? (() => {
      const img = choice.content.find((c: any) => c.type === "image" || c.inline_data);
      if (img?.inline_data) return `data:${img.inline_data.mime_type || "image/png"};base64,${img.inline_data.data}`;
      if (img?.image?.url) return img.image.url;
      return null;
    })() : null)
  );
}

async function getExistingCustomFields(supabaseAdmin: any, purchaseId: string): Promise<Record<string, unknown>> {
  try {
    const { data } = await supabaseAdmin.from("prompt_purchases").select("custom_fields").eq("id", purchaseId).maybeSingle();
    return (data?.custom_fields && typeof data.custom_fields === 'object') ? data.custom_fields : {};
  } catch { return {}; }
}

function delay(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }

async function tryGenerateWithRetry(primaryModel: string, messages: any[], apiKeys: { primary: string; fallback: string | null }): Promise<string | null> {
  const modelsToTry = [primaryModel, "google/gemini-3-pro-image-preview", "google/gemini-3.1-flash-image-preview"];
  // Deduplicate if primary is already in fallback list
  const uniqueModels = [...new Set(modelsToTry)];
  const keysToTry = apiKeys.fallback ? [apiKeys.primary, apiKeys.fallback] : [apiKeys.primary];
  const errors: string[] = [];

  for (const apiKey of keysToTry) {
    const keyLabel = apiKey === apiKeys.primary ? "PRIMARY" : "FALLBACK";
    let authFailed = false;
    for (let mi = 0; mi < uniqueModels.length; mi++) {
      const model = uniqueModels[mi];
      if (authFailed) break;
      try {
        // Add delay between retries to avoid cascading rate limits
        if (mi > 0) await delay(2000);
        console.log(`[${keyLabel}] Attempting: ${model}`);
        const data = await callGateway(model, messages, apiKey);
        if (!data) { errors.push(`${model}: empty response`); continue; }
        const imageUrl = extractImageUrl(data);
        if (imageUrl) { console.log(`[${keyLabel}] ✅ Success with ${model}`); return imageUrl; }
        errors.push(`${model}: no image in response`);
        console.warn(`[${keyLabel}] No image in response from ${model}`);
      } catch (e: any) {
        if (e.message === "AUTH_INVALID") { console.warn(`[${keyLabel}] Auth invalid, skipping key`); authFailed = true; errors.push(`${keyLabel}: auth invalid`); break; }
        if (e.message === "INVALID_IMAGE_URL") { console.error(`[${keyLabel}] User photo URL is unreachable`); throw new Error("A URL da foto enviada não pôde ser acessada. Tente fazer upload novamente."); }
        if (e.message.includes("Rate limit") || e.message.includes("temporarily")) { errors.push(`${model}: ${e.message}`); throw e; }
        errors.push(`${model}: ${e.message}`);
        console.error(`[${keyLabel}] ${model} failed:`, e.message);
      }
    }
  }
  console.error("All generation attempts failed:", errors.join(" | "));
  return null;
}
