import { Hero } from "@/components/Hero";
import { EmotionSection } from "@/components/EmotionSection";
import { AvatarShowcase } from "@/components/AvatarShowcase";
import { CreatorStudio } from "@/components/CreatorStudio";
import { LoveEconomy } from "@/components/LoveEconomy";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <EmotionSection />
      <AvatarShowcase />
      <CreatorStudio />
      <LoveEconomy />
      <Manifesto />
      <Footer />
    </div>
  );
};

export default Index;
