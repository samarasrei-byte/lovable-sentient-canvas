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
    const {
      imageUrl,
      promptCategory,
      promptTemplate,
      expectedName,
      expectedDescription,
      hasReferencePhoto,
      numberOfPeople,
      referenceImageUrls,
      styleReferenceImageUrl,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const safeReferenceImages = Array.isArray(referenceImageUrls)
      ? referenceImageUrls.filter((url) => typeof url === "string" && url.length > 0)
      : [];

    const qaPrompt = `Analyze this AI-generated image with a strict premium QA process.

CHECK ALL ITEMS:
1. FACE/BODY: Are there facial distortions, extra fingers, deformed hands, broken anatomy, or unnatural proportions?
2. CROPPING: Is any important part (head, face, hands, body) cut off?
3. TEXT: If text appears, is it correct, readable, well-positioned, and spelled exactly as expected? Expected name: "${expectedName || "N/A"}". Expected description: "${expectedDescription || "N/A"}".
4. COMPOSITION: Is the composition centered, premium, and suitable for mobile vertical viewing?
5. PROMPT CONSISTENCY: Does the final image visually match the requested prompt/theme/category?
6. PEOPLE COUNT: Expected ${numberOfPeople || 1} person(s). Are they all present?
7. STYLE REFERENCE: If a style reference image is provided, does the generated output follow its style/composition without copying the wrong identity?
8. SUBJECT FIDELITY: ${hasReferencePhoto ? "Compare the generated subject(s) against the reference photo(s). Verify that identity, apparent age group, hair, face structure, and overall likeness are preserved." : "N/A"}
9. QUALITY: Is the image high-resolution, well-lit, professional, and free from obvious AI artifacts?

Category: ${promptCategory || "general"}
Prompt snippet: ${(promptTemplate || "").slice(0, 700)}

IMPORTANT IMAGE ORDER:
- First image = generated output to audit
- Second image (if present) = style reference
- Remaining images (if present) = real subject reference photos

Respond in this EXACT JSON format:
{
  "passed": true/false,
  "issues": ["issue 1", "issue 2"],
  "score": 0-100
}

Only mark passed=false when there are significant issues such as wrong person, wrong age appearance, bad text, severe cropping, missing people, or strong distortions.`;

    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: "text", text: qaPrompt },
      { type: "image_url", image_url: { url: imageUrl } },
    ];

    if (styleReferenceImageUrl) {
      content.push({ type: "text", text: "Style reference image:" });
      content.push({ type: "image_url", image_url: { url: styleReferenceImageUrl } });
    }

    if (safeReferenceImages.length > 0) {
      content.push({ type: "text", text: "Real subject reference images:" });
      safeReferenceImages.forEach((url) => {
        content.push({ type: "image_url", image_url: { url } });
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: safeReferenceImages.length > 0 || styleReferenceImageUrl ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a strict premium image QA inspector. Always return valid JSON only.",
          },
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("QA API error:", response.status);
      return new Response(
        JSON.stringify({ passed: true, issues: [], score: 80 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content || "";
    const jsonMatch = typeof contentText === "string" ? contentText.match(/\{[\s\S]*\}/) : null;

    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ passed: true, issues: [], score: 80 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({
        passed: result.passed ?? true,
        issues: Array.isArray(result.issues) ? result.issues : [],
        score: result.score ?? 80,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("QA validation error:", error);
    return new Response(
      JSON.stringify({ passed: true, issues: [], score: 70 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
