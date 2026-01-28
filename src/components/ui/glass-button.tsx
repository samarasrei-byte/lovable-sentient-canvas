import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.03] backdrop-blur-md border border-white/[0.08] text-foreground hover:bg-white/[0.06] hover:border-white/[0.12]",
        primary:
          "bg-primary/90 border border-primary/20 text-white hover:bg-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:scale-[1.02]",
        secondary:
          "bg-secondary/10 backdrop-blur-md border border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary/30",
        ghost:
          "bg-transparent hover:bg-white/[0.04] border border-transparent",
        outline:
          "bg-transparent backdrop-blur-md border border-white/[0.12] text-foreground hover:bg-white/[0.04] hover:border-white/[0.2]",
        glow:
          "bg-primary/90 border border-primary/30 text-white shadow-[0_0_20px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-[1.02]",
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
