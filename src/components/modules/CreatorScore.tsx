import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Shield,
  Zap,
  Star,
  Info,
  ChevronRight,
  Crown,
  Target,
  Clock,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  description: string;
  tips: string[];
}

const scoreCategories: ScoreCategory[] = [
  {
    name: "Engajamento",
    score: 28,
    maxScore: 30,
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Interação média com seu conteúdo",
    tips: [
      "Responda mais comentários nos primeiros 30 minutos",
      "Use enquetes nos stories",
      "Faça perguntas nas legendas"
    ]
  },
  {
    name: "Consistência",
    score: 18,
    maxScore: 20,
    icon: <Clock className="h-5 w-5" />,
    description: "Frequência e regularidade de posts",
    tips: [
      "Mantenha um calendário editorial",
      "Poste nos mesmos horários",
      "Não fique mais de 3 dias sem postar"
    ]
  },
  {
    name: "Qualidade",
    score: 22,
    maxScore: 25,
    icon: <Star className="h-5 w-5" />,
    description: "Qualidade visual e de conteúdo",
    tips: [
      "Invista em boa iluminação",
      "Melhore a qualidade das thumbnails",
      "Conte histórias, não apenas mostre produtos"
    ]
  },
  {
    name: "Profissionalismo",
    score: 14,
    maxScore: 15,
    icon: <Shield className="h-5 w-5" />,
    description: "Entregas, prazos e comunicação",
    tips: [
      "Responda marcas em até 24h",
      "Mantenha um media kit atualizado",
      "Cumpra todos os prazos acordados"
    ]
  },
  {
    name: "Crescimento",
    score: 6,
    maxScore: 10,
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Taxa de crescimento mensal",
    tips: [
      "Colabore com outros creators",
      "Use trends de forma autêntica",
      "Diversifique formatos de conteúdo"
    ]
  }
];

const getBadgeInfo = (score: number) => {
  if (score >= 90) return { name: "Diamante", color: "from-cyan-400 to-blue-500", icon: <Crown className="h-5 w-5" /> };
  if (score >= 80) return { name: "Ouro", color: "from-yellow-400 to-amber-500", icon: <Award className="h-5 w-5" /> };
  if (score >= 70) return { name: "Prata", color: "from-gray-300 to-gray-400", icon: <Award className="h-5 w-5" /> };
  if (score >= 50) return { name: "Bronze", color: "from-orange-400 to-orange-600", icon: <Award className="h-5 w-5" /> };
  return { name: "Iniciante", color: "from-slate-400 to-slate-500", icon: <Target className="h-5 w-5" /> };
};

const getScoreColor = (percentage: number) => {
  if (percentage >= 90) return "text-cyan-400";
  if (percentage >= 80) return "text-yellow-400";
  if (percentage >= 70) return "text-gray-300";
  if (percentage >= 50) return "text-orange-400";
  return "text-slate-400";
};

export const CreatorScore = () => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ScoreCategory | null>(null);
  
  const totalScore = scoreCategories.reduce((acc, cat) => acc + cat.score, 0);
  const maxTotalScore = scoreCategories.reduce((acc, cat) => acc + cat.maxScore, 0);
  const finalScore = Math.round((totalScore / maxTotalScore) * 100);
  const badge = getBadgeInfo(finalScore);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setAnimatedScore(current);
        if (current >= finalScore) {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [finalScore]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Creator Score
            </h2>
            <p className="text-muted-foreground">Sua pontuação como creator profissional</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-1" />
                Como funciona?
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>
                O Creator Score é calculado com base em 5 métricas principais: 
                engajamento, consistência, qualidade, profissionalismo e crescimento. 
                Quanto maior seu score, maior sua visibilidade para marcas.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Main Score Card */}
        <Card className="p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            {/* Score Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                {/* Outer ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${(animatedScore / 100) * 283} 283` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Inner content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    className={`text-5xl font-bold ${getScoreColor(animatedScore)}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {animatedScore}
                  </motion.span>
                  <span className="text-muted-foreground">/100</span>
                </div>
              </div>

              {/* Badge */}
              <motion.div
                className="mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold`}>
                  {badge.icon}
                  <span>Nível {badge.name}</span>
                </div>
              </motion.div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Composição do Score</h3>
              
              {scoreCategories.map((category, index) => {
                const percentage = (category.score / category.maxScore) * 100;
                
                return (
                  <motion.div
                    key={category.name}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                      selectedCategory?.name === category.name 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50"
                    }`}
                    onClick={() => setSelectedCategory(
                      selectedCategory?.name === category.name ? null : category
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-primary/10 text-primary">
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {category.score}/{category.maxScore}
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${
                          selectedCategory?.name === category.name ? "rotate-90" : ""
                        }`} />
                      </div>
                    </div>
                    
                    <Progress value={percentage} className="h-2" />
                    
                    {/* Expanded Tips */}
                    {selectedCategory?.name === category.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 pt-3 border-t space-y-2"
                      >
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <p className="text-xs font-medium text-primary">Dicas para melhorar:</p>
                        <ul className="space-y-1">
                          {category.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <Zap className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Benefits by Level */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { level: "Bronze", min: 50, benefits: ["Visível no marketplace", "Acesso básico a campanhas"] },
            { level: "Prata", min: 70, benefits: ["Prioridade em matches", "Badge verificado"] },
            { level: "Ouro", min: 80, benefits: ["Campanhas exclusivas", "Suporte prioritário"] },
            { level: "Diamante", min: 90, benefits: ["Embaixador da plataforma", "Negociação direta com marcas premium"] },
          ].map((tier) => (
            <Card 
              key={tier.level}
              className={`p-4 ${finalScore >= tier.min ? "border-primary/50 bg-primary/5" : ""}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={finalScore >= tier.min ? "default" : "outline"}>
                  {tier.level}
                </Badge>
                <span className="text-xs text-muted-foreground">≥ {tier.min} pts</span>
              </div>
              <ul className="space-y-1">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="text-xs flex items-center gap-2">
                    {finalScore >= tier.min ? (
                      <Star className="h-3 w-3 text-primary" />
                    ) : (
                      <Star className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className={finalScore >= tier.min ? "" : "text-muted-foreground"}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
