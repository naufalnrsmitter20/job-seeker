// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Fungsi untuk redirect berdasarkan role
function getRedirectPathForRole(role: string): string {
  if (role === "USER" || role === "EMPLOYEE") return "/";
  if (role === "HRD") return "/hrd";
  if (role === "ADMIN") return "/admin";
  return "/"; // Fallback
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const user = token ? token : null;
  const isLoggedIn = !!user;
  const role = user?.role;

  // 1. Proteksi /login dan /register jika sudah login
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      const redirectPath = getRedirectPathForRole(role!);
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    // Jika belum login, lanjutkan ke halaman
    return NextResponse.next();
  }

  // 2. Proteksi /admin jika role bukan ADMIN
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      const redirectPath = getRedirectPathForRole(role!);
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    // Jika ADMIN, lanjutkan
    return NextResponse.next();
  }

  // 3. Proteksi /hrd jika role bukan HRD atau ADMIN
  if (pathname.startsWith("/hrd")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "HRD" && role !== "ADMIN") {
      const redirectPath = getRedirectPathForRole(role!);
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    // Jika HRD atau ADMIN, lanjutkan
    return NextResponse.next();
  }

  // 4. Proteksi halaman yang memerlukan login: /jobs/*, /profile, /companies/*
  if (pathname.startsWith("/jobs/") || pathname === "/profile" || pathname.startsWith("/companies/")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Jika login, lanjutkan
    return NextResponse.next();
  }

  // Untuk halaman lain, lanjutkan tanpa proteksi
  return NextResponse.next();
}

// Konfigurasi matcher untuk menjalankan middleware pada path tertentu
export const config = {
  matcher: ["/login", "/register", "/admin/:path*", "/hrd/:path*", "/jobs/:path*", "/profile", "/companies/:path*"],
};
