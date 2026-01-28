import { HeroArcana2 } from "@/components/HeroArcana2";
import { SocialProofStats } from "@/components/SocialProofStats";
import { UnifiedMarketplace } from "@/components/UnifiedMarketplace";
import { ProductShowcase } from "@/components/ProductShowcase";
import { PlansSection } from "@/components/PlansSection";
import { HowItWorksNew } from "@/components/HowItWorksNew";
import { AIStudioPreview } from "@/components/AIStudioPreview";
import { SuccessCases } from "@/components/SuccessCases";
import { Testimonials } from "@/components/Testimonials";
import { FAQSection } from "@/components/FAQSection";
import { TrustedBrands } from "@/components/TrustedBrands";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
      
      {/* Main Content - High Conversion Landing */}
      <HeroArcana2 />
      <SocialProofStats />
      <UnifiedMarketplace />
      <ProductShowcase />
      <PlansSection />
      <HowItWorksNew />
      <AIStudioPreview />
      <SuccessCases />
      <Testimonials />
      <FAQSection />
      <TrustedBrands />
      <Footer />
    </div>
  );
};

export default Index;
