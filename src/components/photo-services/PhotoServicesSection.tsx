import { useState, useEffect } from "react";
import { Camera, Baby, Briefcase, Upload, Sparkles, Users, Wand2 } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PhotoServiceModal } from "./PhotoServiceModal";

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
  const [services, setServices] = useState<PhotoService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<PhotoService | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("photo_services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      const parsedServices = (data || []).map((s: any) => ({
        ...s,
        themes: Array.isArray(s.themes) ? s.themes : JSON.parse(s.themes || '[]'),
        features: Array.isArray(s.features) ? s.features : JSON.parse(s.features || '[]')
      }));
      
      setServices(parsedServices);
    } catch (error) {
      console.error("Error fetching photo services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {services.map((service) => {
            const Icon = getCategoryIcon(service.category);
            const isMesversario = service.category === 'mesversario' || service.category === 'foto_infantil';
            
            return (
              <GlassCard key={service.id} className="h-full group hover:border-secondary/40 transition-all duration-300 overflow-hidden">
                <GlassCardContent className="p-6 md:p-8 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center border border-secondary/30">
                        <Icon className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{service.name}</h3>
                        <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                          {service.themes.length} temas disponíveis
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">{formatPrice(service.price_cents)}</div>
                      <div className="text-xs text-muted-foreground">pacote completo</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Alguns temas:</div>
                    <div className="flex flex-wrap gap-2">
                      {service.themes.slice(0, 4).map((theme) => (
                        <span key={theme.id} className="px-3 py-1 rounded-full bg-muted/50 text-xs text-foreground/70 border border-border">
                          {theme.name}
                        </span>
                      ))}
                      {service.themes.length > 4 && (
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-xs text-primary border border-primary/30">
                          +{service.themes.length - 4} mais
                        </span>
                      )}
                    </div>
                  </div>

                  <GlassButton variant="neon" className="w-full" onClick={() => setSelectedService(service)}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isMesversario ? 'Criar Minha Foto Infantil' : 'Gerar Minha Foto Profissional'}
                  </GlassButton>
                </GlassCardContent>
              </GlassCard>
            );
          })}
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
