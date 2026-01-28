import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  History, 
  Star, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare,
  DollarSign,
  Calendar,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CampaignMetrics {
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
}

interface BrandFeedback {
  rating: number;
  comment: string;
  wouldWorkAgain: boolean;
  highlights: string[];
}

interface Campaign {
  id: string;
  brandName: string;
  brandLogo?: string;
  campaignName: string;
  contentType: string;
  status: "completed" | "active" | "cancelled";
  startDate: string;
  endDate: string;
  payment: number;
  metrics: CampaignMetrics;
  feedback?: BrandFeedback;
  deliverables: {
    type: string;
    delivered: boolean;
    link?: string;
  }[];
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    brandName: "Natura",
    campaignName: "Lançamento Linha Ekos",
    contentType: "Reels + Stories",
    status: "completed",
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    payment: 4500,
    metrics: {
      reach: 125000,
      impressions: 280000,
      engagement: 5.2,
      clicks: 3400,
      conversions: 156
    },
    feedback: {
      rating: 5,
      comment: "Excelente trabalho! Conteúdo autêntico e dentro do prazo.",
      wouldWorkAgain: true,
      highlights: ["Criatividade", "Pontualidade", "Comunicação"]
    },
    deliverables: [
      { type: "Reels", delivered: true, link: "https://instagram.com/reel/..." },
      { type: "3 Stories", delivered: true },
      { type: "Post Feed", delivered: true, link: "https://instagram.com/p/..." }
    ]
  },
  {
    id: "2",
    brandName: "Farm",
    campaignName: "Coleção Verão 2024",
    contentType: "Carrossel + Stories",
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    payment: 3800,
    metrics: {
      reach: 98000,
      impressions: 210000,
      engagement: 4.8,
      clicks: 2100,
      conversions: 89
    },
    feedback: {
      rating: 4,
      comment: "Ótima parceria! O conteúdo teve boa repercussão.",
      wouldWorkAgain: true,
      highlights: ["Estética", "Engajamento"]
    },
    deliverables: [
      { type: "Carrossel", delivered: true, link: "https://instagram.com/p/..." },
      { type: "5 Stories", delivered: true }
    ]
  },
  {
    id: "3",
    brandName: "Amaro",
    campaignName: "Black Friday 2024",
    contentType: "Reels",
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-03-20",
    payment: 2500,
    metrics: {
      reach: 45000,
      impressions: 95000,
      engagement: 4.1,
      clicks: 890,
      conversions: 34
    },
    deliverables: [
      { type: "Reels", delivered: true, link: "https://instagram.com/reel/..." },
      { type: "Stories (2)", delivered: false }
    ]
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

export const CampaignHistory = () => {
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "active">("all");

  const filteredCampaigns = mockCampaigns.filter(
    c => statusFilter === "all" || c.status === statusFilter
  );

  const totalEarnings = mockCampaigns
    .filter(c => c.status === "completed")
    .reduce((acc, c) => acc + c.payment, 0);

  const avgRating = mockCampaigns
    .filter(c => c.feedback)
    .reduce((acc, c, _, arr) => acc + (c.feedback?.rating || 0) / arr.length, 0);

  const totalReach = mockCampaigns.reduce((acc, c) => acc + c.metrics.reach, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success">Concluída</Badge>;
      case "active":
        return <Badge className="bg-primary/10 text-primary border-primary">Em andamento</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Histórico de Campanhas
          </h2>
          <p className="text-muted-foreground">Resultados, feedbacks e métricas das suas campanhas</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCampaigns.length}</p>
              <p className="text-xs text-muted-foreground">Campanhas totais</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              <p className="text-xs text-muted-foreground">Total ganho</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Avaliação média</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(totalReach)}</p>
              <p className="text-xs text-muted-foreground">Alcance total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="active">Em andamento</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              {/* Main Row */}
              <div 
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedCampaign(
                  expandedCampaign === campaign.id ? null : campaign.id
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Brand Logo */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>

                  {/* Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{campaign.campaignName}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{campaign.brandName}</span>
                      <span>•</span>
                      <span>{campaign.contentType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(campaign.startDate)}
                      </span>
                    </div>
                  </div>

                  {/* Payment & Rating */}
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(campaign.payment)}</p>
                    {campaign.feedback && (
                      <div className="flex items-center gap-1 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < campaign.feedback!.rating
                                ? "text-accent fill-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <Button variant="ghost" size="icon">
                    {expandedCampaign === campaign.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedCampaign === campaign.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="p-6 space-y-6">
                      {/* Metrics Grid */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Métricas de Performance
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Eye className="h-4 w-4" />
                              <span className="text-xs">Alcance</span>
                            </div>
                            <p className="text-xl font-bold">{formatNumber(campaign.metrics.reach)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <BarChart className="h-4 w-4" />
                              <span className="text-xs">Impressões</span>
                            </div>
                            <p className="text-xl font-bold">{formatNumber(campaign.metrics.impressions)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Heart className="h-4 w-4" />
                              <span className="text-xs">Engajamento</span>
                            </div>
                            <p className="text-xl font-bold">{campaign.metrics.engagement}%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <ExternalLink className="h-4 w-4" />
                              <span className="text-xs">Cliques</span>
                            </div>
                            <p className="text-xl font-bold">{formatNumber(campaign.metrics.clicks)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Target className="h-4 w-4" />
                              <span className="text-xs">Conversões</span>
                            </div>
                            <p className="text-xl font-bold">{campaign.metrics.conversions}</p>
                          </div>
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Entregas
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {campaign.deliverables.map((d, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                                d.delivered
                                  ? "border-success/30 bg-success/5"
                                  : "border-warning/30 bg-warning/5"
                              }`}
                            >
                              {d.delivered ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <Clock className="h-4 w-4 text-warning" />
                              )}
                              <span className="text-sm">{d.type}</span>
                              {d.link && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                  <a href={d.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Brand Feedback */}
                      {campaign.feedback && (
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            Feedback da Marca
                          </h4>
                          <Card className="p-4 bg-muted/30">
                            <div className="flex items-start gap-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < campaign.feedback!.rating
                                        ? "text-accent fill-accent"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm mb-3">"{campaign.feedback.comment}"</p>
                                <div className="flex flex-wrap gap-2">
                                  {campaign.feedback.highlights.map((h, i) => (
                                    <Badge key={i} variant="secondary">
                                      <Award className="h-3 w-3 mr-1" />
                                      {h}
                                    </Badge>
                                  ))}
                                </div>
                                {campaign.feedback.wouldWorkAgain && (
                                  <p className="text-xs text-success mt-3 flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    A marca trabalharia novamente com você
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}

        {filteredCampaigns.length === 0 && (
          <Card className="p-12 text-center">
            <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma campanha encontrada</h3>
            <p className="text-muted-foreground">
              Não há campanhas com o filtro selecionado.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Missing import
const BarChart = TrendingUp;
