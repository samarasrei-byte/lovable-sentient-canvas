import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) redirectToDashboard(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) redirectToDashboard(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const redirectToDashboard = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleData?.role === "admin") {
      navigate("/admin");
      return;
    }
    navigate("/app/dashboard");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao entrar", description: error.message });
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: banData } = await supabase
        .from("bans")
        .select("*")
        .eq("user_id", data.user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (banData) {
        await supabase.auth.signOut();
        toast({ variant: "destructive", title: "Acesso negado", description: "Sua conta foi suspensa." });
        setLoading(false);
        return;
      }
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
        data: { full_name: fullName, user_type: "brand" },
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
      },
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar conta", description: error.message });
      setLoading(false);
      return;
    }

    if (data.user) {
      toast({ title: "Conta criada!", description: "Verifique seu email para confirmar." });
    }
    setLoading(false);
  };

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/[0.04] blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">ARCANA</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "signup" ? "Crie sua conta e comece a criar" : "Bem-vindo de volta"}
          </p>
        </motion.div>

        {/* Glass card */}
        <div className="relative">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent" />
          <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] p-8">
            
            {/* Mode toggle */}
            <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-1 mb-8">
              {(["signup", "login"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    mode === m
                      ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "signup" ? "Criar conta" : "Entrar"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
                transition={{ duration: 0.25 }}
              >
                {mode === "signup" ? (
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
                      <Input
                        name="fullName"
                        placeholder="Seu nome"
                        required
                        className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 caracteres"
                          required
                          minLength={6}
                          className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 group"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Criar conta gratuita
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 group"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Entrar
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-transparent text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                  ou
                </span>
              </div>
            </div>

            {/* Demo access - subtle */}
            <button
              onClick={async () => {
                setLoading(true);
                const creds = { email: "marca@demo.com", password: "demo123" };
                const res = await supabase.auth.signInWithPassword(creds);
                if (res.error) {
                  await supabase.auth.signUp({
                    email: creds.email,
                    password: creds.password,
                    options: { data: { full_name: "Demo User", user_type: "brand" } },
                  });
                  await supabase.auth.signInWithPassword(creds);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground text-sm font-medium hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
            >
              Acessar demo
            </button>
          </div>
        </div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-muted-foreground/40 mt-6"
        >
          Ao criar conta, você concorda com nossos Termos de Uso
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
