import { UploadedFile } from "express-fileupload"; //¿Es esto un dependencia oculta? r: No, es una dependencia explicita
import { FileUploadDatasource } from "../../domain/datasource";
import { cloudinaryAdapter, ICloudinaryAdapter } from '../../configuration/plugins/cloudinary.adapter';

export class CloudinaryFileUploadDataSourceImpl implements FileUploadDatasource {
  
  constructor(
    private readonly cloudinaryAdaptert = cloudinaryAdapter //TODO: refacotizar esto cloudinaryAdapter
  ){}

  async fileUploadSingle(folder: string, fileName: string, file: UploadedFile): Promise<string>{
    //TODO: AGREGAR CONTROL DE ERRORES
    const filePath = file.tempFilePath; //el path del archivo temporal que se subió.
    const result = await this.cloudinaryAdaptert.upload(filePath, folder, fileName);
    return result.url;

  }
  fileUploadMultiple(): void {
    throw new Error("Method not implemented.");
  }
    
}