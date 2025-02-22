import { UploadedFile } from "express-fileupload";

export abstract class FileUploadDatasource {

  abstract fileUploadSingle(
    folder?: string, 
    fileName?: string,
    file?: UploadedFile,
  ): Promise<object>;

  abstract deleteUploadedFile(publicId: string): Promise<any>;

  abstract fileUploadMultiple(): void;

}