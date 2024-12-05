import { Router } from "express";
import { PosgresUserDataSourceImpl } from "../../infrastructure/datasource/index";
import { UserRepositoryImpl } from '../../infrastructure/repository/user.repository.impl';
import { AuthController } from "./auth-controller";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const userDatasourceImpl = new PosgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDatasourceImpl);
    const authController = new AuthController(userRepositoryImpl);

    router.post('/register', authController.registerUser);
    router.post('/login', authController.loginUser);
    router.get('/validate-email:token', authController.validateEmail);

    return router;
  }
}