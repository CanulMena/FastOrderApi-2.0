import { Router } from "express";
import { OrderController } from "./order-controller";
import { PostgresCustomerDatasourceImpl, PostgresDishDatasourceImpl, PostgresOrderDatasourceImpl, PostgresUserDataSourceImpl } from "../../infrastructure/datasource";
import { CustomerRepositoryImpl, DishRepositoryImpl, OrderRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { rolesConfig } from '../../configuration/roles-config';

export class OrderRoutes {
  public static get routes(): Router {
    const router = Router();

    const orderDatasource = new PostgresOrderDatasourceImpl();
    const orderRepository = new OrderRepositoryImpl(orderDatasource);

    
    const userDatasource = new PostgresUserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const customerDatasource = new PostgresCustomerDatasourceImpl();
    const customerRepository = new CustomerRepositoryImpl(customerDatasource);

    const dishDatasource = new PostgresDishDatasourceImpl();
    const dishRepository = new DishRepositoryImpl(dishDatasource);

    const orderController = new OrderController(orderRepository, customerRepository, dishRepository);

    const authMiddleware = new AuthMiddleware(userRepository);

    router.post(
      '/register',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      authMiddleware.validateKitchenAccess,
      orderController.registerOrder
    );
    
    return router;
  }
}