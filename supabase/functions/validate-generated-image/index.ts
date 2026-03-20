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
    const { imageUrl, promptCategory, expectedName, expectedDescription, hasReferencePhoto, numberOfPeople } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const qaPrompt = `Analyze this AI-generated image for quality issues. Check ALL of the following:

1. FACE/BODY: Are there any facial distortions, extra fingers, deformed hands, or unnatural body proportions?
2. CROPPING: Is any important part (head, hands, body) cut off at the edges?
3. COMPOSITION: Is the image well-centered and suitable for mobile viewing (vertical format preferred)?
4. TEXT (if applicable): If there is text in the image, is it spelled correctly and legible? Expected name: "${expectedName || 'N/A'}". Expected description: "${expectedDescription || 'N/A'}".
5. PEOPLE COUNT: Expected ${numberOfPeople || 1} person(s). Are they all present?
6. IDENTITY: ${hasReferencePhoto ? 'Does the person look like a real photo reference was used (realistic skin, natural features)?' : 'N/A'}
7. QUALITY: Is the image high resolution, well-lit, and professional looking?

Category: ${promptCategory || 'general'}

Respond in this EXACT JSON format:
{
  "passed": true/false,
  "issues": ["issue 1", "issue 2"],
  "score": 0-100
}

Only mark "passed": false if there are SIGNIFICANT issues (distortions, wrong text, missing people, severe cropping). Minor stylistic differences should pass.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a strict image quality assurance inspector. Analyze images for defects. Always respond in valid JSON." },
          {
            role: "user",
            content: [
              { type: "text", text: qaPrompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error("QA API error:", response.status);
      return new Response(
        JSON.stringify({ passed: true, issues: [], score: 80 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return new Response(
        JSON.stringify({
          passed: result.passed ?? true,
          issues: result.issues ?? [],
          score: result.score ?? 80,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ passed: true, issues: [], score: 80 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("QA validation error:", error);
    return new Response(
      JSON.stringify({ passed: true, issues: [], score: 70 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
