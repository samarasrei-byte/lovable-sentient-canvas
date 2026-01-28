import { Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      
      {/* Floating orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[180px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Avaliação 5.0/5.0</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            O Que Dizem{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Nossos Clientes
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-light">
            Histórias reais de marcas que revolucionaram suas estratégias de influência digital.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition duration-500`} />
              
              <GlassCard className="relative h-full group-hover:border-primary/30 p-6 md:p-8">
                <Quote className="w-10 h-10 text-primary/20 mb-5" />
                
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>

                <p className="text-base leading-relaxed mb-6 text-foreground/90">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-white/10">
                    <AvatarImage src="" />
                    <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-white text-sm font-bold`}>
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
