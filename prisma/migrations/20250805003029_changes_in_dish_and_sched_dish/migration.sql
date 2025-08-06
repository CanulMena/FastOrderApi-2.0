/*
  Warnings:

  - You are about to drop the column `racionesDisponibles` on the `Platillo` table. All the data in the column will be lost.
  - You are about to drop the column `racionesProgramadas` on the `PlatilloProgramado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Platillo" DROP COLUMN "racionesDisponibles";

-- AlterTable
ALTER TABLE "PlatilloProgramado" DROP COLUMN "racionesProgramadas",
ADD COLUMN     "controlRaciones" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "limiteRaciones" INTEGER;
