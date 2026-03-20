import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { screenshotUrl, action, promptText, referenceImageUrl } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (action === "extract") {
      console.log("Extracting prompt text from screenshot...");

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an expert OCR system. Extract ONLY the prompt text from this screenshot. The image contains a text prompt used for AI image generation. Return ONLY the raw prompt text, nothing else. No explanations, no formatting, no markdown. Just the exact prompt text as written in the image. If there are multiple prompts, extract the main/longest one. If you see metadata like model names, settings, or UI elements, ignore them - only extract the actual prompt text.`
              },
              {
                type: "image_url",
                image_url: { url: screenshotUrl }
              }
            ]
          }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OCR error:", response.status, errorText);
        throw new Error("Failed to extract text from screenshot");
      }

      const data = await response.json();
      const extractedText = data.choices?.[0]?.message?.content?.trim() || "";
      console.log("Extracted text:", extractedText.substring(0, 200));

      return new Response(
        JSON.stringify({ success: true, extractedText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "generate") {
      console.log("Generating image from prompt + reference photo...");

      if (!promptText) {
        throw new Error("promptText is required for generate action");
      }
      if (!referenceImageUrl) {
        throw new Error("referenceImageUrl is required for generate action");
      }

      // Use image editing: send the reference photo + prompt text to generate styled image
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages: [{
            role: "user",
            content: [
              {
                type: "text",
                text: promptText + ". Use this reference image as the base subject. Ultra high resolution, professional quality, 8k."
              },
              {
                type: "image_url",
                image_url: { url: referenceImageUrl }
              }
            ]
          }],
          modalities: ["image", "text"]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Image generation error:", response.status, errorText);
        if (response.status === 429) {
          throw new Error("Rate limit excedido. Tente novamente em alguns segundos.");
        }
        if (response.status === 402) {
          throw new Error("Créditos insuficientes. Adicione créditos ao workspace.");
        }
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const choice = data.choices?.[0]?.message;

      // Try multiple response formats
      const imageUrl = 
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
          : null);

      if (!imageUrl) {
        console.error("No image in response:", JSON.stringify(data).substring(0, 500));
        throw new Error("Nenhuma imagem gerada. Tente novamente.");
      }

      return new Response(
        JSON.stringify({ success: true, imageUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action. Use 'extract' or 'generate'.");
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
