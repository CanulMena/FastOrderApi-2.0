import { Router } from "express";
import { SchedDishController } from "./sched-dish-controller";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PostgresDishDatasourceImpl, PostgresOrderDatasourceImpl, PostgresSchedDishDataSourceImpl, PostgresUserDataSourceImpl } from "../../infrastructure/datasource";
import { DishRepositoryImpl, OrderRepositoryImpl, SchedDishRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { rolesConfig } from "../../configuration";

export class SchedDishRoutes {
  static get routes(): Router {
    const router = Router();

    const userDataSourceImpl = new PostgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDataSourceImpl);
    
    const dishDatasourceImpl = new PostgresDishDatasourceImpl();
    const dishRepositoryImpl = new DishRepositoryImpl(dishDatasourceImpl);
    
    const schedDishDatasourceImpl = new PostgresSchedDishDataSourceImpl();
    const schedDishRepositoryImpl = new SchedDishRepositoryImpl(schedDishDatasourceImpl);

    const orderDatasourceImpl = new PostgresOrderDatasourceImpl();
    const orderRepositoryImpl = new OrderRepositoryImpl(orderDatasourceImpl);

    const authMiddleware = new AuthMiddleware(userRepositoryImpl);
    const roles = rolesConfig;
    
    const schedDishController = new SchedDishController(
      dishRepositoryImpl,
      schedDishRepositoryImpl,
      orderRepositoryImpl
    );

    router.post(
      '/register', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      schedDishController.postSchedDish
    );

    router.get(
      '/available-dishes', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.AllRoles),
      schedDishController.getAvailableDishes
    );

    router.get(
      '/available-dishes-for-week',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      schedDishController.getAvailableDishesForWeek
    );

    router.get(
      '/get-by-dish-id/:dishId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      schedDishController.getSchedDishesByDishId
    );

    router.put(
      '/update/:id',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      schedDishController.updateSchedDish
    );

    return router;

  }
}