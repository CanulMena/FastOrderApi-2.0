import { PrismaClient } from "@prisma/client";
import { seedData } from "./data";

const prisma = new PrismaClient();

( () => {
  main();
})()

async function main() {
  // 0. Borrar todo
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
  
  // 1. Crear 1 cocina 
    console.log('🌱 Insertando cocinas...');
    const cocinas = await Promise.all(
      seedData.cocinas.map((c) => prisma.cocina.create({ data: c }))
    );

  // 2. Crear usuarios
    console.log('🌱 Insertando usuarios...');
    await Promise.all(
      seedData.usuarios.map((u) =>
        prisma.usuario.create({
          data: {
            nombre: u.nombre,
            email: u.email,
            contrasena: u.contrasena,
            rol: u.rol as any,
            cocinaId: cocinas[u.cocinaIndex].id,
          },
        })
      )
    );
    
      // 3. Insertando complementos
      console.log('🌱 Insertando complementos...');
      const complementos = await Promise.all(
        seedData.complementos.map((c) =>
          prisma.complemento.create({
            data: {
              nombre: c.nombre,
              descripcion: c.descripcion,
              rutaImagen: c.rutaImagen,
              cocinaId: cocinas[c.cocinaIndex].id,
            },
          })
        )
      );

  // 4. Crear platos de cocina
  console.log('🌱 Insertando platillos...');
  const platillos = await Promise.all(
    seedData.platillos.map((p) =>
      prisma.platillo.create({
        data: {
          nombre: p.nombre,
          precioMedia: p.precioMedia,
          precioEntera: p.precioEntera,
          rutaImagen: p.rutaImagen,
          cocinaId: cocinas[p.cocinaIndex].id,
          complementos: p.sidesIndex
          ? {
              create: p.sidesIndex.map((sideIdx: number) => ({
                complemento: {
                  connect: { id: complementos[sideIdx].id },
                },
              })),
            }
          : undefined,
        },
      })
    )
  );

  // 5. Crear clientes
  console.log('🌱 Insertando clientes...');
  const clientes =await Promise.all(
    seedData.clientes.map((c) =>
      prisma.cliente.create({
        data: {
          nombre: c.nombre,
          telefono: c.telefono,
          direccion: c.direccion,
          cocinaId: cocinas[c.cocinaIndex].id,
        },
      })
    )
  );

  // 6. Crear platillos programados
  console.log('🌱 Insertando platillos programados...');
  await Promise.all(
    seedData.platillosProgramados.map((pp) =>
      prisma.platilloProgramado.create({
        data: {
          platilloId: platillos[pp.platilloIndex].id,
          cocinaId: cocinas[pp.cocinaIndex].id,
          diaSemana: pp.diaSemana as any,
          limiteRaciones: pp.limiteRaciones,
          controlRaciones: pp.controlRaciones,
        },
      })
    )
  );

  // 8. Crear ordenes / order details
  console.log("🌱 Insertando órdenes...");
  await Promise.all(
    seedData.ordenes.map(async (o) =>
      prisma.pedido.create({
        data: {
          fecha: o.fecha,
          estado: o.estado as any,
          tipoEntrega: o.tipoEntrega as any,
          tipoPago: o.tipoPago as any,
          esPagado: o.esPagado,
          clienteId: clientes[o.clienteIndex].id, // Relacionar cliente
          cocinaId: cocinas[o.cocinaIndex].id,   // Relacionar cocina
          detalles: {
            create: o.detalles.map((d) => ({
              cantidadEntera: d.cantidadEntera,
              cantidadMedia: d.cantidadMedia,
              platilloId: platillos[d.platilloIndex].id, // Relacionar platillo
            })),
          },
        },
        include: { detalles: true },
      })
    )
  );

  console.log("Database Seeded");
}