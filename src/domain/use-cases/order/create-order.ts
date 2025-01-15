import { CreateOrderDto } from "../../dtos";
import { CustomError } from "../../errors";
import { CustomerRepository, DishRepository, OrderRepository } from "../../repositories";
import { UpdateDishDto } from "../../dtos/dish/update-dish.dto";

interface RegisterOrderUseCase {
  execute(order: CreateOrderDto): Promise<object>;
}

export class RegisterOrder implements RegisterOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private dishRepository: DishRepository
  ) {}

  async execute(order: CreateOrderDto): Promise<object> {
    const initialDishesState: { dishId: number; availableServings: number }[] = [];
    // Validar que el cliente pertenezca a la misma cocina del pedido
    const customer = await this.customerRepository.getCustomerById(order.clientId);
    if (customer !== null && customer.kitchenId !== order.kitchenId) {
      throw CustomError.unAuthorized(
        `El cliente con id ${customer.customerId} no pertenece a la cocina del pedido`
      );
    }

    // Validar y actualizar los platillos
    for (const detail of order.orderDetails) {
      // Obtener platillo - Validar que exista
      const dish = await this.dishRepository.getDishById(detail.dishId);

      //guardar estado inicial
      // initialDishesState.push({ dishId: dish.dishId, availableServings: dish.availableServings });

      // Validar que el platillo pertenezca a la cocina del pedido
      if (dish.kitchenId !== order.kitchenId) {
        throw CustomError.unAuthorized(
          `El platillo con id ${detail.dishId} no pertenece a la cocina del pedido`
        );
      }

      // Validar raciones disponibles. 1 ración = 1 entera + 1 media = 1.5
      const orderPortion = detail.fullPortion + detail.halfPortion * 0.5;
      if (dish.availableServings < orderPortion) {
        throw CustomError.unAuthorized(
          `Dish ${dish.name} with id ${dish.dishId} from the kitchen ${dish.kitchenId} does not have enough available servings - enable: ${dish.availableServings}`
        );
      }

      // Actualizar raciones disponibles
      const newAvailableServings = dish.availableServings - orderPortion;
      const [error, updateDishDto] = UpdateDishDto.create({
        availableServings: newAvailableServings,
        dishId: dish.dishId,
      });
      
      if (error) throw CustomError.badRequest(error);

      const updatedDish = await this.dishRepository.updateDish(updateDishDto!);
      if(!updatedDish) throw CustomError.internalServer("Error al actualizar el platillo");
    }

    try {
      const orderCreated = await this.orderRepository.createOder(order);
      return orderCreated;
    } catch (error) {
      //TODO: REVERTIR CAMBIOS EN PLATILLOS CON UN ROLLBACK DE PRISMA
      throw CustomError.internalServer("Error al crear el pedido");
    }

  }
}
