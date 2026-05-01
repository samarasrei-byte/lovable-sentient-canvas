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
} from "lucide-react";

// MelodiaPod — Apple-inspired minimal, ARCANA aesthetic on light cream background.
// Self-contained styling so it doesn't inherit ARCANA's dark theme.

const WHATSAPP_URL =
  "https://wa.me/5511963403691?text=" +
  encodeURIComponent("Olá, gostaria de saber mais sobre a MelodiaPod!");
const EMAIL = "contato@arcana.app.br";

// Light palette inspired by Apple + ARCANA accent
const C = {
  bg: "#FBF7F2",
  bgAlt: "#F2EAE0",
  surface: "rgba(255,255,255,0.65)",
  ink: "#0E0A0A",
  inkSoft: "rgba(14,10,10,0.62)",
  inkMuted: "rgba(14,10,10,0.42)",
  accent: "#5D1717",
  accentSoft: "#8A2A2A",
  line: "rgba(14,10,10,0.08)",
  lineStrong: "rgba(14,10,10,0.12)",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap";

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

// ── Reusable bits ──────────────────────────────────────────────
const Chip = ({ children }: { children: React.ReactNode }) => (
  <div
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
    style={{
      ...sans,
      background: "rgba(255,255,255,0.7)",
      border: `1px solid ${C.line}`,
      color: C.inkSoft,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.06em",
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
    "group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98]";
  const style: React.CSSProperties = {
    ...sans,
    background: C.ink,
    color: C.bg,
    boxShadow: "0 10px 30px -12px rgba(14,10,10,0.45)",
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
    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
    style={{
      ...sans,
      background: "rgba(255,255,255,0.6)",
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
      {/* Ambient gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(93,23,23,0.18), transparent 60%)",
          filter: "blur(20px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] -right-40 w-[520px] h-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(93,23,23,0.10), transparent 60%)",
          filter: "blur(20px)",
        }}
      />

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(251,247,242,0.7)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            borderBottom: `1px solid ${C.line}`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
              }}
            >
              <Music className="w-3.5 h-3.5" style={{ color: C.bg }} />
            </div>
            <span
              style={{ ...serif, fontSize: 22, color: C.ink }}
              className="leading-none"
            >
              MelodiaPod
            </span>
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.ink)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.inkSoft)
                }
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="#planos"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
              style={{
                background: C.ink,
                color: C.bg,
              }}
            >
              Criar minha música
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${C.line}` }}
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
            style={{ background: "rgba(251,247,242,0.96)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center justify-between h-14 px-5">
              <span style={{ ...serif, fontSize: 22 }}>MelodiaPod</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
                <X className="w-6 h-6" />
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
                  className="py-3.5 text-lg"
                  style={{ ...serif, color: C.ink }}
                >
                  {label}
                </a>
              ))}
              <a
                href="#planos"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold"
                style={{ background: C.ink, color: C.bg }}
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
        className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-5 md:px-8"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center mb-7">
              <Chip>
                <Sparkles className="w-3 h-3" style={{ color: C.accent }} />
                Música personalizada com IA
              </Chip>
            </div>

            <h1
              className="text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95] mb-6"
              style={{ ...serif, color: C.ink }}
            >
              A trilha sonora <br />
              da sua{" "}
              <em
                style={{
                  ...serif,
                  fontStyle: "italic",
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
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
                    background: "rgba(255,255,255,0.55)",
                    border: `1px solid ${C.line}`,
                    color: C.inkSoft,
                  }}
                >
                  <CheckCircle2 className="w-3 h-3" style={{ color: C.accent }} />
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
                background: "rgba(255,255,255,0.65)",
                border: `1px solid ${C.line}`,
                backdropFilter: "blur(20px)",
                boxShadow: "0 30px 60px -30px rgba(14,10,10,0.25)",
              }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
                }}
              >
                <Play className="w-7 h-7 md:w-9 md:h-9" style={{ color: C.bg }} fill={C.bg} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p style={{ ...serif, fontSize: 22, color: C.ink }} className="truncate">
                  Para a Maria, com amor
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.inkMuted }}>
                  Bossa romântica · 02:48
                </p>
                <div
                  className="mt-3 h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(14,10,10,0.08)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: "42%",
                      background: `linear-gradient(90deg, ${C.accent}, ${C.accentSoft})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS / SOCIAL PROOF ═══ */}
      <section className="px-5 md:px-8 py-10 md:py-14">
        <div
          className="max-w-5xl mx-auto rounded-3xl px-6 md:px-10 py-8 md:py-10"
          style={{
            background: "rgba(255,255,255,0.55)",
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
                <div style={{ ...serif, fontSize: 40, color: C.ink }} className="leading-none">
                  {s.v}
                </div>
                <div
                  className="mt-2 text-[11px] uppercase tracking-[0.14em]"
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
      <section id="como-funciona" className="px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip>3 passos</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Simples como uma <em style={{ ...serif, fontStyle: "italic", color: C.accent }}>conversa.</em>
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base" style={{ color: C.inkSoft }}>
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
                className="rounded-3xl p-7 md:p-8 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(14px)",
                }}
              >
                <div className="flex items-center justify-between mb-7">
                  <span
                    className="text-[11px] tracking-[0.18em]"
                    style={{ color: C.inkMuted }}
                  >
                    PASSO {step.n}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
                    }}
                  >
                    <step.icon className="w-4 h-4" style={{ color: C.bg }} />
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl mb-3"
                  style={{ ...serif, color: C.ink }}
                >
                  {step.t}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                  {step.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OCASIÕES ═══ */}
      <section id="ocasioes" className="px-5 md:px-8 py-24 md:py-32" style={{ background: C.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip>Ocasiões</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Para todo momento que <em style={{ ...serif, fontStyle: "italic", color: C.accent }}>importa.</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: Heart, t: "Declaração de amor", d: "Diga o que você sente, do seu jeito." },
              { icon: Cake, t: "Aniversários", d: "Uma canção exclusiva no parabéns." },
              { icon: Gift, t: "Presentes únicos", d: "Inesquecível — pra família e amigos." },
              { icon: Star, t: "Casamentos", d: "A trilha sonora do dia mais especial." },
              { icon: Music, t: "Mesversário", d: "Eternize cada mês do seu bebê." },
              { icon: Sparkles, t: "Datas comemorativas", d: "Mães, pais, amizade — tudo cabe em música." },
            ].map((o, i) => (
              <motion.div
                key={o.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl p-5 md:p-6 transition-all"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(93,23,23,0.08)" }}
                >
                  <o.icon className="w-5 h-5" style={{ color: C.accent }} />
                </div>
                <h3 style={{ ...serif, fontSize: 22, color: C.ink }} className="mb-1">
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

      {/* ═══ DEPOIMENTOS ═══ */}
      <section id="depoimentos" className="px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip>Histórias reais</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Emoções que <em style={{ ...serif, fontStyle: "italic", color: C.accent }}>viraram música.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                q: "Minha esposa chorou no momento que ouviu. Capturaram nossa história em 3 minutos.",
                n: "Rafael S.",
                r: "Aniversário de casamento",
              },
              {
                q: "Mandei pra minha mãe no dia das mães. Ela escuta todos os dias até hoje.",
                n: "Camila P.",
                r: "Dia das Mães",
              },
              {
                q: "Usamos no mesversário do João. Virou tradição da família — uma música por mês.",
                n: "Bruna M.",
                r: "Mesversário",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl p-7"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(14px)",
                }}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-3.5 h-3.5" style={{ color: C.accent }} fill={C.accent} />
                  ))}
                </div>
                <p style={{ ...serif, fontSize: 22, color: C.ink }} className="leading-snug mb-6">
                  “{t.q}”
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
                      color: C.bg,
                    }}
                  >
                    {t.n.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.ink }}>
                      {t.n}
                    </p>
                    <p className="text-[11px]" style={{ color: C.inkMuted }}>
                      {t.r}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLANOS ═══ */}
      <section id="planos" className="px-5 md:px-8 py-24 md:py-32" style={{ background: C.bgAlt }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Chip>Planos</Chip>
            <h2 className="mt-5 text-4xl md:text-6xl" style={{ ...serif, color: C.ink }}>
              Escolha seu <em style={{ ...serif, fontStyle: "italic", color: C.accent }}>tom.</em>
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
                  background: p.highlight ? C.ink : "rgba(255,255,255,0.75)",
                  color: p.highlight ? C.bg : C.ink,
                  border: `1px solid ${p.highlight ? "rgba(255,255,255,0.1)" : C.line}`,
                  backdropFilter: "blur(14px)",
                  boxShadow: p.highlight
                    ? "0 30px 60px -25px rgba(14,10,10,0.5)"
                    : "none",
                }}
              >
                {p.highlight && (
                  <div
                    className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] tracking-[0.18em] font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
                      color: C.bg,
                    }}
                  >
                    MAIS AMADO
                  </div>
                )}
                <h3 style={{ ...serif, fontSize: 32 }}>{p.name}</h3>
                <p
                  className="text-sm mt-1 mb-6"
                  style={{ color: p.highlight ? "rgba(251,247,242,0.6)" : C.inkSoft }}
                >
                  {p.desc}
                </p>
                <div className="flex items-baseline gap-1 mb-7">
                  <span style={{ ...serif, fontSize: 56, lineHeight: 1 }}>{p.price}</span>
                  <span
                    className="text-xs"
                    style={{ color: p.highlight ? "rgba(251,247,242,0.55)" : C.inkMuted }}
                  >
                    /música
                  </span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {p.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{
                          color: p.highlight ? C.bg : C.accent,
                        }}
                      />
                      <span style={{ color: p.highlight ? "rgba(251,247,242,0.85)" : C.ink }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-3.5 rounded-full text-sm font-semibold transition-all active:scale-[0.98]"
                  style={{
                    background: p.highlight ? C.bg : C.ink,
                    color: p.highlight ? C.ink : C.bg,
                  }}
                >
                  Começar agora
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Chip>Perguntas frequentes</Chip>
            <h2 className="mt-5 text-4xl md:text-5xl" style={{ ...serif, color: C.ink }}>
              Tudo que você quer <em style={{ ...serif, fontStyle: "italic", color: C.accent }}>saber.</em>
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
                    background: "rgba(255,255,255,0.7)",
                    border: `1px solid ${C.line}`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between text-left p-5 md:p-6"
                  >
                    <span className="text-base md:text-lg font-medium pr-4" style={{ color: C.ink }}>
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
      <section className="px-5 md:px-8 py-20 md:py-24">
        <div
          className="max-w-5xl mx-auto rounded-[36px] p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background: C.ink,
            color: C.bg,
          }}
        >
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${C.accent}, transparent 60%)`,
              opacity: 0.5,
              filter: "blur(20px)",
            }}
          />
          <div className="relative">
            <Sparkles className="w-7 h-7 mx-auto mb-5" style={{ color: C.bg, opacity: 0.7 }} />
            <h2
              className="text-4xl md:text-6xl mb-5"
              style={{ ...serif, color: C.bg }}
            >
              Crie a música que vai <em style={{ ...serif, fontStyle: "italic" }}>marcar uma vida.</em>
            </h2>
            <p
              className="max-w-md mx-auto text-base mb-9"
              style={{ color: "rgba(251,247,242,0.7)" }}
            >
              Em minutos você tem uma canção que ninguém mais terá.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all active:scale-[0.98]"
              style={{
                background: C.bg,
                color: C.ink,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
              }}
            >
              Começar minha música <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="px-5 md:px-8 pt-16 pb-10"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})` }}
                >
                  <Music className="w-3.5 h-3.5" style={{ color: C.bg }} />
                </div>
                <span style={{ ...serif, fontSize: 22 }}>MelodiaPod</span>
              </div>
              <p className="text-sm max-w-sm" style={{ color: C.inkSoft }}>
                Músicas personalizadas com IA para os momentos mais importantes da sua vida.
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
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: C.inkSoft }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: C.inkSoft }}
              >
                <Instagram className="w-4 h-4" /> @melodiapod
              </a>
            </div>
          </div>

          <div
            className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderTop: `1px solid ${C.line}` }}
          >
            <p className="text-xs" style={{ color: C.inkMuted }}>
              © {new Date().getFullYear()} MelodiaPod. Todos os direitos reservados.
            </p>
            <p className="text-xs" style={{ color: C.inkMuted }}>
              Feito com <span style={{ color: C.accent }}>♥</span> e IA.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 hover:scale-105"
        style={{
          background: "#25D366",
          boxShadow: "0 12px 30px -8px rgba(37,211,102,0.6)",
        }}
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-6 h-6" style={{ color: "#fff" }} />
      </a>
    </div>
  );
}
