import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { companies, stats } from "@/lib/landing-data";

export function StatsSection() {
  return (
    <section id="outcomes" className="py-12 sm:py-16">
      <Container>
        <div className="rounded-2xl border border-border bg-primary p-4 text-primary-foreground">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-primary-foreground/20 bg-primary-foreground/10 p-5 text-primary-foreground">
                <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-2 font-medium">{stat.label}</p>
                <p className="mt-1 text-sm opacity-80">{stat.detail}</p>
              </Card>
            ))}
          </div>
          <div id="customers" className="mt-8 border-t border-primary-foreground/20 pt-6">
            <p className="text-center text-sm font-medium uppercase tracking-wider opacity-80">
              Trusted by modern SaaS teams
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {companies.map((company) => (
                <div
                  key={company}
                  className="rounded-lg border border-primary-foreground/15 px-3 py-2 text-center text-sm font-medium"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
