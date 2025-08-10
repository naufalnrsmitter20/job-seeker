"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function VerifyingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="flex items-center gap-2 text-blue-700">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-medium">Memverifikasi token...</span>
      </div>
      <p className="text-sm text-gray-600 text-center">Mohon tunggu beberapa saat. Kami sedang memproses verifikasi email Anda.</p>
    </div>
  );
}

function SuccessView() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="size-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-blue-900">Email berhasil diverifikasi</h2>
        <p className="text-gray-600">Akun Anda telah aktif. Silakan masuk untuk melanjutkan.</p>
      </div>
      <div className="flex justify-center">
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700">Masuk Sekarang</Button>
        </Link>
      </div>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <XCircle className="h-5 w-5" />
        <AlertTitle>Verifikasi gagal</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-3">
        <Link href="/">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700">Coba Masuk</Button>
        </Link>
      </div>
    </div>
  );
}

function VerifyClient({ token }: { token: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setStatus("loading");
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Token tidak valid atau sudah kedaluwarsa.");
        }
        if (!cancelled) {
          setStatus("success");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Terjadi kesalahan saat verifikasi.");
          setStatus("error");
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "loading" || status === "idle") return <VerifyingState />;
  if (status === "success") return <SuccessView />;
  return <ErrorView message={error ?? "Verifikasi gagal."} />;
}

export default function VerifyClientPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-900">Verifikasi Email</CardTitle>
              <CardDescription>{token ? "Sedang memproses verifikasi email Anda..." : "Token verifikasi tidak ditemukan."}</CardDescription>
            </CardHeader>
            <CardContent>
              {!token ? (
                <div className="space-y-6">
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <XCircle className="h-5 w-5" />
                    <AlertTitle>Token tidak ditemukan</AlertTitle>
                    <AlertDescription>Link verifikasi tidak valid. Pastikan Anda membuka link yang dikirim ke email Anda.</AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Link href="/">
                      <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                        Kembali ke Beranda
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="bg-blue-600 hover:bg-blue-700">Masuk</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Suspense fallback={<VerifyingState />}>
                  <VerifyClient token={token} />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
