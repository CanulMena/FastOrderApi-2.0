import { UploadedFile } from "express-fileupload";

export abstract class FileUploadDatasource {

  abstract fileUploadSingle(
    folder?: string, 
    fileName?: string,
    file?: UploadedFile,
  ): Promise<string>;

  abstract fileUploadMultiple(): void;

}