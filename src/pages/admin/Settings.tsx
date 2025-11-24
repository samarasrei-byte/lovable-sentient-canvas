import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Save,
  Bell,
  Shield,
  Mail,
  Database,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    platformName: "Arcana Oracle",
    platformFee: 10,
    minWithdrawal: 100,
    autoApproveInfluencers: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    allowNewSignups: true,
    requireEmailVerification: true,
    maxUploadSize: 10,
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Configurações do Sistema
          </h1>
          <p className="text-muted-foreground">Gerenciar configurações gerais da plataforma</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Configurações Gerais
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformName">Nome da Plataforma</Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Modo Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Desabilitar acesso temporariamente
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Permitir Novos Cadastros</Label>
                  <p className="text-sm text-muted-foreground">
                    Usuários podem criar novas contas
                  </p>
                </div>
                <Switch
                  checked={settings.allowNewSignups}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowNewSignups: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Verificação de Email Obrigatória</Label>
                  <p className="text-sm text-muted-foreground">
                    Requer confirmação de email no cadastro
                  </p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUploadSize">Tamanho Máximo de Upload (MB)</Label>
                <Input
                  id="maxUploadSize"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Configurações Financeiras
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformFee">Taxa da Plataforma (%)</Label>
                <Input
                  id="platformFee"
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) => setSettings({ ...settings, platformFee: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Percentual cobrado sobre cada transação
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minWithdrawal">Saque Mínimo (R$)</Label>
                <Input
                  id="minWithdrawal"
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Valor mínimo para solicitação de saque
                </p>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="font-semibold mb-2 text-accent">Informações Fiscais</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
                  <p className="text-muted-foreground">Razão Social: Arcana Oracle LTDA</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Editar Dados Fiscais
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar alertas importantes por email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertas críticos via SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email do Administrador</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@arcana.com"
                />
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-primary">Configuração SMTP</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Configure o servidor de email para envio de notificações
                </p>
                <Button variant="outline" size="sm">
                  Configurar SMTP
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Segurança
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Aprovação Automática de Influenciadores</Label>
                  <p className="text-sm text-muted-foreground">
                    Novos influenciadores são aprovados automaticamente
                  </p>
                </div>
                <Switch
                  checked={settings.autoApproveInfluencers}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoApproveInfluencers: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tentativas de Login</Label>
                <Input
                  type="number"
                  defaultValue={5}
                  placeholder="Máximo de tentativas antes de bloquear"
                />
              </div>

              <div className="space-y-2">
                <Label>Tempo de Sessão (minutos)</Label>
                <Input
                  type="number"
                  defaultValue={120}
                  placeholder="Duração da sessão ativa"
                />
              </div>

              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-semibold mb-2 text-destructive flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Zona de Perigo
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ações que podem afetar o funcionamento da plataforma
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                    Resetar Todas as Configurações
                  </Button>
                  <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                    Limpar Cache do Sistema
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
