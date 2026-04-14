import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PromptPurchaseFlow } from "@/components/PromptPurchaseFlow";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft, Baby, Sparkles, Heart, Camera, Star, Shield,
  Loader2, Upload, CheckCircle2
} from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

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
  { icon: Camera, title: "Foto Profissional", desc: "Qualidade de estúdio premium para todas as idades" },
  { icon: Shield, title: "Fidelidade 100%", desc: "O rosto do seu filho preservado perfeitamente" },
  { icon: Star, title: "Dezenas de Cenários", desc: "Temas para bebês e crianças até 10 anos" },
  { icon: Heart, title: "Memória Eterna", desc: "Eternize cada fase do seu filho" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Escolha o Tema", desc: "Selecione entre dezenas de cenários encantadores" },
  { step: "2", title: "Envie a Foto", desc: "Suba uma foto nítida do rosto do seu filho" },
  { step: "3", title: "Receba a Magia", desc: "Nossa IA coloca seu filho no cenário escolhido" },
];

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'popular', label: '🔥 Populares' },
  { key: 'personagens', label: '🎭 Personagens' },
  { key: 'newborn', label: '👶 Newborn' },
  { key: 'temas', label: '🎨 Temas' },
];

const CHARACTER_NAMES = ['mario', 'toy story', 'bob esponja', 'mcqueen', 'patrulha', 'barbie', 'branca de neve', 'shrek', 'aranha', 'super-herói', 'dinossauro', 'princesa', 'gelo', 'sereia', 'rei da selva'];
const NEWBORN_NAMES = ['newborn', 'bebê', 'dormindo', 'caminha', 'cestinha', 'pureza', 'anjo', 'rústico', 'arte de estúdio', 'vintage', 'sonho', 'elegante', 'elefante', 'ursinho', 'banho', 'spa', 'boho', 'profissional'];

const Mesversario = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');
  const isMobile = useIsMobile();

  const filteredPrompts = prompts.filter((p) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'popular') return p.is_featured;
    const nameLower = p.name.toLowerCase();
    if (activeFilter === 'personagens') return CHARACTER_NAMES.some(c => nameLower.includes(c));
    if (activeFilter === 'newborn') return NEWBORN_NAMES.some(n => nameLower.includes(n));
    if (activeFilter === 'temas') return !CHARACTER_NAMES.some(c => nameLower.includes(c)) && !NEWBORN_NAMES.some(n => nameLower.includes(n));
    return true;
  });


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
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
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 20%, hsl(330 60% 50% / 0.12), transparent 55%), radial-gradient(ellipse at 70% 70%, hsl(40 80% 60% / 0.1), transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(280 40% 50% / 0.06), transparent 60%)"
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-16 left-[10%] w-3 h-3 rounded-full bg-pink-400/30"
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-32 right-[15%] w-2 h-2 rounded-full bg-yellow-400/40"
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-[20%] w-4 h-4 rounded-full bg-purple-400/20"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-20 md:pt-14 md:pb-28">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                <Baby className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-pink-400">
                  ENSAIO INFANTIL IA
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
                <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                  Ensaio Fotográfico
                </span>
                <br />
                <span className="text-foreground/90 text-3xl md:text-4xl lg:text-5xl font-light">
                  Infantil
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                Envie uma foto do seu filho, de recém-nascido a 10 anos, e nossa IA 
                cria ensaios fotográficos profissionais em cenários encantadores, 
                preservando cada detalhe do rostinho que você ama.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Fidelidade facial 100%</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs text-blue-400 font-medium">Qualidade 4K</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">Bebês e crianças até 10 anos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ GALERIA DE TEMAS ═══════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 md:-mt-14 relative z-20 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Escolha o Cenário Perfeito</h2>
          <p className="text-muted-foreground text-sm">Cada tema é um ensaio fotográfico completo. Toque para criar.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink-400/40" />
          </div>
        ) : (
          <div className={cn(
            "grid gap-3 md:gap-4",
            isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}>
            {prompts.map((prompt, index) => (
              <motion.button
                key={prompt.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                onClick={() => setSelectedPrompt(prompt)}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-card active:scale-[0.97] hover:border-pink-500/30 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-pink-500/40 shadow-lg shadow-black/20"
              >
                {/* Image */}
                <div className="aspect-[3/4] relative overflow-hidden bg-muted/20">
                  {prompt.example_image_url ? (
                    <img
                      src={prompt.example_image_url}
                      alt={prompt.name}
                      className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.08] group-active:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/10 to-amber-500/10">
                      <Baby className="w-12 h-12 text-pink-400/30" />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Featured badge */}
                  {prompt.is_featured && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                      <span className="text-[9px] font-black text-white tracking-wider uppercase">🔥 Popular</span>
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/90 to-primary shadow-lg shadow-primary/30 border border-white/20">
                    <span className="text-[11px] font-black text-primary-foreground">
                      R$ {(prompt.price_cents / 100).toFixed(0)}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-bold text-white mb-1.5 leading-tight drop-shadow-lg">
                      {prompt.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm">
                        <Camera className="w-2.5 h-2.5 text-pink-300" />
                        <span className="text-[9px] text-white/90 font-medium">Toque para criar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ COMO FUNCIONA ═══════════ */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(330 50% 50% / 0.05), transparent 60%)"
        }} />
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-amber-500/20 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-black bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFÍCIOS ═══════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Por que escolher nosso{" "}
            <span className="bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
              Foto Infantil IA
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-5 rounded-2xl bg-card border border-border hover:border-pink-500/20 transition-colors"
              >
                <b.icon className="w-7 h-7 mx-auto mb-3 text-pink-400" />
                <h3 className="font-bold text-sm text-foreground mb-1">{b.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Baby className="w-10 h-10 mx-auto mb-4 text-pink-400/60" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Eternize cada{" "}
              <span className="bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
                fase
              </span>{" "}
              do seu filho
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              De recém-nascido a 10 anos, cada fase é única e passa rápido. 
              Crie memórias profissionais que você vai guardar para sempre.
            </p>
            <GlassButton
              variant="neon"
              size="lg"
              onClick={() => {
                document.querySelector('.grid.gap-4')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Escolher um Tema
            </GlassButton>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER MINIMAL ═══════════ */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Arcana · Foto Infantil IA. Todos os direitos reservados.
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
