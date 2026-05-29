"use client";

type PageTransitionProps = {
  children: React.ReactNode;
};

// Note: previously keyed on pathname which caused the entire page tree to
// remount on every navigation, triggering extra App Router replaceState calls.
// CSS animation via globals.css handles the visual transition instead.
export function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-enter">{children}</div>;
}
