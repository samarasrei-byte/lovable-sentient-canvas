import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"brand" | "influencer">("brand");

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

    // Check user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    if (roleData?.role !== userType) {
      await supabase.auth.signOut();
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: `Esta conta não é do tipo ${userType === "brand" ? "Marca" : "Influenciador"}`,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta.",
    });

    navigate("/app/dashboard");
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
      // Add user role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: userType,
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

      navigate("/app/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Arcana</CardTitle>
          <CardDescription className="text-center">
            Entre ou crie sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="brand" onValueChange={(v) => setUserType(v as "brand" | "influencer")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="brand">Marca</TabsTrigger>
              <TabsTrigger value="influencer">Influenciador</TabsTrigger>
            </TabsList>

            <TabsContent value="brand">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome da Marca</Label>
                      <Input id="fullName" name="fullName" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" name="password" type="password" required minLength={6} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="influencer">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input id="fullName" name="fullName" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stageName">Nome Artístico</Label>
                      <Input id="stageName" name="stageName" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input id="category" name="category" type="text" placeholder="Ex: Tech, Fitness, Fashion" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricePerPost">Preço por Post (R$)</Label>
                      <Input id="pricePerPost" name="pricePerPost" type="number" step="0.01" min="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" name="password" type="password" required minLength={6} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
