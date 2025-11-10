import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroLiquid from "@/assets/hero-liquid.jpg";

export const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        <img 
          src={heroLiquid} 
          alt="Liquid background"
          className="w-full h-full object-cover opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo - Modern ARCANA */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] [text-shadow:0_0_40px_rgba(255,102,196,0.3)]">
              ARCANA
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
          A próxima geração de conexões entre marcas e criadores.
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light tracking-wide max-w-4xl mx-auto">
          Explore um marketplace inteligente que conecta marcas a influenciadores, avatares e artistas para campanhas únicas, autênticas e inesquecíveis.
        </p>

        {/* CTA Button */}
        <Button 
          size="lg"
          className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300 shadow-2xl shadow-primary/50 border border-primary/30"
        >
          Explorar talentos
        </Button>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
