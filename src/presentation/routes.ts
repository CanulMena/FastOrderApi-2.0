import { Router } from "express";
import { KitchenRoutes } from "./kitchen/kitchen-routes";
import { AuthRoutes } from "./auth/auth-routes";
import { CustomerRoutes } from "./customer/customer-routes";

export class AppRoutes {
    static get routes(): Router {

        const router = Router();

        router.use('/api/kitchen', KitchenRoutes.routes); //Ruta de las cocinas

        router.use('/api/auth', AuthRoutes.routes); //Ruta de los usuarios

        router.use('/api/customer', CustomerRoutes.routes); //Ruta de los clientes

        return router;
    }
}