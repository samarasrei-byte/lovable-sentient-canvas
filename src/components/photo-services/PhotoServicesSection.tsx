import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, Baby, Briefcase, Upload, Users, Wand2 } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PhotoServiceModal } from "./PhotoServiceModal";
import { PremiumServiceCard } from "./PremiumServiceCard";

interface PhotoService {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  themes: Array<{ id: string; name: string; description: string }>;
  price_cents: number;
  features: string[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'mesversario': case 'foto_infantil': return Baby;
    case 'profissional': return Briefcase;
    default: return Camera;
  }
};

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
};

export const PhotoServicesSection = () => {
  const [selectedService, setSelectedService] = useState<PhotoService | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["photo-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photo_services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      return (data || []).map((s: any) => ({
        ...s,
        themes: Array.isArray(s.themes) ? s.themes : JSON.parse(s.themes || '[]'),
        features: Array.isArray(s.features) ? s.features : JSON.parse(s.features || '[]')
      })) as PhotoService[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  if (isLoading) {
    return (
      <section id="photo-services" className="relative py-20 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section id="photo-services" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
            <Camera className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">GERAÇÃO DE FOTOS IA</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Sua Foto, Nossa{" "}
            <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              Magia
            </span>
          </h2>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Envie sua foto e deixe nossa IA criar obras de arte únicas. 
            Perfeito para{" "}
            <span className="text-secondary font-medium">momentos especiais</span> e{" "}
            <span className="text-primary font-medium">branding pessoal</span>.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {services.map((service, index) => (
            <PremiumServiceCard 
              key={service.id} 
              service={service} 
              isFirst={index === 0}
              onClick={() => setSelectedService(service)}
            />
          ))}
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
          {[
            { icon: Upload, label: "Upload Fácil", desc: "Envie suas fotos" },
            { icon: Wand2, label: "IA Avançada", desc: "Consistência facial" },
            { icon: Users, label: "Família Toda", desc: "Inclua todos" },
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 rounded-xl bg-card/50 border border-border hover:border-secondary/30 transition-colors">
              <feature.icon className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-sm font-medium text-foreground">{feature.label}</div>
              <div className="text-xs text-muted-foreground">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <PhotoServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
};
