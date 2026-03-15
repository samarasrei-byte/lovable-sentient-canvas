import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Send,
  Shield,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_own: boolean;
}

interface Contract {
  id: string;
  influencer_name: string;
  brand_name: string;
  status: string;
  amount: number;
}

interface TypingUser {
  user_id: string;
  name: string;
  is_typing: boolean;
}

export default function Chat() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const presenceChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    loadUserAndContracts();
  }, []);

  // Setup presence channel for typing indicator
  useEffect(() => {
    if (selectedContract && userId) {
      // Clean up previous channel
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
      }

      const channelName = `typing:${selectedContract}`;
      const presenceChannel = supabase.channel(channelName, {
        config: {
          presence: {
            key: userId,
          },
        },
      });

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          // Check if any other user is typing
          let typingUserName: string | null = null;
          
          Object.entries(state).forEach(([key, value]) => {
            if (key !== userId && Array.isArray(value) && value.length > 0) {
              const presence = value[0] as any;
              if (presence.is_typing) {
                typingUserName = presence.name || 'Alguém';
              }
            }
          });
          
          setOtherUserTyping(typingUserName);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
          console.log('User left:', key);
          if (key !== userId) {
            setOtherUserTyping(null);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({
              user_id: userId,
              name: userName,
              is_typing: false,
              online_at: new Date().toISOString(),
            });
          }
        });

      presenceChannelRef.current = presenceChannel;

      // Also set up message subscription
      const messageChannel = supabase
        .channel(`messages:${selectedContract}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `contract_id=eq.${selectedContract}`
          },
          () => {
            loadMessages(selectedContract);
          }
        )
        .subscribe();

      loadMessages(selectedContract);

      return () => {
        supabase.removeChannel(messageChannel);
        if (presenceChannelRef.current) {
          supabase.removeChannel(presenceChannelRef.current);
          presenceChannelRef.current = null;
        }
      };
    }
  }, [selectedContract, userId, userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update typing status
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (presenceChannelRef.current) {
      await presenceChannelRef.current.track({
        user_id: userId,
        name: userName,
        is_typing: isTyping,
        online_at: new Date().toISOString(),
      });
    }
  }, [userId, userName]);

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Update typing status
    updateTypingStatus(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000);
  };

  const loadUserAndContracts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Get user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      
      setUserName(profile?.full_name || "Usuário");

      // Check user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      setUserRole(roleData?.role || "brand");

      // Load contracts based on role
      if (roleData?.role === "influencer") {
        const { data: influencer } = await supabase
          .from("influencers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (influencer) {
          const { data: contractsData } = await supabase
            .from("contracts")
            .select(`
              id,
              amount,
              status,
              brand_id
            `)
            .eq("influencer_id", influencer.id)
            .eq("status", "active");

          if (contractsData) {
            // Fetch brand names separately
            const contractsWithNames = await Promise.all(
              contractsData.map(async (c) => {
                const { data: brandProfile } = await supabase
                  .from("profiles")
                  .select("full_name")
                  .eq("id", c.brand_id)
                  .maybeSingle();
                
                return {
                  id: c.id,
                  influencer_name: "",
                  brand_name: brandProfile?.full_name || "Marca",
                  status: c.status,
                  amount: c.amount
                };
              })
            );
            setContracts(contractsWithNames);
          }
        }
      } else {
        const { data: contractsData } = await supabase
          .from("contracts")
          .select(`
            id,
            amount,
            status,
            influencer_id,
            influencers(stage_name)
          `)
          .eq("brand_id", user.id)
          .eq("status", "active");

        if (contractsData) {
          setContracts(
            contractsData.map((c: any) => ({
              id: c.id,
              influencer_name: c.influencers?.stage_name || "Influenciador",
              brand_name: "",
              status: c.status,
              amount: c.amount
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar seus contratos."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (contractId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("contract_id", contractId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(
        (data || []).map((msg) => ({
          ...msg,
          is_own: msg.sender_id === user.id
        }))
      );
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContract) return;

    // Stop typing indicator
    updateTypingStatus(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("messages").insert({
        contract_id: selectedContract,
        sender_id: user.id,
        content: newMessage.trim()
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a mensagem."
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Chat com {userRole === "influencer" ? "Marcas" : "Influenciadores"}
        </h1>
        <p className="text-muted-foreground">
          Comunique-se de forma segura através da plataforma
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">
        {/* Contracts List */}
        <Card className="lg:col-span-1 p-6 border-border/50 bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Contratos Ativos
          </h2>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="space-y-3">
              {contracts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhum contrato ativo</p>
                </div>
              ) : (
                contracts.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                      selectedContract === contract.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {(userRole === "influencer" ? contract.brand_name : contract.influencer_name).charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {userRole === "influencer" ? contract.brand_name : contract.influencer_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            R$ {contract.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur flex flex-col">
          {selectedContract ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {contracts
                        .find((c) => c.id === selectedContract)
                        ?.[userRole === "influencer" ? "brand_name" : "influencer_name"]?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {contracts.find((c) => c.id === selectedContract)?.[
                          userRole === "influencer" ? "brand_name" : "influencer_name"
                        ]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {otherUserTyping ? (
                          <span className="text-primary animate-pulse">digitando...</span>
                        ) : (
                          "Online"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Conversa protegida</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_own ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          message.is_own
                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.is_own ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {otherUserTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-4 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* AI Warning */}
              <div className="px-6 py-3 bg-yellow-500/10 border-t border-yellow-500/20">
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-600 dark:text-yellow-400">
                    <strong>Atenção:</strong> Esta conversa é monitorada por IA. Tentativas de contato
                    externo resultam em banimento automático.
                  </p>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-border/50">
                <div className="flex gap-3">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-xl font-bold mb-2">Selecione um contrato</h3>
                <p className="text-muted-foreground">
                  Escolha um contrato ativo para iniciar a conversa
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
