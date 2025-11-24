import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Upload, 
  Save, 
  Eye, 
  Sparkles,
  Building2,
  Globe,
  Mail,
  Phone,
  CheckCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminWhiteLabel = () => {
  const { toast } = useToast();
  const [brandConfig, setBrandConfig] = useState({
    agencyName: "Sua Agência",
    primaryColor: "#A855F7",
    secondaryColor: "#06B6D4",
    logo: "",
    favicon: "",
    customDomain: "",
    supportEmail: "",
    supportPhone: "",
    termsUrl: "",
    privacyUrl: "",
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "As personalizações foram aplicadas com sucesso.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Visualização gerada",
      description: "Abrindo preview em nova aba...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">White Label Pro</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Personalização White Label
          </h1>
          <p className="text-muted-foreground">Configure a plataforma com a identidade da sua agência</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Agências Ativas</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clientes Ativos</p>
              <p className="text-3xl font-bold">248</p>
            </div>
            <Globe className="h-8 w-8 text-secondary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
              <p className="text-3xl font-bold">R$ 45K</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Domínios Ativos</p>
              <p className="text-3xl font-bold">8</p>
            </div>
            <Globe className="h-8 w-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="branding">Identidade</TabsTrigger>
          <TabsTrigger value="domain">Domínio</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Identidade Visual
            </h2>

            <div className="space-y-6">
              {/* Agency Name */}
              <div className="space-y-2">
                <Label htmlFor="agencyName">Nome da Agência</Label>
                <Input
                  id="agencyName"
                  value={brandConfig.agencyName}
                  onChange={(e) => setBrandConfig({ ...brandConfig, agencyName: e.target.value })}
                  placeholder="Digite o nome da sua agência"
                />
              </div>

              {/* Colors */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={brandConfig.primaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, primaryColor: e.target.value })}
                      className="w-20 h-12"
                    />
                    <Input
                      value={brandConfig.primaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, primaryColor: e.target.value })}
                      placeholder="#A855F7"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={brandConfig.secondaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, secondaryColor: e.target.value })}
                      className="w-20 h-12"
                    />
                    <Input
                      value={brandConfig.secondaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, secondaryColor: e.target.value })}
                      placeholder="#06B6D4"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo da Agência</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arraste e solte ou clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, SVG ou JPG (recomendado: 200x50px)
                  </p>
                  <Button variant="outline" className="mt-4">
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Ícone do site (32x32px)
                  </p>
                  <Button variant="outline" size="sm">
                    Selecionar Favicon
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Configuração de Domínio
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Domínio Personalizado</Label>
                <Input
                  id="customDomain"
                  value={brandConfig.customDomain}
                  onChange={(e) => setBrandConfig({ ...brandConfig, customDomain: e.target.value })}
                  placeholder="app.suaagencia.com"
                />
                <p className="text-xs text-muted-foreground">
                  Configure seu próprio domínio para a plataforma
                </p>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="font-semibold mb-2">Instruções DNS</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Adicione os seguintes registros DNS:</p>
                  <div className="bg-background/50 p-3 rounded font-mono text-xs">
                    <p>Type: CNAME</p>
                    <p>Name: app</p>
                    <p>Value: arcana-platform.lovable.app</p>
                  </div>
                </div>
              </div>

              <Badge className="bg-success/10 text-success border-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                SSL Automático Habilitado
              </Badge>
            </div>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Informações de Contato
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de Suporte</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={brandConfig.supportEmail}
                  onChange={(e) => setBrandConfig({ ...brandConfig, supportEmail: e.target.value })}
                  placeholder="suporte@suaagencia.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportPhone">Telefone de Suporte</Label>
                <Input
                  id="supportPhone"
                  type="tel"
                  value={brandConfig.supportPhone}
                  onChange={(e) => setBrandConfig({ ...brandConfig, supportPhone: e.target.value })}
                  placeholder="+55 (11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportMessage">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="supportMessage"
                  placeholder="Mensagem que aparecerá no primeiro acesso dos clientes..."
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Documentos Legais
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="termsUrl">URL dos Termos de Uso</Label>
                <Input
                  id="termsUrl"
                  value={brandConfig.termsUrl}
                  onChange={(e) => setBrandConfig({ ...brandConfig, termsUrl: e.target.value })}
                  placeholder="https://suaagencia.com/termos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacyUrl">URL da Política de Privacidade</Label>
                <Input
                  id="privacyUrl"
                  value={brandConfig.privacyUrl}
                  onChange={(e) => setBrandConfig({ ...brandConfig, privacyUrl: e.target.value })}
                  placeholder="https://suaagencia.com/privacidade"
                />
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Importante</h3>
                <p className="text-sm text-muted-foreground">
                  Certifique-se de que os documentos legais estão adequados à legislação brasileira (LGPD) e às suas operações.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Existing Agencies */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Agências Cadastradas</h2>
        <div className="space-y-4">
          {[
            { name: "Digital Masters", domain: "app.digitalmasters.com.br", clients: 42, status: "active" },
            { name: "Growth Hub", domain: "platform.growthhub.com", clients: 38, status: "active" },
            { name: "Social Plus", domain: "app.socialplus.io", clients: 25, status: "pending" },
          ].map((agency, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{agency.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    {agency.domain}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="text-lg font-bold">{agency.clients}</p>
                </div>
                <Badge className={agency.status === 'active' ? 'bg-success/10 text-success border-success' : 'bg-accent/10 text-accent border-accent'}>
                  {agency.status === 'active' ? 'Ativa' : 'Configurando'}
                </Badge>
                <Button variant="outline" size="sm">
                  Gerenciar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminWhiteLabel;
