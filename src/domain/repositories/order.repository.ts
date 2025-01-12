import { CreateOrderDto } from "../dtos";
import { Order } from "../entities";

export abstract class OrderRepository {
  abstract crateOder(order: CreateOrderDto): Promise<Order>;
}