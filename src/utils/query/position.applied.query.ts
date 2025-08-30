import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllPositionApplied = async (filter?: Prisma.PositionAppliedWhereInput) => {
  const data = await prisma.positionApplied.findMany({
    where: filter,
    include: {
      AvailablePosition: true,
      Employee: true,
    },
  });
  return data;
};

export const findPositionApplied = async (filter: Prisma.PositionAppliedWhereInput) => {
  const data = await prisma.positionApplied.findFirst({
    where: filter,
    include: {
      AvailablePosition: true,
      Employee: true,
    },
  });
  return data;
};

export const createPositionApplied = async (data: Prisma.PositionAppliedUncheckedCreateInput) => {
  const PositionApplied = await prisma.positionApplied.create({
    data,
    include: {
      AvailablePosition: true,
      Employee: true,
    },
  });
  return PositionApplied;
};
export const updatePositionApplied = async (id: string, data: Prisma.PositionAppliedUncheckedUpdateInput) => {
  const PositionApplied = await prisma.positionApplied.update({
    where: { id },
    data,
    include: {
      AvailablePosition: true,
      Employee: true,
    },
  });
  return PositionApplied;
};
export const deletePositionApplied = async (id: string) => {
  const del = await prisma.positionApplied.delete({
    where: { id },
  });
  return del;
};
