import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";

const testimonials = [
  {
    name: "Mariana Costa",
    handle: "@marianacosta",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "Usei o prompt de cyberpunk e a foto ficou SURREAL. Meus seguidores acharam que eu tinha contratado um fotógrafo profissional! 🔥",
    followers: "890K",
    rating: 5,
  },
  {
    name: "Lucas Tech",
    handle: "@lucastech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "Em 2 minutos eu tinha a foto perfeita pro meu perfil. R$21 é baratíssimo pelo resultado. Recomendo demais!",
    followers: "1.2M",
    rating: 5,
  },
  {
    name: "Julia Fitness",
    handle: "@juliafitpro",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    content: "Já usei 3 prompts diferentes e todos ficaram incríveis. A qualidade é impressionante. Melhor investimento que fiz pro meu conteúdo!",
    followers: "2.1M",
    rating: 5,
  },
  {
    name: "Pedro Creator",
    handle: "@pedrocreator",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    content: "O processo é super fácil. Enviei minha foto, paguei via PIX e em segundos tinha um resultado de outro nível. Viciei!",
    followers: "560K",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-primary/[0.03]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-sm font-medium text-secondary mb-6">
            <Star className="w-4 h-4 fill-current" />
            +10.000 clientes satisfeitos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            O que os creators estão{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              dizendo
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Milhares de criadores já transformaram suas imagens com o ARCANA.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard className="h-full hover:border-primary/30 transition-all duration-300">
                <GlassCardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          {testimonial.followers}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>
                  
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-current" />
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
