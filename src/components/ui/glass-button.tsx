import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 backdrop-blur-xl border border-white/20 text-foreground hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-primary/20",
        primary:
          "bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-xl border border-primary/30 text-white hover:from-primary hover:to-secondary hover:shadow-xl hover:shadow-primary/30 hover:scale-105",
        secondary:
          "bg-secondary/10 backdrop-blur-xl border border-secondary/30 text-secondary hover:bg-secondary/20 hover:border-secondary/50",
        ghost:
          "bg-transparent backdrop-blur-sm hover:bg-white/10 hover:border-white/20 border border-transparent",
        outline:
          "bg-transparent backdrop-blur-xl border-2 border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/60",
        glow:
          "bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-13 px-10 py-3 text-base",
        xl: "h-14 px-12 py-4 text-lg",
        icon: "h-11 w-11",
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
