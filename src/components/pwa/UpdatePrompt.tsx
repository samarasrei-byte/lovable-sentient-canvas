import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterSW } from "virtual:pwa-register/react";

export const UpdatePrompt = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const isLovablePreview = typeof window !== "undefined" && window.location.hostname.endsWith(".lovable.app") && window.location.hostname.includes("--");

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    if (!needRefresh) return;

    if (isLovablePreview) {
      void updateServiceWorker(true);
      return;
    }

    setShowUpdate(true);
  }, [isLovablePreview, needRefresh, updateServiceWorker]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-card border border-primary/30 rounded-xl p-4 shadow-lg shadow-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Nova versão disponível
                </p>
                <p className="text-xs text-muted-foreground">
                  Atualize para a versão mais recente
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="flex-1"
              >
                Depois
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Atualizar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
