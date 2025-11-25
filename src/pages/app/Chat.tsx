import { useState, useEffect, useRef } from "react";
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
  User,
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

export default function Chat() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [isSimulation, setIsSimulation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserAndContracts();
  }, []);

  useEffect(() => {
    if (selectedContract) {
      loadMessages(selectedContract);
      const channel = supabase
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

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedContract]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUserAndContracts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setUserRole(roleData?.role || "brand");

      // Load contracts based on role
      if (roleData?.role === "influencer") {
        const { data: influencer } = await supabase
          .from("influencers")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (influencer) {
          const { data: contractsData } = await supabase
            .from("contracts")
            .select(`
              id,
              amount,
              status,
              brand_id,
              profiles!contracts_brand_id_fkey(full_name)
            `)
            .eq("influencer_id", influencer.id)
            .eq("status", "active");

          if (contractsData) {
            setContracts(
              contractsData.map((c: any) => ({
                id: c.id,
                influencer_name: "",
                brand_name: c.profiles?.full_name || "Marca",
                status: c.status,
                amount: c.amount
              }))
            );
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
        data.map((msg) => ({
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
    <div className="p-6 h-[calc(100vh-220px)]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
          Chat com {userRole === "influencer" ? "Marcas" : "Influenciadores"}
        </h1>
        <p className="text-muted-foreground">
          Comunique-se de forma segura através da plataforma
        </p>
        {isSimulation && (
          <div className="mt-4 p-4 rounded-lg border border-orange-500/50 bg-orange-500/10">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              🎭 Modo Simulação - Para desbloquear o chat real, aceite um contrato e realize o pagamento
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-140px)]">
        {/* Contracts List */}
        <Card className="lg:col-span-1 p-6 border-border/50 bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Simulação de Contratos
          </h2>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="space-y-3">
              {/* Always show simulation contracts */}
              {[
                { id: "sim-1", name: "Nike Brasil", amount: 25000, type: "brand" },
                { id: "sim-2", name: "Adidas", amount: 18000, type: "brand" },
                { id: "sim-3", name: "Coca-Cola", amount: 35000, type: "brand" },
              ].map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => {
                    setSelectedContract(contract.id);
                    toast({
                      title: "Chat Bloqueado",
                      description: "Aceite um contrato e realize o pagamento para desbloquear o chat real.",
                      variant: "destructive",
                    });
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 relative ${
                    selectedContract === contract.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-background/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {contract.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{contract.name}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {contract.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-orange-500/20 border-orange-500/50">
                      🔒 Simulação
                    </Badge>
                  </div>
                </div>
              ))}
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
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Conversa protegida</span>
                  </div>
                </div>
              </div>

              {/* Messages - Simulation Mode */}
              <ScrollArea className="flex-1 p-6 relative">
                <div className="space-y-4">
                  {/* Example messages */}
                  <div className="flex justify-start">
                    <div className="max-w-[70%] p-4 rounded-2xl bg-muted">
                      <p className="text-sm">Olá! Gostaria de discutir uma parceria para nossa nova campanha.</p>
                      <p className="text-xs mt-2 text-muted-foreground">10:30</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white">
                      <p className="text-sm">Olá! Fico feliz com seu interesse. Conte-me mais sobre a campanha.</p>
                      <p className="text-xs mt-2 text-white/70">10:32</p>
                    </div>
                  </div>
                  <div ref={messagesEndRef} />
                </div>
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-8 bg-card/90 rounded-2xl border-2 border-primary/50 shadow-2xl shadow-primary/20 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Chat Bloqueado</h3>
                    <p className="text-muted-foreground mb-6">
                      Para desbloquear o chat real e começar a conversar com marcas e influenciadores, você precisa:
                    </p>
                    <div className="space-y-2 text-left mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Aceitar uma proposta de contrato</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Realizar o pagamento da campanha</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                      Ver Contratos Disponíveis
                    </Button>
                  </div>
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

              {/* Message Input - Disabled in simulation */}
              <div className="p-6 border-t border-border/50">
                <div className="flex gap-3">
                  <Input
                    placeholder="Chat bloqueado - Aceite um contrato para desbloquear..."
                    disabled
                    className="flex-1 opacity-50"
                  />
                  <Button
                    disabled
                    className="bg-gradient-to-r from-primary to-secondary opacity-50"
                  >
                    <Send className="w-4 h-4" />
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
