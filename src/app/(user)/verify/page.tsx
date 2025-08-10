import type { Metadata } from "next";
import VerifyClientPage from "./VerifyClientPage";

export const metadata: Metadata = {
  title: "Verifikasi Email | JobSeeker Indonesia",
  description: "Verifikasi email Anda untuk mengaktifkan akun di JobSeeker Indonesia.",
};

export default function VerifyPage() {
  return <VerifyClientPage />;
}
