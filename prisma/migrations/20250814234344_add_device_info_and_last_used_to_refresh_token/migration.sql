/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "expiresAt",
ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "deviceOS" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "lastUsedAt" TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);
