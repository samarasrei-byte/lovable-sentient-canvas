import { TrendingUp, Users, Target, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

export const SuccessCases = () => {
  const cases = [
    {
      brand: "TechFlow",
      influencer: "Sara Tech",
      metric: "+340%",
      description: "Aumento em conversões",
      details: "Campanha de lançamento de produto com avatar IA especializado em tech",
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      brand: "FitLife",
      influencer: "Marcus Fit",
      metric: "2.5M",
      description: "Impressões totais",
      details: "Série de lives e conteúdos fitness com influencer real",
      icon: Users,
      gradient: "from-orange-500 to-red-600"
    },
    {
      brand: "Luxe Fashion",
      influencer: "Luna Fashion",
      metric: "+520%",
      description: "ROI da campanha",
      details: "Colaboração de 6 meses com artista digital exclusivo",
      icon: Target,
      gradient: "from-pink-500 to-purple-600"
    },
    {
      brand: "Zen Wellness",
      influencer: "Ana Wellness",
      metric: "95%",
      description: "Taxa de engajamento",
      details: "Conteúdo autêntico sobre bem-estar e mindfulness",
      icon: Award,
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[150px]" />

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
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Resultados Comprovados</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Cases de{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Sucesso
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-light">
            Marcas reais, resultados extraordinários. Veja como transformamos estratégias em números.
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />
                
                <GlassCard className="relative h-full group-hover:border-primary/30 p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{item.brand}</h3>
                          <p className="text-sm text-muted-foreground">com {item.influencer}</p>
                        </div>
                        <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                          {item.metric}
                        </div>
                      </div>
                      
                      <p className="text-base font-semibold text-foreground/90 mb-2">{item.description}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
