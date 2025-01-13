import { CreateOrderDto } from "../../dtos";
import { OrderRepository } from "../../repositories";

interface RegisterOrderUseCase {
  execute(order: CreateOrderDto): Promise<object>;
}

export class RegisterOrder implements RegisterOrderUseCase {
  constructor(
    private orderRepository: OrderRepository
  ) {}

  async execute(order: CreateOrderDto): Promise<object> {
    return await this.orderRepository.createOder(order);
  }
}