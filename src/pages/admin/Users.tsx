import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Ban, 
  CheckCircle, 
  Shield, 
  Crown,
  Eye,
  MoreVertical,
  Mail,
  Calendar,
  CreditCard,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  roles: string[];
  subscription?: {
    plan: string;
    status: string;
  };
  credits?: {
    balance: number;
    used_this_month: number;
  };
  is_banned: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os usuários",
      });
      setLoading(false);
      return;
    }

    // Get all roles
    const { data: roles } = await supabase.from("user_roles").select("*");
    
    // Get all subscriptions
    const { data: subscriptions } = await supabase.from("subscriptions").select("*");
    
    // Get all credits
    const { data: credits } = await supabase.from("user_credits").select("*");
    
    // Get all bans
    const { data: bans } = await supabase.from("bans").select("*").eq("is_active", true);

    // Combine data
    const usersData: User[] = (profiles || []).map((profile) => {
      const userRoles = roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [];
      const userSub = subscriptions?.find((s) => s.user_id === profile.id);
      const userCredits = credits?.find((c) => c.user_id === profile.id);
      const isBanned = bans?.some((b) => b.user_id === profile.id) || false;

      return {
        ...profile,
        roles: userRoles,
        subscription: userSub ? { plan: userSub.plan, status: userSub.status } : undefined,
        credits: userCredits ? { 
          balance: userCredits.credits_balance, 
          used_this_month: userCredits.credits_used_this_month 
        } : undefined,
        is_banned: isBanned,
      };
    });

    setUsers(usersData);
    setLoading(false);
  };

  const handleBanUser = async (userId: string, reason: string) => {
    const { error } = await supabase.from("bans").insert({
      user_id: userId,
      reason,
      is_active: true,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao banir usuário" });
    } else {
      toast({ title: "Usuário banido com sucesso" });
      loadUsers();
    }
  };

  const handleUnbanUser = async (userId: string) => {
    const { error } = await supabase
      .from("bans")
      .update({ is_active: false })
      .eq("user_id", userId);

    if (error) {
      toast({ variant: "destructive", title: "Erro ao desbanir usuário" });
    } else {
      toast({ title: "Banimento removido" });
      loadUsers();
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    // Remove existing roles and add new one
    await supabase.from("user_roles").delete().eq("user_id", userId);
    
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: newRole as "admin" | "brand" | "influencer",
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao alterar role" });
    } else {
      toast({ title: `Role alterada para ${newRole}` });
      loadUsers();
    }
  };

  const handleAddCredits = async (userId: string, amount: number) => {
    const { error } = await supabase.rpc("add_credits", {
      p_user_id: userId,
      p_amount: amount,
      p_type: "admin_bonus",
      p_description: "Créditos adicionados pelo admin",
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao adicionar créditos" });
    } else {
      toast({ title: `${amount} créditos adicionados` });
      loadUsers();
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (roles: string[]) => {
    if (roles.includes("admin")) {
      return <Badge className="bg-destructive/10 text-destructive border-destructive"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
    }
    if (roles.includes("brand")) {
      return <Badge className="bg-primary/10 text-primary border-primary"><Crown className="h-3 w-3 mr-1" />Marca</Badge>;
    }
    if (roles.includes("influencer")) {
      return <Badge className="bg-accent/10 text-accent border-accent"><Users className="h-3 w-3 mr-1" />Influencer</Badge>;
    }
    return <Badge variant="outline">Usuário</Badge>;
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
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">Administrar todos os usuários da plataforma</p>
        </div>
        <Button onClick={loadUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="brand">Marcas</SelectItem>
              <SelectItem value="influencer">Influenciadores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold text-destructive">
                {users.filter((u) => u.roles.includes("admin")).length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Marcas</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((u) => u.roles.includes("brand")).length}
              </p>
            </div>
            <Crown className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Influencers</p>
              <p className="text-2xl font-bold text-accent">
                {users.filter((u) => u.roles.includes("influencer")).length}
              </p>
            </div>
            <Users className="h-8 w-8 text-accent" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Banidos</p>
              <p className="text-2xl font-bold text-muted-foreground">
                {users.filter((u) => u.is_banned).length}
              </p>
            </div>
            <Ban className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Usuário</th>
                <th className="text-left p-4 font-semibold">Role</th>
                <th className="text-left p-4 font-semibold">Plano</th>
                <th className="text-left p-4 font-semibold">Créditos</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Cadastro</th>
                <th className="text-right p-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{getRoleBadge(user.roles)}</td>
                  <td className="p-4">
                    {user.subscription ? (
                      <Badge variant="outline" className="capitalize">
                        {user.subscription.plan}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Free</span>
                    )}
                  </td>
                  <td className="p-4">
                    {user.credits ? (
                      <span className="font-mono">{user.credits.balance}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {user.is_banned ? (
                      <Badge variant="destructive">Banido</Badge>
                    ) : (
                      <Badge className="bg-success/10 text-success border-success">Ativo</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const amount = prompt("Quantidade de créditos:");
                          if (amount) handleAddCredits(user.id, parseInt(amount));
                        }}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Adicionar Créditos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "admin")}>
                          <Shield className="h-4 w-4 mr-2" />
                          Tornar Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "brand")}>
                          <Crown className="h-4 w-4 mr-2" />
                          Tornar Marca
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "influencer")}>
                          <Users className="h-4 w-4 mr-2" />
                          Tornar Influencer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.is_banned ? (
                          <DropdownMenuItem onClick={() => handleUnbanUser(user.id)} className="text-success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Remover Banimento
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => {
                            const reason = prompt("Motivo do banimento:");
                            if (reason) handleBanUser(user.id, reason);
                          }} className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Banir Usuário
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>Informações completas do usuário selecionado</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedUser.full_name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedUser.email}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Desde {new Date(selectedUser.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <div>{getRoleBadge(selectedUser.roles)}</div>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {selectedUser.is_banned ? (
                    <Badge variant="destructive">Banido</Badge>
                  ) : (
                    <Badge className="bg-success/10 text-success border-success">Ativo</Badge>
                  )}
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Plano</p>
                  <p className="font-semibold capitalize">
                    {selectedUser.subscription?.plan || "Free"}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Créditos</p>
                  <p className="font-semibold font-mono">
                    {selectedUser.credits?.balance || 0}
                  </p>
                </Card>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowUserDetails(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  toast({ title: "Acessando como usuário...", description: "Função em desenvolvimento" });
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Entrar como Usuário
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
