import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/database";

type ProfileCompletionProps = {
  user: User;
};

function calculateCompletion(user: User): number {
  const fields = [
    Boolean(user.full_name?.trim()),
    Boolean(user.email?.trim()),
    Boolean(user.role),
    Boolean(user.avatar_url),
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

const completionTips: Record<number, string> = {
  25: "Add your full name",
  50: "Upload a profile photo",
  75: "Complete your dashboard profile",
  100: "Profile complete!",
};

export function ProfileCompletion({ user }: ProfileCompletionProps) {
  const percent = calculateCompletion(user);
  const tip =
    percent === 100
      ? completionTips[100]
      : completionTips[percent] ?? "Keep building your profile";

  return (
    <Card className="interactive-card card-glow">
      <CardHeader>
        <CardTitle className="text-base">Profile completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={percent} label="Completion" />
        <p className="text-sm text-muted-foreground">{tip}</p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li>{user.full_name ? "✓" : "○"} Full name</li>
          <li>{user.email ? "✓" : "○"} Email verified</li>
          <li>{user.role ? "✓" : "○"} Account role</li>
          <li>{user.avatar_url ? "✓" : "○"} Profile photo</li>
        </ul>
      </CardContent>
    </Card>
  );
}
