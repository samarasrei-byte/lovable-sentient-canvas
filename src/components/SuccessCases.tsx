import { TrendingUp, Users, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Resultados Comprovados</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Cases de Sucesso
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Marcas reais, resultados extraordinários. Veja como transformamos estratégias em números.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500`} />
                
                <Card className="relative bg-card/70 backdrop-blur-xl border-border/50 group-hover:border-primary/50 rounded-3xl p-8 transition-all h-full">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{item.brand}</h3>
                          <p className="text-sm text-muted-foreground">com {item.influencer}</p>
                        </div>
                        <div className={`text-4xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                          {item.metric}
                        </div>
                      </div>
                      
                      <p className="text-lg font-semibold text-foreground/90 mb-2">{item.description}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};