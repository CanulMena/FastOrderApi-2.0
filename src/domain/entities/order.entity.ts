import { CustomError } from "../errors";

const validOrderStatus = ['PENDIENTE', 'CANCELADO', 'ENTREGADO'] as const;
export type OrderStatus = typeof validOrderStatus[number]; //type

const TypeDelivery = ['ENVIO', 'PRESENCIAL'] as const;
export type OrderDeliveryType = typeof TypeDelivery[number]; //type

const PaymentType = ['EFECTIVO', 'TARJETA', 'FIADO'] as const;
export type OrderPaymentType = typeof PaymentType[number]; //type

export class Order {
  public static readonly OrderValidOrderStatus = validOrderStatus;
  public static readonly OrderPaymentType = PaymentType;
  public static readonly OrderTypeDelivery = TypeDelivery;
  constructor(
    public orderId: number, // Identificador único del pedido
    public date: Date, // Fecha del pedido
    public status: OrderStatus, // Estado del pedido
    public deliveryType: OrderDeliveryType                , // Tipo de pedido
    public paymentType: OrderPaymentType, // Tipo de pago
    public isPaid: boolean, // Si el pedido está pagado
    //*public orderDetails: OrderDetail[],
    public clientId: number, // Relación al cliente que hizo el pedido
    public kitchenId: number, // Relación a la cocina para identificar de dónde es el pedido
    //TODO: agregar los pagos pendientes
  ) {}

  public static isValidOrderSatus(status: any): status is OrderStatus {
    return this.OrderValidOrderStatus.includes(status);
  }

  public static isValidOrderPaymentType(paymentType: any): paymentType is OrderPaymentType {
    return this.OrderPaymentType.includes(paymentType);
  }

  public static isValidOrderDeliveryType(deliveryType: any): deliveryType is OrderDeliveryType {
    return this.OrderTypeDelivery.includes(deliveryType);
  }

  static fromJson( object: {[key: string] : any} ): Order {
    const { id, fecha, estado, tipoEntrega, tipoPago, esPagado,
      clienteId, cocinaId } = object;
    let newDate;
    if(!id) throw CustomError.badRequest('Missing id');
    if(!fecha) throw CustomError.badRequest('Missing fecha');
    newDate = new Date(fecha);
    if ( isNaN( newDate.getTime() ) ) throw CustomError.badRequest('date is not a valid date - format: yyyy-mm-dd hh:mm:ss');
    if(!estado) throw CustomError.badRequest('Missing estado');
    if(!Order.isValidOrderSatus(estado)) throw CustomError.badRequest(`Invalid status - valid values: ${this.OrderValidOrderStatus}`);
    if(!tipoEntrega) throw CustomError.badRequest('Missing tipoEntrega');
    if(!Order.isValidOrderDeliveryType(tipoEntrega)) throw CustomError.badRequest(`Invalid order type - valid values: ${Order.OrderTypeDelivery}`);
    if(!tipoPago) throw CustomError.badRequest('Missing tipoPago');
    if(!Order.isValidOrderPaymentType(tipoPago)) throw CustomError.badRequest(`Invalid payment type - valid values: ${Order.OrderPaymentType}`);
    if(esPagado === undefined) throw CustomError.badRequest('Missing esPagado');
    if(!clienteId) throw CustomError.badRequest('Missing clienteId');
    if(!cocinaId) throw CustomError.badRequest('Missing cocinaId');
    return new Order(
      id,
      fecha,
      estado,
      tipoEntrega,
      tipoPago,
      esPagado,
      clienteId,
      cocinaId
    );
  }
  
}