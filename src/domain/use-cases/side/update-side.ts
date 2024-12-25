import { UpdateSideDto } from "../../dtos/side";
import { SideRepository } from "../../repositories";

interface UpdateSideUseCase {
  execute(side: UpdateSideDto): Promise<object>;
}

export class UpdateSide implements UpdateSideUseCase {
  constructor(private sideRepository: SideRepository) {}

  public async execute(side: UpdateSideDto): Promise<object> {
    const sideUpdated = await this.sideRepository.updateSide(side);
    return {
      side: sideUpdated
    }
  }
}