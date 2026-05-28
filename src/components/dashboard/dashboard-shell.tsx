import Link from "next/link";
import { Container } from "@/components/layout/container";

type DashboardShellProps = {
  title: string;
  description: string;
  links: { href: string; label: string }[];
  children: React.ReactNode;
};

export function DashboardShell({ title, description, links, children }: DashboardShellProps) {
  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <nav className="mb-8 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </Container>
  );
}
