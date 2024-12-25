import { CreateSideDto } from "../../dtos/side";
import { SideRepository } from "../../repositories";

interface CreateSideUseCase {
  execute(side: CreateSideDto): Promise<object>;
}

export class CreateSide implements CreateSideUseCase {
  constructor(private sideRepository: SideRepository) {}

  async execute(side: CreateSideDto): Promise<object> {
    const sideCreated = await this.sideRepository.createSide(side);
    return {
      side: sideCreated,
    };
  }
}