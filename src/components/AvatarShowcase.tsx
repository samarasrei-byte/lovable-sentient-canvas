import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const avatars = [
  {
    name: "AVA-01",
    trait: "Empatia",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "LEX-02",
    trait: "Criatividade",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-600",
  },
  {
    name: "SORA-03",
    trait: "Autoconfiança",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
  },
];

export const AvatarShowcase = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Avatares com alma.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Eles não são programas. São presenças.
          </p>
        </div>

        {/* Avatar Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {avatars.map((avatar, index) => {
            const Icon = avatar.icon;
            return (
              <Card 
                key={avatar.name}
                className="relative overflow-hidden bg-card/50 backdrop-blur-xl border-primary/20 p-8 hover:scale-105 transition-transform duration-500 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${avatar.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breathe">
                    <Icon className="w-12 h-12 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative text-center space-y-2">
                  <h3 className="text-2xl font-bold">{avatar.name}</h3>
                  <p className="text-muted-foreground text-lg">{avatar.trait}</p>
                </div>

                {/* Pulse Effect */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform text-lg px-10"
          >
            Adote um avatar
          </Button>
        </div>
      </div>
    </section>
  );
};
