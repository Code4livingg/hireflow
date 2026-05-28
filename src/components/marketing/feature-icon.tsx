import {
  BadgeCheck,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  briefcase: BriefcaseBusiness,
  shield: ShieldCheck,
  calendar: CalendarClock,
  bell: BellRing,
  chart: BarChart3,
  users: UsersRound,
  building: Building2,
  badge: BadgeCheck,
  message: MessageSquareText,
};

export function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
