import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react"; 
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Baby, Sparkles, Heart, Camera, Star, Shield,
  Loader2, CheckCircle2, MessageCircle, ArrowRight, Bell
} from "lucide-react";
import { toast } from "sonner";
import { ArcanaLogo } from "@/components/ArcanaLogo";

const PromptPurchaseFlow = lazy(() => import("@/components/PromptPurchaseFlow").then(m => ({ default: m.PromptPurchaseFlow })));

interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
  hype_text: string;
  example_image_url: string | null;
  price_cents: number;
  status: string;
  required_fields: string[];
  is_influencer_prompt: boolean;
  influencer_name: string | null;
  prompt_template?: string;
  negative_prompt?: string | null;
  ai_model?: string;
  min_photos?: number;
  is_featured?: boolean;
  display_order?: number;
}

const BENEFITS = [
  { icon: Camera, title: "Foto Profissional", desc: "Qualidade de estúdio premium" },
  { icon: Shield, title: "Fidelidade 100%", desc: "Rosto preservado perfeitamente" },
  { icon: Star, title: "Dezenas de Cenários", desc: "Temas para todas as idades" },
  { icon: Heart, title: "Memória Eterna", desc: "Eternize cada fase" },
];

const FILTERS = [
  { key: 'todos', label: 'Todos', emoji: '' },
  { key: 'popular', label: 'Populares', emoji: '🔥' },
  { key: 'personagens', label: 'Personagens', emoji: '🎭' },
  { key: 'newborn', label: 'Newborn', emoji: '👶' },
  { key: 'temas', label: 'Temas', emoji: '🎨' },
];

const CHARACTER_NAMES = ['mario', 'toy story', 'bob esponja', 'mcqueen', 'patrulha', 'barbie', 'branca de neve', 'shrek', 'aranha', 'super-herói', 'dinossauro', 'princesa', 'gelo', 'sereia', 'rei da selva'];
const NEWBORN_NAMES = ['newborn', 'bebê', 'dormindo', 'caminha', 'cestinha', 'pureza', 'anjo', 'rústico', 'arte de estúdio', 'vintage', 'sonho', 'elegante', 'elefante', 'ursinho', 'banho', 'spa', 'boho', 'profissional'];

const Mesversario = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleWhatsappSubmit = useCallback(async () => {
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.length < 10) {
      toast.error('Digite um WhatsApp válido com DDD');
      return;
    }
    setWhatsappLoading(true);
    try {
      await supabase.from('notifications').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        type: 'whatsapp_lead',
        title: 'Novo lead WhatsApp - Foto Infantil',
        message: `WhatsApp: ${cleaned}`,
        metadata: { whatsapp: cleaned, source: 'fotoinfantil_cta' }
      });
      setWhatsappSent(true);
      toast.success('Pronto! Você será o primeiro a saber das novidades 🎉');
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setWhatsappLoading(false);
    }
  }, [whatsapp]);

  const formatWhatsapp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      if (activeFilter === 'todos') return true;
      if (activeFilter === 'popular') return p.is_featured;
      const nameLower = p.name.toLowerCase();
      if (activeFilter === 'personagens') return CHARACTER_NAMES.some(c => nameLower.includes(c));
      if (activeFilter === 'newborn') return NEWBORN_NAMES.some(n => nameLower.includes(n));
      if (activeFilter === 'temas') return !CHARACTER_NAMES.some(c => nameLower.includes(c)) && !NEWBORN_NAMES.some(n => nameLower.includes(n));
      return true;
    });
  }, [prompts, activeFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPrompts();
  }, []);

  const fetchPrompts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("id,name,description,category,hype_text,example_image_url,price_cents,status,required_fields,is_influencer_prompt,influencer_name,ai_model,min_photos,is_featured,display_order")
        .eq("category", "Foto Infantil")
        .eq("status", "active")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setPrompts(
        (data || []).map((p: any) => ({
          ...p,
          required_fields: Array.isArray(p.required_fields)
            ? p.required_fields
            : JSON.parse(p.required_fields || "[]"),
        }))
      );
    } catch (err) {
      console.error("Error fetching mesversario prompts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectPrompt = useCallback(async (prompt: Prompt) => {
    if (prompt.prompt_template) {
      setSelectedPrompt(prompt);
      return;
    }
    setSelectedPrompt(prompt);
    try {
      const { data } = await supabase
        .from("prompts")
        .select("prompt_template,negative_prompt")
        .eq("id", prompt.id)
        .maybeSingle();
      if (data) {
        setSelectedPrompt((prev) => prev ? { ...prev, prompt_template: data.prompt_template, negative_prompt: data.negative_prompt } : prev);
      }
    } catch (err) {
      console.error("Error loading prompt template:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══════════ TOP NAV — Apple-clean ═══════════ */}
      <nav className="sticky top-0 z-50 w-full safe-area-top">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl border-b border-white/[0.04]" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <ArcanaLogo iconSize={18} textSize="text-base" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
          >
            Voltar
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ═══════════ HERO — Minimal & Clean ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(330 50% 50% / 0.12), transparent 60%)"
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
              <Baby className="w-3.5 h-3.5 text-pink-400/80" />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                Ensaio Infantil IA
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] mb-4 leading-[1.1]">
              <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                Ensaio Fotográfico
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400/90 via-rose-300/90 to-amber-300/80 bg-clip-text text-transparent">
                Infantil
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground/70 max-w-md mx-auto mb-10 leading-relaxed font-light">
              Envie uma foto do seu filho e nossa IA cria ensaios profissionais 
              em cenários encantadores, preservando cada detalhe.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: CheckCircle2, text: "Fidelidade facial 100%", color: "text-emerald-400/70" },
                { icon: Sparkles, text: "Qualidade 4K", color: "text-blue-400/70" },
                { icon: Star, text: "0 a 10 anos", color: "text-amber-400/70" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                  <badge.icon className={cn("w-3 h-3", badge.color)} />
                  <span className="text-[10px] text-muted-foreground/60 font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FILTER BAR — Liquid Glass Bottom ═══════════ */}
      <div className="sticky top-14 z-40">
        <div className="relative">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide justify-start md:justify-center">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 shrink-0",
                    activeFilter === f.key
                      ? "text-foreground"
                      : "text-muted-foreground/50 hover:text-muted-foreground/80"
                  )}
                >
                  {/* Liquid glass active indicator */}
                  {activeFilter === f.key && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.1] shadow-[0_0_20px_-4px_hsl(var(--primary)/0.15)]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {f.emoji && <span className="text-[11px]">{f.emoji}</span>}
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ GALLERY — Apple-style Cards ═══════════ */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-6 pb-20 relative z-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">Cenários</h2>
          <span className="text-xs text-muted-foreground/40 font-medium">
            {filteredPrompts.length} {filteredPrompts.length === 1 ? 'tema' : 'temas'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/20" />
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-20">
            <Baby className="w-8 h-8 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-muted-foreground/40 text-sm">Nenhum tema nessa categoria.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "grid gap-3 md:gap-4",
                isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}
            >
              {filteredPrompts.map((prompt, index) => (
                <motion.button
                  key={prompt.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => handleSelectPrompt(prompt)}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden text-left focus:outline-none",
                    "bg-white/[0.02] border border-white/[0.06]",
                    "hover:border-white/[0.12] hover:bg-white/[0.04]",
                    "active:scale-[0.98] transition-all duration-300",
                    "shadow-[0_2px_20px_-4px_rgba(0,0,0,0.3)]",
                    "hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)]"
                  )}
                >
                  {/* Image */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {prompt.example_image_url ? (
                      <img
                        src={prompt.example_image_url}
                        alt={prompt.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/5 to-amber-500/5">
                        <Baby className="w-10 h-10 text-muted-foreground/10" />
                      </div>
                    )}
                    
                    {/* Subtle bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Featured */}
                    {prompt.is_featured && (
                      <div className="absolute top-2.5 left-2.5">
                        <div className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                          <span className="text-[9px] font-semibold text-white/90 tracking-wide">🔥 Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Price — liquid pill */}
                    <div className="absolute top-2.5 right-2.5">
                      <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                        <span className="text-[11px] font-semibold text-white/95">
                          R$ {(prompt.price_cents / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-sm font-semibold text-white/95 mb-1 leading-snug tracking-tight">
                        {prompt.name}
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="w-2.5 h-2.5 text-white/50" />
                        <span className="text-[9px] text-white/50 font-medium">Toque para criar</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ═══════════ BENEFITS — Minimal grid ═══════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <h2 className="text-lg md:text-xl font-semibold text-center mb-12 tracking-tight">
            Por que escolher{" "}
            <span className="bg-gradient-to-r from-pink-400/80 to-amber-300/80 bg-clip-text text-transparent">
              Foto Infantil IA
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
              >
                <b.icon className="w-5 h-5 mx-auto mb-3 text-muted-foreground/40" />
                <h3 className="font-medium text-xs text-foreground/80 mb-1">{b.title}</h3>
                <p className="text-[10px] text-muted-foreground/40 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHATSAPP CTA — Epic ═══════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(270 60% 50% / 0.08), transparent 60%)"
        }} />
        
        <div className="relative z-10 max-w-lg mx-auto px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Card with gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20 p-px">
              <div className="w-full h-full rounded-3xl bg-background" />
            </div>
            
            <div className="relative p-8 md:p-10 text-center">
              {/* Animated icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </motion.div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-primary">Em breve</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Algo{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">
                  incrível
                </span>
                {" "}vem aí
              </h2>
              
              <p className="text-sm text-muted-foreground/60 mb-8 leading-relaxed max-w-sm mx-auto">
                Estamos preparando novidades que vão transformar a forma como você 
                cria fotos do seu filho. Deixe seu WhatsApp e seja o primeiro a saber.
              </p>

              {whatsappSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-foreground/80">Você está na lista VIP!</p>
                  <p className="text-xs text-muted-foreground/50">Avisaremos assim que as novidades estiverem prontas</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleWhatsappSubmit}
                    disabled={whatsappLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  >
                    {whatsappLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Quero ser avisado
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-muted-foreground/30">
                    Sem spam. Só novidades exclusivas.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-8 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <p className="text-[10px] text-muted-foreground/30 tracking-wide">
            © {new Date().getFullYear()} Arcana · Foto Infantil IA
          </p>
        </div>
      </footer>

      {/* Purchase Flow */}
      {selectedPrompt && (
        <PromptPurchaseFlow
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
};

export default Mesversario;
