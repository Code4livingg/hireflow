import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type MatchScoreProps = {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "circle" | "badge";
  className?: string;
};

const sizeMap = {
  sm: { box: "size-14", radius: 24, stroke: 5, text: "text-sm" },
  md: { box: "size-24", radius: 42, stroke: 7, text: "text-2xl" },
  lg: { box: "size-32", radius: 56, stroke: 8, text: "text-3xl" },
};

function scoreTone(score: number) {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-300";
  if (score >= 70) return "text-cyan-700 dark:text-cyan-300";
  if (score >= 50) return "text-amber-700 dark:text-amber-300";
  return "text-muted-foreground";
}

export function MatchScore({ className, label = "Match Score", score, size = "md", variant = "circle" }: MatchScoreProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
          className
        )}
      >
        <Sparkles className="size-3" aria-hidden="true" />
        {clamped}% match
      </span>
    );
  }

  const config = sizeMap[size];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className={cn("relative shrink-0", config.box)}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" role="img" aria-label={`${label}: ${clamped}%`}>
          <circle
            cx="60"
            cy="60"
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-muted"
          />
          <circle
            cx="60"
            cy="60"
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-700", scoreTone(clamped))}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-semibold tabular-nums", config.text)}>{clamped}</span>
          <span className="text-[0.65rem] font-medium text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className={cn("size-4", scoreTone(clamped))} aria-hidden="true" />
          {label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {clamped >= 85
            ? "Excellent role alignment"
            : clamped >= 70
              ? "Strong match with a few gaps"
              : clamped >= 50
                ? "Moderate match"
                : "Develop key skills first"}
        </p>
      </div>
    </div>
  );
}
