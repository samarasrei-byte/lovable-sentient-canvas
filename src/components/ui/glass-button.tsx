import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.03] backdrop-blur-md border border-white/[0.08] text-foreground hover:bg-white/[0.06] hover:border-white/[0.12]",
        primary:
          "bg-primary/90 border border-primary/20 text-primary-foreground hover:bg-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:scale-[1.02]",
        secondary:
          "bg-secondary/10 backdrop-blur-md border border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary/30",
        ghost:
          "bg-transparent hover:bg-white/[0.04] border border-transparent",
        outline:
          "bg-transparent backdrop-blur-md border border-white/[0.12] text-foreground hover:bg-white/[0.04] hover:border-white/[0.2]",
        glow:
          "bg-primary/90 border border-primary/30 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-[1.02]",

        // Futuristic variants
        neon:
          "bg-background/20 backdrop-blur-xl border border-primary/35 text-foreground shadow-[0_0_18px_hsl(var(--primary-glow)/0.28)] hover:shadow-[0_0_28px_hsl(var(--primary-glow)/0.42)] hover:border-primary/55 hover:scale-[1.02]",
        aurora:
          "bg-[var(--gradient-secondary)] border border-white/10 text-primary-foreground shadow-[0_12px_40px_-18px_hsl(var(--secondary)/0.55)] hover:shadow-[0_18px_55px_-22px_hsl(var(--secondary)/0.7)] hover:scale-[1.02]",
        holographic:
          "overflow-hidden bg-[var(--gradient-primary)] border border-white/12 text-primary-foreground shadow-[0_0_26px_hsl(var(--accent)/0.22)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.35)] hover:scale-[1.02] after:content-[''] after:pointer-events-none after:absolute after:inset-0 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:bg-[radial-gradient(80%_120%_at_20%_10%,hsl(var(--secondary)/0.40),transparent_60%),radial-gradient(90%_140%_at_80%_20%,hsl(var(--artist)/0.25),transparent_55%),linear-gradient(120deg,transparent,hsl(var(--foreground)/0.10),transparent)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 py-3",
        xl: "h-14 px-10 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
