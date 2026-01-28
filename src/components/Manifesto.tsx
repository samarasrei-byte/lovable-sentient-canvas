import { useRef } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { useParallax } from "@/hooks/use-parallax";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Manifesto = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentOffset = useParallax(sectionRef, 0.3);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-black to-background" />
      
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
      
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <motion.div 
        ref={sectionRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto relative z-10 text-center"
        style={{
          transform: `translateY(${-contentOffset}px)`,
        }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
          O futuro do design é{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            sentir.
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light leading-relaxed max-w-3xl mx-auto">
          Mais do que estética, é conexão.
          Aqui, tecnologia e emoção se unem para criar experiências que inspiram, 
          engajam e movem pessoas.
        </p>
        
        <GlassButton 
          variant="glow"
          size="xl"
          onClick={() => window.location.href = '/app/dashboard'}
        >
          Comece agora
          <ArrowRight className="w-5 h-5 ml-2" />
        </GlassButton>
      </motion.div>
    </section>
  );
};
