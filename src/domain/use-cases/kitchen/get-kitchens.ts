import { KitchenRepository } from "../../repositories"

interface GetKitchensUseCase {
  execute(): Promise<object>
}

export class GetKitchens implements GetKitchensUseCase {

  constructor(private kitchenRepository: KitchenRepository) {}

  async execute(): Promise<object> {
    const kitchens = await this.kitchenRepository.getKitchens()
    return {
      kitchens: kitchens
    }
  }
}