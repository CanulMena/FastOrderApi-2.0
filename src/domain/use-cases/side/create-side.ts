import { UploadedFile } from "express-fileupload";
import { CreateSideDto } from "../../dtos/side";
import { SideRepository } from "../../repositories";
import { DeleteUploadedFile, FileUploadSingle } from "../file-upload";
import { CustomError } from "../../errors";

interface CreateSideUseCase {
  execute(
    side: CreateSideDto, 
    file: UploadedFile, 
    folder: string, 
    validExtensions: string[]
  ): Promise<object>;
}

export class CreateSide implements CreateSideUseCase {
  constructor(
    private sideRepository: SideRepository, 
    private fileUploadSingle: FileUploadSingle,  
    private deleteUploadedFile: DeleteUploadedFile
  ) {}

  async execute(
    createSideDto: CreateSideDto, 
    file: UploadedFile, 
    folder: string = 'uploads', 
    validExtensions: string[] = ['jpg', 'jpeg', 'png']
  ): Promise<object> {

    const fileUploaded = await this.fileUploadSingle.execute( file, folder, validExtensions );
    
    const sideWithImage = {
      ...createSideDto, // Copiamos las propiedades de createSideDto
      imageUrl: fileUploaded.url || fileUploaded.fileName // Agregamos la propiedad imageUrl
    };

    try {
      const sideCreated = await this.sideRepository.createSide(sideWithImage);
      return { side: sideCreated };
    } catch (error) {
      const deleteUploadedFile = await this.deleteUploadedFile.execute(fileUploaded.publicId);
      throw CustomError.badRequest(`Error creating side - deleteUploadedFile: ${deleteUploadedFile.result}`);
    }
  }
}