import { OrderDatasource } from "../../domain/datasource";
import { CreateOrderDto, UpdateOrderDto } from "../../domain/dtos";
import { Order, OrderDetail } from "../../domain/entities";
import { OrderRepository } from "../../domain/repositories";

export class OrderRepositoryImpl implements OrderRepository{

  constructor(
    private datasource: OrderDatasource
  ) {}

  createOder(order: CreateOrderDto): Promise<Order> {
    return this.datasource.createOder(order);
  }

  getOrderById(orderId: number): Promise<Order> {
    return this.datasource.getOrderById(orderId);
  }

  updateOrder(updateOrder: UpdateOrderDto, orderDetailsEntity: OrderDetail[]): Promise<Order> {
    return this.datasource.updateOrder(updateOrder, orderDetailsEntity);
  }

  getOrderDetailById(orderDetailId: number): Promise<OrderDetail> {
    return this.datasource.getOrderDetailById(orderDetailId);
  }

<<<<<<< HEAD
  deleteOrder(orderId: number): Promise<Order> {
    return this.datasource.deleteOrder(orderId);
=======
  getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]> {
    return this.datasource.getOrderDetailsByOrderId(orderId);
>>>>>>> 83923f3dc306711dea9fe9c8a887d1afe9c31de3
  }

}