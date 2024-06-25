/*
  Warnings:

  - Added the required column `country` to the `vendors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_locationId_fkey";

-- AlterTable
ALTER TABLE "vendors" ADD COLUMN     "country" TEXT NOT NULL,
ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
