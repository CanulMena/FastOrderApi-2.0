interface FileUploadMultipleUseCase {
  execute(
    file: any[],
    folder: string,
    validExtensions: string[],
  ): Promise<any>;
}

export class FileUploadMultiple implements FileUploadMultipleUseCase {
  constructor(
    
  ) {}

  async execute(
    file: any[], 
    folder: string = 'uploads', 
    validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif']
  ) {

    return;
  }
}