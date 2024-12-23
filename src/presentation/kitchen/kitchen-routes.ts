import { Router } from "express";
import { KitchenController } from "./kitchen-controller";
import { PostgresKitchenDatasourceImpl, PosgresUserDataSourceImpl } from "../../infrastructure/datasource/index";
import { KitchenRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository/index";
import { AuthMiddleware } from "../middlewares/auth.middleware"
import { rolesConfig } from "../../configuration";

export class KitchenRoutes {
    //? AL NO SER STATIC TENGO QUE CREAR UNA INSTACIA DE LA CLASE
    static get routes(): Router { //verbos http de la ruta de las cocinas
        const router = Router();

        const kitchenDatasourceImpl = new PostgresKitchenDatasourceImpl();
        const kichenRepositoryImpl = new KitchenRepositoryImpl( kitchenDatasourceImpl );
        const kitchenController = new KitchenController(  kichenRepositoryImpl );

        const userDataSourceImpl = new PosgresUserDataSourceImpl();
        const userRepository = new UserRepositoryImpl(userDataSourceImpl);

        const authMiddleware = new AuthMiddleware(userRepository);

        const roles = rolesConfig;

        router.get('/', kitchenController.getKitchens); //debería proteger tambien estas rutas? si el usuario no esta atutenticado, un rol especifico y pertenece a una cocina el usuario? 

        router.get('/:id', kitchenController.getKitchenById);

        router.post(
            '/register', 
            authMiddleware.validateJWT, //verifica que sea mi token que firme por mi api
            authMiddleware.validateRole(roles.SuperAdmin),// -> Valida que el rol del usuario sea el que puede consultarlo -> SuperAdmin
            authMiddleware.validateKitchenAccess, // -> Valida que el usuario pertenezca a la cocina
            kitchenController.postKitchen
        );

        router.delete('/:id', kitchenController.deleteKitchen);

        router.put('/:id', kitchenController.updateKitchen);

        return router;
    }
}