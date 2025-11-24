import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  TrendingUp,
  Target,
  Zap,
  Star,
  Award,
  Sparkles,
  ArrowUpRight,
  Users,
  Eye,
  Heart,
  DollarSign
} from "lucide-react";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";

export default function IAInsights() {
  const recommendations = [
    {
      id: 1,
      influencer: "Rafael Costa",
      category: "Tecnologia",
      score: 9.8,
      reason: "Crescimento de 240% no engajamento nos últimos 30 dias",
      image: influencerTech,
      metrics: {
        followers: "2.5M",
        engagement: "12.4%",
        avgViews: "850K",
        roi: "4.2x"
      },
      trending: "+240%",
      tags: ["Alto Engajamento", "Crescimento Rápido", "ROI Elevado"]
    },
    {
      id: 2,
      influencer: "Camila Rodrigues",
      category: "Moda",
      score: 9.5,
      reason: "Melhor performance em conversão para marcas de moda",
      image: influencerFashion,
      metrics: {
        followers: "4.8M",
        engagement: "15.2%",
        avgViews: "1.2M",
        roi: "5.8x"
      },
      trending: "+180%",
      tags: ["Top Conversão", "Audiência Qualificada", "Alta Performance"]
    },
    {
      id: 3,
      influencer: "Bruno Almeida",
      category: "Fitness",
      score: 9.2,
      reason: "Maior alcance orgânico na categoria fitness",
      image: influencerFitness,
      metrics: {
        followers: "3.2M",
        engagement: "10.8%",
        avgViews: "920K",
        roi: "3.9x"
      },
      trending: "+150%",
      tags: ["Alcance Orgânico", "Engajamento Alto", "Nicho Premium"]
    }
  ];

  const insights = [
    {
      title: "Melhor Horário para Posts",
      description: "Baseado em 10.000+ posts analisados",
      value: "18h - 21h",
      icon: Target,
      gradient: "from-primary to-primary/70"
    },
    {
      title: "Categoria Mais Rentável",
      description: "Maior ROI médio nas campanhas",
      value: "Moda & Lifestyle",
      icon: TrendingUp,
      gradient: "from-secondary to-secondary/70"
    },
    {
      title: "Taxa de Conversão Média",
      description: "Influenciadores top performers",
      value: "8.4%",
      icon: Zap,
      gradient: "from-artist to-artist/70"
    },
    {
      title: "Custo por Engajamento",
      description: "Média da plataforma",
      value: "R$ 0.42",
      icon: DollarSign,
      gradient: "from-green-500 to-green-600"
    }
  ];

  const trends = [
    {
      title: "Reels estão gerando 3x mais alcance que posts tradicionais",
      type: "high",
      change: "+320%"
    },
    {
      title: "Micro-influenciadores (10K-100K) têm 2x mais engajamento",
      type: "medium",
      change: "+180%"
    },
    {
      title: "Conteúdo autêntico performa 40% melhor que produção profissional",
      type: "medium",
      change: "+40%"
    },
    {
      title: "Colaborações de longo prazo geram 60% mais ROI",
      type: "high",
      change: "+60%"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Powered by AI</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          IA Insights
        </h1>
        <p className="text-muted-foreground">
          Recomendações inteligentes baseadas em performance, tendências e análise de mercado
        </p>
      </div>

      {/* AI Insights Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${insight.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.gradient} inline-flex mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{insight.title}</p>
                <p className="text-2xl font-bold mb-1">{insight.value}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Influenciadores Recomendados para Você</h2>
          <Badge className="bg-gradient-to-r from-primary to-secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            IA Curadoria
          </Badge>
        </div>

        {recommendations.map((rec) => (
          <div key={rec.id} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500" />
            
            <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="flex gap-6">
                {/* Image */}
                <div className="relative">
                  <img 
                    src={rec.image} 
                    alt={rec.influencer}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-primary to-secondary rounded-full p-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{rec.influencer}</h3>
                        <Badge className="bg-gradient-to-r from-primary to-secondary">
                          Score: {rec.score}
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          {rec.trending}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{rec.category}</p>
                      <p className="text-sm flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        {rec.reason}
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      Contratar
                    </Button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rec.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-6 pt-4 border-t border-border/30">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Seguidores</span>
                      </div>
                      <p className="text-lg font-bold">{rec.metrics.followers}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">Engajamento</span>
                      </div>
                      <p className="text-lg font-bold text-primary">{rec.metrics.engagement}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">Média Views</span>
                      </div>
                      <p className="text-lg font-bold">{rec.metrics.avgViews}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">ROI Médio</span>
                      </div>
                      <p className="text-lg font-bold text-green-500">{rec.metrics.roi}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Trends */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-primary" />
          Tendências de Mercado
        </h2>
        <div className="space-y-4">
          {trends.map((trend, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary/30 transition-all">
              <div className={`p-2 rounded-lg ${
                trend.type === 'high' ? 'bg-green-500/10' : 'bg-blue-500/10'
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  trend.type === 'high' ? 'text-green-500' : 'text-blue-500'
                }`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">{trend.title}</p>
                <Badge variant="outline" className={
                  trend.type === 'high' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                }>
                  {trend.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
