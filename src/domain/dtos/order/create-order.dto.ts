import { CustomError } from "../../errors";

const DtovalidOrderStatus = ['PENDIENTE', 'CANCELADO', 'ENTREGADO'] as const;
type DtoOrderStatus = typeof DtovalidOrderStatus[number]; //type

const DtoTypeDelivery = ['ENVIO', 'PRESENCIAL'] as const;
type DtoDeliveryType = typeof DtoTypeDelivery[number]; //type

const DtoPaymentType = ['EFECTIVO', 'TARJETA', 'FIADO'] as const;
type DtoPaymentType = typeof DtoPaymentType[number]; //type

export class CreateOrderDto {

  private static readonly dtoValidOrderStatus = DtovalidOrderStatus;
  private static readonly dtoPaymentType = DtoPaymentType;
  private static readonly dtoTypeDelivery = DtoTypeDelivery;

  constructor(
    public date: Date, // Fecha del pedido
    public status: DtoOrderStatus, // Estado del pedido
    public orderType: DtoDeliveryType, // Tipo de pedido
    public paymentType: DtoPaymentType, // Tipo de pago
    public isPaid: boolean, // Si el pedido está pagado
    //TODO: Agregar los detalles de pedido como opcionales
    public clientId: number, // Relación al cliente que hizo el pedido
    public kitchenId: number, // Relación a la cocina para identificar de dónde es el pedido
    //TODO: agregar los pagos pendientes
  ) {}

  private static isValidOrderSatus(status: any): status is DtoOrderStatus {
    return CreateOrderDto.dtoValidOrderStatus.includes(status);
  }

  private static isValidPaymentType(paymentType: any): paymentType is DtoPaymentType {
    return CreateOrderDto.dtoPaymentType.includes(paymentType);
  }

  private static isValidDeliveryType(deliveryType: any): deliveryType is DtoDeliveryType {
    return CreateOrderDto.dtoTypeDelivery.includes(deliveryType);
  }

  static fromJson( object: {[key: string] : any} ): CreateOrderDto {
    const { date, status, orderType, paymentType, isPaid, clientId, kitchenId } = object;
    let newDate;
    if ( !date ) throw CustomError.badRequest('date is required');
    newDate = new Date(date);
    if ( isNaN( newDate.getTime() ) ) throw CustomError.badRequest('CompletedAt is not a valid date');
    if ( !status ) throw CustomError.badRequest('status is required');
    if (!this.isValidOrderSatus(status)) throw CustomError.badRequest('Invalid status');
    if ( !orderType ) throw CustomError.badRequest('orderType is required');
    if (!this.isValidDeliveryType(orderType)) throw CustomError.badRequest('Invalid order type');
    if ( !paymentType ) throw CustomError.badRequest('paymentType is required');
    if (!this.isValidPaymentType(paymentType)) throw CustomError.badRequest('Invalid payment type');
    if ( isPaid === undefined ) throw CustomError.badRequest('isPaid is required');
    if ( !clientId ) throw CustomError.badRequest('clientId is required');
    if ( !kitchenId ) throw CustomError.badRequest('kitchenId is required');

    return new CreateOrderDto(date, status, orderType, paymentType, isPaid, clientId, kitchenId);
  }
}