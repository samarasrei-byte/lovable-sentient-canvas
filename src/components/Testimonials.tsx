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
      content: "A Arcana transformou nossa estratégia de influência. Resultados 3x melhores com metade do orçamento usando avatares IA.",
      rating: 5,
    },
    {
      name: "Rafael Costa",
      role: "Founder FitLife",
      avatar: "RC",
      content: "O nível de controle e personalização é incrível. A IA de recomendação é sensacional.",
      rating: 5,
    },
    {
      name: "Marina Silva",
      role: "Diretora de Marketing",
      avatar: "MS",
      content: "Finalmente uma plataforma que une tecnologia e criatividade. ROI superou todas as expectativas.",
      rating: 5,
    },
    {
      name: "Pedro Almeida",
      role: "CEO Zen Wellness",
      avatar: "PA",
      content: "A Arcana não é só uma ferramenta, é um parceiro estratégico. Suporte excepcional.",
      rating: 5,
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/[0.02] to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-primary fill-primary" />
            ))}
            <span className="text-sm text-muted-foreground ml-2">5.0 de 500+ avaliações</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            O que nossos clientes dizem
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <GlassCard className="h-full p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed mb-5 text-foreground/80">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 border border-white/[0.08]">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
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
