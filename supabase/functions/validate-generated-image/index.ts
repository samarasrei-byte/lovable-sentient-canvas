import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getQaFallback(strictIdentityCheck: boolean) {
  return strictIdentityCheck
    ? {
        passed: false,
        issues: ["A validação automática de fidelidade falhou; gere novamente para evitar trocar o rosto da pessoa."],
        score: 0,
      }
    : { passed: true, issues: [], score: 70 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let strictIdentityCheck = false;

  try {
    const {
      imageUrl,
      promptCategory,
      promptTemplate,
      expectedAge,
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
    strictIdentityCheck = safeReferenceImages.length > 0 || Boolean(hasReferencePhoto);

    const qaPrompt = `You are a STRICT premium image QA inspector. Analyze this AI-generated image rigorously.

CHECK ALL ITEMS — mark passed=false if ANY significant issue is found:

1. FACIAL FIDELITY (MOST IMPORTANT): Compare the generated subject against the reference photos. The person MUST be INSTANTLY recognizable — same eye shape, nose, mouth, jawline, skin tone, hair color/style, body type. If the generated person looks like a DIFFERENT person, this is an AUTOMATIC FAIL.

2. FACE/BODY ANATOMY: Extra fingers, deformed hands, broken anatomy, unnatural proportions? FAIL.

3. AGE/NUMBER: If birthday/age image, the visible number MUST match expected age EXACTLY. Expected age: "${expectedAge || "N/A"}". Wrong number = AUTOMATIC FAIL. IGNORE any number from the style reference — only validate against the expected age.

4. TEXT: If text appears, is it correct and spelled exactly? Expected name: "${expectedName || "N/A"}". Wrong text = FAIL.

5. CROPPING: Is the person's head, face, or body cut off? FAIL.

6. PEOPLE COUNT: Expected ${numberOfPeople || 1} person(s). Missing people = FAIL.

7. STYLE vs IDENTITY CONTAMINATION: Did the AI copy the WRONG person's face from the style reference instead of the user's photo? This is an AUTOMATIC FAIL.

8. QUALITY: Professional resolution, well-lit, no obvious AI artifacts? Low quality = FAIL.

Category: ${promptCategory || "general"}
Prompt snippet: ${(promptTemplate || "").slice(0, 500)}

IMPORTANT IMAGE ORDER:
- First image = generated output to audit
- Then: real subject reference photos (if present)
- Last: style reference image (if present)

BE STRICT. When in doubt, FAIL. It's better to regenerate than deliver a bad image.

Respond in this EXACT JSON format:
{
  "passed": true/false,
  "issues": ["issue 1", "issue 2"],
  "score": 0-100
}`;

    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: "text", text: qaPrompt },
      { type: "image_url", image_url: { url: imageUrl } },
    ];

    // Reference photos FIRST (identity truth)
    if (safeReferenceImages.length > 0) {
      content.push({ type: "text", text: "Real subject reference photos (the person who MUST appear in the output):" });
      safeReferenceImages.forEach((url) => {
        content.push({ type: "image_url", image_url: { url } });
      });
    }

    // Style reference LAST (secondary context)
    if (styleReferenceImageUrl) {
      content.push({ type: "text", text: "Style reference image (for style/composition only — NOT identity):" });
      content.push({ type: "image_url", image_url: { url: styleReferenceImageUrl } });
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
        JSON.stringify(getQaFallback(strictIdentityCheck)),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content || "";
    const jsonMatch = typeof contentText === "string" ? contentText.match(/\{[\s\S]*\}/) : null;

    if (!jsonMatch) {
      return new Response(
        JSON.stringify(getQaFallback(strictIdentityCheck)),
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
      JSON.stringify(getQaFallback(strictIdentityCheck)),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
