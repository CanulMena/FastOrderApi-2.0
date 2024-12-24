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

        router.get( //solo un super admin puede ver todas las cocinas
            '/get-all',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.SuperAdmin),
            kitchenController.getKitchens
        );

        router.get( //cualquier usuario que tenga un kitchenId puede ver la cocina.
            '/get-by-id/:kitchenId', 
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.AllRoles),
            authMiddleware.validateKitchenAccess,
            kitchenController.getKitchenById
        );

        router.post( //solo un super admin puede crear una cocina
            '/register',
            authMiddleware.validateJWT, //verifica que sea mi token que firme por mi api
            authMiddleware.validateRole(roles.SuperAdmin),// -> Valida que el rol del usuario sea el que puede consultarlo -> SuperAdmin
            kitchenController.postKitchen
        );

        router.delete( //solo un super admin puede eliminar una cocina
            '/delete-by-id/:kitchenId',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.SuperAdmin),
            kitchenController.deleteKitchen
        );

        router.put( //solo un super admin o admin puede actualizar una cocina
            '/put-by-id/:kitchenId', 
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            kitchenController.updateKitchen
        );

        return router;
    }
}