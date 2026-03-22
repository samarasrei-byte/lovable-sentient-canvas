import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, Menu, ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";

export const HeroArcana2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#prompts", label: "Prompts" },
    { href: "#como-funciona", label: "Como Funciona" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-5 md:px-8 pt-16 sm:pt-12 md:pt-6 pb-4 safe-area-top w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/[0.04] rounded-xl border border-white/[0.08]">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ARCANA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="ml-2 px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20"
            >
              Entrar
            </a>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <a
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Entrar
            </a>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/[0.04] border border-white/[0.08]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background/80 backdrop-blur-2xl border-white/[0.06]">
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-white/[0.04]"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-4 text-center py-3 px-4 rounded-xl text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    Entrar
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Static background — no parallax, no mouse tracking */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-secondary/[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      {/* Static ambient orbs — no mousemove tracking */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/[0.05] blur-[100px]" />
      </div>

      {/* Content — CSS animations instead of framer-motion for initial load */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-20 animate-fade-in">
        {/* Badge */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-foreground/80">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            +47.000 fotos geradas esta semana
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-foreground leading-[1.05] tracking-tight">
          Fotos de IA que{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            viralizam
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          Qualidade de estúdio profissional por menos de R$25.
          <br className="hidden sm:block" />
          Resultado em 60 segundos, sem cadastro.
        </p>

        {/* Social proof chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: TrendingUp, text: "#1 em fotos IA no Brasil", highlight: true },
            { icon: Star, text: "4.9/5 avaliação" },
            { icon: Zap, text: "Resultado em 60s" },
          ].map((chip, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]"
            >
              <chip.icon className={`w-3.5 h-3.5 ${chip.highlight ? 'text-primary' : 'text-secondary'}`} />
              <span className={chip.highlight ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}>
                {chip.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a href="#prompts">
              <GlassButton
                variant="glow"
                size="xl"
                className="touch-manipulation text-base px-10 py-7"
              >
                Ver Prompts
                <ArrowRight className="w-5 h-5 ml-2" />
              </GlassButton>
            </a>
            <a href="#photo-services">
              <GlassButton
                variant="outline"
                size="lg"
                className="touch-manipulation"
              >
                <Badge className="bg-primary/20 text-primary border-0 text-[10px] mr-2">NOVO</Badge>
                Gerar Minha Foto IA
              </GlassButton>
            </a>
          </div>
          <p className="text-sm text-muted-foreground/60 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary/50" />
            Sem cadastro · PIX instantâneo · Download imediato
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
