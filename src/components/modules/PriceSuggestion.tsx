import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  Video,
  Image,
  MessageSquare,
  Camera,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  suggestedMin: number;
  suggestedMax: number;
  marketAverage: number;
  yourPosition: "above" | "below" | "average";
  demand: "high" | "medium" | "low";
}

interface ComparisonData {
  metric: string;
  you: number;
  average: number;
  top10: number;
}

const contentTypes: ContentType[] = [
  {
    id: "reels",
    name: "Reels",
    icon: <Video className="h-5 w-5" />,
    suggestedMin: 2500,
    suggestedMax: 4000,
    marketAverage: 2800,
    yourPosition: "above",
    demand: "high"
  },
  {
    id: "story",
    name: "Story Único",
    icon: <Camera className="h-5 w-5" />,
    suggestedMin: 800,
    suggestedMax: 1200,
    marketAverage: 900,
    yourPosition: "average",
    demand: "high"
  },
  {
    id: "story-pack",
    name: "Pack 3 Stories",
    icon: <MessageSquare className="h-5 w-5" />,
    suggestedMin: 2000,
    suggestedMax: 2800,
    marketAverage: 2200,
    yourPosition: "above",
    demand: "medium"
  },
  {
    id: "feed",
    name: "Post Feed",
    icon: <Image className="h-5 w-5" />,
    suggestedMin: 1500,
    suggestedMax: 2500,
    marketAverage: 1800,
    yourPosition: "average",
    demand: "medium"
  },
  {
    id: "carousel",
    name: "Carrossel",
    icon: <Image className="h-5 w-5" />,
    suggestedMin: 2000,
    suggestedMax: 3500,
    marketAverage: 2500,
    yourPosition: "above",
    demand: "high"
  },
  {
    id: "live",
    name: "Live (1h)",
    icon: <Zap className="h-5 w-5" />,
    suggestedMin: 3000,
    suggestedMax: 5000,
    marketAverage: 3500,
    yourPosition: "below",
    demand: "low"
  }
];

const comparisonData: ComparisonData[] = [
  { metric: "Seguidores", you: 125000, average: 80000, top10: 500000 },
  { metric: "Engajamento", you: 4.2, average: 2.8, top10: 6.5 },
  { metric: "Alcance Médio", you: 45000, average: 25000, top10: 150000 },
  { metric: "Views/Reels", you: 35000, average: 20000, top10: 100000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

export const PriceSuggestion = () => {
  const [selectedContent, setSelectedContent] = useState<ContentType>(contentTypes[0]);

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "above":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "below":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDemandBadge = (demand: string) => {
    switch (demand) {
      case "high":
        return <Badge className="bg-success/10 text-success border-success">Alta demanda</Badge>;
      case "medium":
        return <Badge className="bg-warning/10 text-warning border-warning">Média demanda</Badge>;
      default:
        return <Badge variant="outline">Baixa demanda</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Sugestão de Preço
            </h2>
            <p className="text-muted-foreground">Precificação inteligente baseada no seu perfil</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </Badge>
        </div>

        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pricing">Tabela de Preços</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-6">
            {/* Content Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {contentTypes.map((content) => (
                <Card
                  key={content.id}
                  className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedContent.id === content.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedContent(content)}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      selectedContent.id === content.id
                        ? "bg-primary/10 text-primary"
                        : "bg-muted"
                    }`}>
                      {content.icon}
                    </div>
                    <span className="text-sm font-medium">{content.name}</span>
                    {getDemandBadge(content.demand)}
                  </div>
                </Card>
              ))}
            </div>

            {/* Price Suggestion Card */}
            <motion.div
              key={selectedContent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {selectedContent.icon}
                      <h3 className="text-xl font-bold">{selectedContent.name}</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Preço calculado com base em: seguidores, engajamento, 
                            nicho, qualidade do conteúdo e média do mercado.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Faixa sugerida para você:</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">
                            {formatCurrency(selectedContent.suggestedMin)}
                          </span>
                          <span className="text-muted-foreground">até</span>
                          <span className="text-4xl font-bold text-primary">
                            {formatCurrency(selectedContent.suggestedMax)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Média do mercado:</span>
                          <span className="font-medium">{formatCurrency(selectedContent.marketAverage)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sua posição:</span>
                          <div className="flex items-center gap-1">
                            {getPositionIcon(selectedContent.yourPosition)}
                            <span className="font-medium capitalize">
                              {selectedContent.yourPosition === "above" 
                                ? "Acima da média" 
                                : selectedContent.yourPosition === "below" 
                                ? "Abaixo da média" 
                                : "Na média"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Factors */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Fatores considerados:</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Seguidores</span>
                          <span className="text-primary font-medium">125K</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Taxa de engajamento</span>
                          <span className="text-primary font-medium">4.2%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Qualidade do conteúdo</span>
                          <span className="text-primary font-medium">Alta</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Demanda do nicho</span>
                          <span className="text-primary font-medium">Alta</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* All Prices Table */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Tabela Completa de Preços</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Formato</th>
                      <th className="text-left py-3 px-4">Mínimo</th>
                      <th className="text-left py-3 px-4">Máximo</th>
                      <th className="text-left py-3 px-4">Média Mercado</th>
                      <th className="text-left py-3 px-4">Demanda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentTypes.map((content) => (
                      <tr key={content.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {content.icon}
                            {content.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(content.suggestedMin)}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(content.suggestedMax)}</td>
                        <td className="py-3 px-4 text-muted-foreground">{formatCurrency(content.marketAverage)}</td>
                        <td className="py-3 px-4">{getDemandBadge(content.demand)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Comparativo com Creators Similares</h3>
                <Badge variant="outline">Dados anonimizados</Badge>
              </div>

              <div className="space-y-6">
                {comparisonData.map((data, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{data.metric}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Média: <span className="text-foreground">{data.metric === "Engajamento" ? `${data.average}%` : formatNumber(data.average)}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Top 10%: <span className="text-primary font-medium">{data.metric === "Engajamento" ? `${data.top10}%` : formatNumber(data.top10)}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                      {/* Average marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
                        style={{ left: `${(data.average / data.top10) * 100}%` }}
                      />
                      
                      {/* Your value */}
                      <motion.div
                        className="absolute top-1 bottom-1 left-1 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-end px-3"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((data.you / data.top10) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      >
                        <span className="text-xs font-bold text-white whitespace-nowrap">
                          {data.metric === "Engajamento" ? `${data.you}%` : formatNumber(data.you)}
                        </span>
                      </motion.div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span>Top 10% ({data.metric === "Engajamento" ? `${data.top10}%` : formatNumber(data.top10)})</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Seu posicionamento</p>
                    <p className="text-sm text-muted-foreground">
                      Você está no <span className="text-primary font-medium">Top 25%</span> dos creators do seu nicho. 
                      Sua taxa de engajamento está 50% acima da média, o que justifica preços premium.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};
