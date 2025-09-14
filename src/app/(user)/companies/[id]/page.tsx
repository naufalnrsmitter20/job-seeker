import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CompanyProfileClient } from "./company-profile-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    select: { name: true, description: true },
  });

  if (!company) {
    return {
      title: "Company Not Found | JobSeeker Indonesia",
    };
  }

  return {
    title: `${company.name} - Company Profile | JobSeeker Indonesia`,
    description: company.description.slice(0, 160),
  };
}

export default async function CompanyProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tab?: "overview" | "jobs" | "about";
    jobStatus?: "OPEN" | "CLOSED";
    sort?: "newest" | "salary_high" | "deadline";
    page?: string;
  }>;
}) {
  const { id } = await params;
  const { tab, jobStatus, sort, page } = await searchParams;
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      availablePositions: {
        where: jobStatus ? { status: jobStatus } : undefined,
        include: {
          _count: {
            select: { positionApplied: true },
          },
        },
        orderBy: sort === "salary_high" ? { salaryEndRange: "desc" } : sort === "deadline" ? { submissionEndDate: "asc" } : { createdAt: "desc" },
      },
      _count: {
        select: {
          availablePositions: true,
        },
      },
      employees: true,
      humanResource: true,
    },
  });

  if (!company) {
    notFound();
  }

  // Get additional statistics
  const [openJobs, closedJobs, totalApplications, recentJobs] = await Promise.all([
    prisma.availablePosition.count({
      where: { companyId: company.id, status: "OPEN" },
    }),
    prisma.availablePosition.count({
      where: { companyId: company.id, status: "CLOSED" },
    }),
    prisma.positionApplied.count({
      where: { AvailablePosition: { companyId: company.id } },
    }),
    prisma.availablePosition.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        positionName: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const companyStats = {
    totalJobs: company._count.availablePositions,
    openJobs,
    closedJobs,
    totalApplications,
    recentJobs,
  };

  return <CompanyProfileClient company={company} stats={companyStats} searchParams={{ tab, jobStatus, sort, page }} />;
}
