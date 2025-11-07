import { Card } from "@/components/ui/card";
import { Mic, Wand2 } from "lucide-react";

export const CreatorStudio = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Feel. Speak. Create.
          </h2>
          <p className="text-xl text-muted-foreground">
            O coração da experiência.
          </p>
        </div>

        {/* Studio Panel */}
        <Card className="relative overflow-hidden bg-card/30 backdrop-blur-2xl border-primary/30 p-12">
          {/* Animated Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-shimmer bg-[length:200%_100%]" />
          
          <div className="relative space-y-8">
            {/* Voice Input */}
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-background/50 border border-primary/20">
              <Mic className="w-8 h-8 text-primary animate-pulse" />
              <p className="text-lg text-muted-foreground italic">
                "quero uma marca que transmita calma e futuro."
              </p>
            </div>

            {/* AI Processing */}
            <div className="flex items-center justify-center py-8">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <Wand2 className="w-6 h-6 text-secondary animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm uppercase tracking-wider text-secondary">
                  Gerando design ao vivo
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="h-4 bg-primary/20 rounded-full w-3/4 animate-pulse" />
                <div className="h-4 bg-secondary/20 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="h-4 bg-primary/20 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
