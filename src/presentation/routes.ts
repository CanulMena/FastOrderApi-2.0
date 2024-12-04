import { Router } from "express";
import { KitchenRoutes } from "./kitchen/kitchen-routes";
import { UserRoutes } from "./user/user-routes";

export class AppRoutes {
    static get routes(): Router {

        const router = Router();

        router.use('/api/kitchen', KitchenRoutes.routes); //Ruta de las cocinas

        router.use('/api/user', UserRoutes.routes); //Ruta de los usuarios

        return router;
    }
}