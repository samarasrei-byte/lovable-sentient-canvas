import { Hero } from "@/components/Hero";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
import { TalentShowcase } from "@/components/TalentShowcase";
import { InfluencerGrid } from "@/components/InfluencerGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveShop } from "@/components/LiveShop";
import { MarketplaceOverview } from "@/components/MarketplaceOverview";
import { Pricing } from "@/components/Pricing";
import { TrustedBrands } from "@/components/TrustedBrands";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <OnboardingQuiz />
      <TalentShowcase />
      <InfluencerGrid />
      <HowItWorks />
      <LiveShop />
      <MarketplaceOverview />
      <Pricing />
      <TrustedBrands />
      <Manifesto />
      <Footer />
    </div>
  );
};

export default Index;
