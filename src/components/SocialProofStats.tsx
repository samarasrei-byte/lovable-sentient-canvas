import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Award, Globe, Shield } from "lucide-react";

const stats = [
  {
    value: "500+",
    label: "Marcas Ativas",
    description: "Empresas usando nossa plataforma",
    icon: Users,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    value: "2M+",
    label: "Campanhas Geradas",
    description: "Imagens e vídeos criados com IA",
    icon: Zap,
    gradient: "from-primary to-secondary"
  },
  {
    value: "98%",
    label: "Satisfação",
    description: "Clientes recomendam a plataforma",
    icon: Award,
    gradient: "from-green-500 to-emerald-600"
  },
  {
    value: "15k+",
    label: "Criadores",
    description: "Influenciadores e artistas verificados",
    icon: Globe,
    gradient: "from-orange-500 to-red-600"
  },
  {
    value: "+340%",
    label: "ROI Médio",
    description: "Retorno sobre investimento",
    icon: TrendingUp,
    gradient: "from-pink-500 to-purple-600"
  },
  {
    value: "24/7",
    label: "Disponibilidade",
    description: "Plataforma sempre online",
    icon: Shield,
    gradient: "from-indigo-500 to-violet-600"
  }
];

export const SocialProofStats = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Floating effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Números que{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              comprovam resultados
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Milhares de marcas já transformaram suas campanhas com a Arcana
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard className="h-full p-5 text-center group hover:border-primary/30">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">{stat.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
