import Image from "next/image";
import prisma from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { Briefcase, Building2, CheckCircle2, Clock, FilePieChart, FileText, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Server Components + Prisma untuk metrik agregasi
  const [totalUsers, totalVerified, totalCompanies, totalSocieties, totalPortfolios, totalJobs, openJobs, closedJobs, totalApplications, acceptedApps, pendingApps, rejectedApps, recentApps] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { verified: true } }),
    prisma.company.count(),
    prisma.employee.count(),
    prisma.portfolio.count(),
    prisma.availablePosition.count(),
    prisma.availablePosition.count({ where: { status: "OPEN" } }),
    prisma.availablePosition.count({ where: { status: "CLOSED" } }),
    prisma.positionApplied.count(),
    prisma.positionApplied.count({ where: { applyingStatus: "ACCEPTED" } }),
    prisma.positionApplied.count({ where: { applyingStatus: "PENDING" } }),
    prisma.positionApplied.count({ where: { applyingStatus: "REJECTED" } }),
    prisma.positionApplied.findMany({
      orderBy: { applyDate: "desc" },
      take: 10,
      include: {
        Employee: { select: { name: true } },
        AvailablePosition: { select: { positionName: true, Company: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value={totalUsers} icon={<User className="h-4 w-4 text-blue-600" />} subtle={`Verified: ${totalVerified}`} />
        <KpiCard title="Companies" value={totalCompanies} icon={<Building2 className="h-4 w-4 text-blue-600" />} subtle={`Societies: ${totalSocieties}`} />
        <KpiCard title="Jobs" value={totalJobs} icon={<Briefcase className="h-4 w-4 text-blue-600" />} subtle={`Open: ${openJobs} • Closed: ${closedJobs}`} />
        <KpiCard title="Applications" value={totalApplications} icon={<FileText className="h-4 w-4 text-blue-600" />} subtle={`P:${pendingApps} A:${acceptedApps} R:${rejectedApps}`} />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-blue-900">Aplikasi Terbaru</CardTitle>
            <CardDescription>10 aplikasi terakhir dari kandidat.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kandidat</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(app.applyDate)}</TableCell>
                    <TableCell>{app.Employee?.name ?? "-"}</TableCell>
                    <TableCell className="font-medium">{app.AvailablePosition?.positionName ?? "-"}</TableCell>
                    <TableCell>{app.AvailablePosition?.Company?.name ?? "-"}</TableCell>
                    <TableCell>
                      {app.applyingStatus === "PENDING" && <Badge className="bg-blue-100 text-blue-700">Pending</Badge>}
                      {app.applyingStatus === "ACCEPTED" && <Badge className="bg-green-100 text-green-700">Accepted</Badge>}
                      {app.applyingStatus === "REJECTED" && <Badge className="bg-red-100 text-red-700">Rejected</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
                {recentApps.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Belum ada aplikasi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-blue-900">Database & Tools</CardTitle>
            <CardDescription>Gunakan Prisma Client untuk query yang aman.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg overflow-hidden border">
              <Image
                src="https://res.cloudinary.com/dd7jrmane/image/upload/v1754887075/Screenshot_2025-08-11_113642_szd3yh.png"
                alt="Tangkapan layar dokumentasi Prisma"
                width={960}
                height={540}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FilePieChart className="h-4 w-4 text-blue-600" />
                Portfolios: <span className="font-semibold text-blue-900">{totalPortfolios}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-blue-600" />
                Terakhir update: <span className="font-semibold text-blue-900">{new Date().toLocaleTimeString("id-ID")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Semua metrik dihitung di Server Components untuk performa optimal
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
