import { Request, Response } from 'express';

export class FileUploadController {
  constructor(){}

  public fileUpload = (req: Request, res: Response) => {
    res.status(200).json({message: 'File uploaded successfully'});
  }

  public fileUploadMultiple = (req: Request, res: Response) => {
    res.status(200).json({message: 'Files uploaded successfully'});
  }
}