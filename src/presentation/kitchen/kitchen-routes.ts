import { Router } from "express";
import { KitchenController } from "./kitchen-controller";

export class KitchenRoutes {
    //? AL NO SER STATIC TENGO QUE CREAR UNA INSTACIA DE LA CLASE
    static get routes(): Router { //verbos http de la ruta de las cocinas
        const router = Router();
        const kitchenController = new KitchenController();

        router.get('/', kitchenController.getKitchens);

        router.get('/:id', kitchenController.getKitchenById);

        router.post('/', kitchenController.postKitchen);

        router.delete('/:id', kitchenController.deleteKitchen);

        return router;
    }
}