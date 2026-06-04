"use client";

import {
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { SidebarItem, type SidebarItemConfig } from "@/components/dashboard/sidebar-item";
import { cn } from "@/lib/utils";

export type DashboardRole = "student" | "recruiter" | "admin";

export type DashboardNavItem = SidebarItemConfig;

type NavSection = {
  label: string;
  items: DashboardNavItem[];
};

const roleLabels: Record<DashboardRole, string> = {
  student: "Student",
  recruiter: "Recruiter",
  admin: "Admin",
};

const commonItems: DashboardNavItem[] = [
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const roleItems: Record<DashboardRole, DashboardNavItem[]> = {
  student: [
    { href: "/dashboard/student", label: "Student home", icon: LayoutDashboard },
    ...commonItems,
  ],
  recruiter: [
    { href: "/dashboard/recruiter", label: "Recruiter home", icon: LayoutDashboard },
    { href: "/jobs", label: "Job board", icon: Briefcase },
    { href: "/profile", label: "Profile", icon: UserRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Admin home", icon: ShieldCheck },
    { href: "/dashboard/recruiter", label: "Recruiter view", icon: ClipboardList },
    { href: "/dashboard/student", label: "Student view", icon: UsersRound },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
  ],
};

export function getDashboardNav(role: DashboardRole, extraItems: DashboardNavItem[] = []) {
  const seen = new Set<string>();

  return [...roleItems[role], ...extraItems].filter((item) => {
    if (seen.has(item.href)) {
      return false;
    }

    seen.add(item.href);
    return true;
  });
}

type SidebarProps = {
  activePath: string;
  collapsed?: boolean;
  className?: string;
  extraItems?: DashboardNavItem[];
  onNavigate?: () => void;
  role: DashboardRole;
};

function isActiveRoute(activePath: string, href: string) {
  if (href === "/") {
    return activePath === href;
  }

  return activePath === href || activePath.startsWith(`${href}/`);
}

function SidebarSection({
  activePath,
  collapsed,
  items,
  label,
  onNavigate,
}: NavSection & Pick<SidebarProps, "activePath" | "collapsed" | "onNavigate">) {
  return (
    <div className="space-y-1">
      <p className={cn("px-3 text-xs font-semibold text-sidebar-foreground/50", collapsed && "sr-only")}>
        {label}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={isActiveRoute(activePath, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export function Sidebar({
  activePath,
  collapsed = false,
  className,
  extraItems,
  onNavigate,
  role,
}: SidebarProps) {
  const sections: NavSection[] = [
    {
      label: `${roleLabels[role]} menu`,
      items: getDashboardNav(role, extraItems),
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        collapsed ? "w-18" : "w-72",
        className
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <LayoutDashboard className="size-4" aria-hidden="true" />
        </div>
        <div className={cn("ml-3 min-w-0", collapsed && "sr-only")}>
          <p className="truncate text-sm font-semibold">HireFlow</p>
          <p className="truncate text-xs text-sidebar-foreground/55">{roleLabels[role]} workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label={`${roleLabels[role]} dashboard navigation`}>
        {sections.map((section) => (
          <SidebarSection
            key={section.label}
            activePath={activePath}
            collapsed={collapsed}
            onNavigate={onNavigate}
            {...section}
          />
        ))}
      </nav>
    </aside>
  );
}
