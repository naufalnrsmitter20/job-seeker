/*
  Warnings:

  - You are about to drop the `PositionApplied` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PositionApplied" DROP CONSTRAINT "PositionApplied_availablePositionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PositionApplied" DROP CONSTRAINT "PositionApplied_societyId_fkey";

-- DropTable
DROP TABLE "public"."PositionApplied";

-- CreateTable
CREATE TABLE "public"."position_applies" (
    "id" TEXT NOT NULL,
    "applyingStatus" "public"."applyingStatus" NOT NULL DEFAULT 'PENDING',
    "applyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "societyId" TEXT,
    "availablePositionId" TEXT,

    CONSTRAINT "position_applies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."position_applies" ADD CONSTRAINT "position_applies_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "public"."societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."position_applies" ADD CONSTRAINT "position_applies_availablePositionId_fkey" FOREIGN KEY ("availablePositionId") REFERENCES "public"."available_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
