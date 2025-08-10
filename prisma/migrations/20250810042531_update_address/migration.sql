/*
  Warnings:

  - You are about to drop the column `address` on the `societies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."societies" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "societyId" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "public"."societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
