import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllSociety = async (filter?: Prisma.SocietyWhereInput) => {
  const data = await prisma.society.findMany({
    where: filter,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      _count: true,
    },
  });
  return data;
};

export const findSociety = async (filter: Prisma.SocietyWhereInput) => {
  const data = await prisma.society.findFirst({
    where: filter,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      _count: true,
    },
  });
  return data;
};

export const createSociety = async (data: Prisma.SocietyUncheckedCreateInput) => {
  const Society = await prisma.society.create({
    data,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      address: true,
      _count: true,
    },
  });
  return Society;
};
export const updateSociety = async (filter: Prisma.SocietyWhereUniqueInput, data: Prisma.SocietyUncheckedUpdateInput) => {
  const Society = await prisma.society.update({
    where: filter,
    data,
    include: {
      portfolios: true,
      positionApplied: true,
      user: true,
      _count: true,
    },
  });
  return Society;
};
export const deleteSociety = async (id: string) => {
  const del = await prisma.society.delete({
    where: { id },
  });
  return del;
};
