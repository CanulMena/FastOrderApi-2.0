import { CreateDishDto } from "../../dtos/dish/index";
import { CustomError } from "../../errors";
import { DishRepository } from "../../repositories";
import { SideRepository } from '../../repositories/side.repository';


interface CreateDishUseCase {
  execute(dish: CreateDishDto): Promise<object>
}

export class CreateDish implements CreateDishUseCase {

  constructor(
    private dishRepository: DishRepository,
    private SideRepository: SideRepository,
  ) {}

  async execute(createDishDto: CreateDishDto): Promise<object> {

    /*Obtener todos los sides por IDs para validar para que el side exista y obtener el kitchenId de cada side
    y comparar que el kitchenId de cada side pertenece a el mismo kitchenId de la cocina al que se le quiere agregar*/
    const sides = await Promise.all(
      createDishDto.sidesId.map(async (sideId) => {
          const side = await this.SideRepository
          .getSideById(sideId)
          return side;
      })
    );

    //validar que sus kitchenId de cada side sea igual al kitchenId de la cocina al que se le quiere agregar.
    const invalidSides = sides.filter( (side) => side.kitchenId !== createDishDto.kitchenId); // devuleve los sides que no pertenecen a la cocina

    if (invalidSides.length > 0) {
      const invalidSideIds = invalidSides.map((side) => side.sideId).join(', ');
      throw CustomError.unAuthorized(
        `The following ${invalidSideIds.length > 1 ? 'sides' : 'side'} do not belong to the same kitchen: ${invalidSideIds}`
      );
    }

    const dishCreated = await this.dishRepository.createDish(createDishDto);
    return {
      dish: dishCreated
    }
  }
}