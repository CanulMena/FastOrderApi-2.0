import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SideRepository } from "../../repositories";

interface GetSidesUseCase {
  execute(user: User): Promise<object>;
}

export class GetSides implements GetSidesUseCase {
  constructor(
    private readonly sideRepository: SideRepository
  ) {}

  async execute(user: User): Promise<object> {
    if (!user.rol) {
      throw CustomError.unAurothorized('User role is required');
    }

    const sides = await this.sideRepository.getSides();

    // Si el usuario es SUPER_ADMIN, devolver todos los sides
    if (user.rol === 'SUPER_ADMIN') {
      return { sides };
    }

    // Filtrar los sides por kitchenId del usuario
    const filteredSides = sides.filter(side => side.kitchenId === user.kitchenId);

    if (filteredSides.length === 0) {
      throw CustomError.unAurothorized('User does not have access to this kitchen');
    }

    return { sides: filteredSides };
  }
}