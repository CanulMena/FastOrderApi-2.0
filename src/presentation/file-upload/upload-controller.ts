import { Request, Response } from 'express';
import { UploadFile, UploadMultipleFile } from '../../domain/use-cases/index';

export class FileUploadController {
  constructor(){}

  public fileUpload = (req: Request, res: Response) => {
    new UploadFile();
  }

  public fileUploadMultiple = (req: Request, res: Response) => {
    new UploadMultipleFile();
  }
}