import prisma from "@/lib/prisma";
import { JobsPageClient } from "./jobs-page-client";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: "OPEN" | "CLOSED";
    salaryMin?: string;
    salaryMax?: string;
    location?: string;
    sort?: "newest" | "salary_high" | "salary_low" | "deadline";
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (params.q) {
    where.OR = [{ positionName: { contains: params.q, mode: "insensitive" } }, { Company: { name: { contains: params.q, mode: "insensitive" } } }, { Company: { address: { contains: params.q, mode: "insensitive" } } }];
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.salaryMin || params.salaryMax) {
    where.AND = [];
    if (params.salaryMin) {
      where.AND.push({ salaryStartRange: { gte: Number(params.salaryMin) } });
    }
    if (params.salaryMax) {
      where.AND.push({ salaryEndRange: { lte: Number(params.salaryMax) } });
    }
  }

  if (params.location) {
    where.Company = {
      address: { contains: params.location, mode: "insensitive" },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };

  switch (params.sort) {
    case "salary_high":
      orderBy = { salaryEndRange: "desc" };
      break;
    case "salary_low":
      orderBy = { salaryStartRange: "asc" };
      break;
    case "deadline":
      orderBy = { submissionEndDate: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const [jobs, totalJobs] = await Promise.all([
    prisma.availablePosition.findMany({
      where,
      include: {
        Company: true,
        _count: {
          select: { positionApplied: true },
        },
        positionApplied: true,
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.availablePosition.count({ where }),
    // prisma.company.findMany({
    //   select: { address: true },
    //   distinct: ["address"],
    // }),
  ]);

  return <JobsPageClient jobs={jobs} totalJobs={totalJobs} currentPage={page} pageSize={pageSize} searchParams={params} />;
}
