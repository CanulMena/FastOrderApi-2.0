import fs from 'fs';
import path from 'path';

import { FileUploadDatasource } from "../../domain/datasource/file-upload.datasource";
import { CustomError } from '../../domain/errors';
import { UploadedFile } from "express-fileupload"; //TODO: CREAR UN ADAPTADOR PARA EL UPLOADED FILE

export class FileSystemFileUploadDataSourceImpl implements FileUploadDatasource {
  deleteUploadedFile(publicId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
  private checkFolder( folderPath: string ){
    if( !fs.existsSync(folderPath) ){
      fs.mkdirSync(folderPath, {recursive: true});
    }
  }

  async fileUploadSingle(
    folder: string = 'uploads', 
    fileName: string,
    file: UploadedFile,
  ): Promise<object> {
    
    try {

      const destination = path.resolve(__dirname, '../../../', `uploads/${folder}`); //creamos la ruta del destino que donde se almacenará el archivo.
      this.checkFolder(destination); //si la carpeta no existe, la creamos.
      
      await file.mv(`${destination}/${fileName}`); //movemos el archivo al destination(a la carpeta uploads).

      return {fileName}; //retornamos el nombre del archivo.

    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Error uploading file: ${error}`);
    }

  }

  fileUploadMultiple() {
    throw new Error("Method not implemented.");
  }


}