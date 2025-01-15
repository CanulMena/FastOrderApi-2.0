import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SideRepository } from "../../repositories";

interface DeleteSideUseCase {
  execute(sideId: number, user: User): Promise<object>;
}

export class DeleteSide implements DeleteSideUseCase {
  constructor(private readonly sideRepository: SideRepository) {}

  async execute(sideId: number, user: User): Promise<object> {
    if (!user.rol) throw CustomError.unAuthorized('User role is required');
    const sideFound = await this.sideRepository.getSideById(sideId);
    if(sideFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
      throw CustomError.unAuthorized('User does not have access to this kitchen');
    }
    const sideDeleted = await this.sideRepository.deleteBySide(sideId);
    return {
      side: sideDeleted
    }
  }
}