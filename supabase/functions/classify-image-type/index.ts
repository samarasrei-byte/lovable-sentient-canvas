import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, name, age, date, location, numberOfPeople, hasReferenceImage } = await req.json();

    const category = classifyImageType({
      text: (text || "").toLowerCase(),
      name,
      age: age != null ? Number(age) : null,
      date,
      location,
      numberOfPeople: numberOfPeople || 1,
      hasReferenceImage: !!hasReferenceImage,
    });

    return new Response(
      JSON.stringify({ category }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

interface ClassifyInput {
  text: string;
  name: string | null;
  age: number | null;
  date: string | null;
  location: string | null;
  numberOfPeople: number;
  hasReferenceImage: boolean;
}

function classifyImageType(input: ClassifyInput): string {
  const { text, age, numberOfPeople } = input;

  // Anime keywords
  if (/anime|manga|desenho|otaku|kawaii|naruto|dragon ball|one piece/.test(text)) {
    return "anime";
  }

  // Mesversário (baby ≤ 1 year)
  if (age !== null && age <= 1) return "mesversario";
  if (/mesversário|mesversario|mês de vida|meses de vida/.test(text)) return "mesversario";

  // LinkedIn / Professional
  if (/linkedin|currículo|curriculo|trabalho|profissional|executivo|ceo|headshot|perfil profissional/.test(text)) {
    return "linkedin_profissional";
  }

  // Corporate
  if (/corporativo|empresa|negócio|negocio|apresentação|cartão de visita/.test(text)) {
    return "corporativo";
  }

  // Fashion / Editorial
  if (/moda|fashion|editorial|modelo|vogue|revista|desfile|ensaio de moda/.test(text)) {
    return "modelo_fashion";
  }

  // Event
  if (/evento|casamento|formatura|gala|cerimônia|festa|celebração/.test(text)) {
    return "evento";
  }

  // Birthday (age + name)
  if (age !== null && age > 1 && /aniversário|aniversario|birthday|anos/.test(text)) {
    return "aniversario";
  }
  if (age !== null && age > 1 && input.name) return "aniversario";

  // Children
  if (/infantil|criança|crianca|bebê|bebe|kids|children/.test(text) || (age !== null && age > 1 && age <= 12)) {
    return "infantil";
  }

  // Couple
  if (numberOfPeople === 2 && /casal|namorado|namorada|amor|romântico|romantico|noivo|noiva/.test(text)) {
    return "casal";
  }

  // Family / Group
  if (numberOfPeople >= 3) return "familia";
  if (/família|familia|family|grupo|filhos/.test(text)) return "familia";

  // Couple fallback
  if (numberOfPeople === 2) return "casal";

  // Social media
  if (/instagram|tiktok|rede social|redes sociais|social media|influencer|feed|story|stories/.test(text)) {
    return "redes_sociais";
  }

  return "retrato_pessoal";
}
