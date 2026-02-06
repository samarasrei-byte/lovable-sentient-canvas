import { HeroArcana2 } from "@/components/HeroArcana2";
import { PromptMarketplace } from "@/components/PromptMarketplace";
import { InfluencerMarketplaceComingSoon } from "@/components/InfluencerMarketplaceComingSoon";
import { HowItWorksNew } from "@/components/HowItWorksNew";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
      
      {/* Main Content - Prompt Marketplace Focus */}
      <HeroArcana2 />
      
      {/* Active Prompt Marketplace */}
      <PromptMarketplace />
      
      {/* Influencer Marketplace - Coming Soon */}
      <InfluencerMarketplaceComingSoon />
      
      {/* How It Works */}
      <HowItWorksNew />
      
      {/* FAQ */}
      <FAQSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
