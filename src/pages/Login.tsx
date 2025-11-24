import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, User, Users, Shield, Building2 } from "lucide-react";
import { Session } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<"brand" | "influencer" | "admin" | "whitelabel">("brand");

  // Demo credentials
  const demoCredentials = {
    brand: { email: "marca@demo.com", password: "demo123" },
    influencer: { email: "influencer@demo.com", password: "demo123" },
    admin: { email: "admin@arcana.com", password: "admin123" },
    whitelabel: { email: "agencia@demo.com", password: "demo123" }
  };

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        redirectToDashboard(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        redirectToDashboard(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const redirectToDashboard = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleData?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/app/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      // Check if user is banned
      const { data: banData } = await supabase
        .from("bans")
        .select("*")
        .eq("user_id", data.user.id)
        .eq("is_active", true)
        .single();

      if (banData) {
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Sua conta foi suspensa. Entre em contato com o suporte.",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta.",
      });
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      // Add user role - map whitelabel to brand role
      const dbRole = userType === "whitelabel" ? "brand" : userType;
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: dbRole,
      });

      if (roleError) {
        toast({
          variant: "destructive",
          title: "Erro ao configurar conta",
          description: roleError.message,
        });
        setLoading(false);
        return;
      }

      // If influencer, create influencer profile
      if (userType === "influencer") {
        const stageName = formData.get("stageName") as string;
        const category = formData.get("category") as string;
        const pricePerPost = formData.get("pricePerPost") as string;

        await supabase.from("influencers").insert({
          user_id: data.user.id,
          stage_name: stageName,
          category: category,
          price_per_post: parseFloat(pricePerPost),
        });
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login.",
      });
    }

    setLoading(false);
  };

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-black via-background to-primary/10 p-4">
      <Card className="w-full max-w-md border-glass-border bg-card/80 backdrop-blur-xl shadow-2xl animate-fade-in">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-artist rounded-xl opacity-50 blur" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-artist flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent">
              ARCANA
            </CardTitle>
          </div>
          <CardDescription className="text-center text-base">
            Plataforma de Marketing de Influência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="brand" onValueChange={(v) => setUserType(v as any)}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="brand" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Marca
              </TabsTrigger>
              <TabsTrigger value="influencer" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Influencer
              </TabsTrigger>
              <TabsTrigger value="whitelabel" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Agência
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            {/* Brand Tab */}
            <TabsContent value="brand">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <p className="text-sm font-medium mb-2">Credenciais Demo:</p>
                    <p className="text-xs text-muted-foreground">Email: {demoCredentials.brand.email}</p>
                    <p className="text-xs text-muted-foreground">Senha: {demoCredentials.brand.password}</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="seu@email.com"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        placeholder="••••••••"
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome da Marca</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        type="text"
                        placeholder="Sua Empresa Inc."
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        placeholder="contato@suaempresa.com"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required 
                        minLength={6} 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Influencer Tab */}
            <TabsContent value="influencer">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <p className="text-sm font-medium mb-2">Credenciais Demo:</p>
                    <p className="text-xs text-muted-foreground">Email: {demoCredentials.influencer.email}</p>
                    <p className="text-xs text-muted-foreground">Senha: {demoCredentials.influencer.password}</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        placeholder="seu@email.com"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        placeholder="••••••••"
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        type="text"
                        placeholder="Seu Nome"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stageName">Nome Artístico</Label>
                      <Input 
                        id="stageName" 
                        name="stageName" 
                        type="text"
                        placeholder="@seunome"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input 
                        id="category" 
                        name="category" 
                        type="text" 
                        placeholder="Ex: Tech, Fitness, Fashion" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricePerPost">Preço por Post (R$)</Label>
                      <Input 
                        id="pricePerPost" 
                        name="pricePerPost" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        placeholder="1000.00"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        placeholder="seu@email.com"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required 
                        minLength={6} 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* White Label Tab */}
            <TabsContent value="whitelabel">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <p className="text-sm font-medium mb-2">Credenciais Demo:</p>
                    <p className="text-xs text-muted-foreground">Email: {demoCredentials.whitelabel.email}</p>
                    <p className="text-xs text-muted-foreground">Senha: {demoCredentials.whitelabel.password}</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        placeholder="agencia@exemplo.com"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        placeholder="••••••••"
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome da Agência</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        type="text"
                        placeholder="Growth Agency Pro"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        placeholder="contato@agencia.com"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required 
                        minLength={6} 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Admin Tab */}
            <TabsContent value="admin">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-destructive" />
                    Credenciais Demo Admin:
                  </p>
                  <p className="text-xs text-muted-foreground">Email: {demoCredentials.admin.email}</p>
                  <p className="text-xs text-muted-foreground">Senha: {demoCredentials.admin.password}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Administrativo</Label>
                  <Input 
                    id="admin-email" 
                    name="email" 
                    type="email"
                    placeholder="admin@arcana.com"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha</Label>
                  <Input 
                    id="admin-password" 
                    name="password" 
                    type="password"
                    placeholder="••••••••"
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Acessar Painel Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
