import { Router } from "express";
import { PosgresUserDataSourceImpl } from "../../infrastructure/datasource/index";
import { UserRepositoryImpl } from '../../infrastructure/repository/user.repository.impl';
import { UserController } from "./user-controller";

export class UserRoutes {

  static get routes(): Router {
    const router = Router();

    const userDatasourceImpl = new PosgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDatasourceImpl);
    const userController = new UserController(userRepositoryImpl);

    // router.get('/', userController.getUsers);

    // router.get('/:id', userController.getUserById);

    router.post('/', userController.postUser);

    // router.delete('/:id', userController.deleteUser);

    // router.put('/:id', userController.updateUser);

    return router;
  }
}