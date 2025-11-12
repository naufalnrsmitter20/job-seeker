/*
  Warnings:

  - You are about to drop the column `skill` on the `portfolios` table. All the data in the column will be lost.
  - Added the required column `title` to the `portfolios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolios" DROP COLUMN "skill",
ADD COLUMN     "title" TEXT NOT NULL;
