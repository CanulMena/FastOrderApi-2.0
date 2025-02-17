import { Request, Response } from 'express';
import { FileUploadSingle, FileUploadMultiple } from '../../domain/use-cases/index';

export class FileUploadController {
  constructor(){}

  public fileUpload = (req: Request, res: Response) => {
    new FileUploadSingle();
  }

  public fileUploadMultiple = (req: Request, res: Response) => {
    new FileUploadMultiple();
  }
}