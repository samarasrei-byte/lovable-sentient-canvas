import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

interface ModerationAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId?: string;
  photoUrl?: string;
  reason?: string;
  type: "upload" | "generation";
}

export const ModerationAppealModal = ({ 
  isOpen, 
  onClose, 
  purchaseId, 
  photoUrl, 
  reason,
  type 
}: ModerationAppealModalProps) => {
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!justification.trim()) {
      toast.error("Por favor, descreva sua justificativa.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const subject = `Apelação de Moderação - ${type === "upload" ? "Upload de Foto" : "Geração de Imagem"}`;
      const description = `
        ID da Compra: ${purchaseId || "N/A"}
        Tipo: ${type}
        Motivo do Bloqueio: ${reason || "Não informado"}
        URL da Imagem: ${photoUrl || "N/A"}
        
        Justificativa do Usuário:
        ${justification}
      `;

      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user?.id,
          category: "Moderation Appeal",
          subject,
          description,
          priority: "high",
          status: "open"
        });

      if (error) throw error;

      toast.success("Apelação enviada com sucesso!", {
        description: "Nossa equipe revisará o conteúdo em breve."
      });
      onClose();
    } catch (error) {
      console.error("Error submitting appeal:", error);
      toast.error("Erro ao enviar apelação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-white/10 bg-zinc-950 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <DialogTitle>Solicitar Revisão Humana</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Se você acredita que sua {type === "upload" ? "foto" : "imagem"} foi bloqueada por engano, descreva o motivo abaixo. Nossa equipe de segurança fará uma revisão manual.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-200">Motivo do Bloqueio:</p>
              <p className="text-red-300/80">{reason || "Violação das diretrizes de segurança."}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification" className="text-zinc-300">Justificativa</Label>
            <Textarea
              id="justification"
              placeholder="Explique por que esta imagem não viola nossas diretrizes..."
              className="bg-white/5 border-white/10 focus:border-primary/50 text-white min-h-[120px]"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
          </div>

          <p className="text-[11px] text-zinc-500 italic">
            * Tentativas de enviar conteúdo ilegal ou abusivo propositalmente podem levar ao banimento permanente da conta.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-zinc-400 hover:text-white hover:bg-white/5">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Apelação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
