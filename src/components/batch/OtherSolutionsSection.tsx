import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Sparkles, Video, Music, Users, ArrowUpRight } from "lucide-react";

const SOLUTIONS = [
  {
    icon: Camera,
    title: "Fotos com IA",
    description: "Ensaios fotográficos profissionais gerados por IA.",
    href: "/#estilos",
  },
  {
    icon: Sparkles,
    title: "AI Studio",
    description: "Imagens de produto em templates premium.",
    href: "/app/ai-studio",
  },
  {
    icon: Video,
    title: "Video Creator",
    description: "Vídeos curtos a partir de uma imagem.",
    href: "/app/video-creator",
  },
  {
    icon: Music,
    title: "MelodiaPod",
    description: "Podcasts musicais personalizados.",
    href: "/melodiapod",
  },
  {
    icon: Users,
    title: "Talentos",
    description: "Marketplace de influenciadores e criadores.",
    href: "/app/talentos",
  },
];

/**
 * Seção secundária da home: as demais funcionalidades do Arcana em cards
 * menores, sem competir visualmente com a Produção em Lote.
 * Visibilidade controlada por configuração administrativa.
 */
export const OtherSolutionsSection = memo(() => {
  return (
    <section className="py-12 border-t border-border/30" id="outras-solucoes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Ecossistema Arcana
            </p>
            <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
              Outras soluções
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SOLUTIONS.map((solution, i) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={solution.href}
                className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 h-full transition-all hover:border-primary/40 hover:bg-card/80"
              >
                <div className="flex items-center justify-between">
                  <solution.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{solution.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                    {solution.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

OtherSolutionsSection.displayName = "OtherSolutionsSection";
