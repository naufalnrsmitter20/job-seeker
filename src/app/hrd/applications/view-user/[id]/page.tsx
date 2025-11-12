import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EmployeeProfileClient } from "./employee-profile-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true },
  });

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} - HRD Dashboard`,
    description: `Employee profile for ${user.name}`,
  };
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch user and related employee data
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      Employee: {
        include: {
          portfolios: true,
          address: true,
          positionApplied: {
            include: {
              AvailablePosition: {
                include: {
                  Company: true,
                },
              },
            },
            orderBy: {
              applyDate: "desc",
            },
            take: 10,
          },
          Company: true,
          user: true,
          _count: true,
        },
      },
      HumanResource: true,
    },
  });

  if (!user) {
    notFound();
  }

  // If user has no employee record but is HRD, create empty state
  const employee = user.Employee;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Employee Profile</h1>
          <p className="text-gray-600 mt-2">Comprehensive view of employee information and application history</p>
        </div>
      </div>

      <EmployeeProfileClient user={user} employee={employee!} />
    </div>
  );
}
