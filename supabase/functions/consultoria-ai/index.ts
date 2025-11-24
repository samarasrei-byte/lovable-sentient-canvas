import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = `Você é um consultor especialista em marketing de influência e criação de campanhas digitais. 
Seu papel é ajudar marcas a encontrar os criadores ideais e desenvolver estratégias de campanha eficazes.

Quando solicitado para:
- GERAR ROTEIRO: Crie roteiros detalhados de campanha com objetivos, mensagens-chave, CTAs e cronograma
- SUGERIR CRIADORES: Recomende tipos de criadores (avatares IA, influencers reais ou artistas) baseado no nicho, orçamento e objetivos
- CALCULAR ORÇAMENTO: Estime custos considerando tipo de criador, alcance, engajamento e duração da campanha
- GERAR AVATAR: Forneça uma descrição detalhada para geração de avatar IA baseada nas necessidades da marca

Seja específico, criativo e focado em resultados mensuráveis.`;

    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
    };

    // Se for geração de avatar, usar o Nano Banana
    if (type === 'generate-avatar') {
      body.model = "google/gemini-2.5-flash-image";
      body.modalities = ["image", "text"];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Se for geração de imagem, retornar a imagem
    if (type === 'generate-avatar' && data.choices?.[0]?.message?.images) {
      return new Response(
        JSON.stringify({ 
          message: data.choices[0].message.content,
          image: data.choices[0].message.images[0].image_url.url
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retornar resposta normal
    return new Response(
      JSON.stringify({ message: data.choices[0].message.content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in consultoria-ai function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});