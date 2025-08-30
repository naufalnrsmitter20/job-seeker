import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findAllPortfolio = async (filter?: Prisma.PortfolioWhereInput) => {
  const data = await prisma.portfolio.findMany({
    where: filter,
    include: {
      Employee: true,
    },
  });
  return data;
};

export const findPortfolio = async (filter: Prisma.PortfolioWhereInput) => {
  const data = await prisma.portfolio.findFirst({
    where: filter,
    include: {
      Employee: true,
    },
  });
  return data;
};

export const createPortfolio = async (data: Prisma.PortfolioUncheckedCreateInput) => {
  const Portfolio = await prisma.portfolio.create({
    data,
    include: {
      Employee: true,
    },
  });
  return Portfolio;
};
export const updatePortfolio = async (id: string, data: Prisma.PortfolioUncheckedUpdateInput) => {
  const Portfolio = await prisma.portfolio.update({
    where: { id },
    data,
    include: {
      Employee: true,
    },
  });
  return Portfolio;
};
export const deletePortfolio = async (id: string) => {
  const del = await prisma.portfolio.delete({
    where: { id },
  });
  return del;
};
