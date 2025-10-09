// src/mappers/order.mapper.ts
import { Order } from '../entities/index';
import { OrderResponseDto } from '../dtos/index';
import { CustomerRepository, DishRepository } from '../repositories/index';

export class OrderMapper {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly dishRepository: DishRepository,
  ) {}

  async mapOrderToDto(order: Order): Promise<OrderResponseDto> {
    const customer = order.clientId
      ? await this.customerRepository.getCustomerById(order.clientId)
      : null;

    const orderDetails = await Promise.all(
      order.orderDetails.map(async (detail) => {
        const dish = await this.dishRepository.getDishById(detail.dishId);
        const subtotal =
          detail.portion * dish.pricePerServing +
          (detail.halfPortion ?? 0) * dish.pricePerHalfServing;

        return {
          orderDetailId: detail.orderDetailId,
          portion: detail.portion,
          dishId: detail.dishId,
          orderId: detail.orderId,
          halfPortion: detail.halfPortion,
          imagePath: dish.imagePath,
          subtotal,
          dishName: dish.name,
        };
      }),
    );

    const total = orderDetails.reduce((acc, d) => acc + d.subtotal, 0);

    return {
      orderId: order.orderId,
      date: order.date,
      status: order.status,
      deliveryType: order.deliveryType,
      paymentType: order.paymentType,
      isPaid: order.isPaid,
      clientName: customer?.name ?? 'Anónimo',
      kitchenId: order.kitchenId,
      clientId: order.clientId,
      total,
      orderDetails,
    };
  }
}
