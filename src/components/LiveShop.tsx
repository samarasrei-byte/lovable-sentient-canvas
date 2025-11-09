import { Button } from "@/components/ui/button";
import { Video, TrendingUp, Users } from "lucide-react";

export const LiveShop = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme campanhas em experiências ao vivo
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 font-light leading-relaxed">
              Transforme cada live em uma experiência imersiva. Ative produtos, talentos e arte em tempo real, 
              com dados que revelam o impacto de cada conexão.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <Video className="w-6 h-6 text-primary" />
                <span className="text-lg">Transmissões ao vivo integradas</span>
              </div>
              <div className="flex items-center gap-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="text-lg">Métricas em tempo real</span>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-lg">Interação direta com audiência</span>
              </div>
            </div>
            
            <Button 
              size="lg"
              className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300 shadow-2xl shadow-primary/50"
            >
              Explorar Live Shop
            </Button>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur border border-border/50 flex items-center justify-center">
              <Video className="w-24 h-24 text-primary/50" />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-card/80 backdrop-blur border border-border/50 rounded-xl p-4 animate-pulse">
              <div className="text-sm text-muted-foreground">Conversão</div>
              <div className="text-2xl font-bold text-primary">+342%</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card/80 backdrop-blur border border-border/50 rounded-xl p-4 animate-pulse delay-500">
              <div className="text-sm text-muted-foreground">Espectadores</div>
              <div className="text-2xl font-bold text-secondary">12.5k</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
