import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User, Bell, Shield, Palette, Globe, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Perfil() {
  const [companyName, setCompanyName] = useState("ARCANA Digital");
  const [companyDescription, setCompanyDescription] = useState("Plataforma de marketing com influencers IA");
  const [userName, setUserName] = useState("Admin User");
  const [userEmail, setUserEmail] = useState("admin@arcana.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleSaveCompany = () => {
    toast.success("Dados da empresa atualizados!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">Gerencie seu perfil e preferências da plataforma</p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="w-4 h-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Dados da Empresa</h2>
                  <p className="text-sm text-muted-foreground">Informações públicas da sua organização</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website</Label>
                    <Input
                      id="company-website"
                      placeholder="https://seusite.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Descrição</Label>
                  <Textarea
                    id="company-description"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Descreva sua empresa..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-industry">Setor</Label>
                    <Input
                      id="company-industry"
                      placeholder="Ex: Tecnologia, Moda, Fitness"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-size">Tamanho da Empresa</Label>
                    <Input
                      id="company-size"
                      placeholder="Ex: 1-10, 11-50, 51-200"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveCompany} className="w-full md:w-auto">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-artist flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
                  <p className="text-sm text-muted-foreground">Suas informações pessoais</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                    AU
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Trocar Foto</Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG até 5MB</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Nome Completo</Label>
                    <Input
                      id="user-name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">E-mail</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Cargo</Label>
                    <Input
                      id="user-role"
                      placeholder="Ex: Marketing Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-phone">Telefone</Label>
                    <Input
                      id="user-phone"
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  Salvar Perfil
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-artist to-primary flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Notificações</h2>
                  <p className="text-sm text-muted-foreground">Configure como você quer ser notificado</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { id: "campaigns", label: "Atualizações de Campanhas", description: "Receba notificações sobre suas campanhas ativas" },
                  { id: "talents", label: "Novos Talentos", description: "Seja avisado quando novos criadores entrarem na plataforma" },
                  { id: "analytics", label: "Relatórios Semanais", description: "Resumo semanal de performance" },
                  { id: "ai", label: "Dicas da IA", description: "Sugestões personalizadas da Consultoria IA" },
                  { id: "billing", label: "Faturamento", description: "Alertas sobre pagamentos e faturas" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Aparência</h2>
                  <p className="text-sm text-muted-foreground">Personalize a interface da plataforma</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Modo Escuro</div>
                    <div className="text-sm text-muted-foreground">Interface com tema escuro</div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="space-y-3">
                  <Label>Cor de Destaque</Label>
                  <div className="grid grid-cols-6 gap-3">
                    {["#8B5CF6", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#EC4899"].map((color) => (
                      <button
                        key={color}
                        className="w-full h-12 rounded-lg border-2 border-transparent hover:border-white/50 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Salvamento Automático</div>
                    <div className="text-sm text-muted-foreground">Salvar mudanças automaticamente</div>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-artist flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Segurança</h2>
                  <p className="text-sm text-muted-foreground">Proteja sua conta e dados</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Alterar Senha</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Atualizar Senha</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="font-semibold text-lg mb-4">Autenticação em Dois Fatores</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">2FA</div>
                      <div className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</div>
                    </div>
                    <Button variant="outline">Ativar</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="font-semibold text-lg mb-4 text-destructive">Zona de Perigo</h3>
                  <div className="space-y-3">
                    <Button variant="destructive" className="w-full md:w-auto">
                      Desativar Conta
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Uma vez desativada, sua conta pode ser recuperada dentro de 30 dias.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* API Integration Card */}
        <div className="mt-8 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Integração API</h3>
              <p className="text-muted-foreground mb-4">
                Conecte ARCANA com suas ferramentas favoritas ou desenvolva aplicações personalizadas
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Ver Documentação</Button>
                <Button variant="outline">Gerar API Key</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}