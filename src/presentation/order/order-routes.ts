import { Router } from "express";
import { OrderController } from "./order-controller";
import { PostgresCustomerDatasourceImpl, PostgresDishDatasourceImpl, PostgresOrderDatasourceImpl, PostgresUserDataSourceImpl } from "../../infrastructure/datasource";
import { CustomerRepositoryImpl, DishRepositoryImpl, OrderRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { AuthMiddleware } from "../middlewares/index";
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

    router.get(
      '/get-all',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      orderController.getOrders
    );

    router.get(
      '/get-orders-day',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      orderController.getOrdersDay
    );

    router.get(
      'get-by-id/:orderId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      orderController.getOrderById
    );

    router.put(
      '/update/:orderId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      // authMiddleware.validateKitchenAccess,
      orderController.updateOrder
    );

    router.delete(
      '/delete/:orderId', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      authMiddleware.validateKitchenAccess,
      orderController.deleteOrder
    )

    router.post(
      '/order-detail/register',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      // authMiddleware.validateKitchenAccess,
      orderController.createOrderDetail
    )

    router.delete(
      '/delete-order-detail/:orderDetailId', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.AllRoles),
      orderController.deleteOrderDetail
    )
    return router;
  }
}