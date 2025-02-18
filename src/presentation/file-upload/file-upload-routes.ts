import { Router } from "express";
import { FileUploadController } from './file-upload-controller';
import { FileSystemFileUploadDataSourceImpl } from '../../infrastructure/datasource/file-system-file-upload.datasource.impl';
import { FileUploadRepository } from "../../domain/repositories";
import { FileUploadRepositoryImpl } from "../../infrastructure/repository";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const fileSystemFileUploadDatasource = new FileSystemFileUploadDataSourceImpl();
    const fileUploadRepository = new FileUploadRepositoryImpl(fileSystemFileUploadDatasource);

    const uploadFileController = new FileUploadController(
      fileUploadRepository
    );

    router.post('/single/:type', uploadFileController.fileUploadSingle);
    router.post('/multiple/:type', uploadFileController.fileUploadMultiple);

    return router;
  }
}