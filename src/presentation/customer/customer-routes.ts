import { Router } from "express";
import { CustomerController } from "./customer-controller";
import { PostgresCustomerDatasourceImpl, PostgresKitchenDatasourceImpl } from '../../infrastructure/datasource';
import { CustomerRepositoryImpl, KitchenRepositoryImpl } from "../../infrastructure/repository";

export class CustomerRoutes {

  static get routes(): Router {
    
    const router = Router();
    const customerDatasourceImpl = new PostgresCustomerDatasourceImpl();
    const customerRepositoryImpl = new CustomerRepositoryImpl(customerDatasourceImpl);

    const kitchenDatasourceImpl = new PostgresKitchenDatasourceImpl();
    const kitchenRepositoryImpl = new KitchenRepositoryImpl(kitchenDatasourceImpl);

    const routesController = new CustomerController(
      kitchenRepositoryImpl,
      customerRepositoryImpl
    );

    router.post('/register', routesController.postCustomer);
    
    return router;
  }
}