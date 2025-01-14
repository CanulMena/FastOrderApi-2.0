import { OrderDatasource } from "../../domain/datasource";
import { CreateOrderDto } from "../../domain/dtos";
import { Order } from "../../domain/entities";
import { OrderRepository } from "../../domain/repositories";

export class OrderRepositoryImpl implements OrderRepository{

  constructor(
    private datasource: OrderDatasource
  ) {}

  createOder(order: CreateOrderDto): Promise<Order> {
    return this.datasource.createOder(order);
  }
}