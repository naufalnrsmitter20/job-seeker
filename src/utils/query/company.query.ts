import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllCompany = async (filter?: Prisma.CompanyWhereInput) => {
  const data = await prisma.company.findMany({
    where: filter,
    include: {
      availablePositions: true,
      employees: true,
      humanResource: true,
      _count: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return data;
};

export const findCompany = async (filter: Prisma.CompanyWhereInput) => {
  const data = await prisma.company.findFirst({
    where: filter,
    include: {
      availablePositions: {
        include: {
          _count: {
            select: { positionApplied: true },
          },
        },
      },
      employees: true,
      humanResource: true,
      _count: true,
    },
  });
  return data;
};

export const createCompany = async (data: Prisma.CompanyUncheckedCreateInput) => {
  const Company = await prisma.company.create({
    data,
    include: {
      availablePositions: true,
      employees: true,
      humanResource: true,
      _count: true,
    },
  });
  return Company;
};
export const updateCompany = async (filter: Prisma.CompanyWhereUniqueInput, data: Prisma.CompanyUncheckedUpdateInput) => {
  const Company = await prisma.company.update({
    where: filter,
    data,
    include: {
      availablePositions: true,
      employees: true,
      humanResource: true,
      _count: true,
    },
  });
  return Company;
};
export const deleteCompany = async (id: string) => {
  const del = await prisma.company.delete({
    where: { id },
  });
  return del;
};
