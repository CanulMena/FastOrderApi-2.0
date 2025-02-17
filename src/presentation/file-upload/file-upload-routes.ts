import { Router } from "express";
import { FileUploadController } from './file-upload-controller';

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const uploadFileController = new FileUploadController();

    router.post('/single/:type', uploadFileController.fileUpload);
    router.post('/multiple/:type', uploadFileController.fileUploadMultiple);

    return router;
  }
}