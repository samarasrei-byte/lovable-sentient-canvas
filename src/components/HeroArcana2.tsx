import { useState } from "react";
import { Sparkles, Menu, ArrowRight, CheckCircle2, Play } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArcanaLogo } from "@/components/ArcanaLogo";
import heroLiquid from "@/assets/hero-liquid.jpg";

export const HeroArcana2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#estilos", label: "Estilos" },
    { href: "#como-funciona", label: "Como Funciona" },
  ];

  return (
    <section className="relative min-h-[94vh] flex items-center overflow-hidden w-full border-b border-white/[0.06]">
      <nav className="fixed top-0 left-0 right-0 z-50 w-full safe-area-top">
        <div className="absolute inset-0 bg-[#09090c]/75 backdrop-blur-2xl border-b border-white/[0.07]" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="ARCANA — início">
            <ArcanaLogo iconSize={20} textSize="text-lg" />
          </Link>

          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.025] p-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-5 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all duration-200">
                {link.label}
              </a>
            ))}
          </div>

          <a href="#estilos" className="hidden md:inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all">
            Explorar estilos <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <div className="flex md:hidden items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu" className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.08]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background/90 backdrop-blur-2xl border-white/[0.06]">
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-white/[0.04]">
                      {link.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute -top-24 left-[12%] h-[32rem] w-[32rem] rounded-full bg-primary/[0.09] blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-20%] h-[34rem] w-[34rem] rounded-full bg-secondary/[0.06] blur-[130px]" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 md:px-8 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="grid lg:grid-cols-[1.08fr_.92fr] items-center gap-14 lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-7">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" /></span>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">Fotos Profissionais com IA</span>
            </div>

            <h1 className="text-[2.8rem] xs:text-5xl sm:text-7xl xl:text-[5.7rem] font-black tracking-[-0.06em] mb-7 leading-[.95] text-balance">
              <span className="text-foreground">Fotos de IA que</span><br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">TRANSFORMAM</span>
            </h1>

            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light">
              Qualidade de estúdio profissional por menos de R$25.<br className="hidden sm:block" /> Resultado em 60 segundos, sem cadastro.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <a href="#estilos" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-[0_16px_50px_-16px_hsl(var(--primary)/.75)] hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-16px_hsl(var(--primary)/.9)] transition-all duration-300 active:scale-[0.98]">
                  Criar Minha Foto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <a href="#galeria" className="group w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-4 rounded-xl border border-white/[0.09] bg-white/[0.035] text-sm font-medium text-foreground/80 hover:bg-white/[0.07] transition-all">
                <Play className="w-3.5 h-3.5 fill-current" /> Ver resultados
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2">
              {["Resultado em 60s", "Qualidade 4K", "Sem cadastro"].map((text) => (
                <div key={text} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" /><span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="relative hidden sm:block max-w-[560px] mx-auto lg:mx-0 w-full">
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/15 blur-3xl opacity-70" />
            <div className="relative rounded-[2rem] border border-white/[0.1] bg-white/[0.035] p-2.5 shadow-2xl shadow-black/50 rotate-[1.5deg]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-muted">
                <img src={heroLiquid} alt="Exemplo de retrato artístico criado com IA" className="h-full w-full object-cover" fetchPriority="high" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/[0.05]" />
                <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
                  <div className="rounded-xl border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl">
                    <p className="text-[9px] uppercase tracking-[.2em] text-white/50 mb-1">Estilo em destaque</p>
                    <p className="text-sm font-semibold text-white">Liquid portrait</p>
                  </div>
                  <div className="h-11 w-11 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
                </div>
              </div>
            </div>
            <div className="absolute -left-8 top-16 rounded-xl border border-white/[0.1] bg-[#101014]/80 backdrop-blur-xl px-4 py-3 shadow-xl -rotate-3">
              <p className="text-[9px] uppercase tracking-[.18em] text-muted-foreground">Resolução</p><p className="font-bold text-sm mt-0.5">4K Ultra HD</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
