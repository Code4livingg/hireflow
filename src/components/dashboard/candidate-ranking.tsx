import { Award, GraduationCap, UserCheck } from "lucide-react";
import { MatchScore } from "@/components/match/match-score";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RankedCandidate } from "@/lib/resume-match";

type CandidateRankingProps = {
  candidates: RankedCandidate[];
};

export function CandidateRanking({ candidates }: CandidateRankingProps) {
  return (
    <Card className="interactive-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="size-4 text-muted-foreground" aria-hidden="true" />
          <CardTitle>Candidate ranking</CardTitle>
        </div>
        <CardDescription>Ranked by skill overlap, experience, education, and resume completeness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidates.map((candidate, index) => (
          <div key={candidate.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="font-semibold">{candidate.name}</p>
                  <ApplicationStatusBadge status={candidate.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{candidate.email}</p>
                <p className="mt-2 text-sm">{candidate.jobTitle}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {candidate.matchingSkills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="success">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.missingSkills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="muted">
                      Missing: {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <MatchScore score={candidate.score} size="sm" />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Progress value={candidate.score} label="Skill overlap" />
              <Progress value={candidate.educationMatch} label="Education match" />
              <Progress value={candidate.resumeCompleteness} label="Resume completeness" />
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <UserCheck className="size-3" aria-hidden="true" />
                {candidate.experienceLevel} experience
              </span>
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="size-3" aria-hidden="true" />
                Education weighted in score
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
