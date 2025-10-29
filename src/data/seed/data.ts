import { bcryptAdapter } from "../../configuration";

export const cocinaElBaby = {
  info: {
    nombre: "Cocina El Baby",
    direccion: "Calle 111b * 52a y 54 N° 494",
    telefono: "9991402885",
  },

  usuarios: [
    {
      nombre: "Gustavo Mena",
      email: "gussycaul124@gmail.com",
      contrasena: bcryptAdapter.hash("Relax98705"),
      rol: "ADMIN",
    },
  ],

  complementos: [],

  clientes: [
    { nombre: "Gustavo Canul", telefono: "9991402885", direccion: "Calle Falsa 125" },
    { nombre: "Danael Reinoso", telefono: "9995883922", direccion: null },
    { nombre: "Virginia (Gaby Esposa)", telefono: "9993677108", direccion: null },
    { nombre: "Gaby (Computox)", telefono: "9999010250", direccion: null },
    { nombre: "Guadalupe", telefono: "9901818175", direccion: null },
    { nombre: "Alvaro", telefono: "9991345316", direccion: null },
    { nombre: "Cecilia Hernandez", telefono: "9992201598", direccion: null },
    { nombre: "Rosario Nuera", telefono: "9993964222", direccion: null },
    { nombre: "Hija (Doña Luci)", telefono: "9901898559", direccion: null },
    { nombre: "Walki", telefono: "9996455143", direccion: null },
    { nombre: "Elmer (Barber)", telefono: "9991070725", direccion: null },
    { nombre: "Vicente (Albañil)", telefono: "9994731375", direccion: null },
    { nombre: "Lucia Moo", telefono: "9997494508", direccion: null },
    { nombre: "VIRGY", telefono: "9993272726", direccion: null },
    { nombre: "Romina", telefono: "9994036883", direccion: null },
    { nombre: "Alejandro (Mildred)", telefono: "9993860828", direccion: null },
    { nombre: "(Mamá David)", telefono: "9992159693", direccion: null },
    { nombre: "Quetzalli Escayola (Lic.)", telefono: "9935849783", direccion: null },
    { nombre: "Nery", telefono: "9996161780", direccion: null },
    { nombre: "Diana", telefono: "9993438790", direccion: null },
    { nombre: "Mimi", telefono: "9991262877", direccion: null },
    { nombre: "Doña Leti", telefono: "9991420579", direccion: null },
    { nombre: "Hector Marrufo", telefono: "9999095001", direccion: null },
    { nombre: "Juan Jugoba", telefono: "9992389051", direccion: null },
    { nombre: "China Ileana", telefono: "9994080028", direccion: null },
    { nombre: "Andres Calderon", telefono: "9993806828", direccion: null },
    { nombre: "Xiomara", telefono: "9994493123", direccion: null },
    { nombre: "Maria Jesus", telefono: "9997379767", direccion: null },
    { nombre: "Dulce Isabel Dor", telefono: "9995663320", direccion: null },
    { nombre: "(Marcos Hija)", telefono: "9994429573", direccion: null },
    { nombre: "Maritza", telefono: "9992159944", direccion: null },
    { nombre: "Clara", telefono: "9991647473", direccion: null },
    { nombre: "Wilma May Canul", telefono: "9991002261", direccion: null },
    { nombre: "Ale Paredes", telefono: "9994215235", direccion: null },
    { nombre: "Julio Castillo", telefono: "9992346261", direccion: null },
    { nombre: "Paula pech", telefono: "9995511633", direccion: null },
    { nombre: "Naye", telefono: "9991131204", direccion: null },
    { nombre: "Martin Moikis", telefono: "9993450799", direccion: null },
    { nombre: "Oyuki Sanchez", telefono: "9991775618", direccion: null },
    { nombre: "Isabel Pinto", telefono: "9997803654", direccion: null },
    { nombre: "Raúl", telefono: "9991772122", direccion: null },
    { nombre: "(Wolff)", telefono: "9992595864", direccion: null },
    { nombre: "Auris (Maestra)", telefono: "9992339450", direccion: null },
    { nombre: "Alex", telefono: "9993961254", direccion: null },
    { nombre: "Claudia Lara", telefono: "9999901052", direccion: null },
    { nombre: "Natalia", telefono: "9995140819", direccion: null },
    { nombre: "Teresita Chi", telefono: "9991608843", direccion: null },
    { nombre: "Cindy", telefono: "9999567476", direccion: null },
    { nombre: "Alejandrina Chunab", telefono: "9991555565", direccion: null },
    { nombre: "Andrea (UTM)", telefono: "9992285109", direccion: null },
    { nombre: "Mary (Pasteleria)", telefono: "9992141452", direccion: null },
    { nombre: "Doña Dulce (Mamá)", telefono: "9994744828", direccion: null },
    { nombre: "Marta Mami Soco", telefono: "9995851944", direccion: null },
    { nombre: "Elsy Hernandez (La Gas)", telefono: "9999972530", direccion: null },
    { nombre: "Madai Mariely", telefono: "9993233467", direccion: null },
    { nombre: "Selena", telefono: "9996691436", direccion: null },
    { nombre: "Lesly", telefono: "9995715397", direccion: null },
    { nombre: "Itzel", telefono: "9991112268", direccion: null },
    { nombre: "Angelica (SR)", telefono: "9993393388", direccion: null },
    { nombre: "Luceli Cegobia", telefono: null, direccion: null },
    { nombre: "Gloria", telefono: null, direccion: null },
    { nombre: "Jorge", telefono: null, direccion: null },
  ],

  platillos: [
    // {
    //   nombre: "Tinga de pollo",
    //   precioMedia: 65,
    //   precioEntera: 90,
    //   rutaImagen: null,
    //   sides: []
    // },
  ],

  platillosProgramados: [
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'LUNES',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'MARTES',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'MIERCOLES',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'JUEVES',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'VIERNES',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'SABADO',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
    // {
    //   platilloIndex: 0, // Empanizado
    //   diaSemana: 'DOMINGO',
    //   limiteRaciones: 20,
    //   controlRaciones: true,
    //   cocinaIndex: 0,   // Cocina Central
    // },
  ],

  ordenes: [],
};


export const cocinaTesting = {
  info: {
    nombre: "Cocina Testing",
    direccion: "Calle 111 * 46 y 48 N° 315",
    telefono: "9991402885",
  },

  usuarios: [
    {
      nombre: "Admin Testing",
      email: "adminTesting@gmail.com",
      contrasena: bcryptAdapter.hash("123456"),
      rol: "ADMIN",
    },
  ],

  complementos: [
    { nombre: "Papas fritas", descripcion: "Crujientes y doradas" },
    { nombre: "Ensalada", descripcion: "Fresca con aderezo" },
  ],

  clientes: [
    { nombre: "María López", telefono: "5555678", direccion: "Avenida Siempre Viva 742" },
    { nombre: "Gustavo Canul", telefono: null, direccion: "Calle Falsa 125" },
    { nombre: "Danael Reinoso", telefono: null, direccion: null },
    { nombre: "Virginia (Gaby Esposa)", telefono: null, direccion: null },
    { nombre: "Gaby (Computox)", telefono: null, direccion: null },
    { nombre: "Guadalupe", telefono: null, direccion: null },
    { nombre: "Alvaro", telefono: null, direccion: null },
    { nombre: "Cecilia Hernandez", telefono: null, direccion: null },
    { nombre: "Rosario Nuera", telefono: null, direccion: null },
    { nombre: "Hija (Doña Luci)", telefono: null, direccion: null },
    { nombre: "Walki", telefono: null, direccion: null },
    { nombre: "Elmer (Barber)", telefono: null, direccion: null },
    { nombre: "Vicente (Albañil)", telefono: null, direccion: null },
    { nombre: "Lucia Moo", telefono: null, direccion: null },
    { nombre: "VIRGY", telefono: null, direccion: null },
    { nombre: "Romina", telefono: null, direccion: null },
    { nombre: "Alejandro (Mildred)", telefono: null, direccion: null },
    { nombre: "(Mamá David)", telefono: null, direccion: null },
    { nombre: "Quetzalli Escayola (Lic.)", telefono: null, direccion: null },
    { nombre: "Nery", telefono: null, direccion: null },
    { nombre: "Diana", telefono: null, direccion: null },
    { nombre: "Mimi", telefono: null, direccion: null },
    { nombre: "Doña Leti", telefono: null, direccion: null },
    { nombre: "Hector Marrufo", telefono: null, direccion: null },
    { nombre: "Juan Jugoba", telefono: null, direccion: null },
    { nombre: "China Ileana", telefono: null, direccion: null },
    { nombre: "Andres Calderon", telefono: null, direccion: null },
    { nombre: "Xiomara", telefono: null, direccion: null },
    { nombre: "Maria Jesus", telefono: null, direccion: null },
    { nombre: "Dulce Isabel Dor", telefono: null, direccion: null },
    { nombre: "(Marcos Hija)", telefono: null, direccion: null },
    { nombre: "Maritza", telefono: null, direccion: null },
    { nombre: "Clara", telefono: null, direccion: null },
    { nombre: "Wilma May Canul", telefono: null, direccion: null },
    { nombre: "Ale Paredes", telefono: null, direccion: null },
    { nombre: "Julio Castillo", telefono: null, direccion: null },
    { nombre: "Paula pech", telefono: null, direccion: null },
    { nombre: "Naye", telefono: null, direccion: null },
    { nombre: "Martin Moikis", telefono: null, direccion: null },
    { nombre: "Oyuki Sanchez", telefono: null, direccion: null },
    { nombre: "Isabel Pinto", telefono: null, direccion: null },
    { nombre: "Raúl", telefono: null, direccion: null },
    { nombre: "(Wolff)", telefono: null, direccion: null },
    { nombre: "Auris (Maestra)", telefono: null, direccion: null },
    { nombre: "Alex", telefono: null, direccion: null },
    { nombre: "Claudia Lara", telefono: null, direccion: null },
    { nombre: "Natalia", telefono: null, direccion: null },
    { nombre: "Teresita Chi", telefono: null, direccion: null },
    { nombre: "Cindy", telefono: null, direccion: null },
    { nombre: "Alejandrina Chunab", telefono: null, direccion: null },
    { nombre: "Andrea (UTM)", telefono: null, direccion: null },
    { nombre: "Mary (Pasteleria)", telefono: null, direccion: null },
    { nombre: "Doña Dulce (Mamá)", telefono: null, direccion: null },
    { nombre: "Marta Mami Soco", telefono: null, direccion: null },
    { nombre: "Elsy Hernandez (La Gas)", telefono: null, direccion: null },
    { nombre: "Madai Mariely", telefono: null, direccion: null },
    { nombre: "Selena", telefono: null, direccion: null },
    { nombre: "Lesly", telefono: null, direccion: null },
    { nombre: "Itzel", telefono: null, direccion: null },
    { nombre: "Angelica (SR)", telefono: null, direccion: null },
  ],

  platillos: [
    {
      nombre: "Tinga de pollo",
      precioMedia: 65,
      precioEntera: 90,
      rutaImagen: null,
      sides: [0], // Papas fritas
    },
  ],

  platillosProgramados: [
    { platilloIndex: 0, diaSemana: "VIERNES", limiteRaciones: 10 },
  ],

  ordenes: [
    {
      fecha: new Date(),
      estado: "ENTREGADO",
      tipoEntrega: "ENVIO",
      tipoPago: "TARJETA",
      esPagado: true,
      clienteIndex: 0,
      detalles: [
        { platilloIndex: 0, cantidadEntera: 1, cantidadMedia: 0 },
      ],
    },
  ],
};

export const cocinaCustom = {
  info: {
    nombre: "CocinaCustom",
    direccion: "Por definir",
    telefono: "0000000000",
  },
  usuarios: [
    {
      nombre: "Admin Custom",
      email: "custom@gmail.com",
      contrasena: bcryptAdapter.hash("123456"),
      rol: "ADMIN",
    },
  ],
  complementos: [],
  clientes: [],
  platillos: [],
  platillosProgramados: [],
  ordenes: [],
};