import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentModal } from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  MapPin,
  Users,
  TrendingUp,
  Instagram,
  Youtube,
  DollarSign,
  Shield,
  MessageCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";
import influencerArt from "@/assets/influencer-art.jpg";

// Mock data for display only
const mockData: Record<string, any> = {
  "Tech": { image: influencerTech, portfolio: [influencerTech, influencerBusiness, influencerFitness] },
  "Fitness": { image: influencerFitness, portfolio: [influencerFitness, influencerWellness, influencerTech] },
  "Fashion": { image: influencerFashion, portfolio: [influencerFashion, influencerTravel, influencerArt] },
  "Business": { image: influencerBusiness, portfolio: [influencerBusiness, influencerTech, influencerFashion] },
  "Wellness": { image: influencerWellness, portfolio: [influencerWellness, influencerFitness, influencerTravel] },
  "Travel": { image: influencerTravel, portfolio: [influencerTravel, influencerFashion, influencerArt] },
  "Art": { image: influencerArt, portfolio: [influencerArt, influencerFashion, influencerWellness] },
};

const mockReviews = [
  { name: "Cliente A", rating: 5, comment: "Excelente trabalho! Resultados acima do esperado.", date: "Há 2 semanas" },
  { name: "Cliente B", rating: 5, comment: "Muito profissional e criativo. Recomendo!", date: "Há 1 mês" },
  { name: "Cliente C", rating: 4, comment: "Ótima comunicação e entrega no prazo.", date: "Há 2 meses" },
];

const PerfilTalento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [influencer, setInfluencer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfluencer();
  }, [id]);

  const loadInfluencer = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("influencers")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Influenciador não encontrado",
      });
      navigate("/app/talentos");
      return;
    }

    setInfluencer(data);
    setLoading(false);
  };

  const handlePaymentSuccess = (contractId: string) => {
    toast({
      title: "Contrato criado!",
      description: "Redirecionando para seus contratos...",
    });
    navigate(`/app/contratos`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Influenciador não encontrado</h2>
        <Button onClick={() => navigate("/app/talentos")}>Voltar para Talentos</Button>
      </div>
    );
  }

  const categoryData = mockData[influencer.category] || mockData["Tech"];
  const avgRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;

  return (
    <div className="min-h-screen p-6 space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/app/talentos")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Talentos
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 p-6">
          <div className="space-y-6">
            <div className="relative">
              <img
                src={categoryData.image}
                alt="Influencer"
                className="w-full aspect-square object-cover rounded-2xl"
              />
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-2 rounded-full">
                <Star className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{influencer.stage_name}</h1>
                <p className="text-muted-foreground">{influencer.category}</p>
              </div>

              <Badge variant="outline" className="w-fit">Avatar Profissional</Badge>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Seguidores</div>
                  <div className="text-lg font-bold flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {influencer.followers_count.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Engajamento</div>
                  <div className="text-lg font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {influencer.engagement_rate}%
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                <DollarSign className="h-6 w-6" />
                R$ {influencer.price_per_post.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">/ post</span>
              </div>

              <Button 
                onClick={() => setPaymentModalOpen(true)}
                size="lg" 
                className="w-full"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contratar e Desbloquear Chat
              </Button>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Proteção Arcana</p>
                    <p className="text-xs text-muted-foreground">
                      Para sua segurança, a imagem mostrada é ilustrativa. 
                      Após o pagamento, você terá acesso ao chat com o influenciador real.
                    </p>
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Tentativas de contato externo são monitoradas por IA e resultam em banimento.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Sobre</h2>
            <p className="text-muted-foreground leading-relaxed">
              {influencer.bio || `Especialista em ${influencer.category} com ampla experiência em criação de conteúdo de alta qualidade. Focado em entregar resultados excepcionais para marcas que buscam impacto real.`}
            </p>
          </Card>

          {/* Portfolio Gallery */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Galeria de Trabalhos Anteriores</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryData.portfolio.map((work: string, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square group overflow-hidden rounded-lg cursor-pointer"
                >
                  <img
                    src={work}
                    alt={`Trabalho ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Avaliações de Clientes</h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({mockReviews.length} avaliações)</span>
              </div>
            </div>
            <div className="space-y-4">
              {mockReviews.map((review, i) => (
                <div key={i} className="border-b border-border/50 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        influencerId={influencer.id}
        influencerName={influencer.stage_name}
        pricePerPost={influencer.price_per_post}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PerfilTalento;
