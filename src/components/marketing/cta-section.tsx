import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section id="demo" className="pb-16 sm:pb-20">
      <Container>
        <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 id="pricing" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Move from scattered hiring to one operating system.
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Publish roles, review applicants, and keep candidates informed — built for DBMS
                coursework with real relational data.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="h-11">
                <Link href="/register">
                  Create account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11">
                <Link href="/jobs">Browse jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
