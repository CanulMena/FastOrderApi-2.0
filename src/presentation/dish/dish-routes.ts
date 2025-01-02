import { Router } from "express";
import { DishController } from "./dish-controller";
import { PosgresUserDataSourceImpl, PostgresDishDatasourceImpl } from "../../infrastructure/datasource";
import { DishRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { rolesConfig } from "../../configuration";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class DishRoutes {
  static get routes(): Router {
    const router = Router();

    const dishDatasource = new PostgresDishDatasourceImpl();
    const dishRepository = new DishRepositoryImpl(dishDatasource);

    const dishController = new DishController(dishRepository);

    const userDataSourceImpl = new PosgresUserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDataSourceImpl);

    const authMiddleware = new AuthMiddleware(userRepository);

    const roles = rolesConfig;

    router.post(
      '/register', 
      authMiddleware.validateJWT,
      authMiddleware.validateKitchenAccess,
      authMiddleware.validateRole(roles.Admin),
      dishController.postDish,
    );

    return router;
  }
}