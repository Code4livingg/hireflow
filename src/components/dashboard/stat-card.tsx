import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
  tooltip?: string;
};

export function StatCard({ label, value, detail, highlight, tooltip }: StatCardProps) {
  return (
    <Card
      className={cn(
        "interactive-card",
        highlight && "card-glow border-cyan-500/30 dark:border-cyan-400/20",
      )}
    >
      <CardHeader className="pb-2">
        {tooltip ? (
          <Tooltip content={tooltip}>
            <CardDescription className="cursor-default">{label}</CardDescription>
          </Tooltip>
        ) : (
          <CardDescription>{label}</CardDescription>
        )}
        <CardTitle className="text-3xl">
          <AnimatedNumber value={value} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
