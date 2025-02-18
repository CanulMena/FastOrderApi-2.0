import { UploadedFile } from "express-fileupload";
import { FileUploadDatasource } from "../../domain/datasource/file-upload.datasource";
import { FileUploadRepository } from "../../domain/repositories/index";

export class FileUploadRepositoryImpl implements FileUploadRepository{
  constructor(
    private fileUploadDatasource: FileUploadDatasource
  ){}

  fileUploadSingle( 
    folder: string = 'uploads', 
    fileName?: string,
    file?: UploadedFile,
  ): Promise<string> {

    return this.fileUploadDatasource.fileUploadSingle(
      folder,
      fileName,
      file,
    );

  }

  fileUploadMultiple() {
    this.fileUploadDatasource.fileUploadMultiple();
  }
}