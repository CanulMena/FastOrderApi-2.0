-- CreateTable
CREATE TABLE "PlatilloProgramado" (
    "id" SERIAL NOT NULL,
    "platilloId" INTEGER NOT NULL,
    "cocinaId" INTEGER NOT NULL,
    "fechaProgramada" DATE NOT NULL,
    "racionesProgramadas" REAL NOT NULL,

    CONSTRAINT "PlatilloProgramado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatilloProgramado_platilloId_cocinaId_fechaProgramada_key" ON "PlatilloProgramado"("platilloId", "cocinaId", "fechaProgramada");

-- AddForeignKey
ALTER TABLE "PlatilloProgramado" ADD CONSTRAINT "PlatilloProgramado_platilloId_fkey" FOREIGN KEY ("platilloId") REFERENCES "Platillo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatilloProgramado" ADD CONSTRAINT "PlatilloProgramado_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
