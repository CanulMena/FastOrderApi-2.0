import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { User } from "../../entities";
import { SchedDishRepository, OrderRepository } from "../../repositories/index";

interface GetAvailableDishesUseCase {
  execute(user: User): Promise<object>;
}

export class GetAvailableDishes implements GetAvailableDishesUseCase {

  constructor(
    private readonly schedDishRepository: SchedDishRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(user: User): Promise<object> {
    
    //día de la semana actual.
    const nowInZone = luxonAdapter.getCurrentDateTimeInYucatan('America/Merida');
    const startOfDay = luxonAdapter.getStartOfDay(nowInZone);
    const endOfDay = luxonAdapter.getEndOfDay(nowInZone);
    const today = luxonAdapter.getDayName(startOfDay);

    const startJSDate = luxonAdapter.toJSDate(startOfDay);
    const endJSDate = luxonAdapter.toJSDate(endOfDay);

    //Si es super admin, se le devuelven todos los platillos programados de todas las cocinas.
    if(user.rol === 'SUPER_ADMIN') {

      const allScheduledDishes = await this.schedDishRepository.findScheduledDishesByDay(today);

      const superAdminResult = await Promise.all(

        allScheduledDishes.map( async ({ dish }) => { //puedo ejecutar una funcion asincrona dentro de un map, pero debo retornar una promesa.
          
          //esto me trae todos los orderDetails de ese platillo en el rango de fechas.
          const orderDetailsFromDishId = await this.orderRepository.getOrderedServingsByDishAndDateRange(dish!.dishId, startJSDate, endJSDate);

          return { //Esteo es lo que se va a retornar en el map y el promise.all lo va a resolver.
            id: dish!.dishId,
            nombre: dish!.name,
            rutaImagen: dish?.imagePath,
            precioMedia: dish!.pricePerHalfServing,
            precioEntera: dish!.pricePerServing,
            recuentoPorciones : orderDetailsFromDishId.dishTotalServings,
          }
        })

      );

      return {dia: today, platillos: superAdminResult};

    }

    const scheduledDishes = await this.schedDishRepository.findAllSchedDishByKitchen(user.kitchenId!, today);

    const usersResult = await Promise.all(

        scheduledDishes.map( async ({ dish }) => { //puedo ejecutar una funcion asincrona dentro de un map, pero debo retornar una promesa.
          
          //esto me trae todos los orderDetails de ese platillo en el rango de fechas.
          const orderDetailsFromDishId = await this.orderRepository.getOrderedServingsByDishAndDateRange(dish!.dishId, startJSDate, endJSDate);

          return { //Esteo es lo que se va a retornar en el map y el promise.all lo va a resolver.
            id: dish!.dishId,
            nombre: dish!.name,
            rutaImagen: dish?.imagePath,
            precioMedia: dish!.pricePerHalfServing,
            precioEntera: dish!.pricePerServing,
            recuentoPorciones : orderDetailsFromDishId.dishTotalServings,
          }
        })

      );

      return {
        dia: today, 
        platillos: usersResult
      };
  }

}
  