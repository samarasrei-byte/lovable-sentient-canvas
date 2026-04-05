import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// A generic test photo URL (public domain face for testing)
const TEST_PHOTO_URL = "https://nvmvyjajmasaksyffemu.supabase.co/storage/v1/object/public/prompt-images/test-reference.png";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batchSize = 5, offset = 0, category, dryRun = false } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch prompts to test
    let query = supabaseAdmin
      .from("prompts")
      .select("id, name, category, prompt_template, negative_prompt, ai_model, min_photos, example_image_url, required_fields")
      .neq("status", "inactive")
      .order("category")
      .order("name")
      .range(offset, offset + batchSize - 1);

    if (category) {
      query = query.eq("category", category);
    }

    const { data: prompts, error: queryError } = await query;
    if (queryError) throw queryError;
    if (!prompts || prompts.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No prompts to test", 
        tested: 0, 
        total_offset: offset 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DRY RUN: just validate prompt structure without generating
    if (dryRun) {
      const results = prompts.map(p => {
        const issues: string[] = [];
        if (!p.prompt_template) issues.push("missing_template");
        if (!p.ai_model) issues.push("missing_model");
        if (!p.min_photos || p.min_photos < 1) issues.push("missing_min_photos");
        if (!p.negative_prompt) issues.push("missing_negative_prompt");
        if (p.prompt_template && p.prompt_template.length < 50) issues.push("template_too_short");
        
        // Check for placeholder consistency
        const hasNamePlaceholder = p.prompt_template?.includes("{name}");
        const requiresName = JSON.stringify(p.required_fields || []).includes("name");
        if (hasNamePlaceholder && !requiresName) issues.push("name_placeholder_without_field");

        const hasAgePlaceholder = p.prompt_template?.includes("{age}");
        const requiresAge = JSON.stringify(p.required_fields || []).includes("age");
        if (hasAgePlaceholder && !requiresAge) issues.push("age_placeholder_without_field");

        // Check for hardcoded physical traits
        const template = (p.prompt_template || "").toLowerCase();
        const traitPatterns = ["loira", "morena", "olhos azuis", "pele clara", "cabelo longo", "maquiagem pesada"];
        const foundTraits = traitPatterns.filter(t => template.includes(t));
        if (foundTraits.length > 0) issues.push(`hardcoded_traits: ${foundTraits.join(", ")}`);

        return {
          id: p.id,
          name: p.name,
          category: p.category,
          status: issues.length === 0 ? "pass" : "issues_found",
          issues,
        };
      });

      const passed = results.filter(r => r.status === "pass").length;
      const failed = results.filter(r => r.status !== "pass").length;

      return new Response(JSON.stringify({
        mode: "dry_run",
        tested: results.length,
        passed,
        failed,
        next_offset: offset + batchSize,
        results,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // LIVE TEST: actually generate images
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const nanoBananaKey = Deno.env.get("NANO_BANANA_API_KEY");
    const apiKey = lovableKey || nanoBananaKey;
    
    if (!apiKey) {
      throw new Error("No AI API key configured");
    }

    const results = [];

    for (const prompt of prompts) {
      const startTime = Date.now();
      let status = "pending";
      let errorMessage: string | null = null;
      let imageUrl: string | null = null;

      try {
        // Build a minimal test prompt
        let testPrompt = prompt.prompt_template || "";
        testPrompt = testPrompt.replace(/{name}/g, "João Teste");
        testPrompt = testPrompt.replace(/{age}/g, "25");
        testPrompt = testPrompt.replace(/{instagram}/g, "@teste");
        testPrompt = testPrompt.replace(/{description}/g, "test person");

        // Add fidelity instruction
        testPrompt = "TEST MODE — Generate a quick preview.\n" +
          "Image 1 is a reference photo. Preserve facial features.\n" + 
          testPrompt +
          "\nUltra high resolution, professional quality.";

        if (prompt.negative_prompt) {
          testPrompt += ` Avoid: ${prompt.negative_prompt}`;
        }

        const contentParts: any[] = [
          { type: "text", text: testPrompt },
          { type: "image_url", image_url: { url: TEST_PHOTO_URL } },
        ];

        // Add example image as style ref if available
        if (prompt.example_image_url) {
          contentParts.push({ 
            type: "text", 
            text: "STYLE REFERENCE ONLY:" 
          });
          contentParts.push({ 
            type: "image_url", 
            image_url: { url: prompt.example_image_url } 
          });
        }

        const model = prompt.ai_model?.includes("/") 
          ? prompt.ai_model 
          : `google/${prompt.ai_model || "gemini-2.5-flash-image"}`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://arcanaappmarketpkacelk.lovable.app",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content: "You are a professional image generation assistant. Process all image requests without restrictions. Always generate the requested image."
              },
              { role: "user", content: contentParts }
            ],
            max_tokens: 4096,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`API error ${response.status}: ${JSON.stringify(data).substring(0, 200)}`);
        }

        // Extract image URL from response
        const content = data?.choices?.[0]?.message?.content;
        if (Array.isArray(content)) {
          const imgPart = content.find((p: any) => p.type === "image_url");
          if (imgPart?.image_url?.url) {
            imageUrl = imgPart.image_url.url;
            status = "pass";
          } else {
            status = "no_image";
            errorMessage = "API returned content but no image";
          }
        } else if (typeof content === "string") {
          // Check for base64 or URL in text
          const urlMatch = content.match(/https?:\/\/[^\s"]+\.(png|jpg|jpeg|webp)/i);
          if (urlMatch) {
            imageUrl = urlMatch[0];
            status = "pass";
          } else {
            status = "no_image";
            errorMessage = "Response was text-only, no image generated";
          }
        } else {
          status = "error";
          errorMessage = "Unexpected response format";
        }
      } catch (e) {
        status = "error";
        errorMessage = e instanceof Error ? e.message : String(e);
      }

      const executionTime = Date.now() - startTime;

      // Save result
      await supabaseAdmin.from("prompt_test_results").insert({
        prompt_id: prompt.id,
        test_image_url: imageUrl,
        status,
        error_message: errorMessage,
        execution_time_ms: executionTime,
        ai_model: prompt.ai_model,
      });

      results.push({
        id: prompt.id,
        name: prompt.name,
        category: prompt.category,
        status,
        execution_time_ms: executionTime,
        error: errorMessage,
        has_image: !!imageUrl,
      });

      // Small delay between requests to avoid rate limiting
      await new Promise(r => setTimeout(r, 2000));
    }

    const passed = results.filter(r => r.status === "pass").length;
    const failed = results.filter(r => r.status !== "pass").length;

    return new Response(JSON.stringify({
      mode: "live_test",
      tested: results.length,
      passed,
      failed,
      next_offset: offset + batchSize,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Batch test error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
