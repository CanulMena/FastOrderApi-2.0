import { Router } from "express";
import { FileUploadController } from './file-upload-controller';
import { FileSystemFileUploadDataSourceImpl, CloudinaryFileUploadDataSourceImpl, PostgresUserDataSourceImpl } from '../../infrastructure/datasource/index';
import { FileUploadRepositoryImpl, UserRepositoryImpl } from "../../infrastructure/repository";
import { AuthMiddleware, FileUploadMiddleware, TypeMiddleware } from "../middlewares/index";
import { rolesConfig } from "../../configuration";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

        const userDatasourceImpl = new PostgresUserDataSourceImpl();
        const userRepositoryImpl = new UserRepositoryImpl(userDatasourceImpl);

    const authMiddleware = new AuthMiddleware( userRepositoryImpl );

    const fileSystemFileUploadDatasource = new FileSystemFileUploadDataSourceImpl();
    const cloudinaryDatasource = new CloudinaryFileUploadDataSourceImpl();

    const fileUploadRepository = new FileUploadRepositoryImpl(cloudinaryDatasource);

    const uploadFileController = new FileUploadController(
      fileUploadRepository
    );
    router.use(FileUploadMiddleware.containFiles);
    router.post(
      '/single/:type',
      TypeMiddleware.validTypes(['dishes', 'sides']),
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.SuperAdmin),
      uploadFileController.fileUploadSingle
    );
    router.post('/multiple/:type', uploadFileController.fileUploadMultiple);

    return router;
  }
}