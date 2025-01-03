import { CreateDishDto } from "../../dtos/dish/index";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { DishRepository } from "../../repositories";
import { GetSide } from "../side";


interface CreateDishUseCase {
  execute(dish: CreateDishDto, user: User): Promise<object>
}

export class CreateDish implements CreateDishUseCase {

  constructor(
    private dishRepository: DishRepository,
    private getSide: GetSide
  ) {}

  async execute(dish: CreateDishDto, user: User): Promise<object> {
    
    for (const sideId of dish.sidesId) {
      await this.getSide.
      execute(sideId, user)
      .catch( error => { 
        throw CustomError.unAurothorized(
          `Side with ID ${sideId} does not belong to this kitchen. Original error: ${error.message}`
        )
      });
    }

    const dishCreated = await this.dishRepository.createDish(dish)
    return {
      dish: dishCreated
    }
  }
}