-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'DELIVERY', 'OPERATOR');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('ENVIO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'FIADO');

-- CreateTable
CREATE TABLE "Cocina" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,

    CONSTRAINT "Cocina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "cocinaId" INTEGER NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platillo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "precioMedia" REAL NOT NULL,
    "precioEntera" REAL NOT NULL,
    "rutaImagen" TEXT,
    "cocinaId" INTEGER NOT NULL,

    CONSTRAINT "Platillo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complemento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "rutaImagen" TEXT,
    "cocinaId" INTEGER NOT NULL,

    CONSTRAINT "Complemento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatilloComplemento" (
    "platilloId" INTEGER NOT NULL,
    "complementoId" INTEGER NOT NULL,

    CONSTRAINT "PlatilloComplemento_pkey" PRIMARY KEY ("platilloId","complementoId")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15),
    "direccion" TEXT,
    "cocinaId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(6) NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "tipoEntrega" "TipoEntrega" NOT NULL DEFAULT 'PRESENCIAL',
    "tipoPago" "TipoPago" NOT NULL DEFAULT 'EFECTIVO',
    "clienteId" INTEGER NOT NULL,
    "cocinaId" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagosPendientes" (
    "id" SERIAL NOT NULL,
    "cantidad" REAL NOT NULL,
    "montoPendiente" REAL NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "pedidoId" INTEGER NOT NULL,
    "cocinaId" INTEGER NOT NULL,

    CONSTRAINT "PagosPendientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePedido" (
    "id" SERIAL NOT NULL,
    "cantidadEntera" INTEGER NOT NULL,
    "cantidadMedia" INTEGER NOT NULL,
    "subtotal" REAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "platilloId" INTEGER NOT NULL,

    CONSTRAINT "DetallePedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Complemento_nombre_cocinaId_key" ON "Complemento"("nombre", "cocinaId");

-- CreateIndex
CREATE UNIQUE INDEX "PagosPendientes_pedidoId_key" ON "PagosPendientes"("pedidoId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Platillo" ADD CONSTRAINT "Platillo_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complemento" ADD CONSTRAINT "Complemento_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatilloComplemento" ADD CONSTRAINT "PlatilloComplemento_complementoId_fkey" FOREIGN KEY ("complementoId") REFERENCES "Complemento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatilloComplemento" ADD CONSTRAINT "PlatilloComplemento_platilloId_fkey" FOREIGN KEY ("platilloId") REFERENCES "Platillo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagosPendientes" ADD CONSTRAINT "PagosPendientes_cocinaId_fkey" FOREIGN KEY ("cocinaId") REFERENCES "Cocina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagosPendientes" ADD CONSTRAINT "PagosPendientes_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_platilloId_fkey" FOREIGN KEY ("platilloId") REFERENCES "Platillo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
