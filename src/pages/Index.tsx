import { Hero } from "@/components/Hero";
import { AIStudioPreview } from "@/components/AIStudioPreview";
import { TalentShowcase } from "@/components/TalentShowcase";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
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
import { AvatarShowcase } from "@/components/AvatarShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <AIStudioPreview />
      <TalentShowcase />
      <MarketplaceGrid />
      <MarketplaceOverview />
      <OnboardingQuiz />
      <HowItWorks />
      <LiveShop />
      <AvatarShowcase />
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
