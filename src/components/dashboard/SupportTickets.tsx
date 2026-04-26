import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Paperclip,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  created_at: string;
  description: string;
}

interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  is_admin_reply: boolean;
}

export const SupportTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "image_error",
    description: "",
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await (supabase
      .from("support_tickets" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) as any);

    if (error) {
      toast.error("Erro ao carregar chamados");
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  };

  const loadMessages = async (ticketId: string) => {
    const { data, error } = await (supabase
      .from("ticket_messages" as any)
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true }) as any);

    if (error) {
      toast.error("Erro ao carregar mensagens");
    } else {
      setMessages(data || []);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await (supabase
      .from("support_tickets" as any)
      .insert({
        user_id: user.id,
        ...newTicket,
        status: "open",
      })
      .select()
      .single() as any);

    if (error) {
      toast.error("Erro ao abrir chamado");
    } else {
      toast.success("Chamado aberto com sucesso!");
      setShowNewTicketForm(false);
      setNewTicket({ subject: "", category: "image_error", description: "" });
      loadTickets();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await (supabase
      .from("ticket_messages" as any)
      .insert({
        ticket_id: selectedTicket.id,
        sender_id: user.id,
        message: newMessage,
      }) as any);

    if (error) {
      toast.error("Erro ao enviar mensagem");
    } else {
      setNewMessage("");
      loadMessages(selectedTicket.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Aberto</Badge>;
      case "in_analysis": return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Em análise</Badge>;
      case "answered": return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Respondido</Badge>;
      case "resolved": return <Badge variant="secondary" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Resolvido</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Meus Chamados
        </h2>
        {!showNewTicketForm && !selectedTicket && (
          <Button onClick={() => setShowNewTicketForm(true)} className="gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Abrir chamado
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showNewTicketForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-border/20 bg-card/50 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/10 pb-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowNewTicketForm(false)} className="rounded-lg h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-lg">Novo Chamado</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assunto</Label>
                    <Input 
                      placeholder="Ex: Erro ao gerar imagem do Ravi" 
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <select 
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="image_error">Erro na imagem</option>
                      <option value="payment">Pagamento</option>
                      <option value="question">Dúvida</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea 
                      placeholder="Descreva o que houve com detalhes..." 
                      className="min-h-[120px] rounded-xl"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl">Enviar Chamado</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : selectedTicket ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="border-border/20 bg-card/50 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/10 flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)} className="rounded-lg h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedTicket.status)}
                      <span className="text-[10px] text-muted-foreground">#{selectedTicket.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  <div className="bg-muted/30 p-4 rounded-2xl max-w-[80%] border border-border/10">
                    <p className="text-xs text-muted-foreground mb-1">Você (Descrição original)</p>
                    <p className="text-sm">{selectedTicket.description}</p>
                  </div>
                  
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.is_admin_reply ? 'items-start' : 'items-end'}`}
                    >
                      <div className={`p-4 rounded-2xl max-w-[80%] border ${
                        msg.is_admin_reply 
                          ? 'bg-primary/10 border-primary/20 rounded-tl-none' 
                          : 'bg-card border-border/10 rounded-tr-none'
                      }`}>
                        <p className="text-[10px] text-muted-foreground mb-1">
                          {msg.is_admin_reply ? 'Suporte Arcana' : 'Você'} • {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border/10 bg-muted/10 flex gap-2">
                  <Input 
                    placeholder="Sua resposta..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="rounded-xl flex-1"
                  />
                  <Button type="submit" size="icon" className="rounded-xl shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {tickets.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-border/40 bg-transparent">
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground font-medium">Nenhum chamado aberto</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Precisa de ajuda? Abra um novo chamado.</p>
                </div>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className="group cursor-pointer border-border/20 bg-card/40 hover:bg-card/60 transition-all rounded-2xl overflow-hidden"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    loadMessages(ticket.id);
                  }}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{ticket.subject}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          {ticket.category === 'image_error' ? 'Erro na imagem' : 
                           ticket.category === 'payment' ? 'Pagamento' : 'Suporte'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(ticket.status)}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
