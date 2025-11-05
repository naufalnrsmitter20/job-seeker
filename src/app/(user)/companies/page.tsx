import prisma from "@/lib/prisma";
import { CompaniesPageClient } from "./companies-page-client";

export const dynamic = "force-dynamic";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    location?: string;
    sort?: "newest" | "most_jobs" | "alphabetical";
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
    where.OR = [{ name: { contains: params.q, mode: "insensitive" } }, { type: { contains: params.q, mode: "insensitive" } }, { address: { contains: params.q, mode: "insensitive" } }];
  }

  if (params.type) {
    where.type = { contains: params.type, mode: "insensitive" };
  }

  if (params.location) {
    where.address = { contains: params.location, mode: "insensitive" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" }; // default

  switch (params.sort) {
    case "most_jobs":
      orderBy = { availablePositions: { _count: "desc" } };
      break;
    case "alphabetical":
      orderBy = { name: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const [companies, totalCompanies, industryTypes] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        availablePositions: {
          where: { status: "OPEN" },
          include: {
            _count: {
              select: {
                positionApplied: true,
              },
            },
          },
        },
        _count: {
          select: { availablePositions: true },
        },
        employees: true,
        humanResource: true,
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.company.count({ where }),
    prisma.company.findMany({
      select: { type: true },
      where: { type: { not: null } },
      distinct: ["type"],
    }),
    prisma.company.findMany({
      select: { address: true },
      distinct: ["address"],
    }),
  ]);

  // Get unique types and locations for filters
  const types = industryTypes.map((c) => c.type).filter(Boolean) as string[];

  return <CompaniesPageClient companies={companies} totalCompanies={totalCompanies} types={types} currentPage={page} pageSize={pageSize} searchParams={params} />;
}
