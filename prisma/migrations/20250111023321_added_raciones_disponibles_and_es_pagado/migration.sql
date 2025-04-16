-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "esPagado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Platillo" ADD COLUMN     "racionesDisponibles" INTEGER NOT NULL DEFAULT 0;
