import { Router } from "express";
import { DishController } from "./dish-controller";
import { PostgresSideDatasourceImpl, PostgresUserDataSourceImpl, PostgresDishDatasourceImpl, PostgresDishSideDatasourceImpl, CloudinaryFileUploadDataSourceImpl } from "../../infrastructure/datasource";
import { DishRepositoryImpl, DishSideRespositoryImpl, FileUploadRepositoryImpl, SideRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { rolesConfig } from "../../configuration";
import { AuthMiddleware, FileUploadMiddleware, TypeMiddleware } from "../middlewares/index";

export class DishRoutes {
  static get routes(): Router {
    const router = Router();

    const dishDatasource = new PostgresDishDatasourceImpl();
    const dishRepository = new DishRepositoryImpl(dishDatasource);

    const sideDatasource = new  PostgresSideDatasourceImpl();
    const sideRepository = new SideRepositoryImpl(sideDatasource);

    const dishSideDatasource = new PostgresDishSideDatasourceImpl();
    const dishSideRepository = new DishSideRespositoryImpl(dishSideDatasource);

    const cloudinaryDatasource = new CloudinaryFileUploadDataSourceImpl();
    const fileUploadRepository = new FileUploadRepositoryImpl(cloudinaryDatasource);

    const dishController = new DishController(
      dishRepository, 
      dishSideRepository, 
      sideRepository,
      fileUploadRepository
    );

    const userDataSourceImpl = new PostgresUserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDataSourceImpl);

    const authMiddleware = new AuthMiddleware(userRepository);

    const roles = rolesConfig;

    //TODO: VALIDAR SI LA INSERSIÓN DE LOS MIDDLEWARES SI SE PEUDE REFACTORIZAR
    router.post(
      '/register/:type', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      authMiddleware.validateKitchenAccess,
      TypeMiddleware.validTypes(['dishes']),
      FileUploadMiddleware.containFiles,
      dishController.postDish,
    );

    router.get(
      '/get-by-id/:dishId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.AllRoles),
      
      dishController.getDishById
    );

    router.get(
      '/get-all',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.AllRoles),
      dishController.getDishes
    );

    router.delete(
      '/delete-by-id/:dishId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      dishController.deleteDish
    );

    router.put(
      '/update-dish/:dishId',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      dishController.updateDish
    );

    return router;
  }
}