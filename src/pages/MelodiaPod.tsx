import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Play,
  ArrowRight,
  Heart,
  Gift,
  Cake,
  Sparkles,
  Mic,
  Headphones,
  ChevronDown,
  Mail,
  Instagram,
  MessageCircle,
  Menu,
  X,
  GraduationCap,
  Baby,
  Users,
  Church,
  TreePine,
  Music2,
  Send,
  Flame,
} from "lucide-react";
import { ArcanaLogo } from "@/components/ArcanaLogo";

// MelodiaPod by ARCANA — Light premium with vibrant orange accent.
// Bigger typography, floating boxes, lead form modal on CTA click.

const WHATSAPP_NUMBER = "5511963403691";
const EMAIL = "contato@arcana.app.br";

// ARCANA palette + Vibrant Orange highlight
const C = {
  bg: "#FFFFFF",
  bgAlt: "#FAFAFB",
  surface: "rgba(15,15,26,0.03)",
  ink: "#0B0B12",
  inkSoft: "rgba(11,11,18,0.66)",
  inkMuted: "rgba(11,11,18,0.45)",
  primary: "#A855F7",        // Arcana purple
  primaryGlow: "#C084FC",
  cyan: "#0891B2",
  pink: "#EC4899",
  // 🟠 NEW vibrant accent — used to highlight "trilha sonora" + key CTAs
  orange: "#FF6A1A",
  orangeDeep: "#FF3D00",
  orangeSoft: "#FFB088",
  line: "rgba(11,11,18,0.08)",
  lineStrong: "rgba(11,11,18,0.14)",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800;900&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONTS_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONTS_HREF;
    document.head.appendChild(l);
  }, []);
}

const serif: React.CSSProperties = {
  fontFamily: "'Instrument Serif', 'Times New Roman', serif",
  fontWeight: 400,
  letterSpacing: "-0.025em",
};
const sans: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

// Orange accent gradient (for highlighted words + main CTA)
const orangeGradientText: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.orangeDeep}, ${C.orange})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// Purple/cyan gradient (used for secondary highlights + brand)
const brandGradientText: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ── Brand Lockup: ARCANA logo + MelodiaPod subtitle ───────────
const BrandLockup = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const cfg = {
    sm: { icon: 14, text: "text-sm", sub: "text-[9px]" },
    md: { icon: 18, text: "text-lg", sub: "text-[10px]" },
    lg: { icon: 22, text: "text-xl", sub: "text-[11px]" },
  }[size];
  return (
    <div className="flex flex-col leading-none">
      <ArcanaLogo iconSize={cfg.icon} textSize={cfg.text} />
      <span
        className={`${cfg.sub} mt-1 tracking-[0.32em] uppercase font-semibold pl-[26px]`}
        style={{ color: C.orange, ...sans }}
      >
        MelodiaPod
      </span>
    </div>
  );
};

const Chip = ({
  children,
  tone = "purple",
}: {
  children: React.ReactNode;
  tone?: "purple" | "orange";
}) => {
  const palette =
    tone === "orange"
      ? {
          bg: "rgba(255,106,26,0.10)",
          border: "rgba(255,106,26,0.28)",
          color: C.orangeDeep,
        }
      : {
          bg: "rgba(168,85,247,0.08)",
          border: "rgba(168,85,247,0.20)",
          color: C.primary,
        };
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
      style={{
        ...sans,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

const PrimaryBtn = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all duration-300 active:scale-[0.98] hover:scale-[1.03]"
    style={{
      ...sans,
      background: `linear-gradient(135deg, ${C.orangeDeep}, ${C.orange})`,
      color: "#FFFFFF",
      boxShadow: `0 18px 44px -10px rgba(255,61,0,0.55)`,
    }}
  >
    {children}
    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const GhostBtn = ({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const cls =
    "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 active:scale-[0.98] hover:bg-black/[0.04]";
  const style: React.CSSProperties = {
    ...sans,
    background: "rgba(11,11,18,0.02)",
    color: C.ink,
    border: `1px solid ${C.lineStrong}`,
  };
  return href ? (
    <a href={href} className={cls} style={style}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
};

// ── Waveform pseudo decoration ─────────────────────────────────
const Waveform = ({ color, seed = 1 }: { color: string; seed?: number }) => (
  <div className="flex items-end justify-center gap-[3px] h-14 w-full">
    {Array.from({ length: 44 }).map((_, k) => {
      const h = 25 + Math.abs(Math.sin((k + seed) * 0.6)) * 75;
      return (
        <div
          key={k}
          className="rounded-full"
          style={{
            width: 3,
            height: `${h}%`,
            background: color,
            opacity: 0.85,
          }}
        />
      );
    })}
  </div>
);

// ── Lead Form Modal ────────────────────────────────────────────
type LeadForm = {
  name: string;
  occasion: string;
  honoree: string;
  story: string;
  style: string;
  contact: string;
};

const OCCASIONS = [
  "Aniversário", "Casamento", "Pedido de Namoro", "Pedido de Casamento",
  "Dia das Mães", "Dia dos Pais", "Novo Bebê", "Mesversário",
  "Formatura", "Amizade", "Natal", "Sem Motivo Especial",
];
const STYLES = [
  "Pop", "Sertanejo", "MPB", "Bossa Nova", "Acústico",
  "Romântico", "Lo-fi", "Infantil", "Rock", "Eletrônica",
];

const LeadModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LeadForm>({
    name: "", occasion: "", honoree: "", story: "", style: "", contact: "",
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const update = (k: keyof LeadForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    const msg =
      `🎵 *Nova música personalizada — MelodiaPod*\n\n` +
      `*Nome:* ${form.name}\n` +
      `*Ocasião:* ${form.occasion}\n` +
      `*Para quem:* ${form.honoree}\n` +
      `*História:* ${form.story}\n` +
      `*Estilo musical:* ${form.style}\n` +
      `*Contato:* ${form.contact}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    onClose();
  };

  const canNext =
    (step === 0 && form.name.trim() && form.occasion) ||
    (step === 1 && form.honoree.trim() && form.story.trim().length >= 10) ||
    (step === 2 && form.style && form.contact.trim().length >= 8);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
        style={{ background: "rgba(11,11,18,0.55)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:max-w-xl bg-white rounded-t-[28px] md:rounded-[28px] overflow-hidden"
          style={{
            boxShadow: "0 40px 100px -20px rgba(11,11,18,0.4)",
            maxHeight: "92dvh",
          }}
        >
          {/* Header */}
          <div
            className="px-6 md:px-8 pt-7 pb-6 relative"
            style={{
              background: `linear-gradient(135deg, rgba(255,61,0,0.06), rgba(168,85,247,0.06))`,
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5"
            >
              <X className="w-5 h-5" style={{ color: C.ink }} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4" style={{ color: C.orange }} />
              <span
                className="text-[11px] font-bold tracking-[0.22em] uppercase"
                style={{ color: C.orange, ...sans }}
              >
                Sua música em 3 passos
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl" style={{ ...serif, color: C.ink }}>
              Conte sua história
            </h3>
            {/* Steps progress */}
            <div className="flex gap-1.5 mt-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full flex-1 transition-all duration-500"
                  style={{
                    background:
                      i <= step
                        ? `linear-gradient(90deg, ${C.orangeDeep}, ${C.orange})`
                        : "rgba(11,11,18,0.08)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div
            className="px-6 md:px-8 py-6 overflow-y-auto"
            style={{ maxHeight: "55vh", ...sans }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <Field label="Seu nome">
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.orange)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.line)}
                  />
                </Field>
                <Field label="Qual a ocasião?">
                  <div className="grid grid-cols-2 gap-2">
                    {OCCASIONS.map((o) => (
                      <button
                        key={o}
                        onClick={() => update("occasion", o)}
                        className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                        style={{
                          background: form.occasion === o ? `${C.orange}15` : C.bgAlt,
                          border: `1px solid ${form.occasion === o ? C.orange : C.line}`,
                          color: form.occasion === o ? C.orangeDeep : C.ink,
                        }}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <Field label="Para quem é a música?">
                  <input
                    value={form.honoree}
                    onChange={(e) => update("honoree", e.target.value)}
                    placeholder="Nome da pessoa homenageada"
                    className="w-full px-4 py-3.5 rounded-xl text-base outline-none"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.orange)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.line)}
                  />
                </Field>
                <Field label="Conte a história ✨">
                  <textarea
                    value={form.story}
                    onChange={(e) => update("story", e.target.value)}
                    placeholder="Como vocês se conheceram, momentos marcantes, frases especiais, sentimentos…"
                    rows={6}
                    className="w-full px-4 py-3.5 rounded-xl text-base outline-none resize-none leading-relaxed"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.orange)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.line)}
                  />
                  <span className="text-xs mt-1 block" style={{ color: C.inkMuted }}>
                    Quanto mais detalhes, mais íntima a canção.
                  </span>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <Field label="Estilo musical">
                  <div className="grid grid-cols-2 gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s}
                        onClick={() => update("style", s)}
                        className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: form.style === s ? `${C.orange}15` : C.bgAlt,
                          border: `1px solid ${form.style === s ? C.orange : C.line}`,
                          color: form.style === s ? C.orangeDeep : C.ink,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="WhatsApp ou e-mail">
                  <input
                    value={form.contact}
                    onChange={(e) => update("contact", e.target.value)}
                    placeholder="Para enviarmos sua música"
                    className="w-full px-4 py-3.5 rounded-xl text-base outline-none"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.orange)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.line)}
                  />
                </Field>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 md:px-8 py-4 flex items-center justify-between gap-3"
            style={{ borderTop: `1px solid ${C.line}`, background: "#FFFFFF" }}
          >
            <button
              onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
              className="text-sm font-semibold px-4 py-2.5 rounded-full"
              style={{ color: C.inkSoft }}
            >
              {step === 0 ? "Cancelar" : "Voltar"}
            </button>
            {step < 2 ? (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all disabled:opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${C.orangeDeep}, ${C.orange})`,
                  color: "#FFFFFF",
                  boxShadow: canNext ? `0 10px 28px -8px rgba(255,61,0,0.5)` : "none",
                }}
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => canNext && submit()}
                disabled={!canNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all disabled:opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${C.orangeDeep}, ${C.orange})`,
                  color: "#FFFFFF",
                  boxShadow: canNext ? `0 10px 28px -8px rgba(255,61,0,0.5)` : "none",
                }}
              >
                Enviar pedido <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label
      className="text-xs font-bold tracking-[0.16em] uppercase mb-2 block"
      style={{ color: C.inkSoft }}
    >
      {label}
    </label>
    {children}
  </div>
);

// ── Page ───────────────────────────────────────────────────────
export default function MelodiaPod() {
  useFonts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [leadOpen, setLeadOpen] = useState(false);

  const openLead = () => setLeadOpen(true);

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: C.bg, color: C.ink, ...sans }}
    >
      {/* Ambient soft blobs — orange + purple */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-32 -left-32 w-[520px] h-[520px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,106,26,0.14), transparent 60%)`,
          filter: "blur(70px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-[40%] -right-40 w-[560px] h-[560px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(168,85,247,0.10), transparent 60%)`,
          filter: "blur(80px)",
        }}
      />

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            borderBottom: `1px solid ${C.line}`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center">
            <BrandLockup size="md" />
          </a>

          <div className="hidden md:flex items-center gap-1">
            {[
              ["#como-funciona", "Como Funciona"],
              ["#ocasioes", "Ocasiões"],
              ["#exemplos", "Exemplos"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-3.5 py-2 rounded-full text-[14px] font-medium transition-colors"
                style={{ color: C.inkSoft }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.inkSoft)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={openLead}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${C.orangeDeep}, ${C.orange})`,
                color: "#FFFFFF",
                boxShadow: `0 10px 28px -8px rgba(255,61,0,0.5)`,
              }}
            >
              Começar agora <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${C.line}`,
            }}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" style={{ color: C.ink }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50"
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between h-16 px-5">
              <BrandLockup size="md" />
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
                <X className="w-6 h-6" style={{ color: C.ink }} />
              </button>
            </div>
            <div className="flex flex-col px-5 pt-6 gap-1">
              {[
                ["#como-funciona", "Como Funciona"],
                ["#ocasioes", "Ocasiões"],
                ["#exemplos", "Exemplos"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3.5 text-3xl"
                  style={{ ...serif, color: C.ink }}
                >
                  {label}
                </a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); openLead(); }}
                className="mt-6 inline-flex items-center justify-center gap-2 py-4 rounded-full text-base font-bold"
                style={{
                  background: `linear-gradient(135deg, ${C.orangeDeep}, ${C.orange})`,
                  color: "#FFFFFF",
                  boxShadow: `0 10px 28px -8px rgba(255,61,0,0.5)`,
                }}
              >
                Começar agora <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section
        id="top"
        className="relative pt-36 md:pt-48 pb-24 md:pb-32 px-5 md:px-8"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center mb-8 gap-2 flex-wrap">
              <Chip tone="orange">
                <Flame className="w-3.5 h-3.5" /> Áudio em 2K
              </Chip>
              <Chip>
                <Sparkles className="w-3 h-3" style={{ color: C.cyan }} />
                Powered by ARCANA
              </Chip>
            </div>

            <h1
              className="text-[52px] sm:text-7xl md:text-[88px] lg:text-[108px] leading-[0.92] mb-7"
              style={{ ...serif, color: C.ink }}
            >
              A{" "}
              <em
                style={{
                  ...serif,
                  fontStyle: "italic",
                  ...orangeGradientText,
                }}
              >
                trilha sonora
              </em>{" "}
              <br />
              da sua{" "}
              <em style={{ ...serif, fontStyle: "italic", ...brandGradientText }}>
                história.
              </em>
            </h1>

            <p
              className="max-w-2xl mx-auto text-lg md:text-2xl leading-relaxed mb-12 font-light"
              style={{ color: C.inkSoft }}
            >
              Conte um momento — nós transformamos em uma canção única,
              produzida em estúdio com IA. Pronta em minutos, em qualidade{" "}
              <strong style={{ color: C.orangeDeep, fontWeight: 700 }}>2K</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryBtn onClick={openLead}>Criar minha música</PrimaryBtn>
              <GhostBtn href="#exemplos">
                <Play className="w-4 h-4" /> Ouvir exemplos
              </GhostBtn>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        id="como-funciona"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip tone="orange">3 passos</Chip>
            <h2
              className="mt-6 text-5xl md:text-7xl"
              style={{ ...serif, color: C.ink }}
            >
              Simples como uma{" "}
              <em style={{ ...serif, fontStyle: "italic", ...orangeGradientText }}>
                conversa.
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                n: "01",
                icon: Mic,
                t: "Conte sua história",
                d: "Nome, ocasião, sentimentos, frases marcantes. Quanto mais detalhe, mais íntima a canção.",
                color: C.orange,
              },
              {
                n: "02",
                icon: Music,
                t: "Escolha o estilo",
                d: "Pop, sertanejo, bossa, lo-fi, romântica… Tipo de voz, ritmo e clima — tudo no seu jeito.",
                color: C.primary,
              },
              {
                n: "03",
                icon: Headphones,
                t: "Receba e compartilhe",
                d: "Em poucos minutos sua música chega por e-mail e WhatsApp, em qualidade 2K, pronta pra emocionar.",
                color: C.cyan,
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl p-8 md:p-10 relative overflow-hidden transition-all hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 20px 60px -20px rgba(11,11,18,0.10)`,
                }}
              >
                <div className="flex items-center justify-between mb-8">
                  <span
                    className="text-[12px] tracking-[0.24em] font-bold"
                    style={{ color: step.color }}
                  >
                    PASSO {step.n}
                  </span>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, ${C.orange})`,
                      boxShadow: `0 12px 28px -8px ${step.color}66`,
                    }}
                  >
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3
                  className="text-3xl md:text-4xl mb-4"
                  style={{ ...serif, color: C.ink }}
                >
                  {step.t}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: C.inkSoft }}
                >
                  {step.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OCASIÕES — Floating boxes ═══ */}
      <section
        id="ocasioes"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
        style={{ background: C.bgAlt }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip>Para cada momento</Chip>
            <h2
              className="mt-6 text-5xl md:text-7xl"
              style={{ ...serif, color: C.ink }}
            >
              Cada ocasião merece{" "}
              <em style={{ ...serif, fontStyle: "italic", ...orangeGradientText }}>
                uma canção.
              </em>
            </h2>
            <p
              className="mt-6 max-w-xl mx-auto text-lg md:text-xl font-light"
              style={{ color: C.inkSoft }}
            >
              De aniversários a pedidos de casamento, criamos músicas para todos
              os momentos que merecem ser lembrados para sempre.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Heart, t: "Amor", color: C.pink },
              { icon: Sparkles, t: "Casamento", color: C.cyan },
              { icon: Cake, t: "Aniversário", color: C.orange },
              { icon: Users, t: "Dia das Mães", color: C.pink },
              { icon: Users, t: "Dia dos Pais", color: C.cyan },
              { icon: Heart, t: "Amizade", color: C.primary },
              { icon: Baby, t: "Novo Bebê", color: C.orange },
              { icon: GraduationCap, t: "Formatura", color: C.cyan },
              { icon: Gift, t: "Pedido de Namoro", color: C.pink },
              { icon: Church, t: "Pedido de Casamento", color: C.primary },
              { icon: TreePine, t: "Natal", color: C.orange },
              { icon: Music2, t: "Sem Motivo Especial", color: C.cyan },
            ].map((o, i) => (
              <motion.button
                key={o.t}
                onClick={openLead}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl p-6 md:p-7 flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] md:min-h-[180px] group"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 12px 32px -12px rgba(11,11,18,0.08)`,
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 24px 48px -16px ${o.color}40`;
                  e.currentTarget.style.borderColor = `${o.color}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 32px -12px rgba(11,11,18,0.08)`;
                  e.currentTarget.style.borderColor = C.line;
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${o.color}20, ${o.color}10)`,
                    border: `1px solid ${o.color}30`,
                  }}
                >
                  <o.icon className="w-7 h-7" style={{ color: o.color }} />
                </div>
                <h3
                  className="text-base md:text-lg font-semibold"
                  style={{ color: C.ink, ...sans }}
                >
                  {o.t}
                </h3>
              </motion.button>
            ))}
          </div>

          <div className="mt-14 text-center">
            <PrimaryBtn onClick={openLead}>Criar minha música</PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ═══ EXEMPLOS DE MÚSICAS ═══ */}
      <section
        id="exemplos"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Chip tone="orange">Exemplos reais</Chip>
            <h2
              className="mt-6 text-5xl md:text-7xl"
              style={{ ...serif, color: C.ink }}
            >
              Músicas{" "}
              <em style={{ ...serif, fontStyle: "italic", ...orangeGradientText }}>
                criadas.
              </em>
            </h2>
            <p
              className="mt-6 max-w-xl mx-auto text-lg md:text-xl font-light"
              style={{ color: C.inkSoft }}
            >
              Cada música é única, criada a partir da história de quem pediu.
              Ouça alguns exemplos e imagine a sua.
            </p>
          </div>

          <div className="grid gap-5">
            {[
              { name: "Hebert", desc: "Canção de amor", duration: "2:41", style: "Pop", color: C.orange, seed: 1 },
              { name: "Alice", desc: "Canção de amor", duration: "2:38", style: "Acústico", color: C.pink, seed: 3 },
              { name: "Marina & Pedro", desc: "Pedido de casamento", duration: "3:12", style: "Romântico", color: C.cyan, seed: 5 },
              { name: "Pequeno João", desc: "Mesversário · 6 meses", duration: "2:18", style: "Lullaby", color: C.primary, seed: 7 },
            ].map((ex, i) => (
              <motion.div
                key={ex.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl p-7 md:p-9 transition-all hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 18px 48px -16px rgba(11,11,18,0.10)`,
                }}
              >
                <div className="mb-6 px-2">
                  <Waveform color={ex.color} seed={ex.seed} />
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <h3
                      className="text-3xl md:text-4xl mb-1.5"
                      style={{ ...serif, color: C.ink }}
                    >
                      {ex.name}
                    </h3>
                    <p className="text-base" style={{ color: C.inkSoft }}>
                      {ex.desc}
                    </p>
                    <p
                      className="text-xs mt-3 tabular-nums font-semibold tracking-wider"
                      style={{ color: C.inkMuted }}
                    >
                      {ex.duration} · 2K
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span
                      className="text-xs font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        color: ex.color,
                        background: `${ex.color}12`,
                        border: `1px solid ${ex.color}30`,
                      }}
                    >
                      {ex.style}
                    </span>
                    <button
                      aria-label={`Ouvir ${ex.name}`}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, ${ex.color}, ${C.orange})`,
                        boxShadow: `0 14px 32px -8px ${ex.color}80`,
                      }}
                    >
                      <Play
                        className="w-6 h-6 md:w-7 md:h-7 text-white ml-0.5"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <PrimaryBtn onClick={openLead}>Quero a minha música</PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section
        id="faq"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
        style={{ background: C.bgAlt }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Chip>Perguntas frequentes</Chip>
            <h2
              className="mt-6 text-5xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Tudo que você quer{" "}
              <em style={{ ...serif, fontStyle: "italic", ...orangeGradientText }}>
                saber.
              </em>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Quanto tempo leva pra receber minha música?", a: "A maioria das músicas é entregue em até 5 minutos após o pagamento, em qualidade 2K." },
              { q: "Posso escolher o estilo musical?", a: "Sim! Pop, sertanejo, MPB, bossa, lo-fi, eletrônica, romântica, infantil… é só escolher no formulário." },
              { q: "A música é minha pra sempre?", a: "Sim. Você recebe o arquivo em alta qualidade e tem direito de uso pessoal e compartilhamento." },
              { q: "E se eu não gostar do resultado?", a: "Garantia total: ajustamos ou criamos uma nova versão sem custo até você amar." },
              { q: "Como faço o pagamento?", a: "Aceitamos PIX, cartão e boleto. Tudo seguro e rápido pelo nosso checkout." },
            ].map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${open ? C.orange + "55" : C.line}`,
                    boxShadow: open ? `0 12px 32px -16px rgba(255,106,26,0.25)` : "none",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between text-left p-6 md:p-7"
                  >
                    <span
                      className="text-lg md:text-xl font-semibold pr-4"
                      style={{ color: C.ink }}
                    >
                      {f.q}
                    </span>
                    <ChevronDown
                      className="w-5 h-5 shrink-0 transition-transform duration-300"
                      style={{
                        color: open ? C.orange : C.inkSoft,
                        transform: open ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>
                  {open && (
                    <div
                      className="px-6 md:px-7 pb-7 text-base leading-relaxed"
                      style={{ color: C.inkSoft }}
                    >
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="cta" className="px-5 md:px-8 py-24 md:py-32 relative z-10">
        <div
          className="max-w-3xl mx-auto rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,61,0,0.10), rgba(168,85,247,0.06))",
            border: `1px solid rgba(255,106,26,0.25)`,
            boxShadow: `0 40px 100px -30px rgba(255,61,0,0.30)`,
          }}
        >
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[440px] h-[440px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${C.orange}, transparent 60%)`,
              opacity: 0.2,
              filter: "blur(50px)",
            }}
          />
          <div className="relative">
            <Music
              className="w-10 h-10 mx-auto mb-6"
              style={{ color: C.orange }}
            />
            <h2
              className="text-5xl md:text-6xl mb-6"
              style={{ ...serif, color: C.ink }}
            >
              Crie a música que vai{" "}
              <em style={{ ...serif, fontStyle: "italic", ...orangeGradientText }}>
                marcar uma vida.
              </em>
            </h2>
            <p
              className="max-w-md mx-auto text-lg md:text-xl mb-2 font-light"
              style={{ color: C.inkSoft }}
            >
              Em minutos você tem uma canção exclusiva em 2K, que ninguém mais terá.
            </p>

            <div className="flex items-baseline justify-center gap-2 my-10">
              <span className="text-base" style={{ color: C.inkMuted }}>
                a partir de
              </span>
              <span
                style={{
                  ...serif,
                  fontSize: 80,
                  lineHeight: 1,
                  ...orangeGradientText,
                }}
              >
                R$ 49
              </span>
              <span className="text-base" style={{ color: C.inkMuted }}>
                /música
              </span>
            </div>

            <PrimaryBtn onClick={openLead}>Começar agora</PrimaryBtn>

            <p
              className="text-sm mt-7"
              style={{ color: C.inkMuted }}
            >
              Pagamento seguro · PIX, cartão ou boleto · Garantia de satisfação
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="px-5 md:px-8 pt-16 pb-10 relative z-10"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <BrandLockup size="md" />
              <p
                className="text-sm max-w-sm mt-4"
                style={{ color: C.inkSoft }}
              >
                Músicas personalizadas com IA para os momentos mais importantes
                da sua vida. Um produto ARCANA.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: C.inkSoft }}
              >
                <Mail className="w-4 h-4" /> {EMAIL}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: C.inkSoft }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp: 11 96340-3691
              </a>
              <a
                href="https://instagram.com/arcana.app.br"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: C.inkSoft }}
              >
                <Instagram className="w-4 h-4" /> @arcana.app.br
              </a>
            </div>
          </div>

          <div
            className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
            style={{ borderTop: `1px solid ${C.line}`, color: C.inkMuted }}
          >
            <p>© {new Date().getFullYear()} ARCANA · MelodiaPod. Todos os direitos reservados.</p>
            <p>Feito com 🧡 no Brasil</p>
          </div>
        </div>
      </footer>

      {/* Lead Form Modal */}
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
