import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { Dish, User, WeekDays } from "../../entities";
import { SchedDishRepository, OrderRepository } from "../../repositories/index";

interface AvailableDishDto {
  id: number;
  nombre: string;
  rutaImagen?: string;
  precioMedia: number;
  precioEntera: number;
  recuentoPorciones: number;
}

interface GetAvailableDishesResult {
  dia: WeekDays;
  platillos: AvailableDishDto[];
}

interface GetAvailableDishesUseCase {
  execute(user: User): Promise<GetAvailableDishesResult>;
}

export class GetAvailableDishes implements GetAvailableDishesUseCase {
  constructor(
    private readonly schedDishRepository: SchedDishRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(user: User): Promise<GetAvailableDishesResult> {
    const userDayRangeUTC = luxonAdapter.getDayRangeUtcByZone("America/Merida");

    const scheduledDishes = await this.getScheduledDishes(user, userDayRangeUTC.dayName);

    const availableDishes = await Promise.all(
      scheduledDishes.map((scheduledDish) => this.mapToAvailableDish(scheduledDish.dish!, userDayRangeUTC))
    );

    return {
      dia: userDayRangeUTC.dayName,
      platillos: availableDishes,
    };
  }

  private async  getScheduledDishes(user: User, dayName: WeekDays) {
    if (user.rol === "SUPER_ADMIN") {
      return this.schedDishRepository.findScheduledDishesByDay(dayName);
    }
    return this.schedDishRepository.findAllSchedDishByKitchen(user.kitchenId!, dayName);
  }

  private async mapToAvailableDish(dish: Dish, range: { startUTC: Date; endUTC: Date }): Promise<AvailableDishDto> {
    const orders = await this.orderRepository.getOrderedServingsByDishAndDateRange(
      dish.dishId,
      range.startUTC,
      range.endUTC
    );

    return {
      id: dish.dishId,
      nombre: dish.name,
      rutaImagen: dish.imagePath,
      precioMedia: dish.pricePerHalfServing,
      precioEntera: dish.pricePerServing,
      recuentoPorciones: orders.dishTotalServings,
    };
  }
}