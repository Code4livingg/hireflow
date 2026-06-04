"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pipelineChartData, recruiterChartData } from "@/lib/dashboard-mock-data";

function ChartPlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-lg bg-muted" />;
}

export function RecruiterCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Applications trend</CardTitle>
          <CardDescription>Monthly applications vs hires</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...recruiterChartData]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="hires"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder />
          )}
        </CardContent>
      </Card>

      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Hiring pipeline</CardTitle>
          <CardDescription>Candidates by stage</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...pipelineChartData]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
