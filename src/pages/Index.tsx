import { lazy, Suspense } from "react";
import { HeroArcana2 } from "@/components/HeroArcana2";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { PromptMarketplace } from "@/components/marketplace/PromptMarketplace";
const MassiveGallery = lazy(() => import("@/components/MassiveGallery").then(m => ({ default: m.MassiveGallery })));
const UpgradeUpsell = lazy(() => import("@/components/landing/UpgradeUpsell").then(m => ({ default: m.UpgradeUpsell })));
const PhotoServicesSection = lazy(() => import("@/components/photo-services/PhotoServicesSection").then(m => ({ default: m.PhotoServicesSection })));
const ValueProposition = lazy(() => import("@/components/landing/ValueProposition").then(m => ({ default: m.ValueProposition })));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const HowItWorksNew = lazy(() => import("@/components/HowItWorksNew").then(m => ({ default: m.HowItWorksNew })));
const FAQSection = lazy(() => import("@/components/FAQSection").then(m => ({ default: m.FAQSection })));
const PlansSection = lazy(() => import("@/components/PlansSection").then(m => ({ default: m.PlansSection })));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA").then(m => ({ default: m.FinalCTA })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const SectionFallback = () => <div className="py-20" />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <InstallPrompt />
      <UpdatePrompt />
      
      {/* Hero — loaded eagerly for instant FCP */}
      <HeroArcana2 />
      
      {/* Everything below the fold is lazy loaded */}
      <Suspense fallback={<SectionFallback />}>
        <PromptMarketplace />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <MassiveGallery />
      </Suspense>
      {/* UpgradeUpsell oculto — assinaturas serão lançadas depois */}
      
      <Suspense fallback={<SectionFallback />}>
        <PhotoServicesSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <ValueProposition />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      
      {/* PlansSection oculta — assinaturas serão lançadas depois */}
      
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksNew />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <FinalCTA />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
