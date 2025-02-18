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
    //*aquí agregamos todas las validaciones necesarias
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