"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signUpAction, type AuthActionState } from "@/lib/auth-actions";
import { isSupabaseConfigured } from "@/lib/env";
import type { UserRole } from "@/types/database";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
  defaultRole?: UserRole;
};

const initialState: AuthActionState = {};

export function AuthForm({ mode, defaultRole = "job_seeker" }: AuthFormProps) {
  const searchParams = useSearchParams();
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const handledQueryRef = useRef<string | null>(null);
  const demoMode = !isSupabaseConfigured();

  useEffect(() => {
    const error = searchParams.get("error");
    const registered = searchParams.get("registered");
    const queryKey = `${error ?? ""}|${registered ?? ""}`;

    if (queryKey === "|" || handledQueryRef.current === queryKey) {
      return;
    }

    handledQueryRef.current = queryKey;

    if (error) {
      toast.error(decodeURIComponent(error));
    }
    if (registered === "1") {
      toast.success("Account created. You can sign in now.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.error) {
      if (!state.error.toLowerCase().includes("supabase")) {
        toast.error(state.error);
      }
    }
    if (state.success) toast.success(state.success);
  }, [state.error, state.success]);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to manage applications and dashboards."
            : "Join HireFlow as a job seeker or recruiter."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {mode === "register" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Account type</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue={defaultRole}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="job_seeker">Job seeker</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name (recruiters only)</Label>
                <Input id="companyName" name="companyName" placeholder="Optional for job seekers" />
              </div>
            </>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        {demoMode && (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">🎭 Demo Mode — no account needed</p>
            <p>Use any of these to explore:</p>
            <div className="mt-1.5 space-y-0.5 font-mono">
              <p>student@demo.com · any password</p>
              <p>recruiter@demo.com · any password</p>
              <p>admin@demo.com · any password</p>
            </div>
            <p className="mt-1.5">Or just type any email + 6-char password.</p>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
