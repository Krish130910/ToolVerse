import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50",
  {
    variants: {
      variant: {
        default:
          "border-orange-200/80 bg-orange-50 text-orange-600 font-bold",
        emerald:
          "border-orange-200/80 bg-orange-50 text-orange-600 font-bold",
        orange:
          "border-orange-200/80 bg-orange-50 text-orange-600 font-bold",
        neutral:
          "border-zinc-200 bg-zinc-100 text-zinc-700",
        outline:
          "border-zinc-300 text-zinc-600",
        muted:
          "border-zinc-200 bg-zinc-50 text-zinc-500",
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
