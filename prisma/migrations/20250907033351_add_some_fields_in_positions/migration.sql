/*
  Warnings:

  - The `description` column on the `available_positions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requirements` column on the `available_positions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `about` to the `available_positions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."available_positions" ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "benefits" TEXT[],
DROP COLUMN "description",
ADD COLUMN     "description" TEXT[],
DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[];
