import { UploadedFile } from "express-fileupload";
import { FileUploadRepository } from '../../repositories/file-upload.repository';
import { CustomError } from "../../errors";
import { uuidAdapter } from "../../../configuration/plugins/uuid.adapter";

interface FileUploadSingleUseCase {
  execute(
    file: UploadedFile,
    folder: string,
    validExtensions: string[],
  ): Promise<object>;
}

export class FileUploadSingle implements FileUploadSingleUseCase {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly uuid: string = uuidAdapter.v4
  ) {}

  async execute(
    file: UploadedFile, 
    folder: string = 'uploads', 
    validExtensions: string[] = ['jpg', 'jpeg', 'png'] //['jpg', 'jpeg', 'png', 'gif']
  ) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > MAX_FILE_SIZE) {
      throw CustomError.badRequest(`File size exceeds the maximum limit of 10MB`);
    }
    const fileExtension = file.mimetype.split('/').at(1) ?? ''; //agarramos la extesión del archivo: 'image/jpg' -> 'jpg'.
    if( !validExtensions.includes(fileExtension) ){ //verificamos si la extensión del archivo es válida.
      throw CustomError.badRequest(`invalid file extension, valid extensions: ${validExtensions.join(', ')}`);
    }    
    const fileName = `${this.uuid}.${fileExtension}`; //creamos el nombre del archivo.
    const uploadedFile: string =  await this.fileUploadRepository.fileUploadSingle(
      folder, 
      fileName,
      file,
    );

    return {uploadedFile};

  }

}