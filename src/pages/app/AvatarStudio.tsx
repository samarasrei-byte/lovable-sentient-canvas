import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Video, Sparkles, Package, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AvatarStudio() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é vídeo e duração (2 minutos = 120 segundos)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 120) {
          toast({
            title: "Vídeo muito longo",
            description: "O vídeo deve ter no máximo 2 minutos",
            variant: "destructive"
          });
          return;
        }
        setVideoFile(file);
        toast({
          title: "Vídeo carregado!",
          description: `${file.name} - ${(video.duration / 60).toFixed(1)} minutos`
        });
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleCreateAvatar = async () => {
    if (!videoFile) {
      toast({
        title: "Nenhum vídeo selecionado",
        description: "Por favor, faça upload de um vídeo primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    // Aqui será integrado com HeyGen posteriormente
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Avatar em processamento!",
        description: "Você receberá uma notificação quando estiver pronto"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Avatar Studio
              </h1>
              <p className="text-muted-foreground">Crie avatares realistas com IA para seus produtos e campanhas</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="create" className="gap-2">
              <Video className="w-4 h-4" />
              Criar Avatar
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Produtos & Avatares
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Criar Avatar */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload do Vídeo
                  </CardTitle>
                  <CardDescription>
                    Envie um vídeo de até 2 minutos para criar seu avatar digital
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/60 transition-colors bg-primary/5">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <Label htmlFor="video-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Video className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold mb-1">
                            {videoFile ? videoFile.name : "Clique para fazer upload"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            MP4, MOV, AVI (máx. 2 minutos)
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {videoFile && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Vídeo pronto para processamento</p>
                        <p className="text-sm text-muted-foreground">{videoFile.name}</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleCreateAvatar}
                    disabled={!videoFile || isProcessing}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Criar Avatar IA
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Guia e Exemplos */}
              <Card className="border-2 border-secondary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-secondary" />
                    Como Gravar seu Vídeo
                  </CardTitle>
                  <CardDescription>
                    Siga estas dicas para obter o melhor resultado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Iluminação adequada</p>
                        <p className="text-sm text-muted-foreground">Use luz natural ou iluminação frontal uniforme</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Fundo neutro</p>
                        <p className="text-sm text-muted-foreground">Prefira fundos lisos e sem distrações</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Posicionamento frontal</p>
                        <p className="text-sm text-muted-foreground">Fique de frente para a câmera, busto e rosto visíveis</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Fale naturalmente</p>
                        <p className="text-sm text-muted-foreground">Demonstre diferentes expressões e movimentos</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Qualidade HD</p>
                        <p className="text-sm text-muted-foreground">Grave em 1080p ou superior para melhor resultado</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-200">Importante</p>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        O processamento pode levar de 15 a 30 minutos. Você receberá notificação quando estiver pronto.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exemplos Visuais */}
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Exemplos de Vídeos Ideais</CardTitle>
                <CardDescription>Referências visuais para gravação perfeita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="font-bold text-green-700 dark:text-green-400">✓ Correto</p>
                        <p className="text-xs text-muted-foreground mt-1">Boa iluminação<br/>Fundo limpo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="font-bold text-green-700 dark:text-green-400">✓ Correto</p>
                        <p className="text-xs text-muted-foreground mt-1">Posição frontal<br/>Expressivo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-red-500/50 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                        <p className="font-bold text-red-700 dark:text-red-400">✗ Evitar</p>
                        <p className="text-xs text-muted-foreground mt-1">Pouca luz<br/>Fundo confuso</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Produtos & Avatares */}
          <TabsContent value="products" className="space-y-6">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Adicionar Novo Produto
                </CardTitle>
                <CardDescription>
                  Cadastre produtos para criar avatares promocionais automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Nome do Produto</Label>
                      <Input id="product-name" placeholder="Ex: Tênis Esportivo Premium" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Categoria</Label>
                      <Input id="product-category" placeholder="Ex: Calçados, Moda, Tech" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-description">Descrição do Produto</Label>
                    <Textarea 
                      id="product-description" 
                      placeholder="Descreva as principais características e benefícios do produto..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-image">Imagem do Produto</Label>
                    <Input type="file" id="product-image" accept="image/*" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-script">Script Promocional (Opcional)</Label>
                    <Textarea 
                      id="product-script" 
                      placeholder="O que seu avatar deve dizer sobre este produto? Escreva um roteiro curto e envolvente..."
                      rows={3}
                    />
                  </div>

                  <Button className="w-full" size="lg">
                    <Package className="w-4 h-4 mr-2" />
                    Salvar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Produtos */}
            <div>
              <h3 className="text-xl font-bold mb-4">Seus Produtos</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Produto Exemplo 1 */}
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-1">Produto Exemplo</h4>
                    <p className="text-sm text-muted-foreground mb-3">Categoria: Demo</p>
                    <Button variant="outline" className="w-full" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Avatar com Produto
                    </Button>
                  </CardContent>
                </Card>

                {/* Card Add New */}
                <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors cursor-pointer bg-primary/5">
                  <CardContent className="h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Package className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-medium text-primary">Adicionar Produto</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
