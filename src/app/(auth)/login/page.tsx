"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Google from "../../../../public/img/svg/JSX/google";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Memproses...");
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const response = await signIn("credentials", {
        callbackUrl: "/",
        redirect: false,
        email,
        password,
      });
      if (response?.error) {
        toast.error(response.error, { id: toastId });
        setIsLoading(false);
        return;
      }
      toast.success("Berhasil masuk!", { id: toastId });
      setIsLoading(false);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Gagal masuk, silakan coba lagi.", { id: toastId });
      setIsLoading(false);
    }
  };

  // const handleLoginHRD = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const toastId = toast.loading("Memproses...");
  //   try {
  //     const formData = new FormData(e.currentTarget as HTMLFormElement);
  //     const email = formData.get("email") as string;
  //     const password = formData.get("password") as string;
  //     const response = await signIn("credentials", {
  //       callbackUrl: "/hrd",
  //       redirect: false,
  //       email,
  //       password,
  //     });
  //     if (response?.error) {
  //       toast.error(response.error, { id: toastId });
  //       setIsLoading(false);
  //       return;
  //     }
  //     toast.success("Berhasil masuk!", { id: toastId });
  //     setIsLoading(false);
  //     router.push("/hrd");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error("Gagal masuk, silakan coba lagi.", { id: toastId });
  //     setIsLoading(false);
  //   }
  // };

  const handleLoginWithGoogle = async () => {
    const toastId = toast.loading("Masuk dengan Google...");
    setIsLoading(true);
    try {
      const response = await signIn("google", { callbackUrl: "/", redirect: false });
      if (response?.error) {
        toast.error("Gagal masuk dengan Google, silakan coba lagi", { id: toastId });
        setIsLoading(false);
        return;
      }
      toast.success("Berhasil masuk dengan Google", { id: toastId });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mendaftar, silakan coba lagi", { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-900">JobSeeker</span>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Selamat Datang Kembali</h1>
          <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-blue-900">Masuk</CardTitle>
            <CardDescription className="text-center">Pilih tipe akun Anda untuk masuk</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="jobseeker" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobseeker" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pencari Kerja
                </TabsTrigger>
                <TabsTrigger value="hrd" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  HRD Perusahaan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobseeker">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="email" id="email" type="email" placeholder="nama@email.com" className="pl-10 h-11" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="password" id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" className="pl-10 pr-10 h-11" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                      Lupa password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Masuk sebagai Pencari Kerja"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="hrd">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="email" id="company-email" type="email" placeholder="hrd@perusahaan.com" className="pl-10 h-11" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="password" id="company-password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" className="pl-10 pr-10 h-11" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                      Lupa password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Masuk sebagai HRD"}
                  </Button>
                </form>
              </TabsContent>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
              <TabsContent value="jobseeker">
                <div className="py-6">
                  <hr className="border-t border-gray-300" />
                  <Button onClick={handleLoginWithGoogle} type="button" className="w-full h-11 border-2 border-blue-600 bg-transparent hover:bg-blue-50 text-blue-600 flex justify-center items-center" disabled={isLoading}>
                    <Google />
                    {isLoading ? "Mendaftar..." : "Masuk Dengan Google"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
}
