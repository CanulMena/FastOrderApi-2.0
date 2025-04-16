/*
  Warnings:

  - You are about to drop the column `fechaProgramada` on the `PlatilloProgramado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platilloId,cocinaId,diaSemana]` on the table `PlatilloProgramado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `diaSemana` to the `PlatilloProgramado` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- DropIndex
DROP INDEX "PlatilloProgramado_platilloId_cocinaId_fechaProgramada_key";

-- AlterTable
ALTER TABLE "PlatilloProgramado" DROP COLUMN "fechaProgramada",
ADD COLUMN     "diaSemana" "DiaSemana" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PlatilloProgramado_platilloId_cocinaId_diaSemana_key" ON "PlatilloProgramado"("platilloId", "cocinaId", "diaSemana");
