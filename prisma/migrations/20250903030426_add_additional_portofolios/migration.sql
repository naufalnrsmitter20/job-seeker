-- AlterTable
ALTER TABLE "public"."portfolios" ADD COLUMN     "link" TEXT,
ALTER COLUMN "file" DROP NOT NULL;
