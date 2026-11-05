import { memo } from "react";
import { motion } from "framer-motion";
import { Check, Clapperboard, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { BATCH_SEGMENTS, BATCH_QUANTITIES, type BatchClient, type VideoTemplate } from "@/lib/batch-api";

const stepMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25 },
};

/* --------------------------- 1. Segmento --------------------------- */

export const StepSegment = memo(
  ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <motion.div {...stepMotion} className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {BATCH_SEGMENTS.map((segment) => (
        <button
          key={segment}
          type="button"
          onClick={() => onChange(segment)}
          className={cn(
            "rounded-xl border p-4 text-sm font-medium text-left transition-all",
            value === segment
              ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
              : "border-border/40 bg-card/50 text-foreground/80 hover:border-primary/40",
          )}
        >
          {segment}
        </button>
      ))}
    </motion.div>
  ),
);
StepSegment.displayName = "StepSegment";

/* ----------------------------- 2. Tema ------------------------------ */

export const StepTheme = memo(
  ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <motion.div {...stepMotion} className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        maxLength={500}
        placeholder="Ex.: Promoção de dia das mães com 30% de desconto em todos os serviços"
        className="w-full rounded-xl border border-border/40 bg-card/50 px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Descreva o tema ou campanha. Cada vídeo do lote terá variações de texto e cenas geradas a
        partir dele.
      </p>
    </motion.div>
  ),
);
StepTheme.displayName = "StepTheme";

/* --------------------------- 3. Quantidade -------------------------- */

export const StepQuantity = memo(
  ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <motion.div {...stepMotion} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {BATCH_QUANTITIES.map((qty) => (
        <button
          key={qty}
          type="button"
          onClick={() => onChange(qty)}
          className={cn(
            "relative rounded-2xl border p-6 text-center transition-all",
            value === qty
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
              : "border-border/40 bg-card/50 hover:border-primary/40",
          )}
        >
          {value === qty && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
          <Clapperboard
            className={cn(
              "w-6 h-6 mx-auto mb-2",
              value === qty ? "text-primary" : "text-muted-foreground",
            )}
          />
          <p className="font-display text-2xl font-bold">{qty}</p>
          <p className="text-xs text-muted-foreground mt-1">vídeos · {qty} créditos</p>
        </button>
      ))}
    </motion.div>
  ),
);
StepQuantity.displayName = "StepQuantity";

/* ---------------------------- 4. Cliente ---------------------------- */

export const StepClient = memo(
  ({
    clients,
    value,
    onChange,
  }: {
    clients: BatchClient[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <motion.div {...stepMotion} className="grid md:grid-cols-2 gap-3">
      {clients.map((client) => (
        <button
          key={client.id}
          type="button"
          onClick={() => onChange(client.id)}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
            value === client.id
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
              : "border-border/40 bg-card/50 hover:border-primary/40",
          )}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{
              background: `linear-gradient(135deg, ${client.primary_color ?? "#7C3AED"}, ${client.secondary_color ?? "#0EA5E9"})`,
            }}
          >
            {client.logo_url ? (
              <img src={client.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              client.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{client.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {client.brand_name ?? client.instagram_handle ?? "Marca sem nome"}
            </p>
          </div>
        </button>
      ))}
    </motion.div>
  ),
);
StepClient.displayName = "StepClient";

/* ---------------------------- 5. Template --------------------------- */

export const StepTemplate = memo(
  ({
    templates,
    value,
    onChange,
  }: {
    templates: VideoTemplate[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <motion.div {...stepMotion} className="grid md:grid-cols-2 gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onChange(template.id)}
          className={cn(
            "rounded-2xl border p-5 text-left transition-all",
            value === template.id
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
              : "border-border/40 bg-card/50 hover:border-primary/40",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {template.category}
            </span>
            <span className="text-[10px] text-muted-foreground">{template.duration_seconds}s</span>
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">{template.name}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
        </button>
      ))}
    </motion.div>
  ),
);
StepTemplate.displayName = "StepTemplate";

/* ------------------------- 6. Dados da marca ------------------------ */

export const StepBrandReview = memo(({ client }: { client: BatchClient }) => (
  <motion.div {...stepMotion}>
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
          style={{
            background: `linear-gradient(135deg, ${client.primary_color ?? "#7C3AED"}, ${client.secondary_color ?? "#0EA5E9"})`,
          }}
        >
          {client.logo_url ? (
            <img src={client.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            client.name.slice(0, 2).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">{client.brand_name ?? client.name}</h3>
          <p className="text-sm text-muted-foreground">{client.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Cores:</span>
          <span
            className="w-5 h-5 rounded-md border border-border/60"
            style={{ backgroundColor: client.primary_color ?? "#7C3AED" }}
          />
          <span
            className="w-5 h-5 rounded-md border border-border/60"
            style={{ backgroundColor: client.secondary_color ?? "#0EA5E9" }}
          />
        </div>
        {client.instagram_handle && (
          <p className="text-muted-foreground">
            Instagram: <span className="text-foreground">@{client.instagram_handle}</span>
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-6">
        Esses dados serão aplicados em todos os vídeos do lote. Para ajustar, edite o cliente na
        aba Clientes.
      </p>
    </div>
  </motion.div>
));
StepBrandReview.displayName = "StepBrandReview";
