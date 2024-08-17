/*
  Warnings:

  - The values [IN_PROGRESS,COMPLETED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `items` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LaundryStatus" AS ENUM ('NONE', 'RECEIVED', 'WASHED', 'IRONED', 'READY_FOR_PICKUP', 'DELIVERED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('NONE', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "items",
ADD COLUMN     "laundryStatus" "LaundryStatus" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
