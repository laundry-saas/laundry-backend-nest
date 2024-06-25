/*
  Warnings:

  - You are about to drop the column `locationId` on the `vendors` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_locationId_fkey";

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "locationId";
