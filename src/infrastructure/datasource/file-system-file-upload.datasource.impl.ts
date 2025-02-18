import fs from 'fs';
import path from 'path';

import { FileUploadDatasource } from "../../domain/datasource/file-upload.datasource";
import { UploadedFile } from "express-fileupload";
import { CustomError } from '../../domain/errors';
import { uuidAdapter } from '../../configuration/plugins/uuid.adapter';

export class FileSystemFileUploadDataSourceImpl implements FileUploadDatasource {
  
  constructor(
    private readonly uuid: string = uuidAdapter.v4
  ){}
  
  private checkFolder( folderPath: string ){
    if( !fs.existsSync(folderPath) ){
      fs.mkdirSync(folderPath);
    }
  }

  async fileUploadSingle(
    folder: string = 'uploads', 
    fileName: string,
    file: UploadedFile,
  ): Promise<string> {
    
    try {

      const destination = path.resolve(__dirname, '../../../', folder); //creamos la ruta del destino que donde se almacenará el archivo.
      this.checkFolder(destination); //si la carpeta no existe, la creamos.
      
      file.mv(`${destination}/${fileName}`); //movemos el archivo al destination(a la carpeta uploads).

      return fileName; //retornamos el nombre del archivo.

    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Error uploading file: ${error}`);
    }

  }

  fileUploadMultiple() {
    throw new Error("Method not implemented.");
  }


}