import { UploadedFile } from "express-fileupload";

export abstract class FileUploadRepository {
  abstract fileUploadSingle(
    folder?: string, 
    fileName?: string,
    file?: UploadedFile, 
  ): Promise<string>;
  abstract fileUploadMultiple(): void;
}