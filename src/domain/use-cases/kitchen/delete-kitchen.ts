import { KitchenRepository } from "../../repositories"

interface DeleteKitchenUseCase {
  execute(kitchenId: number): Promise<object>
}

export class DeleteKitchen implements DeleteKitchenUseCase {

  constructor(private kitchenRepository: KitchenRepository) {}

  async execute(kitchenId: number): Promise<object> {
    const kitchenDeleted = await this.kitchenRepository.deleteKitchen(kitchenId)
    return {
      kitchen: kitchenDeleted
    }
  }
}