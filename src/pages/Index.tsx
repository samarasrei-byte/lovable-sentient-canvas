import { HeroArcana2 } from "@/components/HeroArcana2";
import { UnifiedMarketplace } from "@/components/UnifiedMarketplace";
import { HowItWorksNew } from "@/components/HowItWorksNew";
import { AIStudioPreview } from "@/components/AIStudioPreview";
import { TalentShowcase } from "@/components/TalentShowcase";
import { AvatarShowcase } from "@/components/AvatarShowcase";
import { SuccessCases } from "@/components/SuccessCases";
import { Testimonials } from "@/components/Testimonials";
import { TrustedBrands } from "@/components/TrustedBrands";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
      
      {/* Main Content - Arcana 2.0 */}
      <HeroArcana2 />
      <UnifiedMarketplace />
      <HowItWorksNew />
      <AIStudioPreview />
      <TalentShowcase />
      <AvatarShowcase />
      <SuccessCases />
      <Testimonials />
      <TrustedBrands />
      <Manifesto />
      <Footer />
    </div>
  );
};

export default Index;
