import { Router } from "express";
import { OrderController } from "./order-controller";
import { PostgresOrderDatasourceImpl, PostgresUserDataSourceImpl } from "../../infrastructure/datasource";
import { OrderRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { rolesConfig } from '../../configuration/roles-config';

export class OrderRoutes {
  public static get routes(): Router {
    const router = Router();

    const orderDatasource = new PostgresOrderDatasourceImpl();
    const orderRepository = new OrderRepositoryImpl(orderDatasource);

    const orderController = new OrderController(orderRepository);

    const userDatasource = new PostgresUserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

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