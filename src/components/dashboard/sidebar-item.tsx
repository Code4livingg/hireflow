"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarItemConfig = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type SidebarItemProps = SidebarItemConfig & {
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarItem({
  active,
  collapsed = false,
  href,
  icon: Icon,
  label,
  onNavigate,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/76 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
    </Link>
  );
}
