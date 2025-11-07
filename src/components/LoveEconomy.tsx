import { TrendingUp, Heart, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";

export const LoveEconomy = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Particle Effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            The Love Economy
          </h2>
          <p className="text-xl text-muted-foreground">
            Amor = Valor
          </p>
        </div>

        {/* Economy Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/20 text-center hover:scale-105 transition-transform">
            <Coins className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">LoveCoin (LVC)</h3>
            <p className="text-muted-foreground">Mede impacto afetivo</p>
          </Card>

          <Card className="p-8 bg-card/30 backdrop-blur-xl border-secondary/20 text-center hover:scale-105 transition-transform">
            <Heart className="w-12 h-12 text-secondary mx-auto mb-4 animate-breathe" />
            <h3 className="text-2xl font-bold mb-2">Marketplace</h3>
            <p className="text-muted-foreground">Interfaces vivas e DNAs</p>
          </Card>

          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/20 text-center hover:scale-105 transition-transform">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4 animate-glow" />
            <h3 className="text-2xl font-bold mb-2">Conexões Globais</h3>
            <p className="text-muted-foreground">Rede de emoções</p>
          </Card>
        </div>

        {/* Visual Graph */}
        <div className="relative h-64 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
                ∞
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Conexões Afetivas em Tempo Real
              </p>
            </div>
          </div>
          
          {/* Flowing Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-primary">
              <animate attributeName="y1" values="40%;60%;40%" dur="4s" repeatCount="indefinite" />
              <animate attributeName="y2" values="60%;40%;60%" dur="4s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>
      </div>
    </section>
  );
};
