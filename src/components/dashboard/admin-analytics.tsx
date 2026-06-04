"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardData } from "@/lib/admin-dashboard";

type AdminAnalyticsProps = {
  charts: AdminDashboardData["charts"];
};

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--card)",
};

function ChartPlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-lg bg-muted" />;
}

export function AdminAnalytics({ charts }: AdminAnalyticsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="interactive-card xl:col-span-2">
        <CardHeader>
          <CardTitle>User growth</CardTitle>
          <CardDescription>New users and recruiters over the last six months</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.userGrowth}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="recruitersGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#usersGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="recruiters"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#recruitersGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder />
          )}
        </CardContent>
      </Card>

      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Monthly application volume</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.applications}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="applications" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder />
          )}
        </CardContent>
      </Card>

      <Card className="interactive-card xl:col-span-3">
        <CardHeader>
          <CardTitle>Jobs by category</CardTitle>
          <CardDescription>Open and moderated listings grouped by inferred category</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.jobsByCategory} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={92} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="jobs" fill="var(--chart-4)" radius={[0, 6, 6, 0]} />
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
