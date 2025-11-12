import Image from "next/image";
import prisma from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { Briefcase, CheckCircle2, Clock, FileText } from "lucide-react";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";
import { findCompany } from "@/utils/query/company.query";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await nextGetServerSession();
  const findHRD = await findHumanResource({
    id: session?.user?.id,
  });
  const [currentCompany, totalJobs, openJobs, closedJobs, totalApplications, acceptedApps, pendingApps, rejectedApps, recentApps] = await Promise.all([
    findCompany({ humanResourceId: findHRD?.id }),
    prisma.availablePosition.count({ where: { companyId: findHRD?.Company?.id } }),
    prisma.availablePosition.count({ where: { status: "OPEN", companyId: findHRD?.Company?.id } }),
    prisma.availablePosition.count({ where: { status: "CLOSED", companyId: findHRD?.Company?.id } }),
    prisma.positionApplied.count({ where: { AvailablePosition: { companyId: findHRD?.Company?.id } } }),
    prisma.positionApplied.count({ where: { applyingStatus: "ACCEPTED", AvailablePosition: { companyId: findHRD?.Company?.id } } }),
    prisma.positionApplied.count({ where: { applyingStatus: "PENDING", AvailablePosition: { companyId: findHRD?.Company?.id } } }),
    prisma.positionApplied.count({ where: { applyingStatus: "REJECTED", AvailablePosition: { companyId: findHRD?.Company?.id } } }),
    prisma.positionApplied.findMany({
      where: { AvailablePosition: { companyId: findHRD?.Company?.id } },
      orderBy: { applyDate: "desc" },
      take: 5,
      include: {
        Employee: { select: { name: true } },
        AvailablePosition: { select: { positionName: true, Company: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard title="Jobs" value={totalJobs} icon={<Briefcase className="h-4 w-4 text-blue-600" />} subtle={`Open: ${openJobs} • Closed: ${closedJobs}`} />
        <KpiCard title="Applications" value={totalApplications} icon={<FileText className="h-4 w-4 text-blue-600" />} subtle={`P:${pendingApps} A:${acceptedApps} R:${rejectedApps}`} />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-full max-w-full w-full">
          <CardHeader>
            <CardTitle className="text-blue-900">New Applications {currentCompany?.name}</CardTitle>
            <CardDescription>5 latest applications from candidates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
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
      </div>
    </div>
  );
}
