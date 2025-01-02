import { CreateDishDto } from "../../dtos/dish/index";
import { DishRepository } from "../../repositories";


interface CreateDishUseCase {
  execute(dish: CreateDishDto): Promise<object>
}

export class CreateDish implements CreateDishUseCase {

  constructor(
    private dishRepository: DishRepository
  ) {}

  async execute(dish: CreateDishDto): Promise<object> {
    const dishCreated = await this.dishRepository.createDish(dish)
    return {
      dish: dishCreated
    }
  }
}