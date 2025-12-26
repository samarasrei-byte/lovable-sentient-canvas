import { useState, useEffect } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSDialog(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) return null;

  // Show button on iOS or when install prompt is available
  if (!isIOS && !deferredPrompt) return null;

  return (
    <>
      <Button
        onClick={handleInstall}
        variant="outline"
        size="sm"
        className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-primary"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </Button>

      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Instalar ARCANA
            </DialogTitle>
            <DialogDescription>
              Siga os passos abaixo para instalar o app no seu iPhone/iPad:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Toque no botão Compartilhar</p>
                <div className="flex items-center gap-1 mt-1">
                  <Share className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Na barra do Safari
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Role e selecione</p>
                <p className="text-xs text-muted-foreground mt-1">
                  "Adicionar à Tela de Início"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">Confirme a instalação</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Toque em "Adicionar" no canto superior direito
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowIOSDialog(false)}
            className="w-full"
          >
            Entendi
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
