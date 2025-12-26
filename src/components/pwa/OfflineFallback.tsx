import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OfflineFallback = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Você está offline
        </h1>
        
        <p className="text-muted-foreground text-sm mb-6">
          Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
        </p>

        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};
