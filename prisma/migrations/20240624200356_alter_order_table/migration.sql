/*
  Warnings:

  - Added the required column `dropOffDateTime` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickUpAddress` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickUpDateTime` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'CARD');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "dropOffDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isExpress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "pickUpAddress" TEXT NOT NULL,
ADD COLUMN     "pickUpDateTime" TIMESTAMP(3) NOT NULL;
