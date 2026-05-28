import { Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/marketing/section-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { testimonials } from "@/lib/landing-data";

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Customers"
          title="Loved by talent leaders who expect premium software."
          description="Designed to feel credible in the boardroom and fast on mobile."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="h-full">
              <CardHeader>
                <Quote className="size-5 text-rose-500" aria-hidden="true" />
                <blockquote className="mt-4 text-base leading-7">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer className="mt-6">
                  <CardTitle className="text-base">{testimonial.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {testimonial.role}, {testimonial.company}
                  </CardDescription>
                </footer>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
