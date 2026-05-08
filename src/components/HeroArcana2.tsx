import { useState } from "react";
import { Sparkles, Menu, ArrowRight, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArcanaLogo } from "@/components/ArcanaLogo";

export const HeroArcana2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#estilos", label: "Estilos" },
    { href: "#como-funciona", label: "Como Funciona" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden w-full">
      {/* ═══ Sticky Nav — Apple-clean ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full safe-area-top">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl border-b border-white/[0.04]" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <ArcanaLogo iconSize={20} textSize="text-xl" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            {/* Login oculto — acesso via /admin */}
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            {/* Login mobile oculto — acesso via /admin */}
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
                  {/* Login sheet oculto — acesso via /admin */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ═══ Background — subtle radial ═══ */}
      <div className="absolute inset-0 opacity-40" style={{
        background: "radial-gradient(ellipse at 50% 0%, hsl(270 50% 50% / 0.12), transparent 60%)"
      }} />

      {/* ═══ Content ═══ */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 pt-24 md:pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary/80" />
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
              Fotos Profissionais com IA
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] mb-6 leading-[0.95] text-center">
            <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              Fotos de IA que
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              TRANSFORMAM
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm md:text-base text-muted-foreground/70 max-w-md mx-auto mb-10 leading-relaxed font-light">
            Qualidade de estúdio profissional por menos de R$25.
            <br className="hidden sm:block" />
            Resultado em 60 segundos, sem cadastro.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { icon: CheckCircle2, text: "Resultado em 60s", color: "text-emerald-400/70" },
              { icon: Sparkles, text: "Qualidade 4K", color: "text-blue-400/70" },
              { icon: CheckCircle2, text: "Sem cadastro", color: "text-amber-400/70" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                <badge.icon className={cn("w-3 h-3", badge.color)} />
                <span className="text-[10px] text-muted-foreground/60 font-medium">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <a href="#estilos">
              <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]">
                Criar Minha Foto
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </a>
            <p className="text-[10px] text-muted-foreground/40 font-medium">
              PIX instantâneo · Download imediato
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
