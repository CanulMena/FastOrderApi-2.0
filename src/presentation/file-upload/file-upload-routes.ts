import { Router } from "express";
import { FileUploadController } from './file-upload-controller';

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const uploadFileController = new FileUploadController();

    router.get('/single/:type', uploadFileController.fileUpload);
    router.get('/multiple/:type', uploadFileController.fileUploadMultiple);

    return router;
  }
}