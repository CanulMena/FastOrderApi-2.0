import { CreateOrderDto } from "../dtos";
import { Order } from "../entities";

export abstract class OrderDatasource {
  abstract crateOder(order: CreateOrderDto): Promise<Order>;
}