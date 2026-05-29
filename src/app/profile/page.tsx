import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ProfileCompletion } from "@/components/profile/profile-completion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser, getCurrentUser, getDashboardPath } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";

export default async function ProfilePage() {
  const authUser = await getAuthUser();
  const user = await getCurrentUser();

  if (!authUser && isSupabaseConfigured()) {
    redirect("/login");
  }

  const profilePending = Boolean(authUser && !user);

  // Derive the best-guess dashboard path even when the DB profile is missing,
  // using the role stored in auth metadata at sign-up time.
  const pendingRole =
    (authUser?.user_metadata?.role as UserRole | undefined) ?? "job_seeker";
  const pendingDashboardPath = getDashboardPath(pendingRole);

  return (
    <Container className="py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="interactive-card max-w-2xl">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profilePending ? (
              <>
                <p className="text-muted-foreground">
                  Your account is signed in but your profile could not be loaded.
                  The database schema may not be applied yet — check the README for
                  setup instructions, then refresh this page.
                </p>
                <Button asChild>
                  <Link href={pendingDashboardPath}>Go to dashboard</Link>
                </Button>
                <SignOutButton />
              </>
            ) : user ? (
              <>
                <p>
                  <span className="font-medium">Name:</span> {user.full_name || "—"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span> {user.role.replace("_", " ")}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild>
                    <Link href={getDashboardPath(user.role)}>Open dashboard</Link>
                  </Button>
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Demo mode active. Sign in after configuring Supabase credentials.
                </p>
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {user ? <ProfileCompletion user={user} /> : null}
      </div>
    </Container>
  );
}
