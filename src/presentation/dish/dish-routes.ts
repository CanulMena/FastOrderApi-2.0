import { Router } from "express";
import { DishController } from "./dish-controller";
import { PostgresSideDatasourceImpl, PostgresUserDataSourceImpl, PostgresDishDatasourceImpl } from "../../infrastructure/datasource";
import { DishRepositoryImpl, SideRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { rolesConfig } from "../../configuration";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { GetSide } from "../../domain/use-cases/side";
import { PostgresDishSideDatasourceImpl } from "../../infrastructure/datasource/postgres-dish-side.datasource.impl";
import { DishSideRespositoryImpl } from "../../infrastructure/repository/dish-side.repository.impl";

export class DishRoutes {
  static get routes(): Router {
    const router = Router();

    const dishDatasource = new PostgresDishDatasourceImpl();
    const dishRepository = new DishRepositoryImpl(dishDatasource);

    const sideDatasource = new  PostgresSideDatasourceImpl();
    const sideRepository = new SideRepositoryImpl(sideDatasource);

    const dishSideDatasource = new PostgresDishSideDatasourceImpl();
    const dishSideRepository = new DishSideRespositoryImpl(dishSideDatasource);

    const getSide = new GetSide(sideRepository);

    const dishController = new DishController(dishRepository, dishSideRepository, getSide);

    const userDataSourceImpl = new PostgresUserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDataSourceImpl);

    const authMiddleware = new AuthMiddleware(userRepository);

    const roles = rolesConfig;

    router.post(
      '/register', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      authMiddleware.validateKitchenAccess,
      dishController.postDish,
    );

    router.get(
      '/get-by-id/:dishId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.AllRoles),
      
      dishController.getDishById
    );


    router.delete(
      '/delete-by-id/:dishId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      dishController.deleteDish
    )
    return router;
  }
}