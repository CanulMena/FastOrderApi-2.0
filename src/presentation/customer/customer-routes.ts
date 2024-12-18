import { Router } from "express";
import { CustomerController } from "./customer-controller";

export class CustomerRoutes {

  static get routes(): Router { //verbos http de la ruta de las cocinas
    
    const router = Router();

    const routesController = new CustomerController();
    
    router.post('/register', routesController.postCustomer);

    return router;
  }
}