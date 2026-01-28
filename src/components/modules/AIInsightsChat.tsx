import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  Target,
  Zap,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SuggestedQuestion {
  icon: React.ReactNode;
  text: string;
  category: string;
}

const suggestedQuestions: SuggestedQuestion[] = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "Qual é a minha taxa de engajamento média?",
    category: "Métricas"
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    text: "Qual preço devo cobrar por um Reels?",
    category: "Precificação"
  },
  {
    icon: <Users className="h-4 w-4" />,
    text: "Como posso aumentar meus seguidores?",
    category: "Crescimento"
  },
  {
    icon: <Target className="h-4 w-4" />,
    text: "Quais nichos são mais lucrativos para mim?",
    category: "Estratégia"
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    text: "Analise minhas métricas dos últimos 30 dias",
    category: "Análise"
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: "Quais marcas combinam com meu perfil?",
    category: "Oportunidades"
  },
];

// Simulated AI responses based on keywords
const generateAIResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("engajamento")) {
    return `📊 **Análise de Engajamento**

Sua taxa de engajamento atual está em **4.2%**, que está acima da média do mercado (2.5-3.5%).

**Destaques:**
- Posts em carrossel: 5.8% de engajamento
- Reels: 4.1% de engajamento  
- Stories interativos: 8.2% de engajamento

**Recomendação:** Invista mais em carrosséis e stories com enquetes/perguntas para maximizar seu engajamento.`;
  }
  
  if (lowerQuestion.includes("preço") || lowerQuestion.includes("cobrar")) {
    return `💰 **Sugestão de Precificação**

Com base no seu perfil e métricas:

| Formato | Preço Sugerido |
|---------|----------------|
| Reels | R$ 2.500 - R$ 4.000 |
| Story único | R$ 800 - R$ 1.200 |
| Pack 3 Stories | R$ 2.000 - R$ 2.800 |
| Feed estático | R$ 1.500 - R$ 2.500 |

**Fatores considerados:**
- Seu nicho (Lifestyle)
- Taxa de engajamento (4.2%)
- Alcance médio (45K)
- Qualidade do conteúdo`;
  }
  
  if (lowerQuestion.includes("seguidores") || lowerQuestion.includes("crescer")) {
    return `🚀 **Estratégias de Crescimento**

Baseado na análise do seu perfil, recomendo:

1. **Conteúdo colaborativo** - Parcerias com creators do mesmo nicho podem aumentar seu alcance em até 30%

2. **Horários de pico** - Seus melhores horários são:
   - 12h - 13h (almoço)
   - 19h - 21h (noite)

3. **Hashtags otimizadas** - Use mix de:
   - 3 hashtags grandes (+1M)
   - 5 hashtags médias (100K-1M)
   - 7 hashtags de nicho (<100K)

4. **Consistência** - Postar 4-5x por semana gera 2x mais crescimento`;
  }
  
  if (lowerQuestion.includes("nicho") || lowerQuestion.includes("lucrativos")) {
    return `🎯 **Nichos Mais Lucrativos Para Seu Perfil**

Baseado na sua audiência e conteúdo:

1. **Beleza & Skincare** - Alto potencial (R$ 5-15K/campanha)
2. **Moda Sustentável** - Crescendo 40% ao ano
3. **Bem-estar & Fitness** - Match com sua audiência: 78%
4. **Tech & Lifestyle** - Brands pagando premium

**Insight:** Seu conteúdo de autocuidado tem 3x mais engajamento. Considere expandir esse pilar.`;
  }
  
  if (lowerQuestion.includes("métricas") || lowerQuestion.includes("últimos")) {
    return `📈 **Relatório dos Últimos 30 Dias**

**Resumo Executivo:**
- Alcance total: 892K (+12% vs mês anterior)
- Impressões: 1.4M
- Novos seguidores: +2.847
- Taxa de crescimento: 1.8%

**Top Conteúdos:**
1. Reels "Rotina da manhã" - 45K views
2. Carrossel "Dicas de produtividade" - 12K saves
3. Story Quiz - 8.2K respostas

**Área de melhoria:** Conteúdo de vídeo longo está abaixo da média. Considere formato mais dinâmico.`;
  }
  
  if (lowerQuestion.includes("marcas") || lowerQuestion.includes("perfil")) {
    return `🏢 **Marcas Compatíveis Com Seu Perfil**

**Alta compatibilidade (90%+):**
- Natura - Beleza consciente
- Farm - Moda brasileira
- Granado - Skincare premium

**Média compatibilidade (70-90%):**
- Reserva - Lifestyle
- Amaro - Fast fashion sustentável
- Simple Organic - Wellness

**Dica:** Empresas de beleza natural estão buscando creators com seu perfil. 3 campanhas abertas agora!`;
  }
  
  return `✨ **Análise Inteligente**

Entendi sua pergunta! Aqui está minha análise:

Baseado nos seus dados e tendências do mercado, posso te ajudar a otimizar sua estratégia. 

**Próximos passos sugeridos:**
1. Analise suas métricas de engajamento
2. Compare com benchmarks do seu nicho
3. Identifique oportunidades de crescimento

Quer que eu detalhe algum desses pontos?`;
};

export const AIInsightsChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Olá! Sou sua IA de insights. Posso analisar suas métricas, sugerir preços, identificar oportunidades e muito mais. Como posso ajudar?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateAIResponse(messageText),
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-40" />
          <div className="relative p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-bold">Insights de IA</h3>
          <p className="text-xs text-muted-foreground">Análise inteligente das suas métricas</p>
        </div>
        <Badge className="ml-auto bg-success/10 text-success border-success">Online</Badge>
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-b border-border/50">
          <p className="text-sm text-muted-foreground mb-3">
            <Lightbulb className="h-4 w-4 inline mr-1" />
            Perguntas sugeridas:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1.5 px-3"
                onClick={() => handleSend(q.text)}
              >
                {q.icon}
                <span className="ml-1.5">{q.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/50 rounded-bl-md"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Arcana AI</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                    {message.content}
                  </div>
                  <p className="text-[10px] opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pergunte sobre suas métricas, preços, estratégias..."
            className="flex-1"
          />
          <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
