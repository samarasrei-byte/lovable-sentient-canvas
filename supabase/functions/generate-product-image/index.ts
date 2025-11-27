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
    const { productName, templateId, productImageBase64, templateImageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    if (!productImageBase64 || !templateImageBase64) {
      throw new Error('Product image and template image are required');
    }

    console.log('Generating image with template:', templateId, 'product:', productName);

    // Use image editing to composite the product into the template scene
    const editPrompt = `Você receberá duas imagens:
1. A primeira imagem é o template de referência (influenciadora fitness)
2. A segunda imagem é o produto que deve ser incluído

INSTRUÇÕES CRÍTICAS:
- Mantenha EXATAMENTE a mesma pessoa da primeira imagem (cabelo ruivo, características faciais, tom de pele, expressão)
- Mantenha EXATAMENTE a mesma pose, ângulo e composição da primeira imagem
- Mantenha o mesmo ambiente (academia) e iluminação da primeira imagem
- Substitua APENAS o produto que a pessoa está segurando pelo produto da segunda imagem
- O produto da segunda imagem deve estar sendo segurado nas mãos da modelo
- O produto deve parecer natural na cena, com tamanho proporcional e iluminação correta
- Mantenha todos os outros elementos iguais: roupa, fundo, equipamentos desfocados
- Ultra-realista, comercial, 1024x1024

IMPORTANTE: Não mude a pessoa! Use a mesma modelo da primeira imagem!`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: editPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: templateImageBase64
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: productImageBase64
                }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        image: generatedImageUrl,
        productName,
        templateId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
