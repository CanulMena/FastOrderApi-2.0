-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_cocinaId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "cocinaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE SET NULL ON UPDATE CASCADE;
