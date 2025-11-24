import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Star, MapPin, Users, TrendingUp, Mail, Phone, MessageSquare, Instagram, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";
import influencerWellness from "@/assets/influencer-wellness.jpg";
import influencerTravel from "@/assets/influencer-travel.jpg";
import influencerArt from "@/assets/influencer-art.jpg";

// Mock data - in production, this would come from database
const talentsData: Record<string, any> = {
  "luna-ai": {
    name: "Luna AI",
    category: "Fashion",
    type: "avatar",
    followers: "500K",
    engagement: "8.5%",
    bio: "Avatar IA especializada em moda e lifestyle. Criando conteúdo autêntico e inspirador para marcas modernas.",
    location: "São Paulo, BR",
    verified: true,
    image: influencerFashion,
    portfolio: [influencerFashion, influencerTech, influencerWellness, influencerTravel, influencerBusiness, influencerFitness],
    social: {
      instagram: "500K",
      twitter: "250K",
      youtube: "180K"
    },
    reviews: [
      { name: "Ana Paula", rating: 5, comment: "Excelente profissional! Resultados acima do esperado.", date: "Há 2 semanas" },
      { name: "Carlos Silva", rating: 5, comment: "Muito comprometida e criativa. Recomendo!", date: "Há 1 mês" },
      { name: "Maria Santos", rating: 4, comment: "Ótima comunicação e entrega no prazo.", date: "Há 2 meses" }
    ]
  },
  "ana-silva": {
    name: "Ana Silva",
    category: "Lifestyle",
    type: "influencer",
    followers: "820K",
    engagement: "9.2%",
    bio: "Influenciadora digital focada em lifestyle autêntico e empoderamento feminino.",
    location: "Rio de Janeiro, BR",
    verified: true,
    image: influencerWellness,
    portfolio: [influencerWellness, influencerFashion, influencerTravel, influencerBusiness, influencerTech, influencerFitness],
    social: {
      instagram: "820K",
      twitter: "320K",
      youtube: "450K"
    },
    reviews: [
      { name: "Beatriz Costa", rating: 5, comment: "Trabalho impecável! Superou todas as expectativas.", date: "Há 1 semana" },
      { name: "João Pedro", rating: 5, comment: "Profissional exemplar. Muito talentosa!", date: "Há 3 semanas" },
      { name: "Luciana Alves", rating: 5, comment: "Excelente ROI nas campanhas. Recomendo muito!", date: "Há 1 mês" }
    ]
  },
  "pedro-costa": {
    name: "Pedro Costa",
    category: "Tech",
    type: "influencer",
    followers: "320K",
    engagement: "7.2%",
    bio: "Tech reviewer e especialista em inovação digital. Ajudando marcas a se conectarem com público tech-savvy.",
    location: "São Paulo, BR",
    verified: false,
    image: influencerTech,
    portfolio: [influencerTech, influencerBusiness, influencerFashion, influencerWellness, influencerTravel, influencerFitness],
    social: {
      instagram: "320K",
      twitter: "450K",
      youtube: "280K"
    },
    reviews: [
      { name: "Rafael Lima", rating: 4, comment: "Muito bom! Conhecimento técnico sólido.", date: "Há 2 semanas" },
      { name: "Fernanda Souza", rating: 5, comment: "Excelente parceria. Muito profissional.", date: "Há 1 mês" }
    ]
  },
  "rafael-costa": {
    name: "Rafael Costa",
    category: "Tecnologia & IA",
    type: "influencer",
    followers: "2.5M",
    engagement: "12.4%",
    bio: "Tech expert especializado em IA e inovação. Ajudando marcas a comunicarem tecnologia de forma acessível.",
    location: "São Paulo, BR",
    verified: true,
    image: influencerTech,
    portfolio: [influencerTech, influencerBusiness, influencerFitness, influencerFashion, influencerWellness, influencerArt],
    social: {
      instagram: "2.5M",
      twitter: "890K",
      youtube: "1.2M"
    },
    reviews: [
      { name: "Tech Corp", rating: 5, comment: "Excelente profissional! Entende profundamente de tecnologia.", date: "Há 1 semana" },
      { name: "Innovation Labs", rating: 5, comment: "Resultados incríveis nas campanhas. ROI excepcional!", date: "Há 3 semanas" },
      { name: "Digital Agency", rating: 5, comment: "Comunicação clara e resultados mensuráveis.", date: "Há 2 meses" }
    ]
  },
  "camila-rodrigues": {
    name: "Camila Rodrigues",
    category: "Moda & Lifestyle",
    type: "influencer",
    followers: "4.8M",
    engagement: "15.2%",
    bio: "Fashion influencer com foco em lifestyle moderno e sustentável. Criando conteúdo inspirador para marcas de moda.",
    location: "Rio de Janeiro, BR",
    verified: true,
    image: influencerFashion,
    portfolio: [influencerFashion, influencerWellness, influencerTravel, influencerArt, influencerTech, influencerBusiness],
    social: {
      instagram: "4.8M",
      twitter: "1.2M",
      youtube: "890K"
    },
    reviews: [
      { name: "Fashion Brand", rating: 5, comment: "Profissionalismo impecável. Sempre entrega além do esperado.", date: "Há 2 dias" },
      { name: "Lifestyle Co", rating: 5, comment: "Trabalho de altíssima qualidade. Recomendo!", date: "Há 1 mês" },
      { name: "Style Magazine", rating: 5, comment: "Criatividade e profissionalismo em cada projeto.", date: "Há 2 meses" }
    ]
  },
  "bruno-almeida": {
    name: "Bruno Almeida",
    category: "Fitness & Saúde",
    type: "influencer",
    followers: "3.2M",
    engagement: "10.8%",
    bio: "Personal trainer e especialista em saúde. Transformando vidas através de fitness e bem-estar.",
    location: "São Paulo, BR",
    verified: true,
    image: influencerFitness,
    portfolio: [influencerFitness, influencerWellness, influencerBusiness, influencerTech, influencerFashion, influencerArt],
    social: {
      instagram: "3.2M",
      twitter: "680K",
      youtube: "1.5M"
    },
    reviews: [
      { name: "Fitness Brand", rating: 5, comment: "Excelente parceiro! Engajamento autêntico e resultados comprovados.", date: "Há 1 semana" },
      { name: "Health Corp", rating: 5, comment: "Profissional dedicado e muito competente.", date: "Há 3 semanas" }
    ]
  },
  "joao-silva": {
    name: "João Silva",
    category: "Negócios & Startups",
    type: "influencer",
    followers: "1.9M",
    engagement: "9.5%",
    bio: "Empreendedor serial e mentor de startups. Compartilhando insights sobre negócios e inovação.",
    location: "São Paulo, BR",
    verified: true,
    image: influencerBusiness,
    portfolio: [influencerBusiness, influencerTech, influencerFashion, influencerWellness, influencerFitness, influencerArt],
    social: {
      instagram: "1.9M",
      twitter: "950K",
      youtube: "780K"
    },
    reviews: [
      { name: "Startup Hub", rating: 5, comment: "Conhecimento profundo de negócios. Excelente comunicador.", date: "Há 5 dias" },
      { name: "Business Weekly", rating: 5, comment: "Conteúdo de alta qualidade e muito engajamento.", date: "Há 2 semanas" }
    ]
  },
  "ana-beatriz": {
    name: "Ana Beatriz",
    category: "Arte Digital & NFT",
    type: "artist",
    followers: "2.1M",
    engagement: "14.2%",
    bio: "Artista digital pioneira em NFTs. Criando arte que conecta tecnologia e emoção.",
    location: "São Paulo, BR",
    verified: true,
    image: influencerArt,
    portfolio: [influencerArt, influencerFashion, influencerTech, influencerWellness, influencerBusiness, influencerFitness],
    social: {
      instagram: "2.1M",
      twitter: "850K",
      youtube: "420K"
    },
    reviews: [
      { name: "Art Gallery", rating: 5, comment: "Talento excepcional! Trabalho único e impactante.", date: "Há 3 dias" },
      { name: "NFT Platform", rating: 5, comment: "Visão artística impressionante. Muito profissional.", date: "Há 1 mês" }
    ]
  },
  "maria-santos": {
    name: "Maria Santos",
    category: "Bem-estar & Mindfulness",
    type: "influencer",
    followers: "3.5M",
    engagement: "11.8%",
    bio: "Especialista em bem-estar e mindfulness. Ajudando pessoas a encontrarem equilíbrio e paz interior.",
    location: "Rio de Janeiro, BR",
    verified: true,
    image: influencerWellness,
    portfolio: [influencerWellness, influencerFashion, influencerTravel, influencerArt, influencerFitness, influencerBusiness],
    social: {
      instagram: "3.5M",
      twitter: "1.1M",
      youtube: "980K"
    },
    reviews: [
      { name: "Wellness Brand", rating: 5, comment: "Autenticidade e conexão genuína com a audiência.", date: "Há 1 semana" },
      { name: "Health Magazine", rating: 5, comment: "Conteúdo inspirador e de grande impacto.", date: "Há 2 semanas" }
    ]
  }
};

export default function PerfilTalento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const talent = talentsData[id || ""] || talentsData["luna-ai"];

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/app/talentos")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Talentos
      </Button>

      {/* Header Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 p-6 bg-card/60 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={talent.image}
                alt={talent.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
              {talent.verified && (
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-2 rounded-full">
                  <Star className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{talent.name}</h1>
                <p className="text-muted-foreground">{talent.category}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {talent.location}
              </div>

              <Badge variant="outline" className="w-fit">
                {talent.type === "avatar" ? "Avatar IA" : "Influencer"}
              </Badge>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Seguidores</div>
                  <div className="text-lg font-bold">{talent.followers}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Engajamento</div>
                  <div className="text-lg font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {talent.engagement}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Redes Sociais</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span>Instagram</span>
                    </div>
                    <span className="text-muted-foreground">{talent.social.instagram}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span>Twitter</span>
                    </div>
                    <span className="text-muted-foreground">{talent.social.twitter}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube</span>
                    </div>
                    <span className="text-muted-foreground">{talent.social.youtube}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Sobre</h2>
            <p className="text-muted-foreground leading-relaxed">{talent.bio}</p>
          </Card>

          {/* Portfolio Gallery */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Galeria de Trabalhos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {talent.portfolio.map((work: string, i: number) => (
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
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Avaliações</h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">
                  {(talent.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / talent.reviews.length).toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm">({talent.reviews.length} avaliações)</span>
              </div>
            </div>
            <div className="space-y-4">
              {talent.reviews.map((review: any, i: number) => (
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

          {/* Contact Form */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Entre em Contato</h2>
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Telefone</label>
                <Input
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Mensagem</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Descreva seu projeto ou dúvida..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
