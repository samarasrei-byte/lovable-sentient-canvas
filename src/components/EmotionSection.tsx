import interface3d from "@/assets/interface-3d.jpg";
import { Button } from "@/components/ui/button";

export const EmotionSection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl animate-pulse" />
            <img 
              src={interface3d}
              alt="3D Interface"
              className="relative rounded-3xl shadow-2xl border border-primary/20 animate-float"
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              We build{" "}
              <span className="text-primary animate-glow">love</span>,{" "}
              <span className="text-muted-foreground">not code.</span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              ARCANA transforma emoções em experiências digitais vivas.
            </p>

            <Button 
              size="lg"
              variant="outline"
              className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary text-lg px-8"
            >
              Experimente criar com o coração
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
