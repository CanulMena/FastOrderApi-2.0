import { CustomError } from "../errors";

const validOrderStatus = ['PENDING', 'COMPLETED', 'CANCELED'] as const;
type OrderStatus = typeof validOrderStatus[number]; //type

const validDeliveryType = ['IN_PERSON', 'DELIVERY'] as const;
type OrderDeliveryType = typeof validDeliveryType[number]; //type

const validPaymentType = ['CASH', 'CARD', 'ON_CREDIT'] as const;
type OrderPaymentType = typeof validPaymentType[number]; //type

export class Order {
  public static readonly validOrderStatus = validOrderStatus;
  public static readonly validOrderType = validDeliveryType;
  public static readonly validPaymentType = validPaymentType;
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
      return Order.validOrderStatus.includes(status);
    }

    public static isValidOrderDeliveryType(deliveryType: any): deliveryType is OrderDeliveryType {
      return Order.validOrderType.includes(deliveryType);
    }

    public static isValidPaymentType(paymentType: any): paymentType is OrderPaymentType {
      return Order.validPaymentType.includes(paymentType);
    }

  static fromJson( object: {[key: string] : any} ): Order {
    const { id, fecha, estado, tipoEntrega, tipoPago, esPagado,
      clienteId, cocinaId } = object;

    if(!id) throw CustomError.badRequest('Missing id');
    if(!fecha) throw CustomError.badRequest('Missing fecha');
    //TODO: validar fecha sea correcta
    if(!estado) throw CustomError.badRequest('Missing estado');
    if(!Order.isValidOrderSatus(estado)) throw CustomError.badRequest('Invalid status');
    if(!tipoEntrega) throw CustomError.badRequest('Missing tipoEntrega');
    if(!Order.isValidOrderDeliveryType(tipoEntrega)) throw CustomError.badRequest('Invalid order type');
    if(!tipoPago) throw CustomError.badRequest('Missing tipoPago');
    if(!Order.isValidPaymentType(tipoPago)) throw CustomError.badRequest('Invalid payment type');
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