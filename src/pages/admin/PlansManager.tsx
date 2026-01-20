import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  Crown,
  Rocket,
  Star,
  Sparkles,
  Check,
  GripVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PlanConfig {
  id: string;
  plan_key: string;
  name: string;
  price_cents: number;
  credits_monthly: number;
  features: unknown;
  is_active: boolean;
  display_order: number;
}

interface PlanUpgrade {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  features: unknown;
  icon: string;
  is_active: boolean;
  display_order: number;
}

const planIcons: Record<string, React.ReactNode> = {
  starter: <Zap className="h-6 w-6" />,
  creator: <Star className="h-6 w-6" />,
  professional: <Crown className="h-6 w-6" />,
  business: <Rocket className="h-6 w-6" />,
  enterprise: <Sparkles className="h-6 w-6" />,
};

const PlansManager = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [upgrades, setUpgrades] = useState<PlanUpgrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"plan" | "upgrade">("plan");
  const [editingItem, setEditingItem] = useState<PlanConfig | PlanUpgrade | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [plansRes, upgradesRes] = await Promise.all([
      supabase.from("plan_configs").select("*").order("display_order"),
      supabase.from("plan_upgrades").select("*").order("display_order"),
    ]);

    setPlans(plansRes.data || []);
    setUpgrades(upgradesRes.data || []);
    setLoading(false);
  };

  const openAddDialog = (type: "plan" | "upgrade") => {
    setDialogType(type);
    setEditingItem(null);
    setFormData({});
    setShowDialog(true);
  };

  const openEditDialog = (type: "plan" | "upgrade", item: PlanConfig | PlanUpgrade) => {
    setDialogType(type);
    setEditingItem(item);
    setFormData({
      ...item,
      features: Array.isArray(item.features) ? item.features.join("\n") : "",
    });
    setShowDialog(true);
  };

  const handleSavePlan = async () => {
    const planData = {
      plan_key: formData.plan_key as string,
      name: formData.name as string,
      price_cents: parseInt(formData.price_cents as string) || 0,
      credits_monthly: parseInt(formData.credits_monthly as string) || 0,
      features: (formData.features as string || "").split("\n").filter(Boolean),
      is_active: formData.is_active !== false,
      display_order: parseInt(formData.display_order as string) || 0,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("plan_configs")
        .update(planData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ variant: "destructive", title: "Erro ao atualizar plano" });
      } else {
        toast({ title: "Plano atualizado!" });
        setShowDialog(false);
        loadData();
      }
    } else {
      const { error } = await supabase.from("plan_configs").insert(planData);

      if (error) {
        toast({ variant: "destructive", title: "Erro ao criar plano" });
      } else {
        toast({ title: "Plano criado!" });
        setShowDialog(false);
        loadData();
      }
    }
  };

  const handleSaveUpgrade = async () => {
    const upgradeData = {
      name: formData.name as string,
      description: formData.description as string,
      price_cents: parseInt(formData.price_cents as string) || 0,
      features: (formData.features as string || "").split("\n").filter(Boolean),
      icon: formData.icon as string,
      is_active: formData.is_active !== false,
      display_order: parseInt(formData.display_order as string) || 0,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("plan_upgrades")
        .update(upgradeData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ variant: "destructive", title: "Erro ao atualizar upgrade" });
      } else {
        toast({ title: "Upgrade atualizado!" });
        setShowDialog(false);
        loadData();
      }
    } else {
      const { error } = await supabase.from("plan_upgrades").insert(upgradeData);

      if (error) {
        toast({ variant: "destructive", title: "Erro ao criar upgrade" });
      } else {
        toast({ title: "Upgrade criado!" });
        setShowDialog(false);
        loadData();
      }
    }
  };

  const handleToggleActive = async (table: string, id: string, currentState: boolean) => {
    const { error } = await supabase
      .from(table)
      .update({ is_active: !currentState })
      .eq("id", id);

    if (!error) {
      toast({ title: currentState ? "Item desativado" : "Item ativado" });
      loadData();
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (!error) {
      toast({ title: "Item excluído" });
      loadData();
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Gestão de Planos
          </h1>
          <p className="text-muted-foreground">Configurar planos de assinatura e upgrades opcionais</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plans" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="upgrades" className="gap-2">
            <Zap className="h-4 w-4" />
            Upgrades
          </TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openAddDialog("plan")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </div>

          <div className="grid gap-4">
            {plans.map((plan, index) => (
              <Card key={plan.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                    <span className="w-6 text-center">{index + 1}</span>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${plan.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {planIcons[plan.plan_key] || <CreditCard className="h-6 w-6" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <Badge variant="outline">{plan.plan_key}</Badge>
                      {!plan.is_active && (
                        <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Preço</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(plan.price_cents)}</p>
                        <p className="text-xs text-muted-foreground">/mês</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Créditos</p>
                        <p className="text-2xl font-bold">{plan.credits_monthly}</p>
                        <p className="text-xs text-muted-foreground">/mês</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Features</p>
                        <p className="text-2xl font-bold">{plan.features?.length || 0}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {plan.features?.slice(0, 5).map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                      {plan.features?.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.features.length - 5} mais
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog("plan", plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive("plan_configs", plan.id, plan.is_active)}
                    >
                      {plan.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete("plan_configs", plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {plans.length === 0 && (
              <Card className="p-12 text-center">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum plano configurado</h3>
                <p className="text-muted-foreground mb-4">Configure os planos de assinatura da plataforma</p>
                <Button onClick={() => openAddDialog("plan")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Plano
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Upgrades Tab */}
        <TabsContent value="upgrades" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openAddDialog("upgrade")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Upgrade
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upgrades.map((upgrade) => (
              <Card key={upgrade.id} className="p-6 relative">
                {!upgrade.is_active && (
                  <Badge variant="outline" className="absolute top-4 right-4 text-muted-foreground">
                    Inativo
                  </Badge>
                )}
                
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg">{upgrade.name}</h3>
                  <p className="text-sm text-muted-foreground">{upgrade.description}</p>
                </div>

                <p className="text-2xl font-bold text-primary mb-4">{formatPrice(upgrade.price_cents)}</p>

                <div className="space-y-2 mb-4">
                  {upgrade.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog("upgrade", upgrade)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive("plan_upgrades", upgrade.id, upgrade.is_active)}
                  >
                    {upgrade.is_active ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {upgrade.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete("plan_upgrades", upgrade.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {upgrades.length === 0 && (
              <Card className="p-12 text-center col-span-full">
                <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum upgrade configurado</h3>
                <p className="text-muted-foreground mb-4">Configure upgrades opcionais para os planos</p>
                <Button onClick={() => openAddDialog("upgrade")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Upgrade
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar" : "Novo"} {dialogType === "plan" ? "Plano" : "Upgrade"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {dialogType === "plan" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Chave do Plano</Label>
                    <Input
                      value={(formData.plan_key as string) || ""}
                      onChange={(e) => setFormData({ ...formData, plan_key: e.target.value })}
                      placeholder="starter, creator, pro..."
                    />
                  </div>
                  <div>
                    <Label>Nome de Exibição</Label>
                    <Input
                      value={(formData.name as string) || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preço (centavos)</Label>
                    <Input
                      type="number"
                      value={(formData.price_cents as string) || ""}
                      onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                      placeholder="5500 = R$ 55,00"
                    />
                  </div>
                  <div>
                    <Label>Créditos Mensais</Label>
                    <Input
                      type="number"
                      value={(formData.credits_monthly as string) || ""}
                      onChange={(e) => setFormData({ ...formData, credits_monthly: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Ordem de Exibição</Label>
                  <Input
                    type="number"
                    value={(formData.display_order as string) || "0"}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Features (uma por linha)</Label>
                  <Textarea
                    value={(formData.features as string) || ""}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={6}
                    placeholder="Geração de imagens&#10;Avatares IA&#10;Suporte prioritário"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Plano Ativo</Label>
                </div>
                <Button onClick={handleSavePlan} className="w-full">
                  {editingItem ? "Salvar Alterações" : "Criar Plano"}
                </Button>
              </>
            )}

            {dialogType === "upgrade" && (
              <>
                <div>
                  <Label>Nome do Upgrade</Label>
                  <Input
                    value={(formData.name as string) || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={(formData.description as string) || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preço (centavos)</Label>
                    <Input
                      type="number"
                      value={(formData.price_cents as string) || ""}
                      onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ícone</Label>
                    <Input
                      value={(formData.icon as string) || ""}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="zap, rocket, crown..."
                    />
                  </div>
                </div>
                <div>
                  <Label>Ordem de Exibição</Label>
                  <Input
                    type="number"
                    value={(formData.display_order as string) || "0"}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Features (uma por linha)</Label>
                  <Textarea
                    value={(formData.features as string) || ""}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Upgrade Ativo</Label>
                </div>
                <Button onClick={handleSaveUpgrade} className="w-full">
                  {editingItem ? "Salvar Alterações" : "Criar Upgrade"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManager;
