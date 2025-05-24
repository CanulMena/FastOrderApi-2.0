import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { User } from "../../entities";
import { SchedDishRepository } from "../../repositories/sched-dish.repository";

interface GetAvailableDishesUseCase {
  execute(user: User): Promise<object>;
}

export class GetAvailableDishes implements GetAvailableDishesUseCase {

  constructor(
    private readonly schedDishRepository: SchedDishRepository,
  ) {}

  async execute(user: User): Promise<object> {
    
    //día de la semana actual.
    const nowInZone = luxonAdapter.getCurrentDateTimeInYucatan('America/Merida');
    const startOfDay = luxonAdapter.getStartOfDay(nowInZone);
    const today = luxonAdapter.getDayName(startOfDay);

    //Si es super admin, se le devuelven todos los platillos programados de todas las cocinas.
    if(user.rol === 'SUPER_ADMIN') {
      const allScheduledDishes = await this.schedDishRepository.findScheduledDishesByDay(today);
      const result = allScheduledDishes.map(({ dish }) => ({
        id: dish!.dishId,
        nombre: dish!.name,
        rutaImagen: dish?.imagePath,
        precioMedia: dish!.pricePerHalfServing,
        precioEntera: dish!.pricePerServing,
        racionesDisponibles: dish!.availableServings,
      }));
      return {dia: today, platillos: result};
    }

    const scheduledDishes = await this.schedDishRepository.findAllSchedDishByKitchen(user.kitchenId!, today);

    const result = scheduledDishes.map(({ dish }) => ({
      id: dish!.dishId,
      nombre: dish!.name,
      rutaImagen: dish?.imagePath,
      precioMedia: dish!.pricePerHalfServing,
      precioEntera: dish!.pricePerServing,
      racionesDisponibles: dish!.availableServings,
    }));

    return {dia: today, platillos: result};
  }

}
  