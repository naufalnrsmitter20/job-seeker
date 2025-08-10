import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllUser = async (filter?: Prisma.UserWhereInput) => {
  const data = await prisma.user.findMany({
    where: filter,
    include: {
      company: true,
      Society: true,
    },
  });
  return data;
};

export const findUser = async (filter: Prisma.UserWhereInput) => {
  const data = await prisma.user.findFirst({
    where: filter,
    include: {
      company: true,
      Society: true,
    },
  });
  return data;
};

export const createUser = async (data: Prisma.UserUncheckedCreateInput) => {
  const user = await prisma.user.create({
    data,
    include: {
      company: true,
      Society: true,
    },
  });
  return user;
};
export const updateUser = async (filter: Prisma.UserWhereUniqueInput, data: Prisma.UserUncheckedUpdateInput) => {
  const user = await prisma.user.update({
    where: filter,
    data,
    include: {
      company: true,
      Society: true,
    },
  });
  return user;
};
export const deleteUser = async (id: string) => {
  const del = await prisma.user.delete({
    where: { id },
  });
  return del;
};
