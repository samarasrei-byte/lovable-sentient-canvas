import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      purchaseId, 
      promptTemplate, 
      negativePrompt,
      aiModel,
      userName, 
      userInstagram, 
      userDescription,
      userPhotoUrl,
      exampleImageUrl
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the final prompt with variable substitution
    let finalPrompt = promptTemplate || "Create a stunning artistic portrait, highly detailed, cinematic lighting, 8k quality";
    
    // Replace variables
    if (userName) {
      finalPrompt = finalPrompt.replace(/{name}/g, userName);
    }
    if (userInstagram) {
      finalPrompt = finalPrompt.replace(/{instagram}/g, `@${userInstagram.replace('@', '')}`);
    }
    if (userDescription) {
      finalPrompt = finalPrompt.replace(/{description}/g, userDescription);
    }

    // Add quality enhancers
    finalPrompt += ". Ultra high resolution, professional photography, trending on artstation.";

    // Add negative prompt if provided
    if (negativePrompt) {
      finalPrompt += ` Avoid: ${negativePrompt}`;
    }

    // Build context-aware system prompt with strong reference image instructions
    let imageInstructions = "";
    if (userPhotoUrl && exampleImageUrl) {
      imageInstructions = "CRITICAL INSTRUCTION — TWO REFERENCE IMAGES PROVIDED:\n" +
        "IMAGE 1 (STYLE REFERENCE ONLY — DO NOT COPY THE PERSON): This image is ONLY for style, lighting, mood, color palette, composition, camera angle, pose, clothing style, and overall aesthetic. " +
        "⚠️ The person shown in this image is NOT the subject. DO NOT reproduce their face, features, or identity. COMPLETELY IGNORE the person's face in this image. Only use the artistic direction.\n" +
        "IMAGE 2 (THE REAL SUBJECT — THIS IS THE PERSON TO GENERATE): This is the REAL person who MUST appear in the final image. " +
        "You MUST preserve their face with 100% fidelity — exact eye shape, nose structure, mouth shape, jawline, skin tone and texture, facial proportions, hair color, hair texture, and hairstyle. " +
        "The generated person must be UNMISTAKABLY IDENTICAL to this photo. Zero modifications to facial features.\n" +
        "OUTPUT: Generate a NEW image that takes ONLY the style/scene/composition/lighting from Image 1 but places the EXACT person from Image 2 into that scene. " +
        "The face in the output MUST match Image 2, NOT Image 1. If Image 1 shows a different person, that person must be completely replaced by the person from Image 2. " +
        "Ultra-realistic skin texture with visible pores, natural imperfections. ";
    } else if (userPhotoUrl) {
      imageInstructions = "CRITICAL INSTRUCTION — USER REFERENCE PHOTO PROVIDED:\n" +
        "The provided image is the USER'S REAL PHOTO. This is the SUBJECT. You MUST use this as the absolute primary reference for the subject's face, identity, and ALL physical features. " +
        "Preserve 100% facial fidelity — exact eye shape, nose, mouth, jawline, skin tone, hair color, facial proportions. " +
        "The generated image MUST look like the EXACT SAME PERSON. No stylistic alterations to facial features. Ultra-realistic skin texture. ";
    } else if (exampleImageUrl) {
      imageInstructions = "CRITICAL INSTRUCTION — STYLE REFERENCE IMAGE PROVIDED:\n" +
        "The provided image is a STYLE REFERENCE. Replicate this exact artistic style, lighting, mood, composition, and overall aesthetic in the generated image. ";
    }

    const fullPrompt = imageInstructions + finalPrompt;
    console.log("Generating image with prompt:", fullPrompt.substring(0, 300));

    // Ensure model has proper prefix
    const resolvedModel = aiModel 
      ? (aiModel.includes('/') ? aiModel : `google/${aiModel}`)
      : "google/gemini-2.5-flash-image";
    console.log("Using model:", resolvedModel);
    console.log("User photo:", userPhotoUrl ? "YES" : "NO");
    console.log("Example image:", exampleImageUrl ? "YES" : "NO");

    // Build message content parts
    const contentParts: any[] = [{ type: "text", text: fullPrompt }];

    // Add example/style reference image FIRST
    if (exampleImageUrl) {
      contentParts.push({
        type: "image_url",
        image_url: { url: exampleImageUrl }
      });
    }

    // Add user photo SECOND
    if (userPhotoUrl) {
      contentParts.push({
        type: "image_url",
        image_url: { url: userPhotoUrl }
      });
    }

    const messages = [{
      role: "user",
      content: contentParts.length > 1 ? contentParts : fullPrompt
    }];

    // Helper to attempt generation with a given model
    async function tryGenerate(model: string): Promise<string | null> {
      console.log("Attempting generation with model:", model);
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          modalities: ["image", "text"]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        if (response.status === 429 || response.status === 402) {
          throw new Error(response.status === 429 
            ? "Rate limit exceeded. Please try again later." 
            : "Service temporarily unavailable.");
        }
        return null;
      }

      const data = await response.json();
      const choice = data.choices?.[0]?.message;
      console.log("Response finish_reason:", data.choices?.[0]?.finish_reason);

      // Try multiple known response formats
      return (
        choice?.images?.[0]?.image_url?.url ||
        (Array.isArray(choice?.content) 
          ? choice.content.find((c: any) => c.type === "image_url")?.image_url?.url 
          : null) ||
        (Array.isArray(choice?.content)
          ? (() => {
              const img = choice.content.find((c: any) => c.type === "image" || c.inline_data);
              if (img?.inline_data) return `data:${img.inline_data.mime_type || "image/png"};base64,${img.inline_data.data}`;
              if (img?.image?.url) return img.image.url;
              return null;
            })()
          : null)
      );
    }

    // Try with primary model, retry once, then fallback to alternative model
    const modelsToTry = [resolvedModel, resolvedModel, "google/gemini-2.5-flash"];
    let imageUrl: string | null = null;

    for (const model of modelsToTry) {
      try {
        imageUrl = await tryGenerate(model);
        if (imageUrl) break;
        console.warn("No image in response, retrying with next attempt...");
      } catch (e: any) {
        // Re-throw rate limit / billing errors
        if (e.message.includes("Rate limit") || e.message.includes("temporarily")) {
          return new Response(
            JSON.stringify({ error: e.message }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        console.error("Attempt failed:", e.message);
      }
    }

    if (!imageUrl) {
      throw new Error("Image generation failed after multiple attempts. Please try again.");
    }

    // Update the purchase record with the generated image
    if (purchaseId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from("prompt_purchases")
        .update({
          generation_status: "completed",
          generated_image_url: imageUrl
        })
        .eq("id", purchaseId);
    }

    return new Response(
      JSON.stringify({ success: true, imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});