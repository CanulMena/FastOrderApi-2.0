import { CreateOrderDto } from "../../dtos";
import { CustomError } from "../../errors";
import { CustomerRepository, DishRepository, OrderRepository } from "../../repositories";
import { Dish } from '../../entities/dish.entity';

interface RegisterOrderUseCase {
  execute(order: CreateOrderDto): Promise<object>;
}

export class RegisterOrder implements RegisterOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private dishRepository: DishRepository
  ) {}

  async execute(createOrderDto: CreateOrderDto): Promise<object> {
    const customer = await this.customerRepository.getCustomerById(createOrderDto.clientId);
    if (customer !== null && customer.kitchenId !== createOrderDto.kitchenId) {
      throw CustomError.unAuthorized(
        `El cliente con id ${customer.customerId} no pertenece a la cocina del pedido`
      );
    }

    // Si orderDetails no es nulo y tiene al menos un detalle
    if(createOrderDto.orderDetails && createOrderDto.orderDetails.length > 0) {
      //1. Obtenemos todos los dishId de los detalles de pedido que queremos crear.
      const dishesId: number[] = createOrderDto.orderDetails.map(detail => detail.dishId);
      //2. Obtenemos todos los platillos de los detalles de pedido que queremos crear.
      const dishes = await this.dishRepository.getDishesById(dishesId);
      //3. Validar raciones disponibles antes de hacer cualquier actualización
      createOrderDto.orderDetails.forEach(detail => {
        // verificar que el platillo exista
        const dish: Dish | undefined = dishes.find(dish => dish.dishId === detail.dishId);
        if (!dish) {
          throw CustomError.badRequest(`El platillo con id ${detail.dishId} no existe`);
        }
        // Validar que el platillo pertenezca a la cocina del pedido
        if (dish.kitchenId !== createOrderDto.kitchenId) {
          throw CustomError.unAuthorized(
            `El platillo con id ${detail.dishId} no pertenece a la cocina del pedido`
          );
        }
        // validar que ese platillo tenga suficientes raciones disponibles
        const orderPortion = detail.fullPortion + detail.halfPortion * 0.5;
        //TODO: Cuando el control de raciones de PlatilloProgramado este activo. Validar que orderPortion no sea mayor al limiteRaciones de PlatilloProgramado
        // if (dish.availableServings < orderPortion) {
        //   throw CustomError.unAuthorized(
        //     `Dish ${dish.name} with id ${dish.dishId} from the kitchen ${dish.kitchenId} does not have enough available servings - enable: ${dish.availableServings}`
        //   );
        // }
      })
    }

    const orderCreated = await this.orderRepository.createOder(createOrderDto);
    return orderCreated;
  }
}
