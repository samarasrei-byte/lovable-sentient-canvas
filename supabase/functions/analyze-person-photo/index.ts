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

    const analysisPrompt = `Analyze this image thoroughly and return ONLY valid JSON in this exact format:

{
  "seguranca": {
    "conteudo_seguro": true,
    "motivo_bloqueio": null,
    "sugestoes_seguranca": ["Use roupas mais cobertas", "Mude o ângulo da foto"],
    "rating": "G|PG|R|X"
  },
  "analise": {
    "quantidade_pessoas": 1,
    "pessoas": [
      {
        "label": "Pessoa 1",
        "tipo": "adulto",
        "genero": "masculino",
        "idade_aproximada": 30
      }
    ],
    "contexto": "individual",
    "animais": []
  },
  "audit_qualidade": {
    "rosto_detectado": true,
    "olhando_camera": true,
    "iluminacao_boa": true,
    "rosto_centralizado": true,
    "sem_obstrucoes": true,
    "resolucao_ok": true,
    "score_identidade": 0.95,
    "recomendacoes": ["Remova óculos de sol", "Vá para um lugar mais iluminado"]
  },
  "areas_editaveis": [
    {
      "tipo": "pessoa",
      "label": "Pessoa 1",
      "descricao": "homem adulto ~30 anos",
      "editavel": true
    }
  ],
  "prompt_gerado": "A detailed prompt describing the scene for AI image generation",
  "categoria": "individual",
  "subcategorias": [],
  "metadados": {
    "pessoas": 1,
    "criancas": 0,
    "adultos": 1,
    "idosos": 0,
    "homens": 1,
    "mulheres": 0,
    "idade_detectada": null,
    "animal": null
  },
  "ageGroup": "adulto",
  "presentation": "masculina",
  "suggestedCategory": "retrato_pessoal",
  "summary": "short phrase"
}

CRITICAL SAFETY RULES:
- "conteudo_seguro": Set to false if the image contains nudity, explicit sexual content, suggests sexualization of minors (infantilized sexual content), or is otherwise highly inappropriate.
- "motivo_bloqueio": If "conteudo_seguro" is false, explain why in Portuguese (e.g., "Nudez detectada", "Conteúdo sexualizado", "Conteúdo infantil inapropriado").
- Be extremely conservative. Any hint of sexualization in children's photos is an automatic block.

Standard Rules:
- In "audit_qualidade", be very strict. If it's a child photo, "score_identidade" measures how well the features (eyes, nose, mouth) are visible for AI cloning.
- "rosto_detectado": true if a face is clearly visible.
- "olhando_camera": true if the person is looking frontally.
- "iluminacao_boa": false if there are harsh shadows on the face or it's too dark.
- "sem_obstrucoes": false if there are hands, pacifiers, hair, or glasses covering the face.
- "recomendacoes": suggest specific improvements in Portuguese.
- "tipo" for each pessoa must be one of: bebe, crianca, adolescente, adulto, idoso
- "genero" must be: masculino, feminino, indefinido
- "contexto" must be one of: aniversario, profissional, familia, casal, individual, social, pet
- If there's a birthday cake with candles or age number, set contexto to "aniversario", extract the age into "idade_detectada" and add an editable area with tipo "idade"
- If formal/professional attire or neutral background, contexto = "profissional"
- If 2+ people of different ages, contexto = "familia"
- If 2 people in romantic context, contexto = "casal"
- If animals are present, list them in "animais" array with {tipo, descricao}
- "categoria" maps: aniversario→aniversario, profissional→linkedin, familia→familia, casal→casal, individual→individual, pet→pet, social→social
- "subcategorias" can include: com_crianca, com_animal, evento, profissional, com_bebe, com_idoso
- "ageGroup" must be: bebe (babies/toddlers ≤1yr), crianca (2-12), adolescente (13-17), adulto (18+)
- For multiple people use the primary subject's age group
- "presentation" must be: masculina, feminina, indefinida
- "suggestedCategory" must be: mesversario (baby ≤1yr), infantil (child), retrato_pessoal, linkedin_profissional, aniversario, familia, casal
- "prompt_gerado" should be a rich, detailed prompt in Portuguese describing all people, their appearance, the scene, lighting, and style
- Do not identify real people by name
- Return ONLY valid JSON, no markdown`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash",
        messages: [
          {
            role: "system",
            content: "You analyze images and return structured JSON with person detection, quality auditing for AI cloning, and context classification. Always return valid JSON only.",
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

    const finalResult = {
      seguranca: result.seguranca || {
        conteudo_seguro: true,
        motivo_bloqueio: null,
        rating: "G"
      },
      ageGroup: result.ageGroup || "adulto",
      presentation: result.presentation || "indefinida",
      suggestedCategory: result.suggestedCategory || "retrato_pessoal",
      summary: result.summary || "",
      audit_qualidade: result.audit_qualidade || {
        rosto_detectado: true,
        olhando_camera: true,
        iluminacao_boa: true,
        rosto_centralizado: true,
        sem_obstrucoes: true,
        resolucao_ok: true,
        score_identidade: 0.8,
        recomendacoes: []
      },
      analise: result.analise || {
        quantidade_pessoas: 1,
        pessoas: [],
        contexto: "individual",
        animais: [],
      },
      areas_editaveis: result.areas_editaveis || [],
      prompt_gerado: result.prompt_gerado || "",
      categoria: result.categoria || "individual",
      subcategorias: result.subcategorias || [],
      metadados: result.metadados || {
        pessoas: 1,
        criancas: 0,
        adultos: 1,
        idosos: 0,
        homens: 0,
        mulheres: 0,
        idade_detectada: null,
        animal: null,
      },
    };

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Photo analysis exception:", error);
    return new Response(
      JSON.stringify({
        ageGroup: "adulto",
        presentation: "indefinida",
        suggestedCategory: "retrato_pessoal",
        summary: "",
        audit_qualidade: { rosto_detectado: true, olhando_camera: true, iluminacao_boa: true, rosto_centralizado: true, sem_obstrucoes: true, resolucao_ok: true, score_identidade: 0.8, recomendacoes: [] },
        analise: { quantidade_pessoas: 1, pessoas: [], contexto: "individual", animais: [] },
        areas_editaveis: [],
        prompt_gerado: "",
        categoria: "individual",
        subcategorias: [],
        metadados: { pessoas: 1, criancas: 0, adults: 1, idosos: 0, homens: 0, mulheres: 0, idade_detectada: null, animal: null },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});