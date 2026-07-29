import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        emerald:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        neutral:
          "border-zinc-800 bg-zinc-900 text-zinc-300",
        outline:
          "border-zinc-800 text-zinc-400",
        muted:
          "border-zinc-800/80 bg-zinc-950 text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

