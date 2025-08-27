import { OrderDatasource } from "../../domain/datasource";
import { CreateOrderDetailsDto, CreateOrderDto, PaginationDto, UpdateOrderDto } from "../../domain/dtos";
import { OrderRange } from "../../domain/dvo";
import { Order, OrderDetail } from "../../domain/entities";
import { OrderRepository } from "../../domain/repositories";

export class OrderRepositoryImpl implements OrderRepository{

  constructor(
    private datasource: OrderDatasource
  ) {}
  getKitchenOrdersInRange(kitchenId: number, orderRange: OrderRange, paginationDto: PaginationDto): Promise<Order[]> {
    return this.datasource.getKitchenOrdersInRange(kitchenId, orderRange, paginationDto);
  }

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

  deleteOrder(orderId: number, orderDetailsEntity: OrderDetail[]): Promise<Order> {
    return this.datasource.deleteOrder(orderId, orderDetailsEntity);
  }
  
  getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]> {
    return this.datasource.getOrderDetailsByOrderId(orderId);
  }

  createOrderDetail(orderDetail: CreateOrderDetailsDto): Promise<OrderDetail> {
    return this.datasource.createOrderDetail(orderDetail);
  }

  deleteOrderDetail(orderDetailId: number): Promise<OrderDetail> {
    return this.datasource.deleteOrderDetail(orderDetailId);
  }

  getOrders(pagination: PaginationDto): Promise<Order[]> {
    return this.datasource.getOrders(pagination);
  }

  getOrdersCount(): Promise<number> {
    return this.datasource.getOrdersCount();
  }

  getOrdersByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.datasource.getOrdersByKitchenIdCount(kitchenId);
  }

  getOrdersByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Order[]> {
    return this.datasource.getOrdersByKitchenId(kitchenId, pagination);
  }

  getOrderedServingsByDishAndDateRange(dishId: number, startDate: Date, endDate: Date): 
  Promise<{
    dishId: number,
    dishTotalServings: number
  }> {
    return this.datasource.getOrderedServingsByDishAndDateRange(dishId, startDate, endDate);
  }
}