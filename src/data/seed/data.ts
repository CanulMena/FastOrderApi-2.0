// prisma/seed-data.ts
import { bcryptAdapter } from './../../configuration';


const cocinaCentral = { // cocinaIndex [0]

  complementos: [
    {
      nombre: 'Arroz',
      descripcion: 'Arroz blanco',
      rutaImagen: null,
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
    {
      nombre: 'Frijoles',
      descripcion: 'Frijoles negros',
      rutaImagen: null,
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
    {
      nombre: 'Pico de gallo',
      descripcion: 'Mezcla fresca de jitomate, cebolla y cilantro',
      rutaImagen: null,
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
  ],

  clientes: [
    {
      nombre: 'Juan Pérez',
      email: 'juanperez@gmail.com',
      telefono: '9991294852',
      direccion: 'Calle Falsa 123',
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
    {
      nombre: 'Danael Reinoso',
      email: 'danaelreinoso@gmail.com',
      telefono: '9991294853',
      direccion: 'Calle Falsa 124',
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
    {
      nombre: 'Maria jose',
      email: 'mariajose@gmail.com',
      telefono: '9991294854',
      direccion: 'Calle Falsa 125',
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
    {
      nombre: 'Gustavo Mena',
      email: 'gustavomena@gmail.com',
      telefono: '9991294822',
      direccion: 'Calle Falsa 126',
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
  ],

  platillos: [
    {
      nombre: 'Empanizado',
      precioMedia: 70,
      precioEntera: 100,
      rutaImagen: null,
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
      sidesIndex: [0, 1] // Arroz y frijol
    },
    {
      nombre: 'Frijol con puerco',
      precioMedia: 70,
      precioEntera: 100,
      rutaImagen: null,
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
      sidesIndex: [2] // Pico de gallo
    },
    {
      nombre: 'Tinga',
      precioMedia: 70,
      precioEntera: 100,
      rutaImagen: null,
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
      // sidesIndex: [2] // Pico de gallo
    },
  ],

  ordenes: [
    {
      fecha: new Date(),
      estado: "PENDIENTE",
      tipoEntrega: "PRESENCIAL",
      tipoPago: "EFECTIVO",
      esPagado: false,
      clienteIndex: 0,   // Juan Pérez
      cocinaIndex: 0,    // Cocina Central
      detalles: [
        {
          platilloIndex: 0, // Empanizado
          cantidadEntera: 2,
          cantidadMedia: 1,
        },
        {
          platilloIndex: 1, // Frijol con puerco
          cantidadEntera: 1,
          cantidadMedia: 0,
        },
      ],
    },
    {
      fecha: new Date(),
      estado: "ENTREGADO",
      tipoEntrega: "ENVIO",
      tipoPago: "TARJETA",
      esPagado: true,
      clienteIndex: 1,   // Danael Reinoso
      cocinaIndex: 0,
      detalles: [
        {
          platilloIndex: 2, // Tinga
          cantidadEntera: 1,
          cantidadMedia: 2,
        },
      ],
    },
  ],

  platillosProgramados: [
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'LUNES',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'MARTES',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'MIERCOLES',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'JUEVES',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'VIERNES',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'SABADO',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
    {
      platilloIndex: 0, // Empanizado
      diaSemana: 'DOMINGO',
      limiteRaciones: 20,
      controlRaciones: true,
      cocinaIndex: 0,   // Cocina Central
    },
  ]

}


export const seedData = {
  cocinas: [
    { nombre: 'Cocina Central', direccion: 'Calle 123', telefono: '111-222-333' },
    { nombre: 'Cocina Norte', direccion: 'Avenida 456', telefono: '222-333-444' },
  ],

  usuarios: [
    {
      nombre: 'Admin Central',
      email: 'gussycaul124@gmail.com',
      contrasena: bcryptAdapter.hash('123456'),
      rol: 'ADMIN',
      cocinaIndex: 0, // Relacionar con cocinas[0] - Cocina Central
    },
    {
      nombre: 'Admin Norte',
      email: 'gusssy12@gmail.com',
      contrasena: bcryptAdapter.hash('123456'),
      rol: 'ADMIN',
      cocinaIndex: 1, // Relacionar con cocinas[1] - Cocina Norte
    },
  ],

  platillos: [
    ...cocinaCentral.platillos,
    // {
    //   nombre: 'Frijol con puerco',
    //   precioMedia: 70,
    //   precioEntera: 100,
    //   rutaImagen: null,
    //   cocinaIndex: 1, // Relacionar con cocinas[1] - Cocina Norte
    // },
  ],

  complementos: [
    ...cocinaCentral.complementos,
    {
      nombre: 'Papas fritas',
      descripcion: 'Papas crocantes',
      rutaImagen: null,
      cocinaIndex: 1, // Relacionar con cocinas[1] - Cocina Norte
    },
  ],

  clientes: [
    ...cocinaCentral.clientes,
    {
      nombre: 'María López',
      email: 'marialopez@gmail.com',
      telefono: '555-5678',
      direccion: 'Avenida Siempre Viva 742',
      cocinaIndex: 1, // Relacionar con cocinas[1] - Cocina Norte
    },
  ],

  platillosProgramados: [
    ...cocinaCentral.platillosProgramados,
    {
      platilloIndex: 1,
      diaSemana: 'VIERNES',
      limiteRaciones: 15,
      controlRaciones: true,
      cocinaIndex: 1,   // Cocina Norte
    },
  ],

  ordenes: [
    ...cocinaCentral.ordenes,
  ],


};
