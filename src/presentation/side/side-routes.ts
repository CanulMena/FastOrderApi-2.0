import { Router } from "express";
import { CloudinaryFileUploadDataSourceImpl, PostgresSideDatasourceImpl, PostgresUserDataSourceImpl } from "../../infrastructure/datasource/index";
import { FileUploadRepositoryImpl, SideRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository/index";
import { SideController } from "./side-controller";
import { rolesConfig } from "../../configuration";
import { AuthMiddleware, FileUploadMiddleware, TypeMiddleware } from "../middlewares/index";
import { FileSystemFileUploadDataSourceImpl } from '../../infrastructure/datasource/file-system-file-upload.datasource.impl';


export class SideRoutes {
    
    static get routes(): Router {

        const router = Router();
        const sideDatasourceImpl = new PostgresSideDatasourceImpl();
        const sideRepositoryImpl = new SideRepositoryImpl( sideDatasourceImpl );

        const userDatasourceImpl = new PostgresUserDataSourceImpl();
        const userRepository = new UserRepositoryImpl(userDatasourceImpl);

        const authMiddleware = new AuthMiddleware(userRepository);
        const cloudinaryFileUploadDatasource = new CloudinaryFileUploadDataSourceImpl();
        const fileSystemFileUploadDataSource = new FileSystemFileUploadDataSourceImpl();
        const fileUploadRepository = new FileUploadRepositoryImpl(cloudinaryFileUploadDatasource)
        const sideController = new SideController( sideRepositoryImpl, fileUploadRepository );
        
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
        );

        router.post(
            '/register/:type',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.AllRoles),
            authMiddleware.validateKitchenAccess,
            FileUploadMiddleware.containFiles,
            TypeMiddleware.validTypes(['sides']),
            sideController.postSide
        ); 

        router.delete(
            '/delete/:sideId',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            sideController.deleteSide
        );

        router.put(
            '/update/:sideId',
            authMiddleware.validateJWT,
            authMiddleware.validateRole(roles.Admin),
            sideController.updateSide
        );

        return router;

    }
}