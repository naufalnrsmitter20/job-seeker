import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllAvailablePosition = async (filter?: Prisma.AvailablePositionWhereInput) => {
  const data = await prisma.availablePosition.findMany({
    where: filter,
    include: {
      _count: true,
      Company: true,
      positionApplied: true,
    },
  });
  return data;
};

export const findAvailablePosition = async (filter: Prisma.AvailablePositionWhereInput) => {
  const data = await prisma.availablePosition.findFirst({
    where: filter,
    include: {
      _count: true,
      Company: true,
      positionApplied: true,
    },
  });
  return data;
};

export const createAvailablePosition = async (data: Prisma.AvailablePositionCreateInput) => {
  const AvailablePosition = await prisma.availablePosition.create({
    data,
    include: {
      _count: true,
      Company: true,
      positionApplied: true,
    },
  });
  return AvailablePosition;
};
export const updateAvailablePosition = async (id: string, data: Prisma.AvailablePositionUncheckedUpdateInput) => {
  const AvailablePosition = await prisma.availablePosition.update({
    where: { id },
    data,
    include: {
      _count: true,
      Company: true,
      positionApplied: true,
    },
  });
  return AvailablePosition;
};
export const deleteAvailablePosition = async (id: string) => {
  const del = await prisma.availablePosition.delete({
    where: { id },
  });
  return del;
};
