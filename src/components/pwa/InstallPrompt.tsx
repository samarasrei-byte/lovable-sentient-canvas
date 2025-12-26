import { useState, useEffect } from "react";
import { X, Download, Share, Plus, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if dismissed recently
    const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedTime) {
      const hoursSinceDismiss = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) {
        setDismissed(true);
      }
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!standalone && !dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show iOS prompt after delay
    if (isIOSDevice && !standalone && !dismissed) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 md:bottom-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-2xl shadow-primary/20">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">
                Instalar ARCANA
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {isIOS 
                  ? "Adicione à sua tela inicial para uma experiência completa"
                  : "Instale o app para acesso rápido e offline"
                }
              </p>
            </div>
          </div>

          {isIOS ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                <Share className="w-4 h-4 text-primary shrink-0" />
                <span>Toque em <strong>Compartilhar</strong> no Safari</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                <Plus className="w-4 h-4 text-primary shrink-0" />
                <span>Selecione <strong>Adicionar à Tela de Início</strong></span>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleInstall}
              className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar Agora
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
