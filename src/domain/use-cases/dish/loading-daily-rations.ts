import { DishRepository, SchedDishRepository } from '../../repositories';
import { UpdateDishDto } from '../../dtos';
import { luxonAdapter } from '../../../configuration/plugins/luxon.adapter';

interface LoadingDailyRationsUseCase {
  execute(): Promise<void>;
}

export class LoadingDailyRations implements LoadingDailyRationsUseCase {

  constructor(
    private readonly schedDishRespository: SchedDishRepository,
    private readonly dishRepository: DishRepository
  ) {}

  async execute() {
    const nowInZone = luxonAdapter.getCurrentDateTimeInYucatan('America/Merida');
    const startOfDay = luxonAdapter.getStartOfDay(nowInZone);
    const today = luxonAdapter.getDayName(startOfDay);

    // console.log(`📅 Hoy en Yucatán es: ${today} (${luxonAdapter.formatDateTime(nowInZone)})`);

    const platillosProgramados = await this.schedDishRespository.findScheduledDishesByDay(today);

    for (const p of platillosProgramados) { //*Por cada platillo programado, actualizamos las raciones disponibles.*/
      console.log(`Platillo programado: ${p}`);
      const updateDishDto = new UpdateDishDto(
        p.dishId,
        undefined,
        undefined, 
        undefined,
        undefined,
        undefined,
      );

      await this.dishRepository.updateDish(updateDishDto); // Actualiza la ración disponible del platillo en la cocina.
      // console.log(
      //   `📦 Platillo "${p.dish?.name}" en cocina ID ${p.kitchenId} programado con ${p.dish?.availableServings} raciones.`
      // );
    }

    // console.log('✅ Raciones del día cargadas correctamente.');
  }
}
