import { CreateOrderDto, OrderResponseDto } from "../../dtos";
import { CustomError } from "../../errors";
import { CustomerRepository, DishRepository, OrderRepository } from "../../repositories";
import { Dish, Order} from '../../entities/index';
import { WssService } from "../../../presentation/services/ws-service";
import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { OrderMapper } from "../../mappers";

interface RegisterOrderUseCase {
  execute(order: CreateOrderDto): Promise<object>;
}

export class RegisterOrder implements RegisterOrderUseCase {

  private _orderMapper: OrderMapper;

  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private dishRepository: DishRepository,
    private orderMapper?: OrderMapper,
    private readonly wssService = WssService.instance,
  ) {
    this._orderMapper = orderMapper ?? new OrderMapper(this.customerRepository, this.dishRepository);
  }

  async execute(createOrderDto: CreateOrderDto): Promise<object> {

    await this.validateCustomer(createOrderDto);
    await this.validateOrderDetails(createOrderDto);

    const orderCreated = await this.orderRepository.createOder(createOrderDto);

    await this.notifyOrderCreated(orderCreated);
    await this.notifyDishPortionsUpdated(orderCreated, createOrderDto);
    
    return orderCreated;
  }

  /** Validar que el cliente pertenezca a la cocina */
  private async validateCustomer(createOrderDto: CreateOrderDto) {
    if (!createOrderDto.clientId) return;

    const customer = await this.customerRepository.getCustomerById(createOrderDto.clientId);

    if (customer && customer.kitchenId !== createOrderDto.kitchenId) {
      throw CustomError.unAuthorized(
        `El cliente con id ${customer.customerId} no pertenece a la cocina del pedido`
      );
    }
  }

    /** Validar que los platillos existan, sean de la cocina correcta, etc. */
  private async validateOrderDetails(createOrderDto: CreateOrderDto) {
    if (!createOrderDto.orderDetails?.length) return;

    const dishesId: number[] = createOrderDto.orderDetails.map(detail => detail.dishId);
    const dishes = await this.dishRepository.getDishesById(dishesId);

    for (const detail of createOrderDto.orderDetails) {
      const dish: Dish | undefined = dishes.find(d => d.dishId === detail.dishId);

      if (!dish) {
        throw CustomError.badRequest(`El platillo con id ${detail.dishId} no existe`);
      }

      if (dish.kitchenId !== createOrderDto.kitchenId) {
        throw CustomError.unAuthorized(
          `El platillo con id ${detail.dishId} no pertenece a la cocina del pedido`
        );
      }

      // validar que ese platillo tenga suficientes raciones disponibles
      // const orderPortion = detail.fullPortion + detail.halfPortion * 0.5;
      //TODO: Cuando el control de raciones de PlatilloProgramado este activo. Validar que orderPortion no sea mayor al limiteRaciones de PlatilloProgramado
      // if (dish.availableServings < orderPortion) {
      //   throw CustomError.unAuthorized(
      //     `Dish ${dish.name} with id ${dish.dishId} from the kitchen ${dish.kitchenId} does not have enough available servings - enable: ${dish.availableServings}`
      //   );
      // }

    }
  }

  /** Notificar la creación de la orden */
  private async notifyOrderCreated(orderCreated: Order) {
    const orderDto = await this.mapOrderToDto(orderCreated);
    this.wssService.sendMessageToKitchen(
      orderCreated.kitchenId,
      "ORDER_CREATED",
      orderDto
    );
  }

  /** Notificar el recuento actualizado de porciones */
  private async notifyDishPortionsUpdated(orderCreated: Order, createOrderDto: CreateOrderDto) {
    if (!createOrderDto.orderDetails?.length) return;

    const { startUTC, endUTC } = luxonAdapter.getDayRangeUtcByZone("America/Merida");

    for (const detail of createOrderDto.orderDetails) {
      const portions = await this.orderRepository.getOrderedServingsByDishAndDateRange(
        detail.dishId,
        startUTC,
        endUTC
      );

      this.wssService.sendMessageToKitchen(
        orderCreated.kitchenId,
        "DISH_PORTIONS_UPDATED",
        {
          dishId: detail.dishId,
          recuentoPorciones: portions.dishTotalServings,
        }
      );
    }
  }

    private async mapOrderToDto(order: Order): Promise<OrderResponseDto> {
      const orderResponseDto = await this._orderMapper.mapOrderToDto(order);
      return orderResponseDto;
    }

}
