import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Video, 
  Sparkles, 
  Play, 
  Download,
  Share2,
  Clock,
  Wand2,
  Image as ImageIcon,
  RefreshCw,
  Zap,
  User,
  Camera,
  Film,
  Settings2,
  ChevronRight,
  Check,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratedVideo {
  id: string;
  thumbnail: string;
  videoUrl: string;
  prompt: string;
  duration: string;
  createdAt: Date;
  status: "processing" | "completed" | "failed";
}

export default function VideoCreator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<5 | 10>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast.success("Imagem carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast.error("Por favor, envie uma foto primeiro.");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Por favor, descreva o vídeo que deseja criar.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        thumbnail: uploadedImage,
        videoUrl: "",
        prompt: prompt,
        duration: `${duration}s`,
        createdAt: new Date(),
        status: "completed"
      };
      
      setGeneratedVideos((prev) => [newVideo, ...prev]);
      setIsGenerating(false);
      setGenerationProgress(0);
      toast.success("Vídeo gerado com sucesso!");
      setActiveTab("gallery");
    }, 6000);
  };

  const promptSuggestions = [
    "Pessoa falando diretamente para a câmera com expressão confiante",
    "Apresentação de produto com movimentos suaves das mãos",
    "Depoimento emocional com gestos naturais",
    "Demonstração dinâmica com zoom in e out",
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Video Creator
              </h1>
              <Badge variant="outline" className="border-primary/50 text-primary mt-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by AI
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Transforme fotos em vídeos incríveis com IA. Estilo Kling AI.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2 py-2 px-3">
            <Zap className="w-4 h-4 text-primary" />
            <span>15 créditos por vídeo</span>
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="create" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Criar Vídeo
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Video className="w-4 h-4" />
            Meus Vídeos ({generatedVideos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Upload & Preview */}
            <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Foto de Referência
                </CardTitle>
                <CardDescription>
                  Envie uma foto sua ou de um personagem para animar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <motion.div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                    uploadedImage
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <AnimatePresence mode="wait">
                    {uploadedImage ? (
                      <motion.div
                        key="image"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full h-full"
                      >
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary/90 backdrop-blur">
                            <Check className="w-3 h-3 mr-1" />
                            Imagem carregada
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-4 right-4 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                          }}
                        >
                          <RefreshCw className="w-3 h-3" />
                          Trocar
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
                      >
                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                          <Upload className="w-10 h-10" />
                        </div>
                        <p className="font-medium mb-1">Clique para enviar</p>
                        <p className="text-sm text-muted-foreground/70">
                          JPG, PNG ou WebP (máx 10MB)
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Tips */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Dicas para melhores resultados
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use fotos com rosto frontal e bem iluminado</li>
                    <li>• Evite imagens com muito ruído ou baixa resolução</li>
                    <li>• Fundo neutro ajuda na qualidade final</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Right: Configuration */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Configurações do Vídeo
                </CardTitle>
                <CardDescription>
                  Descreva como você quer que o vídeo seja gerado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Descrição do Vídeo</label>
                  <Textarea
                    placeholder="Descreva o que você quer que aconteça no vídeo. Ex: 'Pessoa falando diretamente para a câmera apresentando um produto...'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex flex-wrap gap-2">
                    {promptSuggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-1.5"
                        onClick={() => setPrompt(suggestion)}
                      >
                        {suggestion.slice(0, 30)}...
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Duration Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duração do Vídeo
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[5, 10].map((d) => (
                      <Button
                        key={d}
                        variant={duration === d ? "default" : "outline"}
                        className={`h-16 flex-col gap-1 ${
                          duration === d
                            ? "bg-gradient-to-br from-primary to-secondary"
                            : ""
                        }`}
                        onClick={() => setDuration(d as 5 | 10)}
                      >
                        <span className="text-xl font-bold">{d}s</span>
                        <span className="text-xs opacity-80">
                          {d === 5 ? "15 créditos" : "25 créditos"}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="space-y-4 pt-4">
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Gerando vídeo...</span>
                        <span className="font-medium">{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        Isso pode levar alguns minutos. Não feche esta página.
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full h-14 text-lg gap-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={handleGenerate}
                    disabled={isGenerating || !uploadedImage}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando Vídeo...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Gerar Vídeo com IA
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {generatedVideos.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="py-16 text-center">
                <div className="p-4 rounded-full bg-muted/50 inline-block mb-4">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum vídeo ainda</h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro vídeo com IA agora mesmo!
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Wand2 className="w-4 h-4" />
                  Criar Vídeo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden group hover:shadow-xl transition-all">
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="lg" variant="secondary" className="gap-2">
                          <Play className="w-5 h-5" />
                          Reproduzir
                        </Button>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur">
                        {video.duration}
                      </Badge>
                      {video.status === "completed" && (
                        <Badge className="absolute top-3 left-3 bg-green-500/90">
                          <Check className="w-3 h-3 mr-1" />
                          Pronto
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.prompt}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Share2 className="w-4 h-4" />
                          Compartilhar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
