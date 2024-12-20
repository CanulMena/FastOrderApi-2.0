import { Router } from "express";
import { CustomerController } from "./customer-controller";
import { PostgresCustomerDatasourceImpl, PostgresKitchenDatasourceImpl, PosgresUserDataSourceImpl } from '../../infrastructure/datasource';
import { CustomerRepositoryImpl, KitchenRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class CustomerRoutes {

  static get routes(): Router {
    
    const router = Router();
    const customerDatasourceImpl = new PostgresCustomerDatasourceImpl();
    const customerRepositoryImpl = new CustomerRepositoryImpl(customerDatasourceImpl);

    const kitchenDatasourceImpl = new PostgresKitchenDatasourceImpl();
    const kitchenRepositoryImpl = new KitchenRepositoryImpl(kitchenDatasourceImpl);

    const userDatasourceImpl = new PosgresUserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasourceImpl);

    const routesController = new CustomerController(
      kitchenRepositoryImpl,
      customerRepositoryImpl
    );

    const authMiddleware = new AuthMiddleware(userRepository);
    
    router.post('/register', authMiddleware.validateJWT, routesController.postCustomer); //esta ruta tiene un request, response y next escuchando?
    
    return router;
  }
}