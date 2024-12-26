import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SideRepository } from "../../repositories";

interface GetSideUseCase {
  execute(sideId: number, user: User): Promise<object>;
}

export class GetSide implements GetSideUseCase {
  constructor(private readonly sideRepository: SideRepository) {}

  async execute(sideId: number, user: User): Promise<object> {
    if (!user.rol) throw CustomError.unAurothorized('User role is required');
    const side = await this.sideRepository.getSideById(sideId);
    if(side.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
      throw CustomError.unAurothorized('User does not have access to this kitchen');
    }
    return {
      side: side
    }
  }
}