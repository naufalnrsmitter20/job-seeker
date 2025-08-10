import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  try {
    if (!token) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: "Token kadaluarsa atau tidak ditemukan" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: record.userId as string },
      data: { verified: true },
    });

    await prisma.emailVerificationToken.delete({ where: { id: record.id } });

    return NextResponse.json({ ok: true, message: "Email berhasil diverifikasi! Silakan login." });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ ok: false, error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
