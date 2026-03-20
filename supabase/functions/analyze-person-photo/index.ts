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
    const { imageDataUrl, imageUrl } = await req.json();
    const sourceImage = imageDataUrl || imageUrl;

    if (!sourceImage) {
      throw new Error("Image is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const analysisPrompt = `Analyze this reference portrait for image-generation assistance.

Return ONLY valid JSON in this exact format:
{
  "ageGroup": "bebe|crianca|adolescente|adulto",
  "presentation": "masculina|feminina|indefinida",
  "suggestedCategory": "mesversario|infantil|retrato_pessoal",
  "summary": "short phrase"
}

Rules:
- Use bebe for babies/toddlers.
- Use crianca for children.
- Use adolescente for teens.
- Use adulto for adults.
- presentation must describe only visible presentation; if uncertain use indefinida.
- If the photo clearly looks like a baby, suggestedCategory should be mesversario.
- If it looks like a child or teen, suggestedCategory should be infantil.
- Otherwise suggestedCategory should be retrato_pessoal.
- Do not identify the person.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You analyze reference portraits and return compact JSON for generation hints.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              { type: "image_url", image_url: { url: sourceImage } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Photo analysis error:", response.status, errorText);
      throw new Error("Unable to analyze image");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid analysis response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({
        ageGroup: result.ageGroup || "adulto",
        presentation: result.presentation || "indefinida",
        suggestedCategory: result.suggestedCategory || "retrato_pessoal",
        summary: result.summary || "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Photo analysis exception:", error);
    return new Response(
      JSON.stringify({
        ageGroup: "adulto",
        presentation: "indefinida",
        suggestedCategory: "retrato_pessoal",
        summary: "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
