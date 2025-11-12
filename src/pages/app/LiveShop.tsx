import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Send, 
  Radio,
  Bot,
  User,
  Sparkles,
  Clock,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
}

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  isBot?: boolean;
}

export default function LiveShop() {
  const [isLive, setIsLive] = useState(true);
  const [viewers, setViewers] = useState(1247);
  const [likes, setLikes] = useState(3456);
  const [presenter, setPresenter] = useState<"avatar" | "influencer">("avatar");
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: "Maria S.", message: "Esse produto é incrível! 😍", timestamp: new Date(), isBot: false },
    { id: 2, user: "João P.", message: "Qual o desconto disponível?", timestamp: new Date(), isBot: false },
    { id: 3, user: "IA Moderadora", message: "Olá! Use o código LIVE20 para 20% OFF", timestamp: new Date(), isBot: true },
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const products: Product[] = [
    { id: 1, name: "Tênis Premium Sport", price: 299.90, originalPrice: 499.90, image: "bg-gradient-to-br from-primary/30 to-secondary/30", stock: 12 },
    { id: 2, name: "Jaqueta Urban Style", price: 189.90, originalPrice: 349.90, image: "bg-gradient-to-br from-secondary/30 to-artist/30", stock: 8 },
    { id: 3, name: "Relógio Digital Elite", price: 549.90, originalPrice: 899.90, image: "bg-gradient-to-br from-artist/30 to-primary/30", stock: 5 },
    { id: 4, name: "Óculos de Sol Pro", price: 159.90, originalPrice: 299.90, image: "bg-gradient-to-br from-primary/40 to-secondary/40", stock: 15 },
  ];

  // Simular variação de viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10 - 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simular mensagens do chat
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const randomMessages = [
        { user: "Ana L.", message: "Acabei de comprar! 🛍️", isBot: false },
        { user: "Pedro M.", message: "Quanto tempo dura essa live?", isBot: false },
        { user: "Julia K.", message: "Amei o produto! ❤️", isBot: false },
        { user: "Carlos S.", message: "Tem desconto adicional?", isBot: false },
        { user: "IA Moderadora", message: "Aproveite! Apenas hoje com frete grátis! 🚚", isBot: true },
      ];
      
      const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        user: randomMsg.user, 
        message: randomMsg.message, 
        timestamp: new Date(),
        isBot: randomMsg.isBot 
      }]);
    }, 5000);

    return () => clearInterval(chatInterval);
  }, []);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      user: "Você",
      message: chatMessage,
      timestamp: new Date(),
      isBot: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setChatMessage("");
  };

  const handleBuyNow = (product: Product) => {
    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: `Preço: R$ ${product.price.toFixed(2)}`
    });
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
    toast("❤️ Você curtiu a live!");
  };

  const togglePresenter = () => {
    setPresenter(prev => prev === "avatar" ? "influencer" : "avatar");
    toast.success(
      presenter === "avatar" 
        ? "Trocado para Influencer Real" 
        : "Trocado para Avatar IA"
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isLive && (
                <Badge className="bg-red-500 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  AO VIVO
                </Badge>
              )}
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Live Shop - Black Friday Especial
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-semibold">{viewers.toLocaleString()}</span>
              <span className="text-muted-foreground">espectadores</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-semibold">{likes.toLocaleString()}</span>
              <span className="text-muted-foreground">curtidas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Products Sidebar */}
        <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Produtos em Destaque</h2>
            </div>
            <p className="text-sm text-muted-foreground">Compre agora com desconto exclusivo</p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4 bg-card/60 border-border/50 hover:border-primary/30 transition-all group">
                  <div className={`w-full h-32 rounded-lg mb-3 ${product.image} flex items-center justify-center`}>
                    <Sparkles className="w-12 h-12 text-white/50" />
                  </div>
                  
                  <h3 className="font-semibold mb-2 text-sm">{product.name}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {product.originalPrice && (
                    <Badge variant="outline" className="mb-3 bg-green-500/10 border-green-500/20 text-green-400">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Em estoque: {product.stock}</span>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                  
                  <Button 
                    onClick={() => handleBuyNow(product)}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar Agora
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center: Video Stream */}
        <div className="flex-1 flex flex-col bg-background">
          <div className="relative flex-1 bg-gradient-to-br from-card to-background flex items-center justify-center">
            {/* Simulated Video */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-artist/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className={`w-32 h-32 rounded-full mx-auto bg-gradient-to-br ${
                    presenter === "avatar" 
                      ? 'from-primary to-primary/70' 
                      : 'from-secondary to-secondary/70'
                  } flex items-center justify-center animate-pulse`}>
                    {presenter === "avatar" ? (
                      <Bot className="w-16 h-16 text-white" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {presenter === "avatar" ? "Luna AI" : "Ana Silva"}
                    </h3>
                    <Badge className={presenter === "avatar" ? "bg-primary" : "bg-secondary"}>
                      {presenter === "avatar" ? "Avatar IA" : "Influencer Real"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Apresentando produtos exclusivos com descontos imperdíveis!
                  </p>
                </div>
              </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <Button
                onClick={handleLike}
                variant="outline"
                size="lg"
                className="bg-card/80 backdrop-blur-sm hover:bg-card"
              >
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Curtir
              </Button>
              
              <Button
                onClick={togglePresenter}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {presenter === "avatar" ? (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    Trocar para Influencer
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5 mr-2" />
                    Trocar para Avatar IA
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="w-96 border-l border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <h2 className="font-bold text-lg">Chat ao Vivo</h2>
              <Badge variant="outline" className="ml-auto">
                {messages.length} mensagens
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.isBot ? 'bg-primary/20' : 'bg-secondary/20'
                    }`}>
                      {msg.isBot ? (
                        <Sparkles className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-semibold text-sm ${
                          msg.isBot ? 'text-primary' : 'text-foreground'
                        }`}>
                          {msg.user}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {msg.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1 break-words">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-background/50"
              />
              <Button 
                onClick={handleSendMessage}
                size="icon"
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
