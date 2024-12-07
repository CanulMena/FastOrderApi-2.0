import { Router } from "express";
import { KitchenController } from "./kitchen-controller";
import { PostgresKitchenDatasourceImpl } from "../../infrastructure/datasource/index";
import { KitchenRepositoryImpl } from "../../infrastructure/repository/index";

export class KitchenRoutes {
    //? AL NO SER STATIC TENGO QUE CREAR UNA INSTACIA DE LA CLASE
    static get routes(): Router { //verbos http de la ruta de las cocinas
        const router = Router();

        const kitchenDatasourceImpl = new PostgresKitchenDatasourceImpl();
        const kichenRepositoryImpl = new KitchenRepositoryImpl( kitchenDatasourceImpl );
        const kitchenController = new KitchenController(  kichenRepositoryImpl );

        router.get('/', kitchenController.getKitchens);

        router.get('/:id', kitchenController.getKitchenById);

        router.post('/', kitchenController.postKitchen);

        router.delete('/:id', kitchenController.deleteKitchen);

        router.put('/:id', kitchenController.updateKitchen);

        return router;
    }
}