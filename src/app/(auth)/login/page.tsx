import { AuthForm } from "@/components/auth/auth-form";
import { Container } from "@/components/layout/container";

export default function LoginPage() {
  return (
    <Container className="py-16">
      <AuthForm mode="login" />
    </Container>
  );
}
