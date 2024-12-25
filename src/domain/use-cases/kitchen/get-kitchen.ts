import { KitchenRepository } from "../../repositories"

interface GetKitchenUseCase {
  execute(kitchenId: number): Promise<object>
}

export class GetKitchen implements GetKitchenUseCase {

  constructor(private kitchenRepository: KitchenRepository) {}

  async execute(kitchenId: number): Promise<object> {
    const kitchen = await this.kitchenRepository.getKitchenById(kitchenId)
    return {
      kitchen: kitchen
    } 
  }
}