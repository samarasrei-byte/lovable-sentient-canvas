import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Eye, EyeOff, Sparkles, Zap, Shield, Star } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { createNoise3D } from "simplex-noise";

// Mini wave canvas for left panel
const WaveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = createNoise3D();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nt = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#a855f7", "#6366f1", "#06b6d4", "#8b5cf6", "#ec4899"];

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.fillStyle = "rgba(0,0,0,0.03)";
      ctx.globalAlpha = 0.4;
      ctx.fillRect(0, 0, w, h);
      nt += 0.0015;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = 40;
        ctx.strokeStyle = colors[i % colors.length];
        for (let x = 0; x < w; x += 4) {
          const y = noise(x / 900, 0.3 * i, nt) * 120;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
      animId = requestAnimationFrame(render);
    };

    ctx.filter = "blur(15px)";
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Floating particles
const Particle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full bg-primary/30"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      y: [0, -30, 10, 0],
      x: [0, 15, -10, 0],
      opacity: [0.2, 0.6, 0.3, 0.2],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const FeatureItem = ({ icon: Icon, text, delay }: { icon: any; text: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 py-2"
  >
    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm text-foreground/80">{text}</span>
  </motion.div>
);


const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
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
      .from("user_roles").select("role").eq("user_id", userId).maybeSingle();
    if (roleData?.role === "admin") { navigate("/admin"); return; }
    navigate("/app/dashboard");
  };


  const checkIfBanned = async (userId: string) => {
    const { data: banData } = await supabase
      .from("bans")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (!banData) return false;

    await supabase.auth.signOut();
    toast({ variant: "destructive", title: "Acesso negado", description: "Sua conta foi suspensa." });
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim().toLowerCase();
    const password = fd.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao entrar", description: error.message });
      setLoading(false);
      return;
    }

    if (data.user && await checkIfBanned(data.user.id)) {
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const fullName = fd.get("fullName") as string;
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, user_type: "brand" }, emailRedirectTo: `${window.location.origin}/app/dashboard` },
    });
    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar conta", description: error.message });
      setLoading(false); return;
    }
    if (data.user) toast({ title: "Conta criada!", description: "Você já pode fazer login." });
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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* ===== LEFT — Animated Effects Panel ===== */}
      <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-screen overflow-hidden flex items-center justify-center">
        {/* Wave background */}
        <div className="absolute inset-0 bg-background">
          <WaveCanvas />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/80" />

        {/* Floating particles */}
        <Particle delay={0} size={6} x="20%" y="30%" />
        <Particle delay={1.5} size={4} x="70%" y="20%" />
        <Particle delay={3} size={8} x="50%" y="65%" />
        <Particle delay={0.8} size={5} x="80%" y="50%" />
        <Particle delay={2} size={7} x="15%" y="70%" />
        <Particle delay={4} size={3} x="60%" y="85%" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-12 lg:px-16 py-8 md:py-0 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6 md:mb-10">
              <motion.div
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40"
                animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ARCANA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-black text-foreground leading-[1.1] mb-3 md:mb-5">
              Transforme suas{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                fotos em arte
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-sm">
              IA generativa de última geração para criar imagens profissionais que viralizam.
            </p>

            {/* Features — hidden on very small, shown from sm+ */}
            <div className="hidden sm:block space-y-1">
              <FeatureItem icon={Sparkles} text="IA Generativa Premium para fotos pro" delay={0.3} />
              <FeatureItem icon={Shield} text="Seus dados sempre protegidos" delay={0.5} />
              <FeatureItem icon={Star} text="Resultados em segundos" delay={0.7} />
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 md:mt-10 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/50 to-secondary/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 + i * 0.1, type: "spring" }}
                  />
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">+2.400 criadores</p>
                <p className="text-[10px] text-muted-foreground">já estão na plataforma</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade for mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent md:hidden" />
      </div>

      {/* ===== RIGHT — Auth Form ===== */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 md:py-12 relative">
        {/* Subtle ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[420px]"
        >
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Entre para continuar criando
            </p>
          </div>

          {/* Glass card */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent" />
            <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] p-6 md:p-7">

              {/* Login form only */}
              <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                        <Input name="email" type="email" placeholder="seu@email.com" required
                          className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
                        <div className="relative">
                          <Input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                            className="h-12 bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all pr-12" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 group mt-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>Entrar <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                        )}
                      </button>
              </form>

            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center text-[11px] text-muted-foreground/40 mt-6">
            Acesso restrito à administração
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
