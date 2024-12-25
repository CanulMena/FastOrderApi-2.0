import { SideRepository } from "../../repositories";

interface GetSideUseCase {
  execute(sideId: number): Promise<object>;
}

export class GetSide implements GetSideUseCase {
  constructor(private readonly sideRepository: SideRepository) {}

  async execute(sideId: number): Promise<object> {
    const side = await this.sideRepository.getSideById(sideId);
    return {
      side: side
    }
  }
}