import { OrderResponseDto, UpdateOrderDto } from "../../dtos";
import { Order, OrderDetail, User } from "../../entities";
import { CustomError } from "../../errors";
import { CustomerRepository, DishRepository, OrderRepository } from "../../repositories";
import { WssService } from "../../../presentation/services/ws-service";
// import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { OrderMapper } from "../../mappers";

interface UpdateOrderUseCase {
  execute(updateOrderDto: UpdateOrderDto, user: User): Promise<object>;
}

export class UpdateOrder implements UpdateOrderUseCase {

  private _orderMapper: OrderMapper;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly dishRepository: DishRepository,
    private readonly wssService = WssService.instance,
    private orderMapper?: OrderMapper,
  ) {
    this._orderMapper = orderMapper ?? new OrderMapper(this.customerRepository, this.dishRepository);
  }

  async execute(updateOrderDto: UpdateOrderDto, user: User): Promise<object> {
    // Validar acceso y existencia
    const orderFound = await this.validateAccess(updateOrderDto, user);

    // Validar cliente (si se actualiza)
    await this.validateCustomer(updateOrderDto, orderFound.kitchenId);

    // Validar detalles (si los hay)
    const orderDetailsByOrderId: OrderDetail[] =
      await this.validateOrderDetails(updateOrderDto, orderFound.orderId);

    // Actualizar en repositorio
    const updatedOrder = await this.orderRepository.updateOrder(
      updateOrderDto,
      orderDetailsByOrderId
    );

    // Notificar por WebSocket
    await this.notifyInstanceOrderUpdated(updatedOrder);
    // await this.notifyDishPortionsUpdated(updatedOrder, updateOrderDto);

    return { orderUpdated: updatedOrder };
  }

  // =============================
  // Métodos privados auxiliares
  // =============================

  /** Validar existencia y acceso del usuario a la orden */
  private async validateAccess(updateOrderDto: UpdateOrderDto, user: User) {
    const orderFound = await this.orderRepository.getOrderById(updateOrderDto.orderId);

    if (orderFound.kitchenId !== user.kitchenId && user.rol !== "SUPER_ADMIN") {
      throw CustomError.unAuthorized("User does not have access to this kitchen");
    }

    if( updateOrderDto.status === 'COMPLETADO' && updateOrderDto.isPaid === false ) {
        throw CustomError.badRequest("Para completar una orden, ocupa ser pagada");
    }

    if (orderFound.status === "COMPLETADO" && orderFound.isPaid === true) {
      throw CustomError.badRequest("The order has already been completed");
    }

    return orderFound;
  }

  /** Validar cliente (si se cambia el cliente de la orden) */
  private async validateCustomer(updateOrderDto: UpdateOrderDto, kitchenId: number) {
    if (!updateOrderDto.clientId) return;

    const customer = await this.customerRepository.getCustomerById(updateOrderDto.clientId);
    if (customer.kitchenId !== kitchenId) {
      throw CustomError.badRequest("The customer does not belong to this kitchen");
    }
  }

  /** Validar que los detalles existan antes de actualizar */
  private async validateOrderDetails(updateOrderDto: UpdateOrderDto, orderId: number) {
    let orderDetailsByOrderId: OrderDetail[] = [];

    if (updateOrderDto.orderDetails && updateOrderDto.orderDetails.length > 0) {
      orderDetailsByOrderId = await this.orderRepository.getOrderDetailsByOrderId(orderId);

      const dishesId = orderDetailsByOrderId.map((d) => d.dishId);
      const dishes = await this.dishRepository.getDishesById(dishesId);

      for (const detailDto of updateOrderDto.orderDetails) {
        const existingDetail = orderDetailsByOrderId.find(
          (d) => d.orderDetailId === detailDto.orderDetailId
        );
        if (!existingDetail) {
          throw CustomError.badRequest(`Order detail ${detailDto.orderDetailId} not found`);
        }

        const dish = dishes.find((d) => d.dishId === existingDetail.dishId);
        if (!dish) {
          throw CustomError.notFound(`Dish with id ${existingDetail.dishId} not found`);
        }

        //FIXME: Cuando el control de raciones de PlatilloProgramado este activo. Validar que orderPortion no sea mayor al limiteRaciones de PlatilloProgramado
            // const requestedServings =
            //     detailDto.fullPortion !== undefined || detailDto.halfPortion !== undefined
            //     ? (detailDto.fullPortion ?? 0) + (detailDto.halfPortion ?? 0) * 0.5
            //     : (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;

            // const previousServings = (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
            // const dish = dishes.find(d => d.dishId === existingDetail.dishId);
            // if (!dish) {
            //     throw CustomError.notFound(`Dish with id ${existingDetail.dishId} not found`);
            // }

            // const servingsDifference = requestedServings - previousServings;
            // if (servingsDifference > 0 && servingsDifference > dish.availableServings) {
            //     throw CustomError.badRequest(`Not enough servings available for dish ${dish.name}`);
            // }
      }
    }

    return orderDetailsByOrderId;
  }

  /** Notificar a la cocina que la orden fue actualizada */
  private async notifyOrderUpdated(updatedOrder: any, originalOrder?: any) {
    if (!originalOrder) return;

  // Campos que nos interesan monitorear
  const keysToWatch = [
    "status",
    "isPaid",
    "orderType",
    "paymentType",
    "clientId",
    "notes",
  ];

  const changes: Record<string, any> = { orderId: updatedOrder.orderId };

  for (const key of keysToWatch) {
    // Algunos nombres cambian entre tu dominio y la BD (ajústalo si es necesario)
    const oldValue = originalOrder[key];
    const newValue = updatedOrder[key];

    if (newValue !== undefined && newValue !== oldValue) {
      changes[key] = newValue;
    }
  }

  // Solo notificamos si hubo cambios relevantes
  if (Object.keys(changes).length > 1) {
    this.wssService.sendMessageToKitchen(
      updatedOrder.kitchenId,
      "ORDER_UPDATED",
      changes
    );
  }
  }

  private async notifyInstanceOrderUpdated(updatedOrder: Order) {
    const orderDto = await this.mapOrderToDto(updatedOrder);
    this.wssService.sendMessageToKitchen(
      updatedOrder.kitchenId,
      "ORDER_UPDATED",
      orderDto
    );
  }

//   /** Notificar el recuento actualizado de porciones de los platillos */
//   private async notifyDishPortionsUpdated(updatedOrder: any, updateOrderDto: UpdateOrderDto) {
//     if (!updateOrderDto.orderDetails?.length) return;

//     const { startUTC, endUTC } = luxonAdapter.getDayRangeUtcByZone("America/Merida");

//     for (const detail of updateOrderDto.orderDetails) {
//       const portions = await this.orderRepository.getOrderedServingsByDishAndDateRange(
//         detail.dishId,
//         startUTC,
//         endUTC
//       );

//       this.wssService.sendMessageToKitchen(
//         updatedOrder.kitchenId,
//         "DISH_PORTIONS_UPDATED",
//         {
//           dishId: detail.dishId,
//           recuentoPorciones: portions.dishTotalServings,
//         }
//       );
//     }
//   }

    private async mapOrderToDto(order: Order): Promise<OrderResponseDto> {
      const orderResponseDto = await this._orderMapper.mapOrderToDto(order);
      return orderResponseDto;
    }
}