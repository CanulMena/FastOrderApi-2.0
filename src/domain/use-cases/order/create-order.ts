import { CreateOrderDto } from "../../dtos";
import { CustomError } from "../../errors";
import { CustomerRepository, OrderRepository } from "../../repositories";

interface RegisterOrderUseCase {
  execute(order: CreateOrderDto): Promise<object>;
}

export class RegisterOrder implements RegisterOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository
  ) {}

  async execute(order: CreateOrderDto): Promise<object> {

    const customer = await this.customerRepository.getCustomerById(order.clientId);
    if ( customer !== null && customer.kitchenId !== order.kitchenId ) 
      throw CustomError.unAurothorized(`El cliente con id ${customer.customerId} no pertenece a la cocina del pedido`);
    
    return await this.orderRepository.createOder(order);
  }
}