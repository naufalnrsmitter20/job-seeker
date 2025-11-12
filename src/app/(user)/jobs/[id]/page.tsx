import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { JobDetailClient } from "./job-detail-client";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findUser } from "@/utils/query/user.query";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const parameter = await params;
  const job = await prisma.availablePosition.findUnique({
    where: { id: parameter.id },
    include: { Company: true },
  });

  if (!job) {
    return {
      title: "Job Not Found | JobSeeker Indonesia",
    };
  }

  return {
    title: `${job.positionName} at ${job.Company?.name} | JobSeeker Indonesia`,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const parameter = await params;

  const session = await nextGetServerSession();

  const findUserById = await findUser({ id: session?.user?.id });

  const job = await prisma.availablePosition.findUnique({
    where: { id: parameter.id },
    include: {
      Company: true,
      positionApplied: {
        include: {
          Employee: {
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { applyDate: "desc" },
        take: 5,
      },
      _count: {
        select: { positionApplied: true },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const similarJobs = await prisma.availablePosition.findMany({
    where: {
      companyId: job.companyId,
      id: { not: job.id },
      status: "OPEN",
    },
    include: {
      Company: true,
      _count: {
        select: { positionApplied: true },
      },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const jobStats = {
    totalApplications: job._count.positionApplied,
    recentApplications: job.positionApplied,
    daysRemaining: Math.max(0, Math.ceil((new Date(job.submissionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
  };

  const getPositionAppliedEmployee = await prisma.positionApplied.findFirst({
    where: { employeeId: findUserById?.Employee?.id, availablePositionId: job.id },
    include: {
      AvailablePosition: true,
      Employee: {
        include: {
          user: true,
        },
      },
    },
  });

  return <JobDetailClient positionApplied={getPositionAppliedEmployee!} userData={findUserById} job={job!} similarJobs={similarJobs} stats={jobStats} />;
}
