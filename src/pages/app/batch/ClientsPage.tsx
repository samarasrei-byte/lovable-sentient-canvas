import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoPicker } from "@/components/batch/LogoPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createClientRecord,
  deleteClientRecord,
  updateClientRecord,
  fetchClients,
  type BatchClient,
} from "@/lib/batch-api";

const emptyForm = {
  name: "",
  brand_name: "",
  instagram_handle: "",
  whatsapp: "",
  primary_color: "#7C3AED",
  secondary_color: "#0EA5E9",
  logo_url: null as string | null,
};

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["batch-clients"],
    queryFn: fetchClients,
  });

  const set = (key: Exclude<keyof typeof emptyForm, "logo_url">) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    setSaving(true);
    try {
      await createClientRecord({
        name: form.name.trim(),
        brand_name: form.brand_name.trim() || null,
        instagram_handle: form.instagram_handle.trim().replace(/^@/, "") || null,
        whatsapp: form.whatsapp.trim() || null,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        logo_url: form.logo_url,
      });
      toast.success("Cliente cadastrado!");
      setForm(emptyForm);
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["batch-clients"] });
    } catch {
      toast.error("Não foi possível cadastrar o cliente.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (client: BatchClient, logo: string | null) => {
    try {
      await updateClientRecord(client.id, { logo_url: logo });
      toast.success(logo ? "Logo atualizado! Novos lotes já usam a marca." : "Logo removido.");
      void queryClient.invalidateQueries({ queryKey: ["batch-clients"] });
    } catch {
      toast.error("Não foi possível salvar o logo.");
    }
  };

  const handleDelete = async (client: BatchClient) => {
    try {
      await deleteClientRecord(client.id);
      toast.success("Cliente removido.");
      void queryClient.invalidateQueries({ queryKey: ["batch-clients"] });
    } catch {
      toast.error("Não foi possível remover o cliente.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Marcas e dados usados na Produção em Lote.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Novo cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="font-display">Cadastrar cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="client-name">Nome do cliente *</Label>
                <Input
                  id="client-name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Ex.: Studio Glow"
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div>
                <Label>Logo da marca</Label>
                <div className="mt-1.5">
                  <LogoPicker
                    value={form.logo_url}
                    onChange={(logo) => setForm((prev) => ({ ...prev, logo_url: logo }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="client-brand">Nome da marca</Label>
                <Input
                  id="client-brand"
                  value={form.brand_name}
                  onChange={set("brand_name")}
                  placeholder="Nome exibido nos vídeos"
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="client-instagram">Instagram</Label>
                  <Input
                    id="client-instagram"
                    value={form.instagram_handle}
                    onChange={set("instagram_handle")}
                    placeholder="@perfil"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="client-whatsapp">WhatsApp</Label>
                  <Input
                    id="client-whatsapp"
                    value={form.whatsapp}
                    onChange={set("whatsapp")}
                    placeholder="(11) 9..."
                    className="mt-1.5 bg-background/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="client-color-1">Cor primária</Label>
                  <Input
                    id="client-color-1"
                    type="color"
                    value={form.primary_color}
                    onChange={set("primary_color")}
                    className="mt-1.5 h-10 bg-background/50 cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="client-color-2">Cor secundária</Label>
                  <Input
                    id="client-color-2"
                    type="color"
                    value={form.secondary_color}
                    onChange={set("secondary_color")}
                    className="mt-1.5 h-10 bg-background/50 cursor-pointer"
                  />
                </div>
              </div>
              <Button
                onClick={() => void handleCreate()}
                disabled={saving}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <Users className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Cadastre seu primeiro cliente para começar a produzir vídeos em lote.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${client.primary_color ?? "#7C3AED"}, ${client.secondary_color ?? "#0EA5E9"})`,
                  }}
                >
                  {client.logo_url ? (
                    <img src={client.logo_url} alt="" className="w-full h-full object-contain rounded-xl bg-background p-1" />
                  ) : (
                    client.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Remover ${client.name}`}
                  onClick={() => void handleDelete(client)}
                  className="text-muted-foreground/50 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-sm">{client.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {client.brand_name ?? "—"}
                {client.instagram_handle ? ` · @${client.instagram_handle}` : ""}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
