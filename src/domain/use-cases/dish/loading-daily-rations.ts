import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface LoadingDailyRationsUseCase {
  execute(): Promise<void>;
}

export class LoadingDailyRations implements LoadingDailyRationsUseCase {
  async execute() {
    const allDate = new Date();
    allDate.setHours(0, 0, 0, 0); // para ignorar horas
    const diasEnum = [
      'DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'
    ] as const;
    const today = diasEnum[allDate.getDay()]; //getDay() devuelve el día de la semana (0-6) y lo convertimos a string.

    //TODO: CREAR REPOSITORIO, Y DATASOURCE DEL PLATILLO PROGRAMADO.
    const platillosProgramados = await prisma.platilloProgramado.findMany({ //*Cargamos los platillos programados del día.
      where: { diaSemana: today }, //buscamos platillos programados del día.
      include: { platillo: true }, //traemos el platillo relacionado.
    });

    if (platillosProgramados.length === 0) {
      console.log('📭 No hay platillos programados para hoy:', allDate.toDateString());
      return;
    }

    for (const p of platillosProgramados) { //*Por cada platillo programado, actualizamos las raciones disponibles.*/
      await prisma.platillo.update({ // TODO: llamar el repositorio del platillo.
        where: { id: p.platilloId },
        data: { racionesDisponibles: p.racionesProgramadas }
      });

      // console.log(
      //   `📦 Platillo "${p.platillo.nombre}" en cocina ID ${p.cocinaId} programado con ${p.racionesProgramadas} raciones.`
      // );
    }

    // console.log('✅ Raciones del día cargadas correctamente.');
  }
}
