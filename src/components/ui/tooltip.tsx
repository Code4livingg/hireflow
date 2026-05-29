import { cn } from "@/lib/utils";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("tooltip-trigger", className)}>
      {children}
      <span role="tooltip" className="tooltip-content">
        {content}
      </span>
    </span>
  );
}
