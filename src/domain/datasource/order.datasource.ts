import { CreateOrderDto, UpdateOrderDto } from "../dtos";
import { Order } from "../entities";

export abstract class OrderDatasource {
  abstract createOder(order: CreateOrderDto): Promise<Order>;
  abstract updateOrder(order: UpdateOrderDto): Promise<Order>;
  abstract getOrderById(orderId: number): Promise<Order>;
}