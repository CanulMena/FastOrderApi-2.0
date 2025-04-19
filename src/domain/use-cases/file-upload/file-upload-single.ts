import { UploadedFile } from "express-fileupload";
import { FileUploadRepository } from '../../repositories/file-upload.repository';
import { CustomError } from "../../errors";
import { uuidAdapter } from "../../../configuration/plugins/uuid.adapter";

interface FileUploadResult {
  url: string; //solo para el cloudinary-file-upload.datasource.impl.ts 
  publicId: string; //solo para el cloudinary-file-upload.datasource.impl.ts
  fileName?: string; //*solo para el file-system-file-upload.datasource.impl.ts -> SOLO ESTO RETORNA. 
}

interface FileUploadSingleUseCase {
  execute(
    file: UploadedFile,
    folder: string,
    validExtensions: string[],
  ): Promise<FileUploadResult>;
}

export class FileUploadSingle implements FileUploadSingleUseCase {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository, //TODO: HACER QUE COINCIDA EL RETORNO DEL FILE-UPLOAD-DATA-SOURCE-IMPL CON EL DE CLOUDINARY.
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
    const uuid = uuidAdapter.v4(); //generamos un uuid para el nombre del archivo.
    const fileName = `${uuid}.${fileExtension}`; //creamos el nombre del archivo.
    const uploadedFile: object =  await this.fileUploadRepository.fileUploadSingle(
      folder, 
      fileName,
      file,
    );

    return uploadedFile as FileUploadResult;

  }

}