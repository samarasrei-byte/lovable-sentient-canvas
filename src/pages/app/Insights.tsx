import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  DollarSign, 
  Award, 
  History,
  Bot,
  TrendingUp,
  Zap
} from "lucide-react";
import { AIInsightsChat } from "@/components/modules/AIInsightsChat";
import { PriceSuggestion } from "@/components/modules/PriceSuggestion";
import { CreatorScore } from "@/components/modules/CreatorScore";
import { CampaignHistory } from "@/components/modules/CampaignHistory";

const InsightsPage = () => {
  const [activeTab, setActiveTab] = useState("ai-chat");

  const tabs = [
    {
      id: "ai-chat",
      label: "IA Insights",
      icon: <Sparkles className="h-4 w-4" />,
      badge: "Novo",
      description: "Chat com IA para análise de métricas"
    },
    {
      id: "pricing",
      label: "Sugestão de Preço",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Precificação inteligente por tipo de conteúdo"
    },
    {
      id: "score",
      label: "Creator Score",
      icon: <Award className="h-4 w-4" />,
      description: "Sua pontuação como creator profissional"
    },
    {
      id: "history",
      label: "Histórico",
      icon: <History className="h-4 w-4" />,
      description: "Resultados e feedbacks de campanhas"
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Central de Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Ferramentas inteligentes para maximizar seus resultados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Bot className="h-3 w-3" />
            Powered by AI
          </Badge>
          <Badge className="bg-success/10 text-success border-success gap-1">
            <TrendingUp className="h-3 w-3" />
            Premium
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 h-auto p-1 gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat" className="mt-6">
          <Card className="h-[600px] overflow-hidden">
            <AIInsightsChat />
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="mt-6">
          <PriceSuggestion />
        </TabsContent>

        {/* Score Tab */}
        <TabsContent value="score" className="mt-6">
          <CreatorScore />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <CampaignHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsPage;
