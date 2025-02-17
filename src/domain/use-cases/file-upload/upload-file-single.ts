interface FileUploadSingleUseCase {
  execute(
    file: any,
    folder: string,
    validExtensions: string[],
  ): Promise<any>;
}

export class FileUploadSingle implements FileUploadSingleUseCase {
  constructor(
    
  ) {}

  async execute(
    file: any, 
    folder: string = 'uploads', 
    validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif']
  ) {

    return;
  }
}