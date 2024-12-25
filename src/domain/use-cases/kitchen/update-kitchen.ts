import { UpdateKitchenDto } from "../../dtos/kitchen/index";
import { KitchenRepository } from "../../repositories";

interface UpdateKitchenUseCase {
  execute(kitchen: UpdateKitchenDto): Promise<object>
}

export class UpdateKitchen implements UpdateKitchenUseCase {

  constructor(private kitchenRepository: KitchenRepository) {}

  async execute(updateKitchenDto: UpdateKitchenDto): Promise<object> {
    const kitchenUpdated = await this.kitchenRepository.updateKitchen(updateKitchenDto)
    return {
      kitchen: kitchenUpdated
    }
  }
}