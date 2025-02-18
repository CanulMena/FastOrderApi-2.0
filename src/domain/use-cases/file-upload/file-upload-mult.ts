import { UploadedFile } from "express-fileupload";

interface FileUploadMultipleUseCase {
  execute(
    file: UploadedFile[],
    folder: string,
    validExtensions: string[],
  ): Promise<any>;
}

export class FileUploadMultiple implements FileUploadMultipleUseCase {
  constructor(
    
  ) {}

  async execute(
    file: UploadedFile[], 
    folder: string = 'uploads', 
    validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif']
  ) {

    return;
  }
}