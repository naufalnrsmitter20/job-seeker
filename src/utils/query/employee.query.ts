import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllEmployee = async (filter?: Prisma.EmployeeWhereInput) => {
  const data = await prisma.employee.findMany({
    where: filter,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      address: true,
      _count: true,
    },
  });
  return data;
};

export const findEmployee = async (filter: Prisma.EmployeeWhereInput) => {
  const data = await prisma.employee.findFirst({
    where: filter,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      address: true,
      _count: {
        select: {
          address: true,
        },
      },
    },
  });
  return data;
};

export const createEmployee = async (data: Prisma.EmployeeUncheckedCreateInput) => {
  const Employee = await prisma.employee.create({
    data,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      address: true,
      _count: true,
    },
  });
  return Employee;
};
export const updateEmployee = async (filter: Prisma.EmployeeWhereUniqueInput, data: Prisma.EmployeeUncheckedUpdateInput) => {
  const Employee = await prisma.employee.update({
    where: filter,
    data,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      address: true,
      _count: true,
    },
  });
  return Employee;
};
export const deleteEmployee = async (id: string) => {
  const del = await prisma.employee.delete({
    where: { id },
  });
  return del;
};
