import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllAddress = async (filter?: Prisma.AddressWhereInput) => {
  const data = await prisma.address.findMany({
    where: filter,
    include: {
      Employee: true,
    },
  });
  return data;
};

export const findAddress = async (filter: Prisma.AddressWhereInput) => {
  const data = await prisma.address.findFirst({
    where: filter,
    include: {
      Employee: true,
    },
  });
  return data;
};

export const createAddress = async (data: Prisma.AddressUncheckedCreateInput) => {
  const Address = await prisma.address.create({
    data,
    include: {
      Employee: true,
    },
  });
  return Address;
};
export const updateAddress = async (id: string, data: Prisma.AddressUncheckedUpdateInput) => {
  const Address = await prisma.address.update({
    where: { id },
    data,
    include: {
      Employee: true,
    },
  });
  return Address;
};
export const deleteAddress = async (id: string) => {
  const del = await prisma.address.delete({
    where: { id },
  });
  return del;
};
