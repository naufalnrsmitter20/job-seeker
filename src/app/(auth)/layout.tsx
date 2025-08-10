import type { Metadata } from "next";
import "@/app/globals.css";
import { Navigation } from "../_components/Navigation";

export const metadata: Metadata = {
  title: "Register or Login | Job Seeker App",
  description: "A platform for job seekers and companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
