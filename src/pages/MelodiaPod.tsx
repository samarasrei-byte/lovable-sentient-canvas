import { useEffect, useState } from "react";
import {
  Music,
  Play,
  ArrowRight,
  Heart,
  Gift,
  Cake,
  Star,
  Sparkles,
  Mic,
  Headphones,
  CheckCircle2,
  ChevronDown,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

// MelodiaPod — Standalone landing page (cream + bordeaux)
// Self-contained styling so it doesn't inherit ARCANA's dark theme.

const WHATSAPP_URL =
  "https://wa.me/5511963403691?text=" +
  encodeURIComponent("Olá, gostaria de saber mais sobre a MelodiaPod!");
const EMAIL = "contato@arcana.app.br";

const COLORS = {
  bg: "#FDF8F3",
  bgAlt: "#F6EFE6",
  ink: "#1F1414",
  inkSoft: "#5B4A45",
  wine: "#5D1717",
  wineDark: "#451010",
  wineSoft: "#7A2424",
  line: "#E8DDD0",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONTS_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONTS_HREF;
    document.head.appendChild(l);
  }, []);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("mp-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Logo = ({ light = false }: { light?: boolean }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: light ? "#fff" : COLORS.wine }}
    >
      <Music size={18} color={light ? COLORS.wine : "#fff"} />
    </div>
    <span
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: 22,
        color: light ? "#fff" : COLORS.wine,
        letterSpacing: "-0.01em",
      }}
    >
      MelodiaPod
    </span>
  </div>
);

const Header = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "como-funciona", label: "Como Funciona" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "planos", label: "Planos" },
    { id: "faq", label: "FAQ" },
  ];
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ background: "rgba(253,248,243,0.85)", borderBottom: `1px solid ${COLORS.line}` }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <button onClick={() => scrollTo("hero")}>
          <Logo />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-[14px] font-medium transition-opacity hover:opacity-70"
              style={{ color: COLORS.ink, fontFamily: "Inter, sans-serif" }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full text-[13px] font-medium transition-all hover:bg-[#5D1717]/5"
            style={{
              border: `1.5px solid ${COLORS.wine}`,
              color: COLORS.wine,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Ver meu pedido
          </a>
          <button
            onClick={() => scrollTo("planos")}
            className="px-5 py-2 rounded-full text-[13px] font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: COLORS.wine,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 6px 20px -8px rgba(93,23,23,0.5)",
            }}
          >
            Criar minha música
          </button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X color={COLORS.wine} /> : <Menu color={COLORS.wine} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 pt-2 space-y-3" style={{ background: COLORS.bg }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                scrollTo(l.id);
                setOpen(false);
              }}
              className="block w-full text-left py-2 text-[15px]"
              style={{ color: COLORS.ink, fontFamily: "Inter, sans-serif" }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => {
              scrollTo("planos");
              setOpen(false);
            }}
            className="w-full py-3 rounded-full text-[14px] font-semibold mt-2"
            style={{ background: COLORS.wine, color: "#fff" }}
          >
            Criar minha música
          </button>
        </div>
      )}
    </header>
  );
};

const Hero = () => (
  <section id="hero" className="relative overflow-hidden" style={{ background: COLORS.bg }}>
    <div
      className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-3xl"
      style={{ background: COLORS.wine }}
    />
    <div
      className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
      style={{ background: COLORS.wine }}
    />
    <div className="relative max-w-5xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-32 text-center">
      <div
        data-reveal
        className="mp-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.line}`,
          color: COLORS.wine,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        }}
      >
        <Sparkles size={14} /> +2.000 músicas criadas · ★ 4.9 · Entrega em 5 dias
      </div>

      <h1
        data-reveal
        className="mp-reveal text-[40px] md:text-[68px] leading-[1.05] mb-6"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: COLORS.ink,
          letterSpacing: "-0.02em",
        }}
      >
        Transforme sua história em uma{" "}
        <span style={{ color: COLORS.wine, fontStyle: "italic" }}>música inesquecível</span>.
      </h1>

      <p
        data-reveal
        className="mp-reveal text-[16px] md:text-[19px] max-w-2xl mx-auto mb-10"
        style={{
          color: COLORS.inkSoft,
          fontFamily: "Inter, sans-serif",
          lineHeight: 1.6,
        }}
      >
        Cada vida tem uma trilha sonora. Compomos músicas únicas, feitas à mão por artistas reais,
        a partir da sua história — para emocionar quem você ama.
      </p>

      <div data-reveal className="mp-reveal flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          onClick={() => scrollTo("planos")}
          className="group px-7 py-4 rounded-full text-[15px] font-semibold inline-flex items-center gap-2 transition-all hover:opacity-95 hover:-translate-y-0.5"
          style={{
            background: COLORS.wine,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 16px 40px -16px rgba(93,23,23,0.6)",
          }}
        >
          Criar minha música personalizada
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
        <button
          className="px-7 py-4 rounded-full text-[15px] font-medium inline-flex items-center gap-2 transition-all hover:bg-[#5D1717]/5"
          style={{
            border: `1.5px solid ${COLORS.wine}`,
            color: COLORS.wine,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Play size={16} fill={COLORS.wine} /> Ouvir um exemplo
        </button>
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: Mic,
      title: "Conte sua história",
      desc: "Em um formulário simples, compartilhe a história, os nomes e os sentimentos que devem viver na canção.",
    },
    {
      icon: Music,
      title: "Escolha o estilo",
      desc: "Selecione o gênero, o tom e a voz que mais combinam com o momento — do romântico ao alegre.",
    },
    {
      icon: Headphones,
      title: "Receba sua música",
      desc: "Em até 5 dias, sua música chega pronta em alta qualidade, com letra exclusiva e arranjo profissional.",
    },
  ];
  return (
    <section id="como-funciona" className="py-24 md:py-32" style={{ background: COLORS.bgAlt }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16" data-reveal>
          <p
            className="mp-reveal text-[12px] tracking-[0.2em] uppercase mb-3"
            style={{ color: COLORS.wine, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Como funciona
          </p>
          <h2
            className="mp-reveal text-[34px] md:text-[48px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Três passos para uma emoção eterna
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              data-reveal
              className="mp-reveal p-8 rounded-2xl transition-all hover:-translate-y-1"
              style={{
                background: "#fff",
                border: `1px solid ${COLORS.line}`,
                boxShadow: "0 4px 24px -8px rgba(31,20,20,0.06)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{ background: COLORS.wine + "12", color: COLORS.wine }}
              >
                <s.icon size={22} />
              </div>
              <div
                className="text-[12px] font-semibold mb-2"
                style={{ color: COLORS.wine, fontFamily: "Inter, sans-serif" }}
              >
                Passo {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="text-[22px] mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  color: COLORS.ink,
                }}
              >
                {s.title}
              </h3>
              <p
                className="text-[15px]"
                style={{ color: COLORS.inkSoft, fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Categorias = () => {
  const cats = [
    { icon: Heart, label: "Amor" },
    { icon: Gift, label: "Casamento" },
    { icon: Cake, label: "Aniversário" },
    { icon: Star, label: "Homenagem" },
    { icon: Sparkles, label: "Nascimento" },
    { icon: Music, label: "Amizade" },
  ];
  return (
    <section className="py-24 md:py-32" style={{ background: COLORS.bg }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14" data-reveal>
          <p
            className="mp-reveal text-[12px] tracking-[0.2em] uppercase mb-3"
            style={{ color: COLORS.wine, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Para cada momento
          </p>
          <h2
            className="mp-reveal text-[34px] md:text-[48px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Uma música certa
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((c, i) => (
            <button
              key={i}
              onClick={() => scrollTo("planos")}
              data-reveal
              className="mp-reveal aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg group"
              style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors group-hover:bg-[#5D1717] group-hover:text-white"
                style={{ background: COLORS.wine + "12", color: COLORS.wine }}
              >
                <c.icon size={20} />
              </div>
              <span
                className="text-[14px] font-medium"
                style={{ color: COLORS.ink, fontFamily: "Inter, sans-serif" }}
              >
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const Depoimentos = () => {
  const items = [
    {
      i: "MR",
      n: "Mariana R.",
      o: "Casamento",
      t: "Chorei do começo ao fim. A letra parecia escrita por alguém que viveu nossa história. Tocou no nosso primeiro dance e ninguém ficou em pé.",
    },
    {
      i: "JL",
      n: "João L.",
      o: "Aniversário da mãe",
      t: "Foi o presente mais emocionante que já dei. Minha mãe ouve todos os dias. Vale cada centavo.",
    },
    {
      i: "AC",
      n: "Ana C.",
      o: "Homenagem",
      t: "Fiz para meu pai que se foi. A música conseguiu guardar quem ele era. Eternamente grata.",
    },
  ];
  return (
    <section id="depoimentos" className="py-24 md:py-32" style={{ background: COLORS.bgAlt }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14" data-reveal>
          <p
            className="mp-reveal text-[12px] tracking-[0.2em] uppercase mb-3"
            style={{ color: COLORS.wine, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Histórias reais
          </p>
          <h2
            className="mp-reveal text-[34px] md:text-[48px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Quem ouviu, se emocionou
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((d, i) => (
            <div
              key={i}
              data-reveal
              className="mp-reveal p-8 rounded-2xl"
              style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}
            >
              <div className="flex gap-1 mb-4" style={{ color: COLORS.wine }}>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill={COLORS.wine} />
                ))}
              </div>
              <p
                className="text-[15px] mb-6"
                style={{ color: COLORS.ink, fontFamily: "Inter, sans-serif", lineHeight: 1.65 }}
              >
                “{d.t}”
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold"
                  style={{ background: COLORS.wine, color: "#fff", fontFamily: "Inter, sans-serif" }}
                >
                  {d.i}
                </div>
                <div>
                  <div
                    className="text-[14px] font-semibold"
                    style={{ color: COLORS.ink, fontFamily: "Inter, sans-serif" }}
                  >
                    {d.n}
                  </div>
                  <div
                    className="text-[12px]"
                    style={{ color: COLORS.inkSoft, fontFamily: "Inter, sans-serif" }}
                  >
                    {d.o}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Planos = () => {
  const plans = [
    {
      name: "Essencial",
      price: "R$ 197",
      desc: "A emoção em formato música.",
      feats: ["Música personalizada (2-3 min)", "Entrega em 7 dias", "1 estilo musical", "Arquivo MP3 em alta qualidade"],
      featured: false,
    },
    {
      name: "Express",
      price: "R$ 297",
      desc: "O presente mais pedido.",
      feats: [
        "Música personalizada (2-3 min)",
        "Entrega em 5 dias",
        "Escolha de gênero e voz",
        "MP3 + arte personalizada",
        "1 revisão incluída",
      ],
      featured: true,
    },
    {
      name: "Turbo VIP",
      price: "R$ 497",
      desc: "Quando o momento merece tudo.",
      feats: [
        "Música personalizada (3-4 min)",
        "Entrega em 48h",
        "Voz e estilo premium",
        "MP3 + WAV + clipe lyric video",
        "Revisões ilimitadas",
        "Prioridade no atendimento",
      ],
      featured: false,
    },
  ];
  return (
    <section id="planos" className="py-24 md:py-32" style={{ background: COLORS.bg }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14" data-reveal>
          <p
            className="mp-reveal text-[12px] tracking-[0.2em] uppercase mb-3"
            style={{ color: COLORS.wine, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Planos
          </p>
          <h2
            className="mp-reveal text-[34px] md:text-[48px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Escolha o tom da sua história
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <div
              key={i}
              data-reveal
              className="mp-reveal relative p-8 rounded-3xl flex flex-col transition-all hover:-translate-y-1"
              style={{
                background: p.featured ? COLORS.wine : "#fff",
                color: p.featured ? "#fff" : COLORS.ink,
                border: `1px solid ${p.featured ? COLORS.wine : COLORS.line}`,
                boxShadow: p.featured
                  ? "0 30px 60px -20px rgba(93,23,23,0.45)"
                  : "0 4px 24px -8px rgba(31,20,20,0.06)",
                transform: p.featured ? "scale(1.02)" : undefined,
              }}
            >
              {p.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                  style={{ background: "#fff", color: COLORS.wine, fontFamily: "Inter, sans-serif" }}
                >
                  Mais popular
                </div>
              )}
              <h3
                className="text-[26px] mb-1"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                {p.name}
              </h3>
              <p
                className="text-[14px] mb-6 opacity-80"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {p.desc}
              </p>
              <div
                className="text-[42px] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {p.price}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.feats.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[14px]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: p.featured ? "#fff" : COLORS.wine }}
                    />
                    <span style={{ opacity: 0.9 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="text-center py-3.5 rounded-full text-[14px] font-semibold transition-all hover:opacity-90"
                style={{
                  background: p.featured ? "#fff" : COLORS.wine,
                  color: p.featured ? COLORS.wine : "#fff",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Quero este plano
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "Quanto tempo leva para receber minha música?",
      a: "Depende do plano escolhido. O Essencial entrega em até 7 dias, o Express em 5 dias e o Turbo VIP em apenas 48 horas.",
    },
    {
      q: "A música é realmente única e exclusiva?",
      a: "Sim. Cada composição é feita do zero por nossos artistas, baseada exclusivamente na sua história. Você recebe os direitos de uso pessoal.",
    },
    {
      q: "Posso pedir alterações na letra ou no arranjo?",
      a: "Os planos Express incluem 1 revisão e o Turbo VIP oferece revisões ilimitadas dentro do escopo combinado.",
    },
    {
      q: "Em quais estilos vocês compõem?",
      a: "Trabalhamos com diversos gêneros: pop, MPB, sertanejo, romântico, acústico, gospel, rock, infantil e muito mais.",
    },
    {
      q: "Como faço o pagamento?",
      a: "Aceitamos cartão de crédito, PIX e boleto. O pedido entra em produção após a confirmação do pagamento.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32" style={{ background: COLORS.bgAlt }}>
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14" data-reveal>
          <p
            className="mp-reveal text-[12px] tracking-[0.2em] uppercase mb-3"
            style={{ color: COLORS.wine, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Dúvidas frequentes
          </p>
          <h2
            className="mp-reveal text-[34px] md:text-[48px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Tudo que você precisa saber
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                data-reveal
                className="mp-reveal rounded-2xl overflow-hidden"
                style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className="text-[16px] font-semibold"
                    style={{ color: COLORS.ink, fontFamily: "Inter, sans-serif" }}
                  >
                    {f.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className="shrink-0 transition-transform"
                    style={{
                      color: COLORS.wine,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </button>
                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="px-6 pb-5 text-[15px]"
                      style={{
                        color: COLORS.inkSoft,
                        fontFamily: "Inter, sans-serif",
                        lineHeight: 1.65,
                      }}
                    >
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{ background: COLORS.wineDark, color: "#fff" }} className="pt-16 pb-8">
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <Logo light />
          <p
            className="mt-4 max-w-md text-[14px]"
            style={{ fontFamily: "Inter, sans-serif", color: "#FDF8F3", opacity: 0.75, lineHeight: 1.65 }}
          >
            Compomos músicas únicas a partir das suas histórias. Cada canção é um presente que dura
            para sempre.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full text-[14px] font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "#25D366", color: "#fff", fontFamily: "Inter, sans-serif" }}
          >
            <MessageCircle size={16} /> Falar com suporte
          </a>
        </div>
        <div>
          <h4
            className="text-[13px] uppercase tracking-wider mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, opacity: 0.6 }}
          >
            Navegação
          </h4>
          <ul className="space-y-2.5 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            {[
              ["Como Funciona", "como-funciona"],
              ["Depoimentos", "depoimentos"],
              ["Planos", "planos"],
              ["FAQ", "faq"],
            ].map(([l, id]) => (
              <li key={id}>
                <button onClick={() => scrollTo(id)} className="opacity-80 hover:opacity-100">
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4
            className="text-[13px] uppercase tracking-wider mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, opacity: 0.6 }}
          >
            Contato
          </h4>
          <ul className="space-y-2.5 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <Mail size={14} /> {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </li>
          </ul>
          <div className="flex gap-3 mt-5">
            {[Instagram, Facebook].map((Ic, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <Ic size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)", fontFamily: "Inter, sans-serif", opacity: 0.6 }}
      >
        <span>© {new Date().getFullYear()} MelodiaPod. Todos os direitos reservados.</span>
        <span>Feito com ♥ para emocionar.</span>
      </div>
    </div>
  </footer>
);

const FloatingWhatsApp = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noreferrer"
    aria-label="Falar no WhatsApp"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
    style={{
      background: "#25D366",
      boxShadow: "0 12px 32px -8px rgba(37,211,102,0.6)",
    }}
  >
    <MessageCircle size={26} color="#fff" fill="#fff" />
    <span
      className="absolute inset-0 rounded-full animate-ping"
      style={{ background: "#25D366", opacity: 0.3 }}
    />
  </a>
);

export default function MelodiaPod() {
  useFonts();
  useReveal();
  useEffect(() => {
    document.title = "MelodiaPod — Músicas personalizadas que emocionam";
    const prev = document.body.style.background;
    document.body.style.background = COLORS.bg;
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .mp-reveal { opacity: 0; transform: translateY(18px); transition: opacity .8s ease, transform .8s ease; }
        .mp-reveal.mp-in { opacity: 1; transform: translateY(0); }
      `}</style>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Categorias />
        <Depoimentos />
        <Planos />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
