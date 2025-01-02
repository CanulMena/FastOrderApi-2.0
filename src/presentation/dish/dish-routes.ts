import { Router } from "express";
import { DishController } from "./dish-controller";
import { PostgresDishDatasourceImpl } from "../../infrastructure/datasource";
import { DishRepositoryImpl } from "../../infrastructure/repository";

export class DishRoutes {
  static get routes(): Router {
    const router = Router();

    const dishDatasource = new PostgresDishDatasourceImpl();
    const dishRepository = new DishRepositoryImpl(dishDatasource);

    const dishController = new DishController(dishRepository);

    router.post('/register', dishController.postDish);

    return router;
  }
}