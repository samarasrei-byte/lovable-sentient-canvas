import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Carolina Mendes",
      role: "CMO da TechFlow",
      avatar: "CM",
      content: "A Arcana transformou completamente nossa estratégia de influência. Conseguimos resultados 3x melhores com metade do orçamento usando avatares IA personalizados.",
      rating: 5,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      name: "Rafael Costa",
      role: "Founder FitLife",
      avatar: "RC",
      content: "O nível de controle e personalização é incrível. Podemos testar diferentes abordagens e medir resultados em tempo real. A IA de recomendação é sensacional.",
      rating: 5,
      gradient: "from-orange-500 to-red-600"
    },
    {
      name: "Marina Silva",
      role: "Diretora de Marketing Luxe Fashion",
      avatar: "MS",
      content: "Finalmente uma plataforma que une tecnologia e criatividade. Os avatares são indistinguíveis de influencers reais e o ROI superou todas as expectativas.",
      rating: 5,
      gradient: "from-pink-500 to-purple-600"
    },
    {
      name: "Pedro Almeida",
      role: "CEO Zen Wellness",
      avatar: "PA",
      content: "A Arcana não é só uma ferramenta, é um parceiro estratégico. O suporte é excepcional e as funcionalidades de monitoramento são imprescindíveis.",
      rating: 5,
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-sm font-bold text-primary">Avaliação 5.0/5.0</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Histórias reais de marcas que revolucionaram suas estratégias de influência digital.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />
              
              <Card className="relative bg-card/70 backdrop-blur-xl border-border/50 group-hover:border-primary/50 rounded-3xl p-8 transition-all h-full">
                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>

                <p className="text-lg leading-relaxed mb-8 text-foreground/90">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src="" />
                    <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-white text-lg font-bold`}>
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};