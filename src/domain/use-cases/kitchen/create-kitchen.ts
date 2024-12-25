import { CreateKitchenDto } from "../../dtos/kitchen/index";
import { KitchenRepository } from "../../repositories";

interface CreateKitchenUseCase {
  execute(kitchen: CreateKitchenDto): Promise<object>
}

export class CreateKitchen implements CreateKitchenUseCase {

  constructor(private kitchenRepository: KitchenRepository) {}

  async execute(kitchen: CreateKitchenDto): Promise<object> {
    const kitchenCreated = await this.kitchenRepository.createKitchen(kitchen)
    return {
      kitchen: kitchenCreated
    }
  }
} 