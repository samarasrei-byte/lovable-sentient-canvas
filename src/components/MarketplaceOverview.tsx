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

        {/* Três Dimensões */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            👥 Três Dimensões do Marketplace
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Avatares IA */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-secondary/20 hover:border-secondary/50">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">🤖 Avatares IA</CardTitle>
                <CardDescription>Ultrarealismo: Avatares realistas e UGC personalizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Avatares ultrarrealistas com identidades e estilos únicos</p>
                <p>• Geração de conteúdo UGC (User Generated Content) autêntico</p>
                <p>• Podem representar a marca em campanhas, vídeos e lives</p>
                <p>• Suporte a IA para responder, interagir e gerar conteúdo automatizado</p>
                <p>• Conexão com ambientes de realidade aumentada (AR) e metaverso</p>
              </CardContent>
            </Card>

            {/* Influenciadores Reais */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/50">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">🧍‍♀️ Influenciadores Reais</CardTitle>
                <CardDescription>Conecte-se a vozes autênticas que geram resultados reais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Criadores com comunidades estabelecidas e engajadas</p>
                <p>• Métricas integradas: seguidores, engajamento, conversão e vendas</p>
                <p>• Conexão por nicho, estilo, linguagem e público-alvo</p>
                <p>• Dashboard unificado para contratos, pagamentos e resultados</p>
              </CardContent>
            </Card>

            {/* Artistas */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-orange-500/20 hover:border-orange-500/50">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8 text-orange-500" />
                </div>
                <CardTitle className="text-2xl">🎨 Artistas</CardTitle>
                <CardDescription>Criadores premium para colaborações de alto impacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Curadoria exclusiva de artistas e criadores de elite</p>
                <p>• Parcerias estratégicas para campanhas de marca premium</p>
                <p>• Especialistas em arte digital, design e conteúdo criativo</p>
                <p>• Colaborações exclusivas para marcas Enterprise</p>
                <p>• Projetos personalizados de alta qualidade e impacto</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diferenciais Inovadores */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            💡 Diferenciais Inovadores
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">IA Inteligente</CardTitle>
                <CardDescription className="text-base">
                  Recomenda talentos com base em dados, propósito e emoção.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-xl mb-3">Live Shop Integrado</CardTitle>
                <CardDescription className="text-base">
                  Venda em tempo real, com criadores e métricas de impacto.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl mb-3">Consultoria Estratégica</CardTitle>
                <CardDescription className="text-base">
                  Planejamento de campanhas que unem humanos e tecnologia.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Fluxo de Uso */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            💼 Como funciona
          </h3>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: "1", icon: "🎯", text: "Cadastre sua marca", desc: "Objetivos e público" },
                { step: "2", icon: "🤖", text: "IA recomenda", desc: "Talentos ideais" },
                { step: "3", icon: "💬", text: "Negocie", desc: "Com consultoria" },
                { step: "4", icon: "🚀", text: "Execute", desc: "Campanha ao vivo" },
                { step: "5", icon: "📊", text: "Acompanhe", desc: "ROI em tempo real" },
              ].map((item) => (
                <Card key={item.step} className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm mx-auto mb-3">
                      {item.step}
                    </div>
                    <p className="font-semibold mb-1">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
