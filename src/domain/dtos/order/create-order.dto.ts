import { Order, OrderDeliveryType, OrderPaymentType, OrderStatus } from "../../entities";

export class CreateOrderDto {

  constructor(
    public date: Date, // Fecha del pedido
    public status: OrderStatus, // Estado del pedido
    public orderType: OrderDeliveryType, // Tipo de pedido
    public paymentType: OrderPaymentType, // Tipo de pago
    public isPaid: boolean, // Si el pedido está pagado
    //TODO: Agregar los detalles de pedido como opcionales
    public clientId: number, // Relación al cliente que hizo el pedido
    public kitchenId: number, // Relación a la cocina para identificar de dónde es el pedido
    //TODO: agregar los pagos pendientes
  ) {}

  static create( object: {[key: string] : any} ): [string?, CreateOrderDto?] {
    const { date, status, orderType, paymentType, isPaid, clientId, kitchenId } = object;
    let newDate;
    if ( !date ) return ['date is required'];
    newDate = new Date(date);
    if ( isNaN( newDate.getTime() ) ) return ['date is not a valid date - format: yyyy-mm-dd hh:mm:ss'];
    if ( !status ) return ['status is required'];
    if (!Order.isValidOrderSatus(status)) return [`Invalid status - valid values: ${Order.OrderValidOrderStatus}`];
    if ( !orderType ) return ['orderType is required'];
    if (!Order.isValidOrderDeliveryType(orderType)) return [`Invalid order type - valid values: ${Order.OrderTypeDelivery}`];
    if ( !paymentType ) return ['paymentType is required'];
    if (!Order.isValidOrderPaymentType(paymentType)) return [`Invalid payment type - valid values: ${Order.OrderPaymentType}`];
    if ( isPaid === undefined ) return ['isPaid is required'];
    if ( !clientId ) return ['clientId is required'];
    if ( isNaN(clientId) ) return ['clientId must be a number'];
    if ( !kitchenId ) return ['kitchenId is required'];
    if ( isNaN(kitchenId) ) return ['kitchenId must be a number'];

    return [undefined, new CreateOrderDto(newDate, status, orderType, paymentType, isPaid, clientId, kitchenId)];
  }
}