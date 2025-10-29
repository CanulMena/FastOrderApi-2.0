import { PrismaClient, Rol } from "@prisma/client";
import { cocinaCustom, cocinaElBaby, cocinaTesting } from "./data";


const prisma = new PrismaClient();

(async () => {
  await main();
  await prisma.$disconnect();
})();

async function main() {
  const seedData = [cocinaElBaby, cocinaTesting, cocinaCustom];

  console.log("🧹 Limpiando base de datos...");
  await prisma.refreshToken.deleteMany();
  await prisma.detallePedido.deleteMany();
  await prisma.pagosPendientes.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.platilloComplemento.deleteMany();
  await prisma.complemento.deleteMany();
  await prisma.platilloProgramado.deleteMany();
  await prisma.platillo.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.cocina.deleteMany();



  for (const cocinaData of seedData) {
    console.log(`\n🌱 Insertando datos de ${cocinaData.info.nombre}...`);

    const cocina = await prisma.cocina.create({ data: cocinaData.info });

    // Usuarios
    const usuarios = await Promise.all(
      cocinaData.usuarios.map((u) =>
        prisma.usuario.create({
          data: {
            nombre: u.nombre,
            email: u.email,
            contrasena: u.contrasena,
            rol: u.rol === "ADMIN" ? Rol.ADMIN: Rol.OPERATOR,
            cocinaId: cocina.id,
          },
        })
      )
    );

    // Complementos
    const complementos = await Promise.all(
      cocinaData.complementos.map((c) =>
        prisma.complemento.create({
          data: { ...c, cocinaId: cocina.id },
        })
      )
    );

    // Platillos
    const platillos = await Promise.all(
      cocinaData.platillos.map((p) =>
        prisma.platillo.create({
          data: {
            nombre: p.nombre,
            precioMedia: p.precioMedia,
            precioEntera: p.precioEntera,
            rutaImagen: p.rutaImagen,
            cocinaId: cocina.id,
            complementos: p.sides
              ? {
                  create: p.sides.map((idx) => ({
                    complemento: { connect: { id: complementos[idx].id } },
                  })),
                }
              : undefined,
          },
        })
      )
    );

    // Clientes
    const clientes = await Promise.all(
      cocinaData.clientes.map((c) =>
        prisma.cliente.create({
          data: { ...c, cocinaId: cocina.id },
        })
      )
    );

    // Platillos Programados
    await Promise.all(
      cocinaData.platillosProgramados.map((pp) =>
        prisma.platilloProgramado.create({
          data: {
            platilloId: platillos[pp.platilloIndex].id,
            cocinaId: cocina.id,
            diaSemana: pp.diaSemana as any,
            limiteRaciones: pp.limiteRaciones,
            controlRaciones: true,
          },
        })
      )
    );

    // Órdenes
    await Promise.all(
      cocinaData.ordenes.map((o) =>
        prisma.pedido.create({
          data: {
            fecha: o.fecha,
            estado: o.estado as any,
            tipoEntrega: o.tipoEntrega as any,
            tipoPago: o.tipoPago as any,
            esPagado: o.esPagado,
            cocinaId: cocina.id,
            clienteId: clientes[o.clienteIndex]?.id,
            detalles: {
              create: o.detalles.map((d) => ({
                cantidadEntera: d.cantidadEntera,
                cantidadMedia: d.cantidadMedia,
                platilloId: platillos[d.platilloIndex].id,
              })),
            },
          },
        })
      )
    );

    console.log(`✅ ${cocinaData.info.nombre} insertada correctamente.`);
  }

  console.log("\n🎉 Base de datos inicializada con éxito.");
}