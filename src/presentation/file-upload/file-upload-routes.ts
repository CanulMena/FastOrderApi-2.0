import { Router } from "express";
import { FileUploadController } from './file-upload-controller';
import { FileSystemFileUploadDataSourceImpl, CloudinaryFileUploadDataSourceImpl } from '../../infrastructure/datasource/index';
import { FileUploadRepositoryImpl } from "../../infrastructure/repository";
import { FileUploadMiddleware, TypeMiddleware } from "../middlewares/index";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const fileSystemFileUploadDatasource = new FileSystemFileUploadDataSourceImpl();
    const cloudinaryDatasource = new CloudinaryFileUploadDataSourceImpl();

    const fileUploadRepository = new FileUploadRepositoryImpl(cloudinaryDatasource);

    const uploadFileController = new FileUploadController(
      fileUploadRepository
    );
    router.use(FileUploadMiddleware.containFiles);
    router.use( TypeMiddleware.validTypes(['dishes', 'sides']));
    router.post('/single/:type', uploadFileController.fileUploadSingle);
    router.post('/multiple/:type', uploadFileController.fileUploadMultiple);

    return router;
  }
}