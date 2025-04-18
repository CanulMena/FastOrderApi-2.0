import { Router } from "express";
import { SchedDishController } from "./sched-dish-controller";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PostgresDishDatasourceImpl, PostgresSchedDishDataSourceImpl, PostgresUserDataSourceImpl } from "../../infrastructure/datasource";
import { DishRepositoryImpl, SchedDishRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
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
    
    const authMiddleware = new AuthMiddleware(userRepositoryImpl);
    const roles = rolesConfig;
    
    const schedDishController = new SchedDishController(
      dishRepositoryImpl,
      schedDishRepositoryImpl
    );

    router.post(
      '/register', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      schedDishController.postSchedDish
    );

    return router;

  }
}