import { AlertTriangle, BookOpenCheck, CheckCircle2, Target } from "lucide-react";
import { MatchScore } from "@/components/match/match-score";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ResumeMatch } from "@/lib/resume-match";

type SkillGapAnalysisProps = {
  match: ResumeMatch;
};

function SkillList({ emptyLabel, skills, variant = "muted" }: { emptyLabel: string; skills: string[]; variant?: "muted" | "success" | "default" }) {
  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill} variant={variant}>
          {skill}
        </Badge>
      ))}
    </div>
  );
}

export function SkillGapAnalysis({ match }: SkillGapAnalysisProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>AI resume match</CardTitle>
        </CardHeader>
        <CardContent>
          <MatchScore score={match.score} size="lg" />
          <div className="mt-6 space-y-4">
            {match.strengths.map((strength) => (
              <Progress key={strength.label} value={strength.value} label={strength.label} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Target className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Required skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillList skills={match.requiredSkills} emptyLabel="No required skills detected." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <CheckCircle2 className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">User skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillList skills={match.userSkills} emptyLabel="No profile skills found." variant="success" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Missing skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillList skills={match.missingSkills} emptyLabel="No major skill gaps found." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <BookOpenCheck className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Recommended skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillList skills={match.recommendedSkills} emptyLabel="Keep deepening your current strengths." variant="default" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
