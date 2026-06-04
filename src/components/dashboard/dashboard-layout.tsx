"use client";

import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar, type DashboardNavItem, type DashboardRole } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: React.ReactNode;
  description: string;
  links?: DashboardNavItem[];
  role: DashboardRole;
  title: string;
};

export function DashboardLayout({ children, description, links, role, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/25 dark:bg-background">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar
          activePath={pathname}
          collapsed={collapsed}
          extraItems={links}
          role={role}
          className="sticky top-16 hidden max-h-[calc(100vh-4rem)] shrink-0 lg:flex"
        />

        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/45 transition-opacity lg:hidden",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200 lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative h-full">
            <Sidebar activePath={pathname} extraItems={links} onNavigate={() => setMobileOpen(false)} role={role} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close dashboard menu"
              className="absolute right-3 top-3 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <section className="min-w-0 flex-1">
          <header className="sticky top-16 z-30 border-b border-border/80 bg-background/92 backdrop-blur">
            <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open dashboard menu"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={collapsed ? "Expand dashboard sidebar" : "Collapse dashboard sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="hidden lg:inline-flex"
                onClick={() => setCollapsed((value) => !value)}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="size-4" aria-hidden="true" />
                )}
              </Button>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </header>

          <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </section>
      </div>
    </div>
  );
}
