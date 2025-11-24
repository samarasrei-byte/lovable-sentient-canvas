import { Hero } from "@/components/Hero";
import { AvatarGenerator } from "@/components/AvatarGenerator";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
import { TalentShowcase } from "@/components/TalentShowcase";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveShop } from "@/components/LiveShop";
import { MarketplaceOverview } from "@/components/MarketplaceOverview";
import { SuccessCases } from "@/components/SuccessCases";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { TrustedBrands } from "@/components/TrustedBrands";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <TalentShowcase />
      <AvatarGenerator />
      <MarketplaceGrid />
      <MarketplaceOverview />
      <OnboardingQuiz />
      <HowItWorks />
      <LiveShop />
      <SuccessCases />
      <Testimonials />
      <Pricing />
      <TrustedBrands />
      <Manifesto />
      <Footer />
    </div>
  );
};

export default Index;
