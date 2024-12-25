import { SideRepository } from "../../repositories";

interface DeleteSideUseCase {
  execute(sideId: number): Promise<object>;
}

export class DeleteSide implements DeleteSideUseCase {
  constructor(private readonly sideRepository: SideRepository) {}

  async execute(sideId: number): Promise<object> {
    const side = await this.sideRepository.deleteBySide(sideId);
    return {
      side: side
    }
  }
}