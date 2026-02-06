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
      userPhotoUrl 
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

    console.log("Generating image with prompt:", finalPrompt);
    console.log("Using model:", aiModel || "google/gemini-2.5-flash-image");

    // Prepare messages
    const messages: any[] = [];
    
    // If user photo provided, include it for reference
    if (userPhotoUrl) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: finalPrompt
          },
          {
            type: "image_url",
            image_url: {
              url: userPhotoUrl
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: finalPrompt
      });
    }

    // Call Lovable AI Gateway for image generation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel || "google/gemini-2.5-flash-image",
        messages,
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
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