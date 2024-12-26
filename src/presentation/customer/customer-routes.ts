import { Router } from "express";
import { CustomerController } from "./customer-controller";
import { PostgresCustomerDatasourceImpl, PostgresKitchenDatasourceImpl, PosgresUserDataSourceImpl } from '../../infrastructure/datasource';
import { CustomerRepositoryImpl, KitchenRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { rolesConfig } from "../../configuration";

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

    const roles = rolesConfig;
    
    router.post( // admin
      '/register', 
      authMiddleware.validateJWT,
      authMiddleware.validateRole(roles.Admin),
      authMiddleware.validateKitchenAccess,
      routesController.postCustomer
    );

    //TODO: Implementar los siguientes endpoints
    //get-customers-by-kitchenId //-todos      Obtener todos los clientes de una cocina

    //put-customer-by-CustomerId. //admin      Actualizar un cliente por id -> validar el acceso a la cocina desde el caso de uso por que el request no tiene el id de la cocina

    //delete-customer-by-Customerid //admin    Eliminar un cliente por id -> validar el acceso a la cocina desde el caso de uso por que el request no tiene el id de la cocina

    return router;
  }
}