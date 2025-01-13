import { Router } from "express";
import { OrderController } from "./order-controller";
import { PostgresOrderDatasourceImpl } from "../../infrastructure/datasource";
import { OrderRepositoryImpl } from "../../infrastructure/repository";

export class OrderRoutes {
  public static get routes(): Router {
    const router = Router();

    const orderDatasource = new PostgresOrderDatasourceImpl();
    const orderRepository = new OrderRepositoryImpl(orderDatasource);

    const orderController = new OrderController(orderRepository);

    router.post('/register', orderController.registerOrder);
    
    return router;
  }
}