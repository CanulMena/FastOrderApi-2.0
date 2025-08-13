import { regularExps } from "../../../configuration/regular-exp";
import { Order, OrderDeliveryType, OrderPaymentType, OrderStatus } from "../../entities";
import { CreateOrderDetailsDto } from "./create-order-details.dto";

export class CreateOrderDto {
  constructor(
    public date: Date, // Fecha del pedido
    public status: OrderStatus, // Estado del pedido
    public orderType: OrderDeliveryType, // Tipo de pedido
    public paymentType: OrderPaymentType, // Tipo de pago
    public isPaid: boolean, // Si el pedido está pagado
    public orderDetails: CreateOrderDetailsDto[], // Detalles del pedido
    public clientId: number, // Relación al cliente que hizo el pedido
    public kitchenId: number, // Relación a la cocina para identificar de dónde es el pedido
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateOrderDto?] {
    const { date, status, orderType, paymentType, isPaid, orderDetails, clientId, kitchenId } = object;

    // Validar fecha
    if (!date) return ['date is required'];

    if (!regularExps.iso8601.test(date)) return ['date must be in ISO 8601 format - example: 2023-10-01T12:00:00Z'];

    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) return ['date is not a valid date - example: 2023-10-01T12:00:00Z'];

    // Validar estado del pedido
    if (!status) return ['status is required'];
    if (!Order.isValidOrderSatus(status)) return [`Invalid status - valid values: ${Order.OrderValidOrderStatus}`];

    // Validar tipo de pedido
    if (!orderType) return ['orderType is required'];
    if (!Order.isValidOrderDeliveryType(orderType)) return [`Invalid order type - valid values: ${Order.OrderTypeDelivery}`];

    // Validar tipo de pago
    if (!paymentType) return ['paymentType is required'];
    if (!Order.isValidOrderPaymentType(paymentType)) return [`Invalid payment type - valid values: ${Order.OrderPaymentType}`];

    // Validar si está pagado
    if (isPaid === undefined) return ['isPaid is required'];

    // Validar detalles del pedido
    if (!orderDetails) return ['orderDetails is required'];
    if (!Array.isArray(orderDetails)) return ['orderDetails must be an array'];
    if (orderDetails.length === 0) return ['orderDetails must have at least one element'];

    const validatedDetails: CreateOrderDetailsDto[] = [];
    for (const detail of orderDetails) {
      const [error, validDetail] = CreateOrderDetailsDto.create(detail);
      if (error) return [error]; // Detener ejecución si hay un error
      if (validDetail) validatedDetails.push(validDetail);
    }

    // Validar cliente y cocina
    if (!clientId) return ['clientId is required'];
    if (isNaN(clientId)) return ['clientId must be a number'];
    if (!kitchenId) return ['kitchenId is required'];
    if (isNaN(kitchenId)) return ['kitchenId must be a number'];

    // Crear instancia válida
    return [undefined, new CreateOrderDto(newDate, status, orderType, paymentType, isPaid, validatedDetails, clientId, kitchenId)];
  }
}
