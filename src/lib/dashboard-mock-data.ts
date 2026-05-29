import type { ApplicationStatus } from "@/types/database";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New application",
    message: "Priya Sharma applied for Senior Full Stack Engineer.",
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "n2",
    title: "Interview scheduled",
    message: "Noah Chen — Product Designer, tomorrow 2:00 PM.",
    read: false,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "n3",
    title: "Profile viewed",
    message: "Your company page received 12 views today.",
    read: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "n4",
    title: "Job posted",
    message: "Data Analyst Intern is now live on the board.",
    read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
};

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "a1",
    actor: "Priya Sharma",
    action: "applied to",
    target: "Senior Full Stack Engineer",
    time: "2m ago",
  },
  {
    id: "a2",
    actor: "Recruiter",
    action: "shortlisted",
    target: "Noah Chen",
    time: "18m ago",
  },
  {
    id: "a3",
    actor: "Leah Martin",
    action: "saved",
    target: "Product Designer",
    time: "1h ago",
  },
  {
    id: "a4",
    actor: "System",
    action: "published",
    target: "Data Analyst Intern",
    time: "3h ago",
  },
  {
    id: "a5",
    actor: "Dev Rao",
    action: "withdrew from",
    target: "Frontend Engineer",
    time: "5h ago",
  },
];

export const mockApplicationsTimeline = [
  {
    id: "t1",
    candidate: "Priya Sharma",
    job: "Senior Full Stack Engineer",
    status: "reviewing" as ApplicationStatus,
    date: "Today, 10:24 AM",
  },
  {
    id: "t2",
    candidate: "Noah Chen",
    job: "Product Designer",
    status: "interview" as ApplicationStatus,
    date: "Yesterday, 4:10 PM",
  },
  {
    id: "t3",
    candidate: "Leah Martin",
    job: "Data Analyst Intern",
    status: "pending" as ApplicationStatus,
    date: "Mon, 9:00 AM",
  },
  {
    id: "t4",
    candidate: "Aarav Mehta",
    job: "Senior Full Stack Engineer",
    status: "offered" as ApplicationStatus,
    date: "Sun, 2:30 PM",
  },
] as const;

export const recruiterChartData = [
  { month: "Jan", applications: 42, hires: 3 },
  { month: "Feb", applications: 58, hires: 5 },
  { month: "Mar", applications: 71, hires: 4 },
  { month: "Apr", applications: 64, hires: 6 },
  { month: "May", applications: 89, hires: 7 },
  { month: "Jun", applications: 95, hires: 8 },
] as const;

export const pipelineChartData = [
  { stage: "Applied", count: 95 },
  { stage: "Review", count: 42 },
  { stage: "Interview", count: 18 },
  { stage: "Offer", count: 6 },
] as const;
