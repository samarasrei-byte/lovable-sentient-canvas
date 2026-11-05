import { useEffect, useState } from "react";
import { Clapperboard, Camera, Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useHomepageConfig, useSetHomepageConfig } from "@/hooks/use-homepage-config";
import { cn } from "@/lib/utils";

export default function BatchSettings() {
  const { isAdmin } = useAuth();
  const { data: config, isLoading } = useHomepageConfig();
  const setConfig = useSetHomepageConfig();

  const [highlight, setHighlight] = useState<"batch" | "photos">("batch");
  const [showSecondary, setShowSecondary] = useState(true);

  useEffect(() => {
    if (config) {
      setHighlight(config.highlight);
      setShowSecondary(config.show_secondary_features);
    }
  }, [config]);

  const save = (next: { highlight: "batch" | "photos"; show_secondary_features: boolean }) => {
    setConfig.mutate(next, {
      onSuccess: () => toast.success("Configuração da página inicial salva!"),
      onError: () => toast.error("Somente administradores podem alterar a página inicial."),
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Preferências da conta e da página inicial.
        </p>
      </div>

      {/* Destaque da página inicial (admin) */}
      <section className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings2 className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Destaque da página inicial</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Define qual funcionalidade aparece em destaque na home do Arcana.
          {!isAdmin && " (somente administradores)"}
        </p>

        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "batch" as const, icon: Clapperboard, label: "Produção em Lote" },
              { value: "photos" as const, icon: Camera, label: "Fotos com IA" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={!isAdmin || setConfig.isPending}
                onClick={() => {
                  setHighlight(option.value);
                  save({ highlight: option.value, show_secondary_features: showSecondary });
                }}
                className={cn(
                  "rounded-xl border p-4 flex flex-col items-center gap-2 transition-all",
                  highlight === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/40 bg-card/50 text-muted-foreground hover:border-primary/40",
                  (!isAdmin || setConfig.isPending) && "opacity-60 cursor-not-allowed",
                )}
              >
                <option.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 p-4">
          <div>
            <Label htmlFor="show-secondary" className="text-sm font-medium">
              Mostrar outras soluções na home
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quando desativado, a seção secundária de funcionalidades é ocultada.
            </p>
          </div>
          <Switch
            id="show-secondary"
            checked={showSecondary}
            disabled={!isAdmin || setConfig.isPending}
            onCheckedChange={(checked) => {
              setShowSecondary(checked);
              save({ highlight, show_secondary_features: checked });
            }}
          />
        </div>
      </section>
    </div>
  );
}
