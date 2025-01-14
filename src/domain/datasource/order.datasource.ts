import { CreateOrderDto } from "../dtos";
import { Order } from "../entities";

export abstract class OrderDatasource {
  abstract createOder(order: CreateOrderDto): Promise<Order>;
}