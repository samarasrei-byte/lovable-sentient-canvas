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
    const { productName, templateId, productImageBase64, templateImageBase64, customPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    if (!productImageBase64 || !templateImageBase64) {
      throw new Error('Product image and template image are required');
    }

    console.log('Generating image with template:', templateId, 'product:', productName);

    // Generate a new image based on the custom prompt (which already includes all customizations)
    const generationPrompt = customPrompt || `Crie uma fotografia comercial profissional de alta qualidade mostrando uma influencer segurando um produto. A imagem deve ser ultra-realista, estilo comercial/editorial, com iluminação cinematográfica e composição profissional. 1024x1024.`;

    console.log('Using prompt:', generationPrompt.substring(0, 200) + '...');

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
            content: generationPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response structure:', JSON.stringify(data, null, 2));
    
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      console.error('No image URL in response. Full response:', JSON.stringify(data));
      throw new Error('No image generated - check logs for details');
    }
    
    console.log('Successfully generated image');

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
