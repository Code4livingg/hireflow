import Link from "next/link";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const trustItems = [
  "AI-ranked shortlists",
  "Unified hiring pipeline",
  "Enterprise-grade controls",
] as const;

export function HeroSection() {
  return (
    <section className="relative border-b border-border/60 bg-muted/30 pt-12 pb-16 sm:pt-16 sm:pb-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge>Now hiring at startup speed</Badge>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              The recruiting OS for modern talent teams.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              HireFlow unifies job seekers, recruiters, and admins in one workspace for roles,
              applications, and hiring analytics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11">
                <Link href="/register">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11">
                <Link href="/jobs">
                  <PlayCircle className="size-4" />
                  Browse jobs
                </Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Card className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Live hiring workspace</p>
            <h2 className="mt-1 text-xl font-semibold">Senior Product Designer</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Applicants", "248"],
                ["Shortlisted", "42"],
                ["Time saved", "18h"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["Priya Sharma", "97% fit"],
                ["Noah Chen", "91% fit"],
                ["Leah Martin", "88% fit"],
              ].map(([name, score]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{score}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
