import { Prisma } from "@prisma/client";

export type UserGetPayload = Prisma.UserGetPayload<{
  include: {
    Employee: true;
    HumanResource: true;
  };
}>;
export type UserAppliedPositionGetPayload = Prisma.UserGetPayload<{
  include: {
    Employee: {
      include: {
        positionApplied: true;
      };
    };
    HumanResource: true;
  };
}>;

export type EmployeeGetPayload = Prisma.EmployeeGetPayload<{
  include: {
    user: true;
    Company: true;
    address: true;
    portfolios: true;
    positionApplied: {
      include: {
        AvailablePosition: {
          include: {
            Company: true;
          };
        };
      };
    };
    _count: true;
  };
}>;

export type HumanResourceGetPayload = Prisma.HumanResourceGetPayload<{
  include: {
    Company: {
      include: {
        availablePositions: true;
      };
    };
    user: true;
  };
}>;

export type CompanyGetPayload = Prisma.CompanyGetPayload<{
  include: {
    availablePositions: {
      include: {
        _count: {
          select: { positionApplied: true };
        };
      };
    };
    employees: true;
    humanResource: true;
    _count: {
      select: {
        availablePositions: true;
      };
    };
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

export type AvailablePositionWithPositionApplied = Prisma.AvailablePositionGetPayload<{
  include: {
    Company: true;
    positionApplied: {
      include: {
        Employee: {
          select: {
            id: true;
            name: true;
            user: {
              select: { name: true };
            };
          };
        };
      };
      orderBy: { applyDate: "desc" };
      take: 5;
    };
    _count: {
      select: { positionApplied: true };
    };
  };
}>;

export type PositionAppliedGetPayload = Prisma.PositionAppliedGetPayload<{
  include: {
    AvailablePosition: true;
    Employee: {
      include: {
        user: true;
      };
    };
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
    isPrimary: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type PortfolioGetPayload = Prisma.PortfolioGetPayload<{
  include: {
    Employee: true;
  };
}>;
