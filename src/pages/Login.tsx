import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Eye, EyeOff, Sparkles, Zap, Shield, Star } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

// Left panel animated orbs
const FloatingOrb = ({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ width: size, height: size, left: x, top: y, background: color, filter: "blur(60px)" }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.6, 0.3],
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
    }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const GridPattern = () => (
  <div className="absolute inset-0 opacity-[0.04]" style={{
    backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
  }} />
);

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any; title: string; desc: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
  >
    <div className="p-2 rounded-xl bg-primary/20">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  </motion.div>
);

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
    <div className="min-h-screen flex bg-background">
      {/* ===== LEFT PANEL — Effects & Branding ===== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/[0.08] to-secondary/[0.06]" />
        <FloatingOrb delay={0} size={300} x="10%" y="20%" color="hsl(var(--primary) / 0.25)" />
        <FloatingOrb delay={2} size={200} x="60%" y="60%" color="hsl(var(--secondary) / 0.2)" />
        <FloatingOrb delay={4} size={250} x="30%" y="70%" color="hsl(var(--accent) / 0.15)" />
        <FloatingOrb delay={1} size={180} x="70%" y="15%" color="hsl(var(--primary) / 0.15)" />
        <GridPattern />

        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              style={{ top: `${20 + i * 15}%`, width: "120%" }}
              animate={{ x: ["-20%", "0%"] }}
              transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ARCANA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl xl:text-5xl font-black text-foreground leading-[1.1] mb-4">
              Transforme suas
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                fotos em arte
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              IA generativa de última geração para criar imagens profissionais que viralizam nas redes sociais.
            </p>

            {/* Feature cards */}
            <div className="space-y-3">
              <FeatureCard icon={Sparkles} title="IA Generativa Premium" desc="Modelos treinados para fotos profissionais" delay={0.4} />
              <FeatureCard icon={Shield} title="Dados Protegidos" desc="Suas fotos nunca são compartilhadas" delay={0.6} />
              <FeatureCard icon={Star} title="Resultados em Segundos" desc="Geração ultra-rápida com qualidade studio" delay={0.8} />
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-secondary/40"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">+2.400 criadores</p>
                <p className="text-xs text-muted-foreground">já estão usando a plataforma</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ===== RIGHT PANEL — Auth Form ===== */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 relative">
        {/* Subtle background effects for mobile */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/[0.06] blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-secondary/[0.04] blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ARCANA</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-foreground">
              {mode === "signup" ? "Crie sua conta" : "Bem-vindo de volta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signup" ? "Comece a criar imagens incríveis com IA" : "Entre para continuar criando"}
            </p>
          </div>

          {/* Glass card */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent" />
            <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] p-7">
              
              {/* Mode toggle */}
              <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-1 mb-7">
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
                    <form onSubmit={handleSignup} className="space-y-4">
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
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 group mt-6"
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
                    <form onSubmit={handleLogin} className="space-y-4">
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
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 group mt-6"
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
                  <span className="px-3 bg-transparent text-[10px] text-muted-foreground/40 uppercase tracking-widest">ou</span>
                </div>
              </div>

              {/* Demo access */}
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
    </div>
  );
};

export default Login;
