import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AppProviders } from "@/components/providers/app-providers";
import { PageTransition } from "@/components/ui/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HireFlow | Recruiting platform",
    template: "%s | HireFlow",
  },
  description:
    "HireFlow — a DBMS mini-project job portal with authentication, dashboards, and PostgreSQL via Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground">
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
