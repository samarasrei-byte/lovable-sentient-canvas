import { HeroArcana2 } from "@/components/HeroArcana2";
import { SocialProofBanner } from "@/components/landing/SocialProofBanner";
import { PromptGrid } from "@/components/PromptGrid";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { InfluencerMarketplaceComingSoon } from "@/components/InfluencerMarketplaceComingSoon";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { HowItWorksNew } from "@/components/HowItWorksNew";
import { FAQSection } from "@/components/FAQSection";
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
      
      {/* Active Prompts Grid - Responsive */}
      <PromptGrid />
      
      {/* Value Proposition */}
      <ValueProposition />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Influencer Marketplace - Coming Soon */}
      <InfluencerMarketplaceComingSoon />
      
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
