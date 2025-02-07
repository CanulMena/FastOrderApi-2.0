import { CreateOrderDto, UpdateOrderDto } from "../dtos";
import { Order, OrderDetail } from "../entities";

export abstract class OrderDatasource {
  abstract createOder(order: CreateOrderDto): Promise<Order>;
  abstract updateOrder(order: UpdateOrderDto, orderDetailsEntity: OrderDetail[]): Promise<Order>;
  abstract getOrderById(orderId: number): Promise<Order>;
  abstract getOrderDetailById(orderDetailId: number): Promise<OrderDetail>;
  abstract deleteOrder(orderId: number): Promise<Order>;
  abstract getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]>
}