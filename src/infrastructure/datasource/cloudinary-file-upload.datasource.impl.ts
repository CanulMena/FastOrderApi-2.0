import { UploadedFile } from "express-fileupload";
import { FileUploadDatasource } from "../../domain/datasource";

export class CloudinaryFileUploadDataSourceImpl implements FileUploadDatasource {
  
  constructor(
    // private readonly cloudinary: Cloudinary = cloudinaryAdapter.v2
  ){}

  fileUploadSingle(folder?: string, fileName?: string, file?: UploadedFile): Promise<string> {
    throw new Error("Method not implemented.");
  }
  fileUploadMultiple(): void {
    throw new Error("Method not implemented.");
  }
    
}