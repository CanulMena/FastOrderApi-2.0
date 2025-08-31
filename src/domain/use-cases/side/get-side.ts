import { Side, User } from "../../entities";
import { CustomError } from "../../errors";
import { DishRepository, SideRepository } from "../../repositories";

interface GetSideUseCase {
  execute(sideId: number, user: User): Promise<object>;
}

export class GetSide implements GetSideUseCase {
  constructor(
    private readonly sideRepository: SideRepository,
    private readonly dishRepository: DishRepository,
  ) {}

  async execute(sideId: number, user: User): Promise<object> {
    if (!user.rol) throw CustomError.unAuthorized('User role is required');
    const side = await this.sideRepository.getSideById(sideId);
    if(side.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
      throw CustomError.unAuthorized('User does not have access to this kitchen');
    }
    const dishes = await this.dishRepository.getDishesBySideId(sideId);
    return {
      ...side, 
      dishes
    }
  }
}