import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, templateId, productImageBase64, logoImageBase64, templateStyle, customPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating professional product image with AI');
    console.log('Template:', templateId, 'Product:', productName);

    // Build the prompt based on template style
    const stylePrompts: Record<string, string> = {
      'dominos': 'cenário de entrega premium, ambiente acolhedor de pizzaria, iluminação quente',
      'cocacola': 'cenário lifestyle refrescante, gotas de água, gelo, ambiente descontraído',
      'sunshine': 'cenário natural e fresco, frutas, vegetação, luz natural suave',
      'nike': 'cenário esportivo premium, dinâmico, iluminação dramática',
      'fashion': 'cenário de alta moda, estúdio luxuoso, iluminação editorial',
      'mcdonalds': 'cenário fast food vibrante, cores alegres, ambiente familiar',
      'pepsi': 'cenário bold e moderno, luzes neon, ambiente jovem e urbano',
      'megamare': 'cenário de perfumaria luxuosa, elegante, iluminação suave e sofisticada',
    };

    const styleContext = stylePrompts[templateId] || 'cenário profissional de estúdio fotográfico';

    // Build messages array with images if provided
    const messages: any[] = [];
    const contentParts: any[] = [];

    // Main prompt for image generation
    const basePrompt = customPrompt || `FOTOGRAFIA COMERCIAL ULTRA PROFISSIONAL para ${productName}:

CENÁRIO: ${styleContext}

COMPOSIÇÃO OBRIGATÓRIA:
- Influencer digital/modelo SEGURANDO O PRODUTO nas mãos de forma natural e destacada
- O produto "${productName}" deve estar claramente visível, na altura do peito ou cintura
- Rótulo/frente do produto voltado para a câmera com foco nítido
- Produto ocupa 20-25% do enquadramento, bem integrado à cena

ESTILO VISUAL:
- Iluminação comercial profissional com spotlight no produto
- Fundo complementar ao estilo ${templateStyle || templateId}
- Qualidade editorial, ultra-realista
- Cores vibrantes e contraste profissional
- Composição harmoniosa entre modelo e produto

DETALHES TÉCNICOS:
- Resolução alta, nitidez profissional
- Proporção 1:1 (quadrada)
- Estilo de marca premium

Crie uma foto publicitária impactante que destaque o produto de forma natural e atraente.`;

    contentParts.push({
      type: "text",
      text: basePrompt
    });

    // Add product image if provided
    if (productImageBase64) {
      console.log('Adding product image to generation context');
      contentParts.push({
        type: "image_url",
        image_url: {
          url: productImageBase64.startsWith('data:') ? productImageBase64 : `data:image/png;base64,${productImageBase64}`
        }
      });
    }

    // Add logo image if provided
    if (logoImageBase64) {
      console.log('Adding logo image to generation context');
      contentParts.push({
        type: "image_url",
        image_url: {
          url: logoImageBase64.startsWith('data:') ? logoImageBase64 : `data:image/png;base64,${logoImageBase64}`
        }
      });
    }

    messages.push({
      role: 'user',
      content: contentParts
    });

    console.log('Calling Lovable AI Gateway with Nano Banana model...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: messages,
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 402) {
        throw new Error('Créditos insuficientes. Por favor, adicione créditos à sua conta Lovable.');
      } else if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Aguarde um momento e tente novamente.');
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI Response received successfully');
    
    // Extract the generated image URL from the response
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!generatedImageUrl) {
      console.error('No image in response:', JSON.stringify(data, null, 2));
      throw new Error('Falha ao gerar imagem - tente novamente');
    }
    
    console.log('Successfully generated professional product image');

    return new Response(
      JSON.stringify({ 
        image: generatedImageUrl,
        message: assistantMessage,
        productName,
        templateId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar imagem' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
