import { Hero } from "@/components/Hero";
import { TalentShowcase } from "@/components/TalentShowcase";
import { InfluencerGrid } from "@/components/InfluencerGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveShop } from "@/components/LiveShop";
import { MarketplaceOverview } from "@/components/MarketplaceOverview";
import { TrustedBrands } from "@/components/TrustedBrands";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <TalentShowcase />
      <InfluencerGrid />
      <HowItWorks />
      <LiveShop />
      <MarketplaceOverview />
      <TrustedBrands />
      <Manifesto />
      <Footer />
    </div>
  );
};

export default Index;
