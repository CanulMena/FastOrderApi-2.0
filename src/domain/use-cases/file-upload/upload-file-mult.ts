interface UploadFileMultipleUseCase {
  execute(
    file: any[],
    folder: string,
    validExtensions: string[],
  ): Promise<any>;
}

export class UploadMultipleFile implements UploadFileMultipleUseCase {
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