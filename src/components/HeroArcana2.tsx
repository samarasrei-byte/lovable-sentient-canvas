import { useState, useEffect, useRef } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { Zap, Menu, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroLiquid from "@/assets/hero-liquid.jpg";
import { useParallax } from "@/hooks/use-parallax";
import { InstallButton } from "@/components/pwa/InstallButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const HeroArcana2 = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  const contentOffset = useParallax(contentRef, 0.3);
  const backgroundOffset = useParallax(backgroundRef, -0.2);

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

  const navLinks = [
    { href: "#marketplace", label: "Marketplace" },
    { href: "#como-funciona", label: "Como Funciona" },
    { href: "#planos", label: "Planos" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-6 safe-area-top w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="relative group flex-shrink-0">
            <div className="relative flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-secondary/30">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
              <span className="text-lg md:text-2xl font-bold text-secondary">
                ARCANA
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <InstallButton />
            <Button 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/10"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <InstallButton />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-card/95 backdrop-blur-xl">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    >
                      {link.label}
                    </a>
                  ))}
                  <hr className="border-border/50" />
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Subtle Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src={heroLiquid} 
          alt="Liquid background"
          className="w-full h-full object-cover opacity-15 scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      </div>

      {/* Subtle Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-secondary/[0.06] rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto pt-24 md:pt-20"
        style={{
          transform: `translateY(${-contentOffset}px)`,
        }}
      >
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-foreground leading-tight tracking-tight"
        >
          Encontre o{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            talento perfeito
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 font-light max-w-3xl mx-auto px-2"
        >
          Recrie sua imagem com a estética usada pelos creators mais hypados.
        </motion.p>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-full bg-card/50 border border-border">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-foreground">1.000.000.000+</span>
            <span>views</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-full bg-card/50 border border-border">
            <span className="text-lg">🎨</span>
            <span>Artistas & Creators</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-full bg-card/50 border border-border">
            <span className="text-lg">👑</span>
            <span>Influencers</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">(em breve)</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GlassButton 
            variant="glow"
            size="lg"
            className="w-full sm:w-auto touch-manipulation"
            onClick={() => navigate("/login")}
          >
            Explorar talentos
            <ArrowRight className="w-4 h-4 ml-2" />
          </GlassButton>
          <GlassButton
            variant="outline"
            size="lg"
            className="w-full sm:w-auto touch-manipulation"
            onClick={() => navigate("/login")}
          >
            Criar conta grátis
          </GlassButton>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
