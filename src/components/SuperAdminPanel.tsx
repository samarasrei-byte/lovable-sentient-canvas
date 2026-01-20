import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Image, 
  Camera, 
  Users, 
  Palette, 
  UserCircle, 
  Settings2,
  Upload,
  Trash2,
  Edit,
  Save,
  Key,
  Coins,
  Crown
} from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  category: string;
  prompt: string;
  image: string;
  tags: string[];
  credits: number;
  active: boolean;
}

// Mock data
const mockProductTemplates: Template[] = [
  { id: "1", name: "Mockup Premium", category: "E-commerce", prompt: "Product photography, white background, studio lighting...", image: "/placeholder.svg", tags: ["Clean", "3D"], credits: 2, active: true },
  { id: "2", name: "Cenário Lifestyle", category: "Lifestyle", prompt: "Lifestyle product shot, natural lighting...", image: "/placeholder.svg", tags: ["Natural", "Warm"], credits: 3, active: true },
];

const mockPhotoTemplates: Template[] = [
  { id: "3", name: "Studio Fashion", category: "Moda", prompt: "Fashion photography, professional model pose...", image: "/placeholder.svg", tags: ["Fashion", "Studio"], credits: 4, active: true },
];

export const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [productTemplates, setProductTemplates] = useState(mockProductTemplates);
  const [photoTemplates, setPhotoTemplates] = useState(mockPhotoTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    bananaApiKey: "sk-***************",
    clingApiKey: "ck-***************",
    basicCredits: 120,
    proCredits: 400,
    basicPrice: 55,
    proPrice: 220,
  });

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    toast.success("Template salvo com sucesso!");
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    toast.success("Template removido!");
  };

  const handleSaveSettings = () => {
    toast.success("Configurações salvas!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Arcana Master Panel
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie templates, influenciadores, artistas e configurações da plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Image className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{productTemplates.length}</p>
              <p className="text-sm text-muted-foreground">Templates Produto</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{photoTemplates.length}</p>
              <p className="text-sm text-muted-foreground">Templates Foto</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Influenciadores</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-artist/10 flex items-center justify-center">
              <Palette className="w-6 h-6 text-artist" />
            </div>
            <div>
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Artistas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 gap-2 h-auto bg-transparent">
          <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Image className="w-4 h-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="photos" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Camera className="w-4 h-4" />
            Fotos
          </TabsTrigger>
          <TabsTrigger value="influencers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-4 h-4" />
            Influencers
          </TabsTrigger>
          <TabsTrigger value="artists" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="w-4 h-4" />
            Artistas
          </TabsTrigger>
          <TabsTrigger value="avatars" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UserCircle className="w-4 h-4" />
            Avatares
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings2 className="w-4 h-4" />
            Config
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Templates de Produtos</CardTitle>
                <CardDescription>Gerencie os templates para criação de imagens de produtos</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                      <Badge className="absolute top-2 right-2">{template.credits} créditos</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Switch checked={template.active} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.category}</p>
                      <div className="flex gap-1 mb-3">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Templates de Fotos Profissionais</CardTitle>
                <CardDescription>Gerencie os templates com máscaras para fotos profissionais</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photoTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                      <Badge className="absolute top-2 right-2">{template.credits} créditos</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Switch checked={template.active} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.category}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencers Tab */}
        <TabsContent value="influencers" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Influenciadores</CardTitle>
                <CardDescription>Gerencie os influenciadores disponíveis para criação</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Influenciador
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Clique em "Novo Influenciador" para adicionar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Artistas</CardTitle>
                <CardDescription>Gerencie os artistas (reais e IA) disponíveis</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Artista
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Clique em "Novo Artista" para adicionar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avatars Tab */}
        <TabsContent value="avatars" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Avatares</CardTitle>
                <CardDescription>Gerencie os avatares IA disponíveis</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Avatar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Clique em "Novo Avatar" para adicionar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Chaves de API
                </CardTitle>
                <CardDescription>Configure as integrações externas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Banana.dev API Key</Label>
                  <Input 
                    type="password" 
                    value={settings.bananaApiKey}
                    onChange={(e) => setSettings({...settings, bananaApiKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cling AI API Key</Label>
                  <Input 
                    type="password" 
                    value={settings.clingApiKey}
                    onChange={(e) => setSettings({...settings, clingApiKey: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Plans Config */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Configuração de Planos
                </CardTitle>
                <CardDescription>Defina créditos e preços dos planos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Créditos Basic</Label>
                    <Input 
                      type="number" 
                      value={settings.basicCredits}
                      onChange={(e) => setSettings({...settings, basicCredits: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço Basic (R$)</Label>
                    <Input 
                      type="number" 
                      value={settings.basicPrice}
                      onChange={(e) => setSettings({...settings, basicPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Créditos PRO</Label>
                    <Input 
                      type="number" 
                      value={settings.proCredits}
                      onChange={(e) => setSettings({...settings, proCredits: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço PRO (R$)</Label>
                    <Input 
                      type="number" 
                      value={settings.proPrice}
                      onChange={(e) => setSettings({...settings, proPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings} className="gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
