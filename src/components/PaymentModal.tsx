import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, DollarSign } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  influencerId: string;
  influencerName: string;
  pricePerPost: number;
  onSuccess: (contractId: string) => void;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  influencerId,
  influencerName,
  pricePerPost,
  onSuccess,
}: PaymentModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const arcanaFee = pricePerPost * 0.15; // 15% fee
  const totalAmount = pricePerPost + arcanaFee;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para realizar o pagamento.",
        });
        return;
      }

      // Create contract
      const { data: contract, error: contractError } = await supabase
        .from("contracts")
        .insert({
          brand_id: user.id,
          influencer_id: influencerId,
          amount: pricePerPost,
          arcana_fee: arcanaFee,
          total_amount: totalAmount,
          description: description,
          status: "pending_payment",
        })
        .select()
        .single();

      if (contractError) throw contractError;

      // Create payment
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          contract_id: contract.id,
          brand_id: user.id,
          amount: totalAmount,
          status: "completed", // Simulating instant payment
          payment_method: "credit_card",
          paid_at: new Date().toISOString(),
        });

      if (paymentError) throw paymentError;

      // Update contract status
      await supabase
        .from("contracts")
        .update({ 
          status: "active",
          started_at: new Date().toISOString(),
        })
        .eq("id", contract.id);

      toast({
        title: "Pagamento realizado!",
        description: "Agora você pode conversar com o influenciador.",
      });

      onSuccess(contract.id);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao processar pagamento",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contratar {influencerName}</DialogTitle>
          <DialogDescription>
            Complete o pagamento para liberar o chat com o influenciador
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Valor do Post</span>
              <span className="font-semibold">R$ {pricePerPost.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Taxa Arcana (15%)</span>
              <span className="font-semibold">R$ {arcanaFee.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-primary">R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Trabalho</Label>
            <Textarea
              id="description"
              placeholder="Descreva o que você espera deste trabalho..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-semibold">Pagamento Simulado</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Esta é uma demonstração. O pagamento será processado instantaneamente.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Aviso Importante:</strong> A Arcana monitora todas as conversas com IA. 
                Tentar contatar o influenciador fora da plataforma resultará em banimento permanente.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <DollarSign className="mr-2 h-4 w-4" />
              Pagar R$ {totalAmount.toFixed(2)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
