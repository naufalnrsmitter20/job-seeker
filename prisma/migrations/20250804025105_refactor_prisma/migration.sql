/*
  Warnings:

  - You are about to drop the `positionApplied` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."positionApplied" DROP CONSTRAINT "positionApplied_availablePositionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."positionApplied" DROP CONSTRAINT "positionApplied_societyId_fkey";

-- DropTable
DROP TABLE "public"."positionApplied";

-- CreateTable
CREATE TABLE "public"."PositionApplied" (
    "id" TEXT NOT NULL,
    "applyingStatus" "public"."applyingStatus" NOT NULL DEFAULT 'PENDING',
    "applyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "societyId" TEXT,
    "availablePositionId" TEXT,

    CONSTRAINT "PositionApplied_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PositionApplied" ADD CONSTRAINT "PositionApplied_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "public"."societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PositionApplied" ADD CONSTRAINT "PositionApplied_availablePositionId_fkey" FOREIGN KEY ("availablePositionId") REFERENCES "public"."available_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
