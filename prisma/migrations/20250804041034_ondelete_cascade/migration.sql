-- DropForeignKey
ALTER TABLE "public"."available_positions" DROP CONSTRAINT "available_positions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."portfolios" DROP CONSTRAINT "portfolios_societyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."position_applies" DROP CONSTRAINT "position_applies_availablePositionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."societies" DROP CONSTRAINT "societies_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."societies" ADD CONSTRAINT "societies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolios" ADD CONSTRAINT "portfolios_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "public"."societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."available_positions" ADD CONSTRAINT "available_positions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."position_applies" ADD CONSTRAINT "position_applies_availablePositionId_fkey" FOREIGN KEY ("availablePositionId") REFERENCES "public"."available_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
