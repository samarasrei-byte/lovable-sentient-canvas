import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fileToLogoDataUrl } from "@/lib/logo-image";

export interface LogoPickerProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void | Promise<void>;
  compact?: boolean;
}

export function LogoPicker({ value, onChange, compact = false }: LogoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      await onChange(await fileToLogoDataUrl(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar o logo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {!compact && (
        <div className="w-14 h-14 rounded-xl border border-border/50 bg-background/60 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="Logo do cliente" className="w-full h-full object-contain p-1" />
          ) : (
            <ImagePlus className="w-5 h-5 text-muted-foreground/60" />
          )}
        </div>
      )}
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {value ? "Trocar logo" : "Enviar logo"}
      </Button>
      {value && (
        <Button type="button" variant="ghost" size="sm" aria-label="Remover logo" onClick={() => void onChange(null)}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
