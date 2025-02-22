import { UploadedFile } from "express-fileupload";

export abstract class FileUploadRepository {
  abstract fileUploadSingle(
    folder?: string, 
    fileName?: string,
    file?: UploadedFile, 
  ): Promise<object>;

  abstract deleteUploadedFile(publicId: string): Promise<any>;
  abstract fileUploadMultiple(): void;
}