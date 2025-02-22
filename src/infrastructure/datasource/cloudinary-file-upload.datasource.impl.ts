import { UploadedFile } from "express-fileupload"; //¿Es esto un dependencia oculta? r: No, es una dependencia explicita
import { FileUploadDatasource } from "../../domain/datasource";
import { cloudinaryAdapter, ICloudinaryAdapter } from '../../configuration/plugins/cloudinary.adapter';

export class CloudinaryFileUploadDataSourceImpl implements FileUploadDatasource {
  
  constructor(
    private readonly cloudinaryAdaptert: ICloudinaryAdapter = cloudinaryAdapter
  ){}

  async fileUploadSingle(folder: string, fileName: string, file: UploadedFile): Promise<object>{
    const result: object = await this.cloudinaryAdaptert.uploadFileFromBuffer(file.data, folder, fileName);
    return result;
  }

  async deleteUploadedFile(publicId: string): Promise<any> {
    return await this.cloudinaryAdaptert.deleteUploadedFile(publicId);
  }

  fileUploadMultiple(): void {
    throw new Error("Method not implemented.");
  }
    
}