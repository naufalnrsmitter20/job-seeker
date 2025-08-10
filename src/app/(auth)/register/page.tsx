"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Building2, Phone, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "@/utils/actions/user.actions";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const toastId = toast.loading("Mendaftar...");
    setIsLoading(true);
    if (!agreedToTerms) {
      toast.error("Anda harus menyetujui syarat dan ketentuan", { id: toastId });
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const firstname = formData.get("firstName") as string;
      const lastname = formData.get("lastName") as string;
      const name = `${firstname} ${lastname}`;
      formData.append("name", name);
      const regist = await registerUser(formData);
      if (regist.error) {
        toast.error(regist.message, { id: toastId });
        setIsLoading(false);
        return;
      }
      toast.success("Pendaftaran berhasil! Silakan masuk", { id: toastId });
      setIsLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mendaftar, silakan coba lagi", { id: toastId });
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-300 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-2 border-sky-300 rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-40 h-40 border-2 border-blue-300 rounded-full"></div>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm relative z-10">
          <CardContent className="pt-8 text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-full mx-auto animate-ping opacity-20"></div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Selamat! Pendaftaran Berhasil</h2>
              <p className="text-gray-600 leading-relaxed">Akun Anda telah berhasil dibuat. Selamat datang di komunitas Senara! Silakan cek email untuk verifikasi akun.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700">📧 Email verifikasi telah dikirim ke alamat email Anda. Silakan cek inbox atau folder spam.</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-medium shadow-lg">
                <Link href="/login">Masuk ke Akun</Link>
              </Button>

              <Button asChild variant="outline" className="w-full border-gray-200 hover:bg-gray-50 bg-transparent">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-900">JobSeeker</span>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Bergabung dengan Kami</h1>
          <p className="text-gray-600">Buat akun untuk memulai perjalanan karir Anda</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-blue-900">Daftar Akun</CardTitle>
            <CardDescription className="text-center">Pilih tipe akun yang sesuai dengan kebutuhan Anda</CardDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input name="firstName" id="firstName" type="text" placeholder="Nama depan" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input name="lastName" id="lastName" type="text" placeholder="Nama belakang" className="h-11" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="email" id="email" type="email" placeholder="nama@email.com" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="phone" id="phone" type="tel" placeholder="08xxxxxxxxxx" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" required>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Pilih gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input name="password" id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" className="pl-10 pr-10 h-11" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input name="confirmPassword" id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Ulangi password" className="pl-10 pr-10 h-11" required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                    <Label htmlFor="terms" className="text-sm">
                      Saya menyetujui{" "}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                        Syarat & Ketentuan
                      </Link>{" "}
                      dan{" "}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                        Kebijakan Privasi
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading || !agreedToTerms}>
                    {isLoading ? "Mendaftar..." : "Daftar sebagai Pencari Kerja"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="hrd">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nama Perusahaan</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input id="companyName" type="text" placeholder="PT. Nama Perusahaan" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hrdName">Nama Lengkap HRD</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="hrdName" type="text" placeholder="Nama lengkap" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Posisi/Jabatan</Label>
                      <Input id="position" type="text" placeholder="HR Manager" className="h-11" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email Perusahaan</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input id="companyEmail" type="email" placeholder="hrd@perusahaan.com" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Telepon Perusahaan</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="companyPhone" type="tel" placeholder="021-xxxxxxxx" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industri</Label>
                      <Select required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih industri" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teknologi">Teknologi</SelectItem>
                          <SelectItem value="keuangan">Keuangan</SelectItem>
                          <SelectItem value="manufaktur">Manufaktur</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="kesehatan">Kesehatan</SelectItem>
                          <SelectItem value="pendidikan">Pendidikan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <Input id="companyAddress" type="text" placeholder="Alamat lengkap perusahaan" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hrdPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="hrdPassword" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" className="pl-10 pr-10 h-11" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrdConfirmPassword">Konfirmasi Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="hrdConfirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Ulangi password" className="pl-10 pr-10 h-11" required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="hrdTerms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                    <Label htmlFor="hrdTerms" className="text-sm">
                      Saya menyetujui{" "}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                        Syarat & Ketentuan
                      </Link>{" "}
                      dan{" "}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                        Kebijakan Privasi
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading || !agreedToTerms}>
                    {isLoading ? "Mendaftar..." : "Daftar sebagai HRD"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Masuk sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Platform resmi Pemerintah Indonesia untuk menghubungkan pencari kerja dengan perusahaan terpercaya.</p>
        </div>
      </div>
    </div>
  );
}
