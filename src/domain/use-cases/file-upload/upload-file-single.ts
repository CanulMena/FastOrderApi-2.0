interface UploadFileSingleUseCase {
  execute(
    file: any,
    folder: string,
    validExtensions: string[],
  ): Promise<any>;
}

export class UploadFile implements UploadFileSingleUseCase {
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