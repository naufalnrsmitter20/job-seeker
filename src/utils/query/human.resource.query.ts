import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllHumanResource = async (filter?: Prisma.HumanResourceWhereInput) => {
  const data = await prisma.humanResource.findMany({
    where: filter,
    include: {
      user: true,
      Company: true,
    },
  });
  return data;
};

export const findHumanResource = async (filter: Prisma.HumanResourceWhereInput) => {
  const data = await prisma.humanResource.findFirst({
    where: filter,
    include: {
      user: true,
      Company: true,
    },
  });
  return data;
};

export const createHumanResource = async (data: Prisma.HumanResourceUncheckedCreateInput) => {
  const HumanResource = await prisma.humanResource.create({
    data,
    include: {
      user: true,
      Company: true,
    },
  });
  return HumanResource;
};
export const updateHumanResource = async (filter: Prisma.HumanResourceWhereUniqueInput, data: Prisma.HumanResourceUncheckedUpdateInput) => {
  const HumanResource = await prisma.humanResource.update({
    where: filter,
    data,
    include: {
      user: true,
      Company: true,
    },
  });
  return HumanResource;
};
export const deleteHumanResource = async (id: string) => {
  const del = await prisma.humanResource.delete({
    where: { id },
  });
  return del;
};
