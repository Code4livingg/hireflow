import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-xl transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-cyan-200/80 bg-white/70 text-cyan-900 shadow-sm dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100",
        muted:
          "border-border/80 bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/5",
        success:
          "border-emerald-200/80 bg-emerald-50/80 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
