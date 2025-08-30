import type { Metadata } from "next";
import "@/app/globals.css";
import { DashboardShell } from "@/components/dashboard-sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "HRD Panel | Job Seeker App",
  description: "A platform for job seekers and companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <DashboardShell>{children}</DashboardShell>
    </NuqsAdapter>
  );
}
