import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Menu, Play, Check, Sparkles, Image, Camera, Users, Palette, Video, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroLiquid from "@/assets/hero-liquid.jpg";
import { useParallax } from "@/hooks/use-parallax";
import { InstallButton } from "@/components/pwa/InstallButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Arcana BASIC",
    price: "55",
    description: "Perfeito para começar a criar",
    features: [
      "Criar imagens de produtos",
      "Criar fotos profissionais",
      "Usar templates prontos",
      "Criar com influenciadores",
      "Criar com avatares e artistas",
      "120 créditos/mês",
    ],
    icon: Sparkles,
    popular: false,
    gradient: "from-primary/20 to-secondary/20",
  },
  {
    name: "Arcana PRO",
    price: "220",
    description: "Para criadores profissionais",
    features: [
      "Tudo do Basic",
      "Animação de imagens com IA",
      "400 créditos/mês",
      "Acesso prioritário às features beta",
      "Suporte prioritário",
      "Templates exclusivos",
    ],
    icon: Crown,
    popular: true,
    gradient: "from-primary to-secondary",
  },
];

const showcaseItems = [
  { label: "Produtos", icon: Image, image: "/placeholder.svg" },
  { label: "Fotos Profissionais", icon: Camera, image: "/placeholder.svg" },
  { label: "Influenciadores", icon: Users, image: "/placeholder.svg" },
  { label: "Artistas", icon: Palette, image: "/placeholder.svg" },
  { label: "Animações", icon: Video, image: "/placeholder.svg" },
];

export const HeroArcana2 = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % showcaseItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "#marketplace", label: "Marketplace" },
    { href: "#como-funciona", label: "Como Funciona" },
    { href: "#planos", label: "Planos" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 safe-area-top">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="relative group">
            <div className="relative flex items-center gap-2 px-3 md:px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-secondary/30">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
              <span className="text-xl md:text-2xl font-bold text-secondary">
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

      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y + backgroundOffset}px)`,
        }}
      >
        <img 
          src={heroLiquid} 
          alt="Liquid background"
          className="w-full h-full object-cover opacity-30 scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Content */}
      <div 
        ref={contentRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6 max-w-7xl mx-auto pt-24 md:pt-20 pb-12"
        style={{
          transform: `translateY(${-contentOffset}px)`,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 px-4 py-2 bg-primary/10 border-primary/30 text-primary">
            <Sparkles className="w-3 h-3 mr-2" />
            Plataforma de Criação Visual #1 do Brasil
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 text-center leading-tight"
        >
          <span className="bg-gradient-to-r from-primary via-[#6366F1] to-secondary bg-clip-text text-transparent">
            Crie produtos, fotos profissionais, influenciadores, artistas e animações
          </span>
          <br />
          <span className="text-foreground">— tudo em um único lugar.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-10 font-light tracking-wide max-w-4xl mx-auto px-2 text-center"
        >
          A ferramenta de criação visual mais completa do Brasil. 
          Potencialize sua marca com IA generativa de última geração.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button 
            size="lg"
            className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300 shadow-2xl shadow-primary/50 touch-manipulation"
            onClick={() => navigate("/login")}
          >
            Começar agora
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 rounded-full border-primary/30 hover:bg-primary/10 touch-manipulation gap-2"
            onClick={() => navigate("/login")}
          >
            <Play className="w-5 h-5" />
            Testar grátis por 7 dias
          </Button>
        </motion.div>

        {/* Showcase Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <div className="flex justify-center gap-2 md:gap-4 mb-6">
            {showcaseItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setActiveShowcase(index)}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full transition-all duration-300 ${
                  activeShowcase === index
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs md:text-sm font-medium hidden sm:block">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {(() => {
                  const IconComponent = showcaseItems[activeShowcase].icon;
                  return <IconComponent className="w-16 h-16 mx-auto mb-4 text-primary" />;
                })()}
                <p className="text-xl font-semibold">{showcaseItems[activeShowcase].label}</p>
                <p className="text-muted-foreground mt-2">Crie conteúdo incrível com IA</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Plans Section */}
      <div id="planos" className="relative z-10 py-20 px-4 md:px-6 bg-gradient-to-b from-transparent to-background/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-secondary/10 border-secondary/30 text-secondary">
              Planos
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comece com 7 dias grátis em qualquer plano. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`relative overflow-hidden border-2 ${
                  plan.popular 
                    ? "border-primary shadow-2xl shadow-primary/20" 
                    : "border-border/50"
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">R$ {plan.price}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-success flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => navigate("/login")}
                    >
                      Testar grátis por 7 dias
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
