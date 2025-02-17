import { Router } from "express";
import { KitchenRoutes } from "./kitchen/kitchen-routes";
import { AuthRoutes } from "./auth/auth-routes";
import { CustomerRoutes } from "./customer/customer-routes";
import { SideRoutes } from "./side/side-routes";
import { DishRoutes } from "./dish/dish-routes";
import { OrderRoutes } from "./order/order-routes";
import { FileUploadRoutes } from "./file-upload/file-upload-routes";

export class AppRoutes {
    static get routes(): Router {

        const router = Router();

        router.use('/api/kitchen', KitchenRoutes.routes); //Ruta de las cocinas

        router.use('/api/auth', AuthRoutes.routes); //Ruta de los usuarios

        router.use('/api/customer', CustomerRoutes.routes); //Ruta de los clientes

        router.use('/api/side', SideRoutes.routes); //Ruta de los complementos

        router.use('/api/dish', DishRoutes.routes); //Ruta de los platillos

        router.use('/api/order', OrderRoutes.routes); //Ruta de los pedidos

        router.use('/api/upload', FileUploadRoutes.routes); //Ruta de las imagenes

        return router;
    }
}