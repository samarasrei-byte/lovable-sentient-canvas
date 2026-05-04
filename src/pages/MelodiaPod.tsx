import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  CheckCircle2,
  ChevronDown,
  Mail,
  Instagram,
  MessageCircle,
  Menu,
  X,
  Star,
  BadgeCheck,
  Quote,
  Zap,
} from "lucide-react";
import { ArcanaLogo } from "@/components/ArcanaLogo";

// MelodiaPod by ARCANA — Cyberpunk dark, neon purple/cyan, glassmorphism.
// Self-contained styling so it doesn't inherit global classes.

const WHATSAPP_URL =
  "https://wa.me/5511963403691?text=" +
  encodeURIComponent("Olá, gostaria de saber mais sobre a MelodiaPod!");
const EMAIL = "contato@arcana.app.br";

// ARCANA palette — Light Premium
const C = {
  bg: "#FFFFFF",
  bgAlt: "#FAFAFB",
  surface: "rgba(15,15,26,0.03)",
  ink: "#0B0B12",
  inkSoft: "rgba(11,11,18,0.66)",
  inkMuted: "rgba(11,11,18,0.45)",
  primary: "#A855F7", // purple
  primaryGlow: "#C084FC",
  cyan: "#0891B2", // deeper cyan for contrast on white
  pink: "#EC4899",
  line: "rgba(11,11,18,0.08)",
  lineStrong: "rgba(11,11,18,0.14)",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap";

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
  letterSpacing: "-0.02em",
};
const sans: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const gradientText: React.CSSProperties = {
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
        className={`${cfg.sub} mt-1 tracking-[0.32em] uppercase font-medium pl-[26px]`}
        style={{ color: C.inkMuted, ...sans }}
      >
        MelodiaPod
      </span>
    </div>
  );
};

// ── Reusable bits ──────────────────────────────────────────────
const Chip = ({ children }: { children: React.ReactNode }) => (
  <div
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
    style={{
      ...sans,
      background: "rgba(168,85,247,0.08)",
      border: `1px solid rgba(168,85,247,0.2)`,
      color: C.primaryGlow,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      backdropFilter: "blur(10px)",
    }}
  >
    {children}
  </div>
);

const PrimaryBtn = ({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const cls =
    "group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98] hover:scale-[1.02]";
  const style: React.CSSProperties = {
    ...sans,
    background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
    color: "#0B0B12",
    boxShadow: `0 14px 40px -10px rgba(168,85,247,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset`,
  };
  const inner = (
    <>
      {children}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </>
  );
  return href ? (
    <a href={href} className={cls} style={style}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls} style={style}>
      {inner}
    </button>
  );
};

const GhostBtn = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98] hover:bg-black/[0.04]"
    style={{
      ...sans,
      background: "rgba(11,11,18,0.02)",
      color: C.ink,
      border: `1px solid ${C.lineStrong}`,
      backdropFilter: "blur(10px)",
    }}
  >
    {children}
  </a>
);

// ── Page ───────────────────────────────────────────────────────
export default function MelodiaPod() {
  useFonts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: C.bg, color: C.ink, ...sans }}
    >
      {/* Ambient neon blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-32 -left-32 w-[520px] h-[520px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(168,85,247,0.35), transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-[35%] -right-40 w-[560px] h-[560px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(34,211,238,0.22), transparent 60%)`,
          filter: "blur(50px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
        style={{
          background: `radial-gradient(ellipse, rgba(244,114,182,0.10), transparent 60%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,11,18,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,18,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.78)",
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
              ["#depoimentos", "Histórias"],
              ["#planos", "Planos"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors"
                style={{ color: C.inkSoft }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.inkSoft)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="#planos"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                color: "#0B0B12",
                boxShadow: `0 8px 24px -8px rgba(168,85,247,0.5)`,
              }}
            >
              Criar minha música
            </a>
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
                ["#depoimentos", "Histórias"],
                ["#planos", "Planos"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3.5 text-2xl"
                  style={{ ...serif, color: C.ink }}
                >
                  {label}
                </a>
              ))}
              <a
                href="#planos"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                  color: "#0B0B12",
                }}
              >
                Criar minha música <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section
        id="top"
        className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-5 md:px-8"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center mb-7">
              <Chip>
                <Sparkles className="w-3 h-3" style={{ color: C.cyan }} />
                Powered by ARCANA · IA Musical
              </Chip>
            </div>

            <h1
              className="text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95] mb-6"
              style={{ ...serif, color: C.ink }}
            >
              A trilha sonora <br />
              da sua{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                história.
              </em>
            </h1>

            <p
              className="max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-10"
              style={{ color: C.inkSoft }}
            >
              Conte um momento — nós transformamos em uma canção única,
              produzida em estúdio com IA. Pronta em minutos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryBtn href="#planos">Criar minha música</PrimaryBtn>
              <GhostBtn href="#depoimentos">
                <Play className="w-4 h-4" /> Ouvir exemplos
              </GhostBtn>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {[
                "Pronto em ~3 minutos",
                "Letra 100% personalizada",
                "Voz e estilo à sua escolha",
              ].map((t) => (
                <div
                  key={t}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${C.line}`,
                    color: C.inkSoft,
                  }}
                >
                  <CheckCircle2 className="w-3 h-3" style={{ color: C.cyan }} />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating glass player preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 md:mt-20 mx-auto max-w-2xl"
          >
            <div
              className="rounded-3xl p-5 md:p-7 flex items-center gap-4 md:gap-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.lineStrong}`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 30px 80px -30px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shrink-0 relative"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                  boxShadow: `0 0 40px rgba(168,85,247,0.5)`,
                }}
              >
                <Play
                  className="w-7 h-7 md:w-9 md:h-9 relative z-10"
                  style={{ color: "#0B0B12" }}
                  fill="#0B0B12"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p
                  style={{ ...serif, fontSize: 22, color: C.ink }}
                  className="truncate"
                >
                  Para a Maria, com amor
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.inkMuted }}>
                  Bossa romântica · 02:48
                </p>
                <div
                  className="mt-3 h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: "42%",
                      background: `linear-gradient(90deg, ${C.primary}, ${C.cyan})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS / SOCIAL PROOF ═══ */}
      <section className="px-5 md:px-8 py-10 md:py-14 relative z-10">
        <div
          className="max-w-5xl mx-auto rounded-3xl px-6 md:px-10 py-8 md:py-10"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${C.line}`,
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { v: "12K+", l: "Músicas criadas" },
              { v: "4.9", l: "Avaliação média" },
              { v: "~3 min", l: "Tempo médio" },
              { v: "100%", l: "Personalizadas" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  style={{ ...serif, fontSize: 44, ...gradientText }}
                  className="leading-none"
                >
                  {s.v}
                </div>
                <div
                  className="mt-2 text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: C.inkMuted }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        id="como-funciona"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip>3 passos</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Simples como uma{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                conversa.
              </em>
            </h2>
            <p
              className="mt-4 max-w-lg mx-auto text-base"
              style={{ color: C.inkSoft }}
            >
              Você conta, a IA compõe, você emociona.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                icon: Mic,
                t: "Conte sua história",
                d: "Nome, ocasião, sentimentos, frases marcantes. Quanto mais detalhe, mais íntima a canção.",
              },
              {
                n: "02",
                icon: Music,
                t: "Escolha o estilo",
                d: "Pop, sertanejo, bossa, lo-fi, romântica… Tipo de voz, ritmo e clima — tudo no seu jeito.",
              },
              {
                n: "03",
                icon: Headphones,
                t: "Receba e compartilhe",
                d: "Em poucos minutos sua música chega por e-mail e WhatsApp, pronta pra emocionar.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl p-7 md:p-8 relative overflow-hidden group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(14px)",
                }}
              >
                <div className="flex items-center justify-between mb-7">
                  <span
                    className="text-[11px] tracking-[0.22em]"
                    style={{ color: C.inkMuted }}
                  >
                    PASSO {step.n}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                      boxShadow: `0 0 24px rgba(168,85,247,0.4)`,
                    }}
                  >
                    <step.icon
                      className="w-4 h-4"
                      style={{ color: "#0B0B12" }}
                    />
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl mb-3"
                  style={{ ...serif, color: C.ink }}
                >
                  {step.t}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: C.inkSoft }}
                >
                  {step.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OCASIÕES ═══ */}
      <section
        id="ocasioes"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
        style={{ background: C.bgAlt }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip>Ocasiões</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Para todo momento que{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                importa.
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: Heart,
                t: "Declaração de amor",
                d: "Diga o que você sente, do seu jeito.",
              },
              {
                icon: Cake,
                t: "Aniversários",
                d: "Uma canção exclusiva no parabéns.",
              },
              {
                icon: Gift,
                t: "Presentes únicos",
                d: "Inesquecível — pra família e amigos.",
              },
              {
                icon: Star,
                t: "Casamentos",
                d: "A trilha sonora do dia mais especial.",
              },
              {
                icon: Music,
                t: "Mesversário",
                d: "Eternize cada mês do seu bebê.",
              },
              {
                icon: Sparkles,
                t: "Datas comemorativas",
                d: "Mães, pais, amizade — tudo cabe em música.",
              },
            ].map((o, i) => (
              <motion.div
                key={o.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl p-5 md:p-6 transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    border: `1px solid rgba(168,85,247,0.2)`,
                  }}
                >
                  <o.icon className="w-5 h-5" style={{ color: C.primaryGlow }} />
                </div>
                <h3
                  style={{ ...serif, fontSize: 22, color: C.ink }}
                  className="mb-1"
                >
                  {o.t}
                </h3>
                <p className="text-sm" style={{ color: C.inkSoft }}>
                  {o.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEPOIMENTOS — PREMIUM CONVERSION SECTION ═══ */}
      <section
        id="depoimentos"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header com rating agregado */}
          <div className="text-center mb-14">
            <Chip>
              <Star className="w-3 h-3 fill-current" style={{ color: C.cyan }} />
              4.9 / 5 · +2.300 avaliações
            </Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Emoções que{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                viraram música.
              </em>
            </h2>
            <p
              className="mt-4 max-w-xl mx-auto text-base"
              style={{ color: C.inkSoft }}
            >
              Histórias reais de pessoas reais. Cada música, um instante
              eternizado.
            </p>

            {/* Rating bars */}
            <div className="mt-8 max-w-md mx-auto grid grid-cols-1 gap-1.5">
              {[
                { label: "5", pct: 92 },
                { label: "4", pct: 6 },
                { label: "3", pct: 1.5 },
                { label: "2", pct: 0.3 },
                { label: "1", pct: 0.2 },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span
                    className="text-[11px] w-3 text-right"
                    style={{ color: C.inkMuted }}
                  >
                    {r.label}
                  </span>
                  <Star
                    className="w-3 h-3"
                    style={{ color: C.inkMuted }}
                    fill="currentColor"
                  />
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full"
                      style={{
                        background: `linear-gradient(90deg, ${C.primary}, ${C.cyan})`,
                      }}
                    />
                  </div>
                  <span
                    className="text-[11px] w-10 text-left tabular-nums"
                    style={{ color: C.inkMuted }}
                  >
                    {r.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured testimonial — large */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="rounded-[28px] p-8 md:p-12 mb-6 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.10), rgba(34,211,238,0.06))",
              border: `1px solid rgba(168,85,247,0.24)`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 40px 80px -40px rgba(168,85,247,0.3)`,
            }}
          >
            <Quote
              className="absolute top-8 right-8 w-16 h-16 md:w-24 md:h-24"
              style={{ color: "rgba(168,85,247,0.12)" }}
            />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, k) => (
                    <Star
                      key={k}
                      className="w-4 h-4"
                      style={{ color: C.cyan }}
                      fill={C.cyan}
                    />
                  ))}
                </div>
                <p
                  style={{ ...serif, color: C.ink }}
                  className="text-2xl md:text-3xl lg:text-4xl leading-[1.15] mb-7"
                >
                  “Pedi pro nosso aniversário de 10 anos. Quando ela ouviu, a
                  gente chorou junto. É um{" "}
                  <em
                    style={{
                      ...serif,
                      fontStyle: "italic",
                      ...gradientText,
                    }}
                  >
                    presente que ninguém mais vai ter.
                  </em>
                  ”
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                      color: "#0B0B12",
                    }}
                  >
                    RS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: C.ink }}
                      >
                        Rafael Souza
                      </p>
                      <BadgeCheck
                        className="w-4 h-4"
                        style={{ color: C.cyan }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: C.inkMuted }}>
                      Aniversário de casamento · São Paulo, SP
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini player */}
              <div
                className="rounded-2xl p-5 w-full md:w-[260px]"
                style={{
                  background: "rgba(11,11,18,0.6)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                    }}
                  >
                    <Play
                      className="w-4 h-4"
                      style={{ color: "#0B0B12" }}
                      fill="#0B0B12"
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      style={{ ...serif, color: C.ink }}
                      className="text-base truncate"
                    >
                      10 Anos de Nós
                    </p>
                    <p className="text-[10px]" style={{ color: C.inkMuted }}>
                      Acústico romântico · 03:12
                    </p>
                  </div>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: "62%",
                      background: `linear-gradient(90deg, ${C.primary}, ${C.cyan})`,
                    }}
                  />
                </div>
                {/* Waveform pseudo */}
                <div className="mt-4 flex items-end gap-[2px] h-6">
                  {Array.from({ length: 32 }).map((_, k) => {
                    const h = 20 + Math.abs(Math.sin(k * 0.7)) * 80;
                    const active = k < 32 * 0.62;
                    return (
                      <div
                        key={k}
                        className="flex-1 rounded-full"
                        style={{
                          height: `${h}%`,
                          background: active
                            ? `linear-gradient(180deg, ${C.primaryGlow}, ${C.cyan})`
                            : "rgba(255,255,255,0.1)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grid 6 cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                q: "Mandei pra minha mãe no dia das mães. Ela escuta todos os dias até hoje.",
                n: "Camila Pires",
                r: "Dia das Mães",
                loc: "Rio de Janeiro, RJ",
                style: "MPB · 02:54",
                title: "Pra Você, Mãe",
                hue: C.primary,
              },
              {
                q: "Usamos no mesversário do João. Virou tradição da família — uma música por mês.",
                n: "Bruna Martins",
                r: "Mesversário",
                loc: "Curitiba, PR",
                style: "Lullaby · 02:18",
                title: "João, 6 meses",
                hue: C.cyan,
              },
              {
                q: "Pedi pro pedido de casamento. Ela disse sim antes da segunda estrofe.",
                n: "Diego Almeida",
                r: "Pedido de casamento",
                loc: "Belo Horizonte, MG",
                style: "Acústico · 03:01",
                title: "Quer Casar Comigo?",
                hue: C.pink,
              },
              {
                q: "Surpreendi minha melhor amiga no aniversário dela. Foi a melhor reação que já vi.",
                n: "Larissa Ferreira",
                r: "Aniversário",
                loc: "Porto Alegre, RS",
                style: "Pop · 02:36",
                title: "Pra Minha Bestie",
                hue: C.primary,
              },
              {
                q: "Fiz uma música pro meu filho que tá no exterior. Ele me ligou chorando.",
                n: "Sandra Oliveira",
                r: "Saudade",
                loc: "Salvador, BA",
                style: "Sertanejo · 03:22",
                title: "Volta Logo, Filho",
                hue: C.cyan,
              },
              {
                q: "Eternizei minha avó. A família inteira ouve. É como tê-la perto outra vez.",
                n: "Pedro Henrique",
                r: "Homenagem",
                loc: "Recife, PE",
                style: "Bossa · 02:48",
                title: "Vó Iolanda",
                hue: C.pink,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-3xl p-6 md:p-7 group hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(14px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, k) => (
                      <Star
                        key={k}
                        className="w-3.5 h-3.5"
                        style={{ color: t.hue }}
                        fill={t.hue}
                      />
                    ))}
                  </div>
                  <Quote
                    className="w-5 h-5"
                    style={{ color: "rgba(255,255,255,0.08)" }}
                  />
                </div>

                <p
                  style={{ ...serif, color: C.ink }}
                  className="text-lg md:text-xl leading-snug mb-6 flex-1"
                >
                  “{t.q}”
                </p>

                {/* Mini track */}
                <div
                  className="rounded-xl p-3 mb-5 flex items-center gap-3"
                  style={{
                    background: "rgba(11,11,18,0.5)",
                    border: `1px solid ${C.line}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.hue}, ${C.primary})`,
                    }}
                  >
                    <Play
                      className="w-3 h-3"
                      style={{ color: "#0B0B12" }}
                      fill="#0B0B12"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: C.ink }}
                    >
                      {t.title}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: C.inkMuted }}
                    >
                      {t.style}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.hue}, ${C.cyan})`,
                      color: "#0B0B12",
                    }}
                  >
                    {t.n
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: C.ink }}
                      >
                        {t.n}
                      </p>
                      <BadgeCheck
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: C.cyan }}
                      />
                    </div>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: C.inkMuted }}
                    >
                      {t.r} · {t.loc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.line}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[C.primary, C.cyan, C.pink, C.primaryGlow].map((c, k) => (
                  <div
                    key={k}
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      background: `linear-gradient(135deg, ${c}, ${C.primary})`,
                      borderColor: C.bg,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm" style={{ color: C.inkSoft }}>
                <span className="font-semibold" style={{ color: C.ink }}>
                  +12.000 pessoas
                </span>{" "}
                já criaram sua música
              </p>
            </div>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                color: "#0B0B12",
              }}
            >
              Quero a minha <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ PLANOS ═══ */}
      <section
        id="planos"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
        style={{ background: C.bgAlt }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Chip>Planos</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Escolha seu{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                tom.
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                name: "Essencial",
                price: "R$ 49",
                desc: "Uma música personalizada, perfeita pra surpreender.",
                feats: [
                  "1 música exclusiva",
                  "Letra 100% personalizada",
                  "Estilo musical à escolha",
                  "Entrega em até 5 minutos",
                  "Arquivo MP3 em alta qualidade",
                ],
                highlight: false,
              },
              {
                name: "Premium",
                price: "R$ 89",
                desc: "Para momentos que merecem o tratamento completo.",
                feats: [
                  "2 versões da música",
                  "Letra revisada por humano",
                  "Capa personalizada",
                  "Entrega prioritária",
                  "Cartão digital incluso",
                  "Suporte dedicado",
                ],
                highlight: true,
              },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-3xl p-7 md:p-9 relative"
                style={{
                  background: p.highlight
                    ? `linear-gradient(135deg, rgba(168,85,247,0.14), rgba(34,211,238,0.08))`
                    : "rgba(255,255,255,0.03)",
                  color: C.ink,
                  border: p.highlight
                    ? `1px solid rgba(168,85,247,0.4)`
                    : `1px solid ${C.line}`,
                  backdropFilter: "blur(14px)",
                  boxShadow: p.highlight
                    ? `0 30px 80px -30px rgba(168,85,247,0.5)`
                    : "none",
                }}
              >
                {p.highlight && (
                  <div
                    className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] tracking-[0.18em] font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                      color: "#0B0B12",
                    }}
                  >
                    MAIS AMADO
                  </div>
                )}
                <h3 style={{ ...serif, fontSize: 32, color: C.ink }}>
                  {p.name}
                </h3>
                <p className="text-sm mt-1 mb-6" style={{ color: C.inkSoft }}>
                  {p.desc}
                </p>
                <div className="flex items-baseline gap-1 mb-7">
                  <span
                    style={{
                      ...serif,
                      fontSize: 56,
                      lineHeight: 1,
                      ...(p.highlight ? gradientText : { color: C.ink }),
                    }}
                  >
                    {p.price}
                  </span>
                  <span className="text-xs" style={{ color: C.inkMuted }}>
                    /música
                  </span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {p.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: p.highlight ? C.cyan : C.primaryGlow }}
                      />
                      <span style={{ color: C.inkSoft }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-3.5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] hover:scale-[1.02]"
                  style={
                    p.highlight
                      ? {
                          background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                          color: "#0B0B12",
                          boxShadow: `0 14px 30px -10px rgba(168,85,247,0.5)`,
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          color: C.ink,
                          border: `1px solid ${C.lineStrong}`,
                        }
                  }
                >
                  Começar agora
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section
        id="faq"
        className="px-5 md:px-8 py-24 md:py-32 relative z-10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Chip>Perguntas frequentes</Chip>
            <h2
              className="mt-5 text-4xl md:text-5xl"
              style={{ ...serif, color: C.ink }}
            >
              Tudo que você quer{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                saber.
              </em>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Quanto tempo leva pra receber minha música?",
                a: "A maioria das músicas é entregue em até 5 minutos. Pedidos premium podem levar um pouco mais devido à revisão humana.",
              },
              {
                q: "Posso escolher o estilo musical?",
                a: "Sim! Pop, sertanejo, MPB, bossa, lo-fi, eletrônica, romântica, infantil… é só escolher no formulário.",
              },
              {
                q: "A música é minha pra sempre?",
                a: "Sim. Você recebe o arquivo em alta qualidade e tem direito de uso pessoal e compartilhamento.",
              },
              {
                q: "E se eu não gostar do resultado?",
                a: "Garantia total: ajustamos ou criamos uma nova versão sem custo até você amar.",
              },
              {
                q: "Como faço o pagamento?",
                a: "Aceitamos PIX, cartão e boleto. Tudo seguro e rápido pelo nosso checkout.",
              },
            ].map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${C.line}`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between text-left p-5 md:p-6"
                  >
                    <span
                      className="text-base md:text-lg font-medium pr-4"
                      style={{ color: C.ink }}
                    >
                      {f.q}
                    </span>
                    <ChevronDown
                      className="w-5 h-5 shrink-0 transition-transform duration-300"
                      style={{
                        color: C.inkSoft,
                        transform: open ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>
                  {open && (
                    <div
                      className="px-5 md:px-6 pb-6 text-sm leading-relaxed"
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
      <section className="px-5 md:px-8 py-20 md:py-24 relative z-10">
        <div
          className="max-w-5xl mx-auto rounded-[36px] p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.16), rgba(34,211,238,0.10))",
            border: `1px solid rgba(168,85,247,0.3)`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 60px 120px -40px rgba(168,85,247,0.5)`,
          }}
        >
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${C.primary}, transparent 60%)`,
              opacity: 0.4,
              filter: "blur(40px)",
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${C.cyan}, transparent 60%)`,
              opacity: 0.3,
              filter: "blur(40px)",
            }}
          />
          <div className="relative">
            <Zap
              className="w-7 h-7 mx-auto mb-5"
              style={{ color: C.primaryGlow }}
              fill="currentColor"
            />
            <h2
              className="text-4xl md:text-6xl mb-5"
              style={{ ...serif, color: C.ink }}
            >
              Crie a música que vai{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                marcar uma vida.
              </em>
            </h2>
            <p
              className="max-w-md mx-auto text-base mb-9"
              style={{ color: C.inkSoft }}
            >
              Em minutos você tem uma canção que ninguém mais terá.
            </p>
            <PrimaryBtn href={WHATSAPP_URL}>Começar minha música</PrimaryBtn>
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
                className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: C.inkSoft }}
              >
                <Mail className="w-4 h-4" /> {EMAIL}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: C.inkSoft }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: C.inkSoft }}
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>

          <div
            className="mt-10 pt-6 text-xs flex flex-col md:flex-row items-center justify-between gap-2"
            style={{ borderTop: `1px solid ${C.line}`, color: C.inkMuted }}
          >
            <p>© {new Date().getFullYear()} ARCANA · MelodiaPod. Todos os direitos reservados.</p>
            <p>Feito com ♥ no Brasil</p>
          </div>
        </div>
      </footer>

      {/* ═══ FLOATING WHATSAPP ═══ */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.04]"
        style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
          color: "#0B0B12",
          boxShadow: `0 20px 50px -10px rgba(168,85,247,0.6)`,
        }}
      >
        <MessageCircle className="w-4 h-4" />
        Falar no WhatsApp
      </a>
    </div>
  );
}
