import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Video, Sparkles, Package, Play, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url?: string;
}

interface HeyGenVoice {
  voice_id: string;
  name: string;
  language: string;
  gender: string;
}

export default function AvatarStudio() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [avatarName, setAvatarName] = useState("");
  const [avatars, setAvatars] = useState<HeyGenAvatar[]>([]);
  const [voices, setVoices] = useState<HeyGenVoice[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [script, setScript] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAvatarsAndVoices();
  }, []);

  const loadAvatarsAndVoices = async () => {
    setIsLoadingAvatars(true);
    try {
      // Load avatars
      const { data: avatarData, error: avatarError } = await supabase.functions.invoke('heygen-avatar', {
        body: { action: 'list_avatars' }
      });

      if (avatarError) throw avatarError;
      if (avatarData?.data?.avatars) {
        setAvatars(avatarData.data.avatars);
      }

      // Load voices
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('heygen-avatar', {
        body: { action: 'list_voices' }
      });

      if (voiceError) throw voiceError;
      if (voiceData?.data?.voices) {
        // Filter for Portuguese voices
        const ptVoices = voiceData.data.voices.filter((v: HeyGenVoice) => 
          v.language?.toLowerCase().includes('portuguese') || 
          v.language?.toLowerCase().includes('pt')
        );
        setVoices(ptVoices.length > 0 ? ptVoices : voiceData.data.voices.slice(0, 20));
      }
    } catch (error: any) {
      console.error('Error loading avatars/voices:', error);
      toast({
        title: "Aviso",
        description: "Não foi possível carregar avatares. Verifique a configuração da API.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAvatars(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

    if (!avatarName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, dê um nome ao seu avatar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Convert video to base64 and upload to storage
      const reader = new FileReader();
      reader.readAsDataURL(videoFile);
      
      reader.onload = async () => {
        const base64Video = reader.result as string;
        
        // In production, we'd upload to Supabase Storage first
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
        const { data: storageData, error: uploadError } = await supabase.storage
          .from('user-videos')
          .upload(fileName, videoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-videos')
          .getPublicUrl(fileName);

        const { data, error } = await supabase.functions.invoke('heygen-avatar', {
          body: { 
            action: 'create_avatar',
            videoUrl: publicUrl,
            avatarName: avatarName.trim()
          }
        });

        if (error) throw error;

        if (data?.error) {
          toast({
            title: "Erro ao criar avatar",
            description: data.error,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Avatar em processamento!",
            description: "Você receberá uma notificação quando estiver pronto. Isso pode levar alguns minutos."
          });
          
          // Refresh avatar list
          setTimeout(loadAvatarsAndVoices, 5000);
        }
      };
    } catch (error: any) {
      console.error('Error creating avatar:', error);
      toast({
        title: "Erro ao criar avatar",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedAvatar) {
      toast({
        title: "Selecione um avatar",
        description: "Por favor, selecione um avatar para gerar o vídeo",
        variant: "destructive"
      });
      return;
    }

    if (!script.trim()) {
      toast({
        title: "Script obrigatório",
        description: "Por favor, escreva o script para o vídeo",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingVideo(true);
    setVideoStatus("Iniciando geração...");
    
    try {
      const { data, error } = await supabase.functions.invoke('heygen-avatar', {
        body: { 
          action: 'generate_video',
          avatarId: selectedAvatar,
          script: script.trim(),
          voiceId: selectedVoice || undefined
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Erro ao gerar vídeo",
          description: data.error,
          variant: "destructive"
        });
        setVideoStatus(null);
      } else if (data?.data?.video_id) {
        setGeneratedVideoId(data.data.video_id);
        setVideoStatus("Processando...");
        toast({
          title: "Vídeo em geração!",
          description: "O processamento pode levar alguns minutos."
        });
        
        // Start polling for status
        pollVideoStatus(data.data.video_id);
      }
    } catch (error: any) {
      console.error('Error generating video:', error);
      toast({
        title: "Erro ao gerar vídeo",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      setVideoStatus(null);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('heygen-avatar', {
          body: { 
            action: 'check_video_status',
            videoId
          }
        });

        if (error) throw error;

        const status = data?.data?.status;
        setVideoStatus(status === 'completed' ? 'Concluído!' : status === 'failed' ? 'Falhou' : 'Processando...');

        if (status === 'completed' && data?.data?.video_url) {
          setVideoUrl(data.data.video_url);
          toast({
            title: "Vídeo pronto!",
            description: "Seu vídeo foi gerado com sucesso."
          });
        } else if (status === 'failed') {
          toast({
            title: "Falha na geração",
            description: "Ocorreu um erro ao gerar o vídeo. Tente novamente.",
            variant: "destructive"
          });
        } else if (status !== 'completed') {
          // Continue polling
          setTimeout(checkStatus, 10000);
        }
      } catch (error) {
        console.error('Error checking video status:', error);
      }
    };

    checkStatus();
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
              <p className="text-muted-foreground">Crie avatares realistas com IA HeyGen para seus produtos e campanhas</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8">
            <TabsTrigger value="create" className="gap-2">
              <Video className="w-4 h-4" />
              Criar Avatar
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2">
              <Play className="w-4 h-4" />
              Gerar Vídeo
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Produtos
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
                    Envie um vídeo de até 2 minutos para criar seu avatar digital com HeyGen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="avatar-name">Nome do Avatar</Label>
                    <Input
                      id="avatar-name"
                      placeholder="Ex: Meu Avatar Profissional"
                      value={avatarName}
                      onChange={(e) => setAvatarName(e.target.value)}
                    />
                  </div>

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
                    disabled={!videoFile || isProcessing || !avatarName.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Criar Avatar com HeyGen
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
                    Siga estas dicas para obter o melhor resultado com HeyGen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { title: "Iluminação adequada", desc: "Use luz natural ou iluminação frontal uniforme" },
                      { title: "Fundo neutro", desc: "Prefira fundos lisos e sem distrações" },
                      { title: "Posicionamento frontal", desc: "Fique de frente para a câmera, busto e rosto visíveis" },
                      { title: "Fale naturalmente", desc: "Demonstre diferentes expressões e movimentos" },
                      { title: "Qualidade HD", desc: "Grave em 1080p ou superior para melhor resultado" },
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{tip.title}</p>
                          <p className="text-sm text-muted-foreground">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-200">Importante</p>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        O processamento do HeyGen pode levar de 5 a 15 minutos. Você receberá notificação quando estiver pronto.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 2: Gerar Vídeo */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        Gerar Vídeo com Avatar
                      </CardTitle>
                      <CardDescription>
                        Selecione um avatar e escreva o script para gerar um vídeo
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadAvatarsAndVoices}
                      disabled={isLoadingAvatars}
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingAvatars ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Selecione o Avatar</Label>
                    <Select value={selectedAvatar} onValueChange={setSelectedAvatar}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingAvatars ? "Carregando..." : "Escolha um avatar"} />
                      </SelectTrigger>
                      <SelectContent>
                        {avatars.map((avatar) => (
                          <SelectItem key={avatar.avatar_id} value={avatar.avatar_id}>
                            {avatar.avatar_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Selecione a Voz (opcional)</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Voz padrão do avatar" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.name} ({voice.language})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script">Script do Vídeo</Label>
                    <Textarea
                      id="script"
                      placeholder="Escreva o que o avatar deve dizer..."
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      {script.length} caracteres
                    </p>
                  </div>

                  <Button 
                    onClick={handleGenerateVideo}
                    disabled={!selectedAvatar || !script.trim() || isGeneratingVideo}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Vídeo
                      </>
                    )}
                  </Button>

                  {videoStatus && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${
                      videoStatus === 'Concluído!' 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : videoStatus === 'Falhou'
                        ? 'bg-red-500/10 border border-red-500/30'
                        : 'bg-blue-500/10 border border-blue-500/30'
                    }`}>
                      {videoStatus === 'Concluído!' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : videoStatus === 'Falhou' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      )}
                      <span className="font-medium">{videoStatus}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview do Vídeo */}
              <Card className="border-2 border-secondary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-secondary" />
                    Preview do Vídeo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {videoUrl ? (
                    <div className="aspect-[9/16] max-h-[500px] rounded-lg overflow-hidden bg-black">
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[9/16] max-h-[500px] rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center p-6">
                        <Video className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {videoStatus ? videoStatus : "O vídeo gerado aparecerá aqui"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Produtos */}
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