import { useState, useEffect, useRef } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Zap, Menu, ArrowRight } from "lucide-react";
import heroLiquid from "@/assets/hero-liquid.jpg";
import { useParallax } from "@/hooks/use-parallax";
import { InstallButton } from "@/components/pwa/InstallButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const HeroArcana2 = () => {
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
    { href: "#prompts", label: "Prompts" },
    { href: "#influencers", label: "Influencers" },
    { href: "#como-funciona", label: "Como Funciona" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-6 safe-area-top w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="relative group flex-shrink-0">
            <div className="relative flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-primary/30">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <InstallButton />
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
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                    >
                      {link.label}
                    </a>
                  ))}
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
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-secondary/30 text-sm font-medium text-secondary shadow-[0_0_20px_hsl(var(--secondary)/0.15)]">
            <span className="animate-pulse">🔥</span>
            Os prompts mais baratos da internet — a partir de R$21
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 text-foreground leading-tight tracking-tight"
        >
          O marketplace de{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(var(--secondary)/0.3)]">
            influenciadores
          </span>{" "}
          e{" "}
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            fotos com IA
          </span>{" "}
          por R$21
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 font-light max-w-3xl mx-auto px-2"
        >
          Contrate influenciadores, avatares IA e artistas — ou transforme suas fotos em 
          <span className="text-secondary font-medium">imagens profissionais com IA</span> em minutos. 
          <span className="text-primary font-medium">Tudo em um só lugar</span>, sem mensalidade.
        </motion.p>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8 md:mb-10"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2.5 rounded-full bg-card/50 border border-secondary/30 backdrop-blur-sm shadow-[0_0_15px_hsl(var(--secondary)/0.1)]">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-foreground">+10.000</span>
            <span>clientes satisfeitos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2.5 rounded-full bg-card/50 border border-primary/30 backdrop-blur-sm shadow-[0_0_15px_hsl(var(--primary)/0.1)]">
            <span className="text-lg">💎</span>
            <span className="font-bold text-foreground">R$21</span>
            <span>por prompt</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2.5 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/30 backdrop-blur-sm">
            <span className="text-lg">📸</span>
            <span className="font-medium text-foreground">Fotos IA</span>
            <Badge className="text-[10px] px-1.5 py-0.5 bg-secondary/30 text-secondary border-0 animate-pulse">NOVO</Badge>
          </div>
        </motion.div>

        {/* CTA Buttons - Cyberpunk Neon Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="#prompts">
              <GlassButton 
                variant="holographic"
                size="xl"
                className="touch-manipulation text-lg px-10 py-7 transition-all duration-500 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                <Zap className="w-5 h-5 mr-2" />
                Explorar Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </GlassButton>
            </a>
            <a href="#photo-services">
              <GlassButton 
                variant="neon"
                size="lg"
                className="touch-manipulation transition-all duration-500"
              >
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/30 text-secondary font-bold mr-2">NOVO</span>
                Gerar Foto IA
              </GlassButton>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Sem cadastro • Pagamento via PIX • Resultado instantâneo
          </p>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
