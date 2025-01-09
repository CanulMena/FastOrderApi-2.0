import { UpdateDishDto } from "../../dtos";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { DishRepository, DishSideRepository, SideRepository } from "../../repositories";

interface UpdateDishUseCase {
  execute(updateDishDto: UpdateDishDto, user: User): Promise<object>;
}

export class UpdateDish implements UpdateDishUseCase {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly sideRepository: SideRepository,
    private readonly dishSideRepository: DishSideRepository
  ) {}

  async execute(updateDishDto: UpdateDishDto, user: User): Promise<object> {
    
    // Valida que el platillo exista en la base de datos
    const dishFound = await this.dishRepository.getDishById(updateDishDto.dishId);
    // Si el platillo existe pero no pertenece a la misma cocina del usuario, y el usuario no es SUPER_ADMIN, lanza un error.
    if(dishFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
      throw CustomError.unAurothorized('User does not have access to this kitchen');
    }

    // aca muere si no mando sidesId  r: como puedo solucinar esto? r: con un if que verifique si sidesId es undefined
    if(updateDishDto.sidesId){

      const updateDishDtosides = await Promise.all( //obtiene todos los sides del updateDto y verifica que existan en la base de datos.
        updateDishDto.sidesId!.map(async (sideId) => {
            const side = await this.sideRepository
            .getSideById(sideId)
            return side;
        })
      );
  
      const invalidSides = updateDishDtosides.filter( (side) => side.kitchenId !== dishFound.kitchenId); // filtra los sides que no pertenecen a la misma cocina del platillo a actualizar
  
      if (invalidSides.length > 0) { //si existe un complemento(side) que no pertenece a la misma cocina retorna un error con los sides que no pertenecen a la misma cocina
        const invalidSideIds = invalidSides.map((side) => side.sideId).join(', ');
        throw CustomError.unAurothorized(
          `The following ${invalidSideIds.length > 1 ? 'sides' : 'side'} do not belong to the same kitchen: ${invalidSideIds}`
        );
      }
      
    }

    if( updateDishDto.sidesId && updateDishDto.sidesId.length > 0) {
      //elimina todos los complementos del platillo
      await this.dishSideRepository.deleteSidesByDishId(updateDishDto.dishId);
      //crea los complementos del platillo a actualizar
      await this.dishSideRepository.createMany(updateDishDto.dishId, updateDishDto.sidesId!);
    }

    const dishUpdated = await this.dishRepository.updateDish(updateDishDto);

    return {
      dishUpdated
    };
  }
}