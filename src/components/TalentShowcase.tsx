import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Users, Palette } from "lucide-react";

export const TalentShowcase = () => {
  const talents = [
    {
      icon: Bot,
      title: "Avatares IA",
      description: "Crie influenciadores digitais sob medida com IA generativa. Controle total sobre voz, estilo e personalidade.",
      cta: "Criar avatar",
      gradient: "from-primary/20 to-primary/5",
      bgClass: "bg-gradient-to-br from-primary/10 to-transparent",
      glowColor: "primary"
    },
    {
      icon: Users,
      title: "Influenciadores reais",
      description: "Conecte-se a vozes autênticas que geram resultados reais com comunidades estabelecidas.",
      cta: "Ver influenciadores",
      gradient: "from-secondary/20 to-secondary/5",
      bgClass: "bg-gradient-to-br from-secondary/10 to-transparent",
      glowColor: "secondary"
    },
    {
      icon: Palette,
      title: "Artistas",
      description: "Curadoria premium para colaborações criativas de alto impacto. Exclusivo Enterprise.",
      cta: "Conhecer artistas",
      gradient: "from-orange-500/20 to-orange-500/5",
      bgClass: "bg-gradient-to-br from-orange-500/10 to-transparent",
      glowColor: "orange-500"
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-secondary to-orange-500 bg-clip-text text-transparent">
          Três Universos
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground text-center mb-4 font-light">
          Infinitas possibilidades para potencializar sua marca.
        </p>
        <p className="text-sm text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
          Avatares IA • Influenciadores Reais • Artistas
        </p>

        {/* Talent Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {talents.map((talent, index) => {
            const Icon = talent.icon;
            const iconColorClass = talent.glowColor === 'primary' ? 'text-primary' : 
                                   talent.glowColor === 'secondary' ? 'text-secondary' : 
                                   'text-orange-500';
            
            return (
              <Card 
                key={index}
                className="group hover:scale-105 transition-all duration-500 border-border/50 backdrop-blur overflow-hidden relative"
              >
                <div className={`absolute inset-0 ${talent.bgClass}`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${talent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="relative z-10">
                  <div className="mb-4">
                    <Icon className={`w-16 h-16 ${iconColorClass} group-hover:scale-110 transition-transform duration-500`} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{talent.title}</CardTitle>
                  <CardDescription className="text-base">
                    {talent.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                  >
                    {talent.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
