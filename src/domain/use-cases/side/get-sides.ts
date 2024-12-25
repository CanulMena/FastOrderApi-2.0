import { SideRepository } from "../../repositories";

interface GetSidesUseCase {
  execute(): Promise<object>;
}

export class GetSides implements GetSidesUseCase {
  constructor(private readonly sideRepository: SideRepository) {}

  async execute(): Promise<object> {
    const sides = await this.sideRepository.getSides();
    return {
      sides: sides
    }
  }
}