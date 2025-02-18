import { Request, Response } from 'express';
import { FileUploadSingle, FileUploadMultiple } from '../../domain/use-cases/index';
import { UploadedFile } from 'express-fileupload';
import { FileUploadRepository } from '../../domain/repositories/file-upload.repository';
import { CustomError } from '../../domain/errors';

export class FileUploadController {
  constructor(
    private readonly FileUploadRepository: FileUploadRepository,
  ){}
  
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public fileUploadSingle = (req: Request, res: Response) => {

    //validar -> esto ese puede poner en un middleware
    const type = req.params.type;
    const validTypes = ['dishes', 'sides'];
    if( !validTypes.includes(type as string) ){
      res.status(400).send(`Invalid type, valid types: ${validTypes.join(', ')}`);
      return;
    }
    
    //agarramos el archivo subido
    const file = req.body.files.at(0) as UploadedFile;

    new FileUploadSingle(
      this.FileUploadRepository
    )
    .execute( file, `uploads/${type}` )
    .then( uploaded => res.json(uploaded) )
    .catch( error => this.handleError(error, res));
  }

  public fileUploadMultiple = (req: Request, res: Response) => {
    new FileUploadMultiple();
  }
}