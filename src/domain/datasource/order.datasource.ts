import { CreateOrderDto } from "../dtos";
import { Order } from "../entities";

export abstract class OrderDataSource {
  abstract crateOder(order: CreateOrderDto): Promise<Order>;
}