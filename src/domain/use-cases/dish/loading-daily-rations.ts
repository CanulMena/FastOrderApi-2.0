import { DishRepository, SchedDishRepository } from '../../repositories';
import { UpdateDishDto } from '../../dtos';

interface LoadingDailyRationsUseCase {
  execute(): Promise<void>;
}

export class LoadingDailyRations implements LoadingDailyRationsUseCase {

  constructor(
    private readonly schedDishRespository: SchedDishRepository,
    private readonly dishRepository: DishRepository
  ) {}

  async execute() {
    const allDate = new Date(); //TODO: CONFIGURAR FECHAD MEXICO YUCATAN.. POR SI LA DEL SERVIDOR ES DIFERENTE.
    allDate.setHours(0, 0, 0, 0); // para ignorar horas
    const diasEnum = [
      'DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'
    ] as const;
    const today = diasEnum[allDate.getDay()]; //getDay() devuelve el día de la semana (0-6) y lo convertimos a string.

    const platillosProgramados = await this.schedDishRespository.findScheduledDishesByDay(today);

    for (const p of platillosProgramados) { //*Por cada platillo programado, actualizamos las raciones disponibles.*/
      console.log(`Platillo programado: ${p}`);
      const updateDishDto = new UpdateDishDto(
        p.dishId,
        undefined,
        undefined, 
        undefined,
        p.scheduledRations,
        undefined,
        undefined,
      );

      await this.dishRepository.updateDish(updateDishDto); // Actualiza la ración disponible del platillo en la cocina.
      console.log(
        `📦 Platillo "${p.dish?.name}" en cocina ID ${p.kitchenId} programado con ${p.dish?.availableServings} raciones.`
      );
    }

    console.log('✅ Raciones del día cargadas correctamente.');
  }
}
