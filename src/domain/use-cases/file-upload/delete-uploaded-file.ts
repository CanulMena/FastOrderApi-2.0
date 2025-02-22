import { FileUploadRepository } from '../../repositories/file-upload.repository';

interface DeleteUploadedFileUseCase {
  execute(publicId: string): Promise<any>
}

export class DeleteUploadedFile implements DeleteUploadedFileUseCase {

  constructor(
    private fileUploadRepository: FileUploadRepository
  ){}

  async execute(publicId: string): Promise<any> {
    return await this.fileUploadRepository.deleteUploadedFile(publicId);
  }

}