import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export const TrustedBrands = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-card/30">
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <Badge className="mb-6 px-4 py-2 bg-primary/10 border-primary/30 text-primary">
          <Sparkles className="w-3 h-3 mr-2" />
          Marcas que confiam
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Empoderamos marcas que acreditam na nova economia criativa
        </h2>
        
        <p className="text-xl text-muted-foreground font-light">
          Junte-se às marcas que estão moldando o futuro da conexão entre tecnologia e humanidade.
        </p>
      </div>
    </section>
  );
};
