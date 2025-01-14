import { CreateOrderDto } from "../dtos";
import { Order } from "../entities";

export abstract class OrderRepository {
  abstract createOder(order: CreateOrderDto): Promise<Order>;
}