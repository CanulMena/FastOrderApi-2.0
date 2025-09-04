import { OrderDeliveryType, OrderStatus, OrderPaymentType, Order } from '../../entities/order.entity'

export class OrderFiltersDto {

  private constructor(
    public orderStatus?: OrderStatus,
    public paymentType?: OrderPaymentType,
    public orderType?: OrderDeliveryType,
  ) {}

  // Factory method para crear el DTO desde query params
  public static create(object: { [key: string]: any }): [string?, OrderFiltersDto?] {
    const { orderStatus, paymentType, orderType } = object;

    if (orderStatus && !Order.OrderValidOrderStatus.includes(orderStatus)) {
      return [`Invalid orderStatus: ${orderStatus}, valid values are: ${Order.OrderValidOrderStatus.join(', ')}`, undefined];
    }

    if (paymentType && !Order.OrderPaymentType.includes(paymentType)) {
      return [`Invalid paymentType: ${paymentType}, valid values are: ${Order.OrderPaymentType.join(', ')}`, undefined];
    }

    if (orderType && !Order.OrderTypeDelivery.includes(orderType)) {
      return [`Invalid orderType: ${orderType}, valid values are: ${Order.OrderTypeDelivery.join(', ')}`, undefined];
    }

    return [undefined, new OrderFiltersDto(orderStatus, paymentType, orderType)];
  }
}
