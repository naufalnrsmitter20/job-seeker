import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllCompany = async (filter?: Prisma.CompanyWhereInput) => {
  const data = await prisma.company.findMany({
    where: filter,
    include: {
      availablePosition: true,
      User: true,
      _count: true,
    },
  });
  return data;
};

export const findCompany = async (filter: Prisma.CompanyWhereInput) => {
  const data = await prisma.company.findFirst({
    where: filter,
    include: {
      availablePosition: true,
      User: true,
      _count: true,
    },
  });
  return data;
};

export const createCompany = async (data: Prisma.CompanyUncheckedCreateInput) => {
  const Company = await prisma.company.create({
    data,
    include: {
      availablePosition: true,
      User: true,
      _count: true,
    },
  });
  return Company;
};
export const updateCompany = async (id: string, data: Prisma.CompanyUncheckedUpdateInput) => {
  const Company = await prisma.company.update({
    where: { id },
    data,
    include: {
      availablePosition: true,
      User: true,
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
