import { Star, Quote } from "lucide-react";

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
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-muted-foreground mb-6">
            <Star className="w-3.5 h-3.5 text-primary fill-current" />
            +10.000 clientes satisfeitos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            O que dizem os{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              creators
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/[0.1]"
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{t.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/80">
                      {t.followers}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/60">{t.handle}</p>
                </div>
                <Quote className="w-5 h-5 text-white/[0.06] flex-shrink-0" />
              </div>

              <p className="text-foreground/80 text-sm leading-relaxed">
                "{t.content}"
              </p>

              <div className="flex gap-0.5 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-primary/60 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
