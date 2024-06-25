/*
  Warnings:

  - The `contactInfo` column on the `vendors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GENERAL', 'VENDOR', 'CUSTOMER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_vendorId_fkey";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "meta" JSONB,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "customerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "contactInfo",
ADD COLUMN     "contactInfo" JSONB;

-- DropTable
DROP TABLE "services";

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
