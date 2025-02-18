import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleware {

  static containFiles(req: Request, res: Response, next: NextFunction){
    //validar que se haya subido un archivo
    if( !req.files || Object.keys(req.files).length === 0 ){
      res.status(400).send({ error: 'No files were uploaded.' });
      return;
    }

    // Validar que req.files.file exista
    if (!req.files.file) {
      res.status(400).send({ error: 'No file field named "file" found in the uploaded files. - file field es empty' });
      return;
    }

    //TODO: Me gustaría validar que req.files.file sea un arreglo de archivos de tipo UploadedFile y no de otro tipo.

    if( !Array.isArray(req.files.file) ){ //si esto no es un arreglo
      req.body.files =  [req.files.file]; //en mi req.body.files le agregamos ese archivo como un arreglo.
    } else {
      req.body.files = req.files.file; //aca esto es si es una arreglo, lo agrgamos agregamos a req.body.files.
    }

    next();
  }

}