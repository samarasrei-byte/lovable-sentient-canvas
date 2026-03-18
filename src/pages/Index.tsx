import { HeroArcana2 } from "@/components/HeroArcana2";
import { SocialProofBanner } from "@/components/landing/SocialProofBanner";
import { PromptMarketplace } from "@/components/marketplace";
import { UpgradeUpsell } from "@/components/landing/UpgradeUpsell";
import { PhotoServicesSection } from "@/components/photo-services";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { HowItWorksNew } from "@/components/HowItWorksNew";
import { FAQSection } from "@/components/FAQSection";
import { PlansSection } from "@/components/PlansSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
      
      {/* Hero Section */}
      <HeroArcana2 />
      
      {/* Social Proof Stats */}
      <SocialProofBanner />
      
      {/* Marketplace de Talentos — Oculto temporariamente */}
      {/* <InfluencerMarketplaceComingSoon /> */}
      
      {/* Prompt Marketplace - Galeria de Elite */}
      <PromptMarketplace />
      
      {/* Photo Services - Upload de Fotos IA */}
      <PhotoServicesSection />
      
      {/* Value Proposition */}
      <ValueProposition />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Planos */}
      <PlansSection />
      
      {/* How It Works */}
      <HowItWorksNew />
      
      {/* FAQ */}
      <FAQSection />
      
      {/* Final CTA */}
      <FinalCTA />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
