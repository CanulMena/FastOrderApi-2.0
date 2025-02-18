import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleware {
  static containFiles(req: Request, res: Response, next: NextFunction){
    //validar que se haya subido un archivo
    if( !req.files || Object.keys(req.files).length === 0 ){
      res.status(400).send('No files were uploaded.');
      return;
    }

    if( !Array.isArray(req.files.file) ){ //si esto no es un arreglo
      req.body.files =  [req.files.file]; //en mi req.body.files le agregaoms ese archivo como un arreglo.
    } else {
      req.body.files = req.files.files; //aca esto es si es una arreglo, lo agrgamos agregamos a req.body.files.
    }

    next();
  }
}