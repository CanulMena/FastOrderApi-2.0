import { Router } from "express";
import { CustomerController } from "./customer-controller";
import { PostgresCustomerDatasourceImpl } from '../../infrastructure/datasource';
import { CustomerRepositoryImpl } from "../../infrastructure/repository";

export class CustomerRoutes {

  static get routes(): Router {
    
    const router = Router();
    const customerDatasourceImpl = new PostgresCustomerDatasourceImpl();
    const customerRepositoryImpl = new CustomerRepositoryImpl(customerDatasourceImpl);
    const routesController = new CustomerController(customerRepositoryImpl);

    router.post('/register', routesController.postCustomer);
    
    return router;
  }
}