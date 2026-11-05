/**
 * Renderizador de vídeos de marketing da Produção em Lote.
 *
 * Motor "template + dados da marca": nenhum vídeo é gerado por IA.
 * Cada vídeo é renderizado em canvas (9:16) a partir do template escolhido,
 * dos dados da marca do cliente e de variações determinísticas de texto
 * (seed = variation_index), garantindo que 300 vídeos sejam únicos,
 * rápidos e sem custo de IA por unidade.
 */

export interface BatchBrandData {
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

export interface BatchRenderConfig {
  template_id: string;
  template_name: string;
  style: string;
  duration_seconds: number;
  segment: string;
  theme: string;
  variation_index: number;
  brand: BatchBrandData;
}

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 1280;
const FPS = 30;

/* ------------------------------------------------------------------ */
/* Bancos de texto (variação determinística por índice)                */
/* ------------------------------------------------------------------ */

const HOOKS = [
  "Você não vai acreditar nisso",
  "Pare tudo o que está fazendo",
  "Isso vai mudar seu jogo",
  "Atenção: novidade chegando",
  "O segredo que ninguém conta",
  "Prepare-se para se surpreender",
  "É hoje! Não perca",
  "Descubra agora mesmo",
  "Oportunidade única para você",
  "O que você estava esperando chegou",
  "Simples, rápido e feito para você",
  "A escolha certa está aqui",
];

const CTAS = [
  "Garanta o seu agora",
  "Clique e saiba mais",
  "Fale com a gente hoje",
  "Aproveite enquanto dura",
  "Comece agora mesmo",
  "Chama no direct",
  "Peça já o seu",
  "Saiba mais no link",
  "Não fique de fora",
  "Faça parte agora",
];

const BENEFITS = [
  "Qualidade que você confia",
  "Feito especialmente para você",
  "Resultados de verdade",
  "O melhor custo-benefício",
  "Atendimento de excelência",
  "Inovação em cada detalhe",
  "Sua satisfação garantida",
  "Experiência premium",
];

/** PRNG determinístico (mulberry32) — mesmo índice gera sempre o mesmo vídeo. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: T[], rand: () => number): T {
  return list[Math.floor(rand() * list.length) % list.length];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ------------------------------------------------------------------ */
/* Renderer                                                            */
/* ------------------------------------------------------------------ */

export class BatchVideoRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: BatchRenderConfig;
  private logo: HTMLImageElement | null = null;
  private rand: () => number;
  private hook: string;
  private cta: string;
  private benefit: string;
  private backgroundHueShift: number;
  private animationFrame: number | null = null;

  constructor(config: BatchRenderConfig, canvas?: HTMLCanvasElement) {
    this.config = config;
    this.canvas = canvas ?? document.createElement("canvas");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D não suportado neste navegador.");
    this.ctx = ctx;
    this.rand = seededRandom(config.variation_index * 7919 + 17);
    this.hook = pick(HOOKS, this.rand);
    this.cta = pick(CTAS, this.rand);
    this.benefit = pick(BENEFITS, this.rand);
    this.backgroundHueShift = Math.floor(this.rand() * 360);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  private async loadLogo(): Promise<void> {
    const url = this.config.brand.logo_url;
    if (!url) return;
    try {
      this.logo = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    } catch {
      this.logo = null;
    }
  }

  /** Desenha um frame no tempo t (0..1 da duração total). */
  drawFrame(t: number): void {
    const { ctx, canvas } = this;
    const { brand, theme, segment } = this.config;
    const W = canvas.width;
    const H = canvas.height;

    const primary = brand.primary_color || "#7C3AED";
    const secondary = brand.secondary_color || "#0EA5E9";

    // Fundo em gradiente animado
    const drift = Math.sin(t * Math.PI * 2) * 0.15;
    const gradient = ctx.createLinearGradient(0, 0, W * (1 + drift), H);
    gradient.addColorStop(0, primary);
    gradient.addColorStop(1, secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Círculos decorativos com paralaxe
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffffff";
    const cx1 = W * 0.85 + Math.sin(t * Math.PI * 2) * 40;
    ctx.beginPath();
    ctx.arc(cx1, H * 0.15, 180, 0, Math.PI * 2);
    ctx.fill();
    const cx2 = W * 0.1 + Math.cos(t * Math.PI * 2) * 40;
    ctx.beginPath();
    ctx.arc(cx2, H * 0.85, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cena 1 (0–40%): hook
    // Cena 2 (35–70%): tema + benefício
    // Cena 3 (65–100%): marca + CTA
    const scene1 = { in: 0, out: 0.4 };
    const scene2 = { in: 0.35, out: 0.7 };
    const scene3 = { in: 0.65, out: 1 };

    // Selo do segmento (sempre visível)
    const badgeAlpha = Math.min(1, t * 6);
    ctx.save();
    ctx.globalAlpha = badgeAlpha * 0.9;
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    const badgeText = segment.toUpperCase();
    ctx.font = "600 26px system-ui, sans-serif";
    const badgeWidth = ctx.measureText(badgeText).width + 48;
    this.roundRect(W / 2 - badgeWidth / 2, 96, badgeWidth, 52, 26);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, W / 2, 96 + 26);
    ctx.restore();

    // Cena 1 — Hook
    if (t >= scene1.in && t < scene1.out + 0.05) {
      const local = (t - scene1.in) / (scene1.out - scene1.in);
      const enter = easeOutCubic(Math.min(1, local * 3));
      const exit = local > 0.85 ? 1 - (local - 0.85) / 0.15 : 1;
      const alpha = Math.max(0, Math.min(enter, exit));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "800 84px system-ui, sans-serif";
      const lines = wrapText(ctx, this.hook, W - 120);
      const startY = H * 0.42 - ((lines.length - 1) * 100) / 2 + (1 - enter) * 60;
      lines.forEach((line, i) => {
        ctx.fillText(line, W / 2, startY + i * 100);
      });
      ctx.restore();
    }

    // Cena 2 — Tema + benefício
    if (t >= scene2.in && t < scene2.out + 0.05) {
      const local = (t - scene2.in) / (scene2.out - scene2.in);
      const enter = easeOutCubic(Math.min(1, local * 3));
      const exit = local > 0.85 ? 1 - (local - 0.85) / 0.15 : 1;
      const alpha = Math.max(0, Math.min(enter, exit));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 64px system-ui, sans-serif";
      const themeLines = wrapText(ctx, this.config.theme, W - 100).slice(0, 4);
      const themeStart = H * 0.36 + (1 - enter) * 60;
      themeLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, themeStart + i * 76);
      });
      ctx.font = "500 36px system-ui, sans-serif";
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillText(this.benefit, W / 2, themeStart + themeLines.length * 76 + 60);
      ctx.restore();
    }

    // Cena 3 — Marca + CTA
    if (t >= scene3.in) {
      const local = (t - scene3.in) / (scene3.out - scene3.in);
      const enter = easeOutCubic(Math.min(1, local * 3));
      ctx.save();
      ctx.globalAlpha = enter;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (this.logo) {
        const size = 200 * enter;
        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, H * 0.3, size / 2 + 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();
        ctx.clip();
        ctx.drawImage(this.logo, W / 2 - size / 2, H * 0.3 - size / 2, size, size);
        ctx.restore();
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 72px system-ui, sans-serif";
        const brandLines = wrapText(ctx, brand.name, W - 140).slice(0, 2);
        brandLines.forEach((line, i) => {
          ctx.fillText(line, W / 2, H * 0.26 + i * 84 + (1 - enter) * 40);
        });
      }

      // Botão CTA pulsante
      const pulse = 1 + Math.sin(t * Math.PI * 6) * 0.03;
      ctx.font = "700 40px system-ui, sans-serif";
      const ctaWidth = (ctx.measureText(this.cta).width + 96) * pulse;
      const ctaHeight = 96 * pulse;
      const ctaY = H * 0.72;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "#ffffff";
      this.roundRect(W / 2 - ctaWidth / 2, ctaY, ctaWidth, ctaHeight, ctaHeight / 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = primary;
      ctx.fillText(this.cta, W / 2, ctaY + ctaHeight / 2 + 2);

      // Nome da marca no rodapé
      ctx.globalAlpha = enter * 0.85;
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 30px system-ui, sans-serif";
      ctx.fillText(brand.name, W / 2, H * 0.92);
      ctx.restore();
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /** Prévia animada em loop (para a galeria). Retorna função de stop. */
  async playPreview(): Promise<() => void> {
    await this.loadLogo();
    const durationMs = this.config.duration_seconds * 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) % durationMs) / durationMs;
      this.drawFrame(t);
      this.animationFrame = requestAnimationFrame(tick);
    };
    this.animationFrame = requestAnimationFrame(tick);
    return () => {
      if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    };
  }

  /** Gera uma miniatura estática (frame do meio do vídeo) como dataURL. */
  async renderThumbnail(): Promise<string> {
    await this.loadLogo();
    this.drawFrame(0.5);
    return this.canvas.toDataURL("image/jpeg", 0.85);
  }

  /**
   * Exporta o vídeo completo como WebM (MediaRecorder + captureStream).
   * Retorna null quando o navegador não suporta captura de canvas.
   */
  async exportWebM(onProgress?: (fraction: number) => void): Promise<Blob | null> {
    if (typeof MediaRecorder === "undefined" || !this.canvas.captureStream) {
      return null;
    }
    await this.loadLogo();

    const stream = this.canvas.captureStream(FPS);
    const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    if (!mimeType) return null;

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const durationMs = this.config.duration_seconds * 1000;
    const frameInterval = 1000 / FPS;

    return await new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      recorder.onerror = () => resolve(null);
      recorder.start(250);

      const start = performance.now();
      const render = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, elapsed / durationMs);
        this.drawFrame(t);
        onProgress?.(t);
        if (t >= 1) {
          recorder.stop();
          return;
        }
        setTimeout(render, frameInterval);
      };
      render();
    });
  }
}
