
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

  static create( object: {[key: string] : any} ): [string?, CreateOrderDto?] {
    const { date, status, orderType, paymentType, isPaid, clientId, kitchenId } = object;
    let newDate;
    if ( !date ) return ['date is required'];
    newDate = new Date(date);
    if ( isNaN( newDate.getTime() ) ) return ['date is not a valid date - format: yyyy-mm-dd hh:mm:ss'];
    if ( !status ) return ['status is required'];
    if (!this.isValidOrderSatus(status)) return ['Invalid status'];
    if ( !orderType ) return ['orderType is required'];
    if (!this.isValidDeliveryType(orderType)) return ['Invalid order type'];
    if ( !paymentType ) return ['paymentType is required'];
    if (!this.isValidPaymentType(paymentType)) return ['Invalid payment type'];
    if ( isPaid === undefined ) return ['isPaid is required'];
    if ( !clientId ) return ['clientId is required'];
    if ( !kitchenId ) return ['kitchenId is required'];

    return [undefined, new CreateOrderDto(date, status, orderType, paymentType, isPaid, clientId, kitchenId)];
  }
}