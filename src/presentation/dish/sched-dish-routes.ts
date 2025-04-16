import { Router } from "express";
import { SchedDishController } from "./sched-dish-controller";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PostgresUserDataSourceImpl } from "../../infrastructure/datasource";
import { UserRepositoryImpl } from "../../infrastructure/repository";
import { rolesConfig } from "../../configuration";

export class SchedDishRoutes {
  static get routes(): Router {
    const router = Router();

    const schedDishController = new SchedDishController();

    const userDataSourceImpl = new PostgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDataSourceImpl);

    const authMiddleware = new AuthMiddleware(userRepositoryImpl);
    const roles = rolesConfig;

    router.post(
      '/register', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      schedDishController.postSchedDish
    );

    return router;

  }
}