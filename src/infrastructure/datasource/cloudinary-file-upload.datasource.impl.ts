import { UploadedFile } from "express-fileupload"; //¿Es esto un dependencia oculta? r: No, es una dependencia explicita
import { FileUploadDatasource } from "../../domain/datasource";
import { cloudinaryAdapter } from '../../configuration/plugins/cloudinary.adapter';

export class CloudinaryFileUploadDataSourceImpl implements FileUploadDatasource {
  
  constructor(
    private readonly cloudinaryAdaptert = cloudinaryAdapter
  ){}

  async fileUploadSingle(folder: string, fileName: string, file: UploadedFile): Promise<string>{
    
    const result = await this.cloudinaryAdaptert.uploadFileFromBuffer(file.data, folder, fileName);
    return result.url;

  }
  fileUploadMultiple(): void {
    throw new Error("Method not implemented.");
  }
    
}