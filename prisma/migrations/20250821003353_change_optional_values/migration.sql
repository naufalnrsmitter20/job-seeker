-- AlterTable
ALTER TABLE "public"."societies" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;
