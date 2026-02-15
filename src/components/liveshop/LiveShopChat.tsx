import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Send, Sparkles, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  is_bot: boolean;
  created_at: string;
}

interface Props {
  sessionId: string;
  className?: string;
}

export function LiveShopChat({ sessionId, className = "" }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("live_chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (data) setMessages(data);
      setLoading(false);
    };
    loadMessages();
  }, [sessionId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`live-chat-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Allow anonymous messages with local state only
      const tempMsg: ChatMessage = {
        id: crypto.randomUUID(),
        user_name: "Você",
        message: chatMessage,
        is_bot: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      setChatMessage("");
      return;
    }

    const { error } = await supabase.from("live_chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || "Usuário",
      message: chatMessage,
    });

    if (!error) setChatMessage("");
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="p-3 md:p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
          <h2 className="font-bold text-sm md:text-lg">Chat ao Vivo</h2>
          <Badge variant="outline" className="ml-auto text-xs">
            {messages.length} msgs
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 md:p-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-2">
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.is_bot ? "bg-primary/20" : "bg-secondary/20"
                }`}>
                  {msg.is_bot ? (
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  ) : (
                    <User className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-semibold text-xs md:text-sm ${
                      msg.is_bot ? "text-primary" : "text-foreground"
                    }`}>
                      {msg.user_name}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 inline mr-0.5" />
                      {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm mt-0.5 break-words">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 md:p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-background/50 text-sm"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-gradient-to-r from-primary to-secondary flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
