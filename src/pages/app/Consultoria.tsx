import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, TrendingUp, Users, DollarSign, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export default function Consultoria() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Olá! Sou seu consultor de IA para campanhas de marketing de influência. Posso ajudá-lo a:\n\n• 📝 Gerar roteiros de campanha personalizados\n• 🎯 Sugerir criadores ideais (Avatares IA, Influencers, Artistas)\n• 💰 Calcular orçamentos estimados\n• 🤖 Criar avatares IA diretamente no chat\n\nComo posso ajudá-lo hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: "Gerar Roteiro", icon: TrendingUp, prompt: "Crie um roteiro de campanha para lançamento de produto de tecnologia, público jovem 18-35 anos" },
    { label: "Sugerir Criadores", icon: Users, prompt: "Sugira os melhores tipos de criadores para uma campanha de moda sustentável com orçamento médio" },
    { label: "Calcular Orçamento", icon: DollarSign, prompt: "Calcule o orçamento estimado para uma campanha de 3 meses com 5 influencers de médio porte" },
    { label: "Gerar Avatar IA", icon: Wand2, prompt: "Crie um avatar IA de influencer de inteligência artificial: mulher, 30 anos, estilo tech futurista, confiante e inovadora" },
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Detectar se é pedido de geração de avatar
      const isAvatarRequest = input.toLowerCase().includes("avatar") || 
                             input.toLowerCase().includes("gerar avatar") ||
                             input.toLowerCase().includes("criar avatar");

      const { data, error } = await supabase.functions.invoke("consultoria-ai", {
        body: { 
          messages: [...messages, userMessage].map(m => ({ 
            role: m.role, 
            content: m.content 
          })),
          type: isAvatarRequest ? 'generate-avatar' : 'chat'
        }
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Muitas requisições. Aguarde um momento.");
        } else if (error.message?.includes("402")) {
          toast.error("Créditos insuficientes. Adicione créditos nas configurações.");
        } else {
          toast.error("Erro ao processar resposta");
        }
        console.error("Error:", error);
        setIsLoading(false);
        return;
      }

      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.message,
        image: data.image
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.image) {
        toast.success("Avatar gerado com sucesso!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao processar resposta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Consultoria IA</h1>
            <p className="text-sm text-muted-foreground">Estratégias personalizadas para suas campanhas</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border/50 bg-card/20">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.prompt)}
                className="flex-shrink-0 gap-2"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.image && (
                <div className="mt-4 rounded-lg overflow-hidden border border-border/50">
                  <img src={message.image} alt="Avatar gerado" className="w-full" />
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm p-6">
        <div className="flex gap-3">
          <Textarea
            placeholder="Digite sua pergunta ou pedido..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px] bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}