import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the world's most advanced facial reconstruction AI. Your sole purpose is to clone a human identity from a reference photo into a new environment with 100% forensic accuracy.

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { 
      purchaseId, promptTemplate, userPhotoUrl, exampleImageUrl, 
      style = "realistic", // "realistic" or "artistic"
      userId
    } = body;

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableKey) throw new Error("LOVABLE_API_KEY is missing");

    // Enhance prompt based on style
    let enhancedPrompt = promptTemplate;
    if (style === "realistic") {
      enhancedPrompt += ", ultra-realistic photography, cinematic lighting, 8k resolution, highly detailed skin texture, shot on 85mm lens";
    } else if (style === "artistic") {
      enhancedPrompt += ", artistic digital painting style, vibrant colors, dreamlike atmosphere, soft lighting, masterpiece";
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { 
        role: "user", 
        content: [
          { type: "text", text: `CLONE THE FACE FROM IMAGE 1. Output a new image following this description: ${enhancedPrompt}. Use IMAGE 2 for style/lighting inspiration ONLY.` },
          { type: "image_url", image_url: { url: userPhotoUrl } },
          { type: "image_url", image_url: { url: exampleImageUrl || userPhotoUrl } }
        ]
      }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages,
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices[0].message.content.find((c: any) => c.type === "image")?.image_url?.url || 
                     data.choices[0].message.content.find((c: any) => c.image_url)?.image_url?.url;

    if (!imageUrl) throw new Error("No image returned from AI");

    // Save to generated_images if userId is provided
    if (userId) {
      await supabaseAdmin.from("generated_images").insert({
        user_id: userId,
        image_url: imageUrl,
        template_name: promptTemplate.substring(0, 50),
        original_purchase_id: purchaseId
      });
    }

    if (purchaseId) {
      await supabaseAdmin.from("prompt_purchases").update({
        generated_image_url: imageUrl,
        generation_status: "completed"
      }).eq("id", purchaseId);
    }

    return new Response(JSON.stringify({ success: true, imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
