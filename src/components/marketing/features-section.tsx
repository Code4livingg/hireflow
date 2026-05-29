import { Container } from "@/components/layout/container";
import { FeatureIcon } from "@/components/marketing/feature-icon";
import { SectionHeader } from "@/components/marketing/section-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { platformFeatures, workflowCards } from "@/lib/landing-data";

export function FeaturesSection() {
  return (
    <section id="platform" className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Platform"
          title="Everything your hiring stack should feel like."
          description="Candidate experience, recruiter operations, admin governance, and team collaboration in one cohesive product."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature) => (
            <Card key={feature.title} className="interactive-card h-full">
              <CardHeader>
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FeatureIcon name={feature.icon} className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-2 leading-7">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          {workflowCards.map((card) => (
            <Card key={card.title} className="bg-primary text-primary-foreground">
              <CardHeader>
                <FeatureIcon name={card.icon} className="size-5 opacity-90" />
                <CardTitle className="mt-3 text-primary-foreground">{card.title}</CardTitle>
                <CardDescription className="mt-2 text-primary-foreground/80">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
