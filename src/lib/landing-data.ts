export const navItems = [
  { href: "/jobs", label: "Jobs" },
  { href: "/#platform", label: "Platform" },
  { href: "/login", label: "Login" },
] as const;

export const platformFeatures = [
  {
    title: "AI candidate matching",
    description:
      "Rank applicants by skills and role fit so recruiters move from noise to qualified shortlists faster.",
    icon: "sparkles",
  },
  {
    title: "Unified job operations",
    description:
      "Publish roles, monitor pipeline health, and keep hiring teams aligned from one dashboard.",
    icon: "briefcase",
  },
  {
    title: "Verified recruiter controls",
    description: "Approval workflows, trust signals, and moderation tools for platform governance.",
    icon: "shield",
  },
  {
    title: "Application timelines",
    description:
      "Shared view of saves, submissions, screening, interviews, and hiring decisions.",
    icon: "calendar",
  },
  {
    title: "Notifications",
    description: "Alerts for applications, interviews, and recruiter updates across the platform.",
    icon: "bell",
  },
  {
    title: "Recruiting analytics",
    description: "Conversion, response, and hiring velocity metrics for data-driven decisions.",
    icon: "chart",
  },
] as const;

export const stats = [
  { value: "3.8x", label: "faster shortlists", detail: "Ranked candidate review" },
  { value: "72%", label: "less manual tracking", detail: "Centralized workflows" },
  { value: "120+", label: "active jobs", detail: "Live marketplace listings" },
  { value: "99.9%", label: "uptime target", detail: "Production-ready stack" },
] as const;

export const companies = ["Vercel", "Linear", "Ramp", "Stripe", "Notion", "Mercury"] as const;

export const testimonials = [
  {
    quote: "HireFlow is the recruiting command center our talent team needed.",
    name: "Aarav Mehta",
    role: "Head of Talent",
    company: "Northstar Labs",
  },
  {
    quote: "Clean workflows and a UI that gives candidates real confidence.",
    name: "Maya Iyer",
    role: "People Ops Lead",
    company: "Cobalt Systems",
  },
  {
    quote: "One place to understand hiring activity without spreadsheet drift.",
    name: "Dev Rao",
    role: "Founder",
    company: "SignalWorks",
  },
] as const;

export const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Jobs", href: "/jobs" },
      { label: "Platform", href: "/#platform" },
      { label: "Dashboard", href: "/dashboard/student" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Profile", href: "/profile" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#platform" },
      { label: "Contact", href: "/#demo" },
    ],
  },
] as const;

export const workflowCards = [
  {
    title: "For job seekers",
    description: "Profiles, saved roles, applications, and interview tracking.",
    icon: "users",
  },
  {
    title: "For recruiters",
    description: "Job posting, applicant management, shortlists, and analytics.",
    icon: "building",
  },
  {
    title: "For admins",
    description: "User monitoring, recruiter approvals, and platform health.",
    icon: "badge",
  },
  {
    title: "For teams",
    description: "Notifications and hiring context shared across stakeholders.",
    icon: "message",
  },
] as const;
