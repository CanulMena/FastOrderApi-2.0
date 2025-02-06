import { CreateOrderDto, UpdateOrderDto } from "../dtos";
import { Order, OrderDetail } from "../entities";

export abstract class OrderDatasource {
  abstract createOder(order: CreateOrderDto): Promise<Order>;
  abstract updateOrder(order: UpdateOrderDto, orderDetailsEntity: OrderDetail[]): Promise<Order>;
  abstract getOrderById(orderId: number): Promise<Order>;
  abstract getOrderDetailById(orderDetailId: number): Promise<OrderDetail>;
<<<<<<< HEAD
  abstract deleteOrder(orderId: number): Promise<Order>;
=======
  abstract getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]>
>>>>>>> 83923f3dc306711dea9fe9c8a887d1afe9c31de3
}