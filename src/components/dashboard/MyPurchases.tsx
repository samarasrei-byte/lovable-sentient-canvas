import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Purchase {
  id: string;
  amount_cents: number;
  payment_status: string;
  generation_status: string;
  created_at: string;
  prompt_id: string;
  generated_image_url: string | null;
  prompts: {
    name: string;
    example_image_url: string | null;
  };
}

export const MyPurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("prompt_purchases")
      .select("*, prompts(name, example_image_url)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar compras");
    } else {
      setPurchases(data as any || []);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Concluído</Badge>;
      case "generating": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Gerando</Badge>;
      case "failed": return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Falhou</Badge>;
      case "pending": return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
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
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Minhas Compras</h2>
        <p className="text-sm text-muted-foreground">Histórico de pedidos e faturas</p>
      </div>

      <div className="space-y-3">
        {purchases.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border/40 bg-transparent">
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">Nenhuma compra realizada</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Seus pedidos aparecerão aqui após o pagamento.</p>
            </div>
          </Card>
        ) : (
          purchases.map((purchase, i) => (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/20 bg-card/40 hover:bg-card/60 transition-all rounded-2xl overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/10 shrink-0">
                      <img 
                        src={purchase.generated_image_url || purchase.prompts?.example_image_url || ""} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{purchase.prompts?.name || "Prompt"}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(purchase.created_at).toLocaleDateString("pt-BR", {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-black text-primary">R$ {(purchase.amount_cents / 100).toFixed(2)}</span>
                        <span className="text-[10px] text-muted-foreground">• {purchase.payment_method?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Status:</span>
                        {getStatusBadge(purchase.generation_status)}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {purchase.id.slice(0, 8)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/20" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
