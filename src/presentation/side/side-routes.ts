import { Router } from "express";
import { PosgresSideDatasourceImpl, PosgresUserDataSourceImpl } from "../../infrastructure/datasource/index";
import { SideRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository/index";
import { SideController } from "./side-controller";
import { rolesConfig } from "../../configuration";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class SideRoutes {
    
    static get routes(): Router {

        const router = Router();
        const sideDatasourceImpl = new PosgresSideDatasourceImpl();
        const sideRepositoryImpl = new SideRepositoryImpl( sideDatasourceImpl );
        const sideController = new SideController( sideRepositoryImpl );

        const userDatasourceImpl = new PosgresUserDataSourceImpl();
        const userRepository = new UserRepositoryImpl(userDatasourceImpl);

        const authMiddleware = new AuthMiddleware(userRepository);
        
        const roles = rolesConfig;

        router.get(
            '/get-all', 
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            sideController.getSides,
        );

        router.get(
            '/get-by-id/:sideId',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.AllRoles),
            sideController.getSideById
        ); //manejarlo en el caso de uso por que no tenemos el id de la cocina

        router.post(
            '/register',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            authMiddleware.validateKitchenAccess,
            sideController.postSide
        ); 

        router.delete(
            '/delete-by-id/:sideId',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            sideController.deleteSide
        ); //manejarlo en el caso de uso por que no tenemos el id de la cocina

        router.put(
            '/put-by-id/:sideId',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            sideController.updateSide
        ); //manejarlo en el caso de uso por que no tenemos el id de la cocina

        return router;

    }
}