import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Mariana Costa",
    handle: "@marianacosta",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=60",
    content: "Usei o prompt de cyberpunk e a foto ficou SURREAL. Meus seguidores acharam que eu tinha contratado um fotógrafo profissional!",
    followers: "890K",
  },
  {
    name: "Lucas Tech",
    handle: "@lucastech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=60",
    content: "Em 2 minutos eu tinha a foto perfeita pro meu perfil. R$21 é baratíssimo pelo resultado. Recomendo demais!",
    followers: "1.2M",
  },
  {
    name: "Julia Fitness",
    handle: "@juliafitpro",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=60",
    content: "Já usei 3 prompts diferentes e todos ficaram incríveis. A qualidade é impressionante. Melhor investimento que fiz pro meu conteúdo!",
    followers: "2.1M",
  },
  {
    name: "Pedro Creator",
    handle: "@pedrocreator",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&q=60",
    content: "O processo é super fácil. Enviei minha foto, paguei via PIX e em segundos tinha um resultado de outro nível. Viciei!",
    followers: "560K",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-28 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2">
            O que dizem os{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              creators
            </span>
          </h2>
          <p className="text-sm text-muted-foreground/50 font-light">
            Milhares de clientes satisfeitos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/[0.1]"
                  loading="lazy"
                  decoding="async"
                  width={36}
                  height={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-xs text-foreground/80">{t.name}</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/70">
                      {t.followers}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/40">{t.handle}</p>
                </div>
                <Quote className="w-4 h-4 text-white/[0.04] flex-shrink-0" />
              </div>

              <p className="text-foreground/70 text-xs leading-relaxed">
                "{t.content}"
              </p>

              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-primary/50 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
