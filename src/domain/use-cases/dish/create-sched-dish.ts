import { CreateSchedDishDto } from "../../dtos";
import { SchedDish } from "../../entities";
import { CustomError } from '../../errors';
import { DishRepository, SchedDishRepository } from '../../repositories';

interface CreateSchedDishUseCase {
  execute(
    schedDishDto: CreateSchedDishDto
  ): Promise<{
    scheduledDish: SchedDish;
  }>
}

export class CreateSchedDish implements CreateSchedDishUseCase {
  
  constructor(
    private readonly schedDishRepository: SchedDishRepository,
    private readonly dishRepository: DishRepository
  ){}
  
  async execute(schedDishDto: CreateSchedDishDto): Promise<{ scheduledDish: SchedDish }> {

    //1. validar que el platillo existe y que pertenece a la cocina.
    const dish = await this.dishRepository.getDishById(schedDishDto.dishId);

    //2. al ya haber validado que este platillo es de la misma cocina, tambien valida que el usuario pertenece a esa cocina.
    if (dish!.kitchenId !== schedDishDto.kitchenId) {
      throw CustomError.unAuthorized(
        `The dish with ID ${schedDishDto.dishId} does not belong to the specified kitchen (ID: ${schedDishDto.kitchenId}).`
      );
    }

    //3. validar que no se pueda repetir platillos programados para la misma cocina y el mismo dia de la semana.
    await this.schedDishRepository.findSchedDish(schedDishDto);
    
    //4. Crear el platillo programado
    const scheduledDish = await this.schedDishRepository.createSchedDish(schedDishDto);

    return {
      scheduledDish: scheduledDish,
    };
  }

}