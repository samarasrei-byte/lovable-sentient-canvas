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

    // Build the prompt based on template style - IMPORTANT: No brand logos, only user's product/logo
    const stylePrompts: Record<string, string> = {
      'dominos': 'cenário de pizzaria artesanal, ambiente acolhedor com iluminação quente, mesa de madeira rústica, sem nenhum logo de marca',
      'cocacola': 'cenário refrescante de verão, gotas de água, gelo, ambiente descontraído ao ar livre, sem nenhum logo de marca',
      'sunshine': 'cenário natural e fresco, frutas tropicais, vegetação verde, luz natural suave, sem nenhum logo de marca',
      'nike': 'cenário esportivo moderno, academia premium, iluminação dramática, sem nenhum logo de marca',
      'fashion': 'cenário de estúdio de moda luxuoso, fundo neutro elegante, iluminação editorial profissional, sem nenhum logo de marca',
      'mcdonalds': 'cenário de lanchonete americana vintage, cores alegres, ambiente familiar aconchegante, sem nenhum logo de marca',
      'pepsi': 'cenário urbano moderno, luzes neon azuis, ambiente jovem e energético, sem nenhum logo de marca',
      'megamare': 'cenário de perfumaria luxuosa, mármore, cristais, iluminação suave e sofisticada, sem nenhum logo de marca',
    };

    const styleContext = stylePrompts[templateId] || 'cenário profissional de estúdio fotográfico premium';

    // Build messages array with images if provided
    const messages: any[] = [];
    const contentParts: any[] = [];

    // Main prompt - CRITICAL: Emphasize using ONLY user's product/logo, NO external brand elements
    const basePrompt = customPrompt || `FOTOGRAFIA COMERCIAL ULTRA PROFISSIONAL para "${productName}":

REGRAS CRÍTICAS E OBRIGATÓRIAS:
- NÃO INCLUIR NENHUM LOGO DE MARCAS FAMOSAS (sem Domino's, Coca-Cola, Nike, McDonald's, Pepsi, etc.)
- USAR EXCLUSIVAMENTE o produto/logo fornecido pelo usuário nas imagens anexadas
- O produto "${productName}" deve ser o ÚNICO produto visível na imagem
- Qualquer texto ou logo na imagem deve ser APENAS do produto "${productName}"

CENÁRIO E AMBIENTE:
${styleContext}

COMPOSIÇÃO DA IMAGEM:
- Modelo/influencer digital segurando o produto "${productName}" de forma natural e destacada
- Produto posicionado na altura do peito, claramente visível e em foco
- O rótulo/logo do produto "${productName}" deve estar voltado para a câmera
- Produto ocupa 25-30% do enquadramento

ESTILO VISUAL:
- Iluminação comercial profissional com destaque no produto
- Qualidade editorial ultra-realista 4K
- Cores vibrantes e contraste profissional
- Composição harmoniosa entre modelo e produto

IMPORTANTE: Se uma imagem de logo foi fornecida, incorpore esse logo de forma visível no produto ou no cenário. NÃO use nenhum outro logo ou marca.

Crie uma foto publicitária premium que destaque APENAS o produto "${productName}".`;

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
