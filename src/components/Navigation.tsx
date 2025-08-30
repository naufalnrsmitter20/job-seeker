"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User, Building2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">JobSeeker</span>
              <span className="hidden sm:inline text-sm text-blue-600 font-medium">Indonesia</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900">JobSeeker</span>
            <span className="hidden sm:inline text-sm text-blue-600 font-medium">Indonesia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Beranda
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Lowongan Kerja
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Perusahaan
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Tentang Kami
            </Link>
            {session?.user?.role === "HRD" && (
              <Link href="/hrd" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                HRD Panel
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-3 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">{session.user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start px-3">
                      <span className="text-sm font-medium text-gray-900">{session.user?.name}</span>
                      <span className="text-xs text-gray-500">{session?.user?.role.toLowerCase() || ""}</span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2">
                {/* Profile Header */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg mb-2">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-200">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Profile" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{session.user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {session?.user?.role.toLowerCase() || ""}
                      </Badge>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Menu Items */}
                {["USER", "EMPLOYEE"].includes(session.user?.role as string) && (
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50">
                    <User className="h-4 w-4 mr-3 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">Profil Saya</span>
                      <span className="text-xs text-gray-500">Kelola informasi pribadi</span>
                    </div>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                      redirect: true,
                    })
                  }
                  className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600"
                >
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <User className="h-4 w-4 mr-2" />
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Building2 className="h-4 w-4 mr-2" />
                  Daftar
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Beranda
                </Link>
                <Link href="/jobs" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Lowongan Kerja
                </Link>
                <Link href="/companies" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Perusahaan
                </Link>
                <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Tentang Kami
                </Link>
                {session?.user?.role === "HRD" && (
                  <Link href="/hrd" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    HRD Panel
                  </Link>
                )}
                {session?.user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Admin Panel
                  </Link>
                )}
                <div className="border-t pt-4 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <Building2 className="h-4 w-4 mr-2" />
                      Daftar
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
