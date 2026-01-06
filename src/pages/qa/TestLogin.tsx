import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QA_CONFIG, isQAUser } from "@/lib/qa-config";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const TestLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Iniciando login de teste...");

  useEffect(() => {
    const performQALogin = async () => {
      try {
        // Check if already logged in as QA user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && isQAUser(user.email)) {
          setMessage("Usuário QA já autenticado. Redirecionando...");
          setStatus("success");
          setTimeout(() => navigate("/qa-dashboard"), 1000);
          return;
        }

        // Sign out any existing user
        if (user) {
          await supabase.auth.signOut();
        }

        setMessage("Tentando criar/autenticar usuário QA...");

        // Try to sign up first (in case QA user doesn't exist)
        const { error: signUpError } = await supabase.auth.signUp({
          email: QA_CONFIG.QA_USER_EMAIL,
          password: QA_CONFIG.QA_USER_PASSWORD,
          options: {
            data: {
              full_name: "QA Tester",
              user_type: QA_CONFIG.USER_TYPE,
            },
            emailRedirectTo: `${window.location.origin}/qa-dashboard`,
          },
        });

        // Ignore "user already exists" error
        if (signUpError && !signUpError.message.includes("already registered")) {
          console.log("Signup info:", signUpError.message);
        }

        setMessage("Autenticando usuário QA...");

        // Now sign in
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: QA_CONFIG.QA_USER_EMAIL,
          password: QA_CONFIG.QA_USER_PASSWORD,
        });

        if (loginError) {
          throw new Error(loginError.message);
        }

        if (loginData.user) {
          // Ensure QA user has admin role for full access
          const { error: roleError } = await supabase
            .from("user_roles")
            .upsert({
              user_id: loginData.user.id,
              role: "admin",
            }, {
              onConflict: "user_id,role"
            });

          if (roleError) {
            console.log("Role setup info:", roleError.message);
          }

          setStatus("success");
          setMessage("Login QA realizado com sucesso!");
          
          toast({
            title: "🧪 QA Mode Ativado",
            description: "Você está logado como usuário de teste. Todas as restrições de plano estão desabilitadas.",
          });

          setTimeout(() => navigate("/qa-dashboard"), 1500);
        }
      } catch (error: any) {
        console.error("QA Login error:", error);
        setStatus("error");
        setMessage(error.message || "Erro ao realizar login de teste");
        
        toast({
          variant: "destructive",
          title: "Erro no Login QA",
          description: error.message,
        });
      }
    };

    performQALogin();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-black via-background to-yellow-500/10 p-4">
      <Card className="w-full max-w-md border-yellow-500/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-yellow-500" />
            <CardTitle className="text-2xl font-bold text-yellow-500">
              QA TEST LOGIN
            </CardTitle>
          </div>
          <CardDescription className="text-yellow-500/80">
            Ambiente de Testes - Acesso Restrito
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {status === "loading" && (
              <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            )}
            {status === "success" && (
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
            )}
            {status === "error" && (
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground">{message}</p>
          </div>

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <h3 className="font-semibold text-yellow-500 mb-2">⚠️ Aviso Importante</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Esta rota é exclusiva para testes internos</li>
              <li>• Usuário QA não conta para métricas</li>
              <li>• Pagamentos e cobranças estão desabilitados</li>
              <li>• Emails automáticos não serão enviados</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Email: <code className="bg-muted px-1 rounded">{QA_CONFIG.QA_USER_EMAIL}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestLogin;
