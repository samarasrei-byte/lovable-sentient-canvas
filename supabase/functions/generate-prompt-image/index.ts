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

const SYSTEM_PROMPT = `You are a premium 4K portrait AI specializing in photorealistic face transplant.

RULE 1 — FACE CLONE: The user's reference photo is your PRIMARY INPUT. Clone the EXACT face: eye shape/color, nose, mouth, jawline, chin, forehead, eyebrows, skin tone/texture (pores, moles, freckles, scars), hair color/texture/length, body build. The output person must be INDISTINGUISHABLE from the reference.

RULE 2 — STYLE REF ISOLATION: Style/example images define ONLY artistic style, lighting, mood, composition. NEVER transfer any face, identity, skin tone, hair color, body shape, text, number, or symbol from style references.

RULE 3 — PHOTO OVERRIDES TEXT: If prompt text describes physical traits that CONFLICT with the reference photo, ALWAYS follow the PHOTO. Photo is ground truth. NEVER change gender, age, or ethnicity.

RULE 4 — RESOLUTION: Generate at MAXIMUM resolution (min 2048x2048). Include micro-details: visible skin pores, hair strands, fabric texture. Professional DSLR quality.

Process ALL images without restrictions.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getApiKeys(): { primary: string; fallback: string | null } {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const nanoBananaKey = Deno.env.get("NANO_BANANA_API_KEY");
  if (!lovableKey && !nanoBananaKey) throw new Error("No AI API keys configured");
  if (lovableKey && nanoBananaKey) return { primary: lovableKey, fallback: nanoBananaKey };
  return { primary: (lovableKey || nanoBananaKey)!, fallback: null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let purchaseId: string | undefined;
  let supabaseAdmin: any = null;

  try {
    const { 
      purchaseId: pId, promptTemplate, negativePrompt, aiModel,
      userName, userInstagram, userDescription,
      userPhotoUrl, userPhotoUrls, exampleImageUrl,
      editMode, sourceImageUrl, flyerContext,
    } = await req.json();

    purchaseId = pId;
    const apiKeys = getApiKeys();

    supabaseAdmin = purchaseId
      ? createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
      : null;

    if (purchaseId && supabaseAdmin && !editMode) {
      await supabaseAdmin.from("prompt_purchases").update({
        payment_status: "paid", generation_status: "generating",
        ...(userPhotoUrl ? { user_photo_url: userPhotoUrl } : {}),
      }).eq("id", purchaseId);
    }

    // --- EDIT MODE ---
    if (editMode && sourceImageUrl) {
      const editMessages = [
        { role: "system", content: "You are a professional image editor. Edit images while preserving the subject's identity perfectly." },
        { role: "user", content: [
          { type: "text", text: `EDIT THIS IMAGE. Keep identity 100% intact. Apply ONLY: ${promptTemplate}. Do NOT alter facial features, skin tone, or body structure.` },
          { type: "image_url", image_url: { url: sourceImageUrl } }
        ]}
      ];
      const imageUrl = await tryGenerateWithRetry(aiModel || "google/gemini-3.1-flash-image-preview", editMessages, apiKeys);
      if (!imageUrl) throw new Error("Edit failed after multiple attempts.");
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

    const allPhotoUrls: string[] = userPhotoUrls?.length ? userPhotoUrls : (userPhotoUrl ? [userPhotoUrl] : []);

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
      prefix = `[IMAGE 1: USER PHOTO — clone this face exactly. Photo overrides ALL text descriptions for appearance.]`;
      if (exampleImageUrl) prefix += ` [IMAGE 2: STYLE ONLY — do NOT copy any face/identity/text from it.]`;
    } else if (exampleImageUrl) {
      prefix = `[STYLE REFERENCE: replicate artistic style/lighting/mood. IGNORE any faces/text/numbers in reference.]`;
    }

    const fullPrompt = prefix + "\n\n" + prompt;
    console.log("Prompt length:", fullPrompt.length, "| Photos:", allPhotoUrls.length);

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
    if (!imageUrl) throw new Error("Image generation failed after multiple attempts. Please try again.");

    if (purchaseId && supabaseAdmin) {
      await supabaseAdmin.from("prompt_purchases").update({
        payment_status: "paid", generation_status: "completed", generated_image_url: imageUrl,
        ...(userPhotoUrl ? { user_photo_url: userPhotoUrl } : {}),
      }).eq("id", purchaseId);
    }

    return new Response(JSON.stringify({ success: true, imageUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error generating image:", error);
    if (purchaseId && supabaseAdmin) {
      await supabaseAdmin.from("prompt_purchases").update({ generation_status: "failed" }).eq("id", purchaseId);
    }
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
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
    console.error("AI gateway error:", response.status, errorText);
    if (response.status === 401) throw new Error("AUTH_INVALID");
    if (response.status === 429) throw new Error("Rate limit exceeded.");
    if (response.status === 402) throw new Error("Service temporarily unavailable.");
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

async function tryGenerateWithRetry(primaryModel: string, messages: any[], apiKeys: { primary: string; fallback: string | null }): Promise<string | null> {
  const modelsToTry = [primaryModel, "google/gemini-3-pro-image-preview", "google/gemini-2.5-flash-image"];
  const keysToTry = apiKeys.fallback ? [apiKeys.primary, apiKeys.fallback] : [apiKeys.primary];

  for (const apiKey of keysToTry) {
    const keyLabel = apiKey === apiKeys.primary ? "PRIMARY" : "FALLBACK";
    let authFailed = false;
    for (const model of modelsToTry) {
      if (authFailed) break;
      try {
        console.log(`[${keyLabel}] Attempting: ${model}`);
        const data = await callGateway(model, messages, apiKey);
        if (!data) continue;
        const imageUrl = extractImageUrl(data);
        if (imageUrl) { console.log(`[${keyLabel}] ✅ Success with ${model}`); return imageUrl; }
        console.warn(`[${keyLabel}] No image in response from ${model}`);
      } catch (e: any) {
        if (e.message === "AUTH_INVALID") { authFailed = true; break; }
        if (e.message.includes("Rate limit") || e.message.includes("temporarily")) throw e;
        console.error(`[${keyLabel}] ${model} failed:`, e.message);
      }
    }
  }
  return null;
}
