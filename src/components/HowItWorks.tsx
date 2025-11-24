import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentOffset = useParallax(sectionRef, 0.2);

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-card/30">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
      
      <div 
        ref={sectionRef}
        className="max-w-4xl mx-auto relative z-10 text-center"
        style={{
          transform: `translateY(${-contentOffset}px)`,
        }}
      >
        <div className="mb-8 flex justify-center">
          <Sparkles className="w-16 h-16 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Mais que um marketplace, uma experiência consultiva para sua marca
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light leading-relaxed">
          Nosso ecossistema combina dados, criatividade e curadoria humana.
          Aqui, sua marca encontra talentos alinhados à sua essência e recebe suporte estratégico 
          para campanhas, collabs, lives e experiências imersivas.
        </p>
        
        <Button 
          size="lg"
          className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300 shadow-2xl shadow-primary/50"
        >
          Falar com um consultor de marca
        </Button>
      </div>
    </section>
  );
};
