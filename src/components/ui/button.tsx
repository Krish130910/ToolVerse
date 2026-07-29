import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-400 text-black hover:bg-emerald-300 shadow-xs font-bold",
        destructive:
          "bg-rose-500 text-white hover:bg-rose-600 shadow-xs",
        outline:
          "border border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-400 shadow-xs",
        secondary:
          "bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white",
        ghost:
          "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80",
        link:
          "text-emerald-400 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

