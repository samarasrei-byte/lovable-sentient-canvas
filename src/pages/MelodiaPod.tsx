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
  GraduationCap,
  Baby,
  Users,
  Church,
  TreePine,
  Music2,
} from "lucide-react";
import { ArcanaLogo } from "@/components/ArcanaLogo";

// MelodiaPod by ARCANA — Light premium, ARCANA purple/cyan accents.
// Inspired by nossacancao.com.br layout: clean boxes, focused content.

const WHATSAPP_URL =
  "https://wa.me/5511963403691?text=" +
  encodeURIComponent("Olá, gostaria de criar minha música personalizada na MelodiaPod!");
const EMAIL = "contato@arcana.app.br";

// ARCANA palette — Light Premium
const C = {
  bg: "#FFFFFF",
  bgAlt: "#FAFAFB",
  surface: "rgba(15,15,26,0.03)",
  ink: "#0B0B12",
  inkSoft: "rgba(11,11,18,0.66)",
  inkMuted: "rgba(11,11,18,0.45)",
  primary: "#A855F7",
  primaryGlow: "#C084FC",
  cyan: "#0891B2",
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

const Chip = ({ children }: { children: React.ReactNode }) => (
  <div
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
    style={{
      ...sans,
      background: "rgba(168,85,247,0.08)",
      border: `1px solid rgba(168,85,247,0.2)`,
      color: C.primary,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
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
    color: "#FFFFFF",
    boxShadow: `0 14px 40px -10px rgba(168,85,247,0.55)`,
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
    }}
  >
    {children}
  </a>
);

// ── Waveform pseudo decoration ─────────────────────────────────
const Waveform = ({ color, seed = 1 }: { color: string; seed?: number }) => (
  <div className="flex items-end justify-center gap-[3px] h-12 w-full">
    {Array.from({ length: 40 }).map((_, k) => {
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
      {/* Ambient soft blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-32 -left-32 w-[520px] h-[520px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(168,85,247,0.12), transparent 60%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-[40%] -right-40 w-[560px] h-[560px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(8,145,178,0.08), transparent 60%)`,
          filter: "blur(70px)",
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
              href="#cta"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                color: "#FFFFFF",
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
                ["#exemplos", "Exemplos"],
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
                href="#cta"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                  color: "#FFFFFF",
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
        className="relative pt-36 md:pt-44 pb-20 md:pb-28 px-5 md:px-8"
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
              <PrimaryBtn href="#cta">Criar minha música personalizada</PrimaryBtn>
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
        className="px-5 md:px-8 py-20 md:py-28 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
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
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 4px 24px -8px rgba(11,11,18,0.06)`,
                }}
              >
                <div className="flex items-center justify-between mb-7">
                  <span
                    className="text-[11px] tracking-[0.22em] font-semibold"
                    style={{ color: C.inkMuted }}
                  >
                    PASSO {step.n}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`,
                      boxShadow: `0 8px 24px -6px rgba(168,85,247,0.4)`,
                    }}
                  >
                    <step.icon className="w-4 h-4 text-white" />
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

      {/* ═══ OCASIÕES — Floating boxes (inspired by nossacancao.com.br) ═══ */}
      <section
        id="ocasioes"
        className="px-5 md:px-8 py-20 md:py-28 relative z-10"
        style={{ background: C.bgAlt }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Chip>Para cada momento</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Cada ocasião merece{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                uma canção.
              </em>
            </h2>
            <p
              className="mt-5 max-w-lg mx-auto text-base"
              style={{ color: C.inkSoft }}
            >
              De aniversários a pedidos de casamento, criamos músicas para todos
              os momentos que merecem ser lembrados para sempre.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: Heart, t: "Amor", color: C.pink },
              { icon: Sparkles, t: "Casamento", color: C.cyan },
              { icon: Cake, t: "Aniversário", color: C.primary },
              { icon: Users, t: "Dia das Mães", color: C.pink },
              { icon: Users, t: "Dia dos Pais", color: C.cyan },
              { icon: Heart, t: "Amizade", color: C.primary },
              { icon: Baby, t: "Novo Bebê", color: C.pink },
              { icon: GraduationCap, t: "Formatura", color: C.cyan },
              { icon: Gift, t: "Pedido de Namoro", color: C.primary },
              { icon: Church, t: "Pedido de Casamento", color: C.pink },
              { icon: TreePine, t: "Natal", color: C.cyan },
              { icon: Music2, t: "Sem Motivo Especial", color: C.primary },
            ].map((o, i) => (
              <motion.div
                key={o.t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
                className="rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-lg cursor-default min-h-[140px] md:min-h-[160px]"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 2px 12px -4px rgba(11,11,18,0.04)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{
                    background: `${o.color}15`,
                  }}
                >
                  <o.icon className="w-6 h-6" style={{ color: o.color }} />
                </div>
                <h3
                  className="text-sm md:text-base font-medium"
                  style={{ color: C.ink, ...sans }}
                >
                  {o.t}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <PrimaryBtn href="#cta">Criar minha música personalizada</PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ═══ EXEMPLOS DE MÚSICAS — Player Cards (inspired by ref) ═══ */}
      <section
        id="exemplos"
        className="px-5 md:px-8 py-20 md:py-28 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <Chip>Exemplos reais</Chip>
            <h2
              className="mt-5 text-4xl md:text-6xl"
              style={{ ...serif, color: C.ink }}
            >
              Exemplos de músicas{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                criadas.
              </em>
            </h2>
            <p
              className="mt-5 max-w-lg mx-auto text-base"
              style={{ color: C.inkSoft }}
            >
              Cada música é única, criada a partir da história de quem pediu.
              Ouça alguns exemplos e imagine a sua.
            </p>
          </div>

          <div className="grid gap-4 md:gap-5">
            {[
              {
                name: "Hebert",
                desc: "Canção de amor",
                duration: "2:41",
                style: "Pop",
                color: C.primary,
                seed: 1,
              },
              {
                name: "Alice",
                desc: "Canção de amor",
                duration: "2:38",
                style: "Acústico",
                color: C.pink,
                seed: 3,
              },
              {
                name: "Marina & Pedro",
                desc: "Pedido de casamento",
                duration: "3:12",
                style: "Romântico",
                color: C.cyan,
                seed: 5,
              },
              {
                name: "Pequeno João",
                desc: "Mesversário · 6 meses",
                duration: "2:18",
                style: "Lullaby",
                color: C.primary,
                seed: 7,
              },
            ].map((ex, i) => (
              <motion.div
                key={ex.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl p-6 md:p-8"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 4px 24px -8px rgba(11,11,18,0.06)`,
                }}
              >
                {/* Waveform on top */}
                <div className="mb-5 px-2">
                  <Waveform color={ex.color} seed={ex.seed} />
                </div>

                {/* Bottom row: name + style + play */}
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <h3
                      className="text-2xl md:text-3xl mb-1"
                      style={{ ...serif, color: C.ink }}
                    >
                      {ex.name}
                    </h3>
                    <p className="text-sm" style={{ color: C.inkSoft }}>
                      {ex.desc}
                    </p>
                    <p
                      className="text-xs mt-3 tabular-nums"
                      style={{ color: C.inkMuted }}
                    >
                      {ex.duration}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span
                      className="text-xs font-semibold tracking-wide"
                      style={{ color: ex.color }}
                    >
                      {ex.style}
                    </span>
                    <button
                      aria-label={`Ouvir ${ex.name}`}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, ${ex.color}, ${C.primary})`,
                        boxShadow: `0 8px 24px -6px ${ex.color}66`,
                      }}
                    >
                      <Play
                        className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <PrimaryBtn href="#cta">Quero a minha música</PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section
        id="faq"
        className="px-5 md:px-8 py-20 md:py-28 relative z-10"
        style={{ background: C.bgAlt }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
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
                a: "A maioria das músicas é entregue em até 5 minutos após o pagamento.",
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
                    background: "#FFFFFF",
                    border: `1px solid ${C.line}`,
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

      {/* ═══ FINAL CTA (com preço — última seção) ═══ */}
      <section id="cta" className="px-5 md:px-8 py-20 md:py-28 relative z-10">
        <div
          className="max-w-3xl mx-auto rounded-[36px] p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.10), rgba(8,145,178,0.06))",
            border: `1px solid rgba(168,85,247,0.20)`,
            boxShadow: `0 30px 80px -30px rgba(168,85,247,0.3)`,
          }}
        >
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${C.primary}, transparent 60%)`,
              opacity: 0.18,
              filter: "blur(40px)",
            }}
          />
          <div className="relative">
            <Music
              className="w-8 h-8 mx-auto mb-5"
              style={{ color: C.primary }}
            />
            <h2
              className="text-4xl md:text-5xl mb-5"
              style={{ ...serif, color: C.ink }}
            >
              Crie a música que vai{" "}
              <em style={{ ...serif, fontStyle: "italic", ...gradientText }}>
                marcar uma vida.
              </em>
            </h2>
            <p
              className="max-w-md mx-auto text-base mb-2"
              style={{ color: C.inkSoft }}
            >
              Em minutos você tem uma canção exclusiva, que ninguém mais terá.
            </p>

            <div className="flex items-baseline justify-center gap-2 my-8">
              <span className="text-sm" style={{ color: C.inkMuted }}>
                a partir de
              </span>
              <span
                style={{
                  ...serif,
                  fontSize: 64,
                  lineHeight: 1,
                  ...gradientText,
                }}
              >
                R$ 49
              </span>
              <span className="text-sm" style={{ color: C.inkMuted }}>
                /música
              </span>
            </div>

            <PrimaryBtn href={WHATSAPP_URL}>Criar minha música</PrimaryBtn>

            <p
              className="text-xs mt-6"
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
                href={WHATSAPP_URL}
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
            <p>Feito com 💜 no Brasil</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
