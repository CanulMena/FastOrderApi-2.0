
export class Order {
  constructor(
    public orderId: number, // Identificador único del pedido
    public clientId: number, // Relación al cliente que hizo el pedido
    public date: Date, // Fecha del pedido
    public orderType: 'IN_PERSON' | 'DELIVERY', // Tipo de pedido
    public paymentType: 'CASH' | 'CARD' | 'ON_CREDIT', // Tipo de pago
    public status: 'PENDING' | 'COMPLETED' | 'CANCELED', // Estado del pedido
    public kitchenId: number, // Relación a la cocina para identificar de dónde es el pedido
  ) {}
  //TODO: Create from object to create a new instance of the class
}