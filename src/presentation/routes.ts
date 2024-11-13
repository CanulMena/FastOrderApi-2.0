import { Router } from "express";
import { KitchenRoutes } from "./kitchen/kitchen-routes";

export class AppRoutes {
    static get routes(): Router {

        const router = Router();

        router.use('/api/kitchen', KitchenRoutes.routes); //Ruta de las cocinas

        return router;
    }
}