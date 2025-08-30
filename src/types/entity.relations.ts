import { Prisma } from "@prisma/client";

export type UserGetPayload = Prisma.UserGetPayload<{
  include: {
    Employee: true;
    HumanResource: true;
  };
}>;

export type EmployeeGetPayload = Prisma.EmployeeGetPayload<{
  include: {
    user: true;
    Company: true;
    address: true;
    portfolios: true;
    positionApplied: true;
    _count: true;
  };
}>;

export type HumanResourceGetPayload = Prisma.HumanResourceGetPayload<{
  include: {
    Company: true;
    user: true;
  };
}>;

export type CompanyGetPayload = Prisma.CompanyGetPayload<{
  include: {
    availablePositions: true;
    employees: true;
    humanResource: true;
    _count: true;
  };
}>;

export type AvailablePositionPayload = Prisma.AvailablePositionGetPayload<{
  include: {
    Company: true;
    positionApplied: true;
    _count: {
      select: {
        positionApplied: true;
      };
    };
  };
}>;

export type PositionAppliedGetPayload = Prisma.PositionAppliedGetPayload<{
  include: {
    AvailablePosition: true;
    Employee: true;
  };
}>;

export type AddressGetPayload = Prisma.AddressGetPayload<{
  select: {
    id: true;
    street: true;
    city: true;
    state: true;
    country: true;
    zip: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type PortfolioGetPayload = Prisma.PortfolioGetPayload<{
  include: {
    Employee: true;
  };
}>;
