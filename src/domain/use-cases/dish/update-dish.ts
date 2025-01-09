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
    // Verifica si el platillo existe
    const dishFound = await this.dishRepository.getDishById(updateDishDto.dishId);

    // Verifica si el usuario tiene acceso a la cocina del platillo
    if (dishFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
      throw CustomError.unAurothorized('User does not have access to this kitchen');
    }

    // Valida los complementos (sides) si están presentes
    if (updateDishDto.sidesId?.length) {
      await this.validateAndUpdateSides(updateDishDto.sidesId, dishFound.kitchenId, updateDishDto.dishId);
    }

    // Actualiza el platillo
    const dishUpdated = await this.dishRepository.updateDish(updateDishDto);

    return { dishUpdated };
  }

  private async validateAndUpdateSides(sidesId: number[], kitchenId: number, dishId: number): Promise<void> {
    // Obtiene los complementos de la base de datos y valida que existan
    const foundSides = await Promise.all(
      sidesId.map(async (sideId) => {
        const side = await this.sideRepository
        .getSideById(sideId);
        return side;
      })
    );

    // Filtra los complementos que no pertenecen a la misma cocina
    const invalidSides = foundSides.filter((side) => side.kitchenId !== kitchenId);

    if (invalidSides.length) {
      const invalidSideIds = invalidSides.map((side) => side.sideId).join(', ');
      throw CustomError.unAurothorized(
        `The following ${invalidSides.length > 1 ? 'sides' : 'side'} do not belong to the same kitchen: ${invalidSideIds}`
      );
    }

    // Elimina y actualiza las relaciones con los complementos
    await this.dishSideRepository.deleteSidesByDishId(dishId);
    await this.dishSideRepository.createMany(dishId, sidesId);
  }
}
