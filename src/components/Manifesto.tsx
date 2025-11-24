import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useParallax } from "@/hooks/use-parallax";

export const Manifesto = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentOffset = useParallax(sectionRef, 0.3);

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-black">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
      
      <div 
        ref={sectionRef}
        className="max-w-4xl mx-auto relative z-10 text-center"
        style={{
          transform: `translateY(${-contentOffset}px)`,
        }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          O futuro do design é sentir.
        </h2>
        
        <p className="text-2xl md:text-3xl text-muted-foreground mb-12 font-light leading-relaxed">
          Mais do que estética, é conexão.
          Aqui, tecnologia e emoção se unem para criar experiências que inspiram, 
          engajam e movem pessoas.
        </p>
        
        <Button 
          size="lg"
          className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300 shadow-2xl shadow-primary/50 border border-primary/30"
          onClick={() => window.location.href = '/app/dashboard'}
        >
          Comece agora
        </Button>

      </div>
    </section>
  );
};
