"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivityFeed } from "@/lib/dashboard-mock-data";

export function ActivityFeed() {
  const [items, setItems] = useState([...mockActivityFeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const rotated = [...prev];
        const last = rotated.pop();
        if (last) rotated.unshift({ ...last, id: `live-${Date.now()}`, time: "Just now" });
        return rotated;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="interactive-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4 text-emerald-500" />
          Live activity
        </CardTitle>
        <span className="activity-pulse text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Live
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
          >
            <p>
              <span className="font-medium">{item.actor}</span>{" "}
              <span className="text-muted-foreground">{item.action}</span>{" "}
              <span className="font-medium">{item.target}</span>
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
