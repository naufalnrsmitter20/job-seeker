/*
  Warnings:

  - You are about to drop the column `societyId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `societyId` on the `portfolios` table. All the data in the column will be lost.
  - You are about to drop the column `societyId` on the `position_applies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[humanResourceId]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."userRole" ADD VALUE 'EMPLOYEE';

-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_societyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."portfolios" DROP CONSTRAINT "portfolios_societyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."position_applies" DROP CONSTRAINT "position_applies_societyId_fkey";

-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "societyId",
ADD COLUMN     "employeeId" TEXT;

-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "userId",
ADD COLUMN     "humanResourceId" TEXT;

-- AlterTable
ALTER TABLE "public"."portfolios" DROP COLUMN "societyId",
ADD COLUMN     "employeeId" TEXT;

-- AlterTable
ALTER TABLE "public"."position_applies" DROP COLUMN "societyId",
ADD COLUMN     "employeeId" TEXT;

-- AlterTable
ALTER TABLE "public"."societies" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "public"."HumanResource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "HumanResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HumanResource_userId_key" ON "public"."HumanResource"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_humanResourceId_key" ON "public"."companies"("humanResourceId");

-- AddForeignKey
ALTER TABLE "public"."societies" ADD CONSTRAINT "societies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HumanResource" ADD CONSTRAINT "HumanResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolios" ADD CONSTRAINT "portfolios_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_humanResourceId_fkey" FOREIGN KEY ("humanResourceId") REFERENCES "public"."HumanResource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."position_applies" ADD CONSTRAINT "position_applies_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
