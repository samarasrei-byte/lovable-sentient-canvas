import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, TrendingUp, ShoppingBag, Target, Sparkles, Briefcase, Palette } from "lucide-react";

export const MarketplaceOverview = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background opacity-50" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🔥 Visão Geral
          </h2>
        </div>

        {/* Duas Dimensões */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            👥 Duas Dimensões do Marketplace
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Influenciadores Reais */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/50">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">🧍‍♀️ Influenciadores Reais</CardTitle>
                <CardDescription>Criadores autênticos com comunidades já estabelecidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Perfil com métricas integradas (seguidores, engajamento, taxa de conversão, dados de vendas na TikTok Shop e Instagram)</p>
                <p>• Ferramentas para conectar facilmente marcas a creators por nicho, estilo, linguagem e público</p>
                <p>• Possibilidade de integrar contratos, recebimentos e resultados em um dashboard</p>
              </CardContent>
            </Card>

            {/* Avatares Digitais */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-secondary/20 hover:border-secondary/50">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">🤖 Avatares Digitais / Influencers Virtuais</CardTitle>
                <CardDescription>Avatares 3D ou 2D personalizáveis com identidades únicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Avatares 3D ou 2D personalizáveis, com identidades e estilos únicos</p>
                <p>• Podem representar a marca em campanhas, vídeos e lives</p>
                <p>• Gerados e administrados pela sua equipe ou pelos próprios usuários</p>
                <p>• Suporte a IA para responder, interagir e gerar conteúdo automatizado</p>
                <p>• Conexão com ambientes de realidade aumentada (AR) e metaverso</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diferenciais Inovadores */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            💡 Diferenciais Inovadores
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <Target className="w-10 h-10 text-accent mb-4" />
                <CardTitle className="text-xl">Marketplace Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Sistema de IA que recomenda influenciadores ideais baseado em:</p>
                <p>• Público-alvo</p>
                <p>• Estilo de comunicação</p>
                <p>• Histórico de campanhas</p>
                <p>• Emoções e tom de voz</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <ShoppingBag className="w-10 h-10 text-accent mb-4" />
                <CardTitle className="text-xl">Live Shop Integrado</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Integração com TikTok Shop, Instagram Live Shopping e YouTube Shopping</p>
                <p>• Lives de vendas dentro da plataforma</p>
                <p>• Analytics de conversão em tempo real</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <Briefcase className="w-10 h-10 text-accent mb-4" />
                <CardTitle className="text-xl">Consultoria Estratégica</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Matching de marcas e creators</p>
                <p>• Planejamento de campanhas omnichannel</p>
                <p>• Criação de narrativas para ambos os mundos</p>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Fluxo de Uso */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            💼 Fluxo de Uso
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {[
                    { step: "1", text: "Marcas se cadastram → Informam objetivos, público e orçamento" },
                    { step: "2", text: "IA recomenda influenciadores reais e/ou avatares adequados" },
                    { step: "3", text: "Negociação e contratação via chat interno com consultoria integrada" },
                    { step: "4", text: "Execução de campanha (post, live, collab, etc)" },
                    { step: "5", text: "Analytics unificado: engajamento, ROI, conversão, feedback" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <p className="text-lg text-foreground pt-2">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monetização */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            🚀 Potencial de Monetização
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              "Comissão sobre transações (campanhas e lives)",
              "Taxa de criação e customização de avatares",
              "Assinaturas para marcas com acesso premium",
              "Licenciamento de tecnologia white-label"
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-8 pb-8">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
