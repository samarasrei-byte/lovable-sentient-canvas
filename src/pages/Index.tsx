import { EmotionSection } from "@/components/EmotionSection";
import { InfluencerGrid } from "@/components/InfluencerGrid";
import { MarketplaceOverview } from "@/components/MarketplaceOverview";
import { CreatorStudio } from "@/components/CreatorStudio";
import { LoveEconomy } from "@/components/LoveEconomy";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <EmotionSection />
      <InfluencerGrid />
      <MarketplaceOverview />
      <CreatorStudio />
      <LoveEconomy />
      <Manifesto />
      <Footer />
    </div>
  );
};

export default Index;
