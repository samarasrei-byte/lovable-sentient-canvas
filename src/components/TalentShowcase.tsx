import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Bot, Palette } from "lucide-react";

export const TalentShowcase = () => {
  const talents = [
    {
      icon: Users,
      title: "Influenciadores reais",
      description: "Conecte-se a vozes autênticas que geram resultados reais.",
      cta: "Ver influenciadores",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: Bot,
      title: "Avatares digitais",
      description: "Experimente campanhas com personagens virtuais e tecnologia 3D.",
      cta: "Conhecer avatares",
      gradient: "from-secondary/20 to-secondary/5"
    },
    {
      icon: Palette,
      title: "Artistas",
      description: "Descubra criadores que transformam ideias em expressões visuais e emocionais.",
      cta: "Explorar artistas",
      gradient: "from-accent/20 to-accent/5"
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-6">
          Três dimensões, um mesmo propósito
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground text-center mb-16 font-light">
          Potencializar sua marca.
        </p>

        {/* Talent Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {talents.map((talent, index) => (
            <Card 
              key={index}
              className="group hover:scale-105 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${talent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10">
                <div className="mb-4">
                  <talent.icon className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
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
          ))}
        </div>
      </div>
    </section>
  );
};
