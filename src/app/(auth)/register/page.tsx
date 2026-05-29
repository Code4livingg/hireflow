import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Container } from "@/components/layout/container";

export default function RegisterPage() {
  return (
    <Container className="py-16">
      <Suspense fallback={<p className="text-center text-muted-foreground">Loading...</p>}>
        <AuthForm mode="register" />
      </Suspense>
    </Container>
  );
}
