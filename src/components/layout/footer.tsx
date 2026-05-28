import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { footerGroups } from "@/lib/landing-data";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="HireFlow home">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="font-semibold tracking-tight">HireFlow</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              A DBMS mini-project recruiting platform with PostgreSQL, Supabase, and Next.js.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold">{group.title}</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HireFlow. DBMS coursework demo.</p>
        </div>
      </Container>
    </footer>
  );
}
