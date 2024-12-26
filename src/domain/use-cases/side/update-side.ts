import { UpdateSideDto } from "../../dtos/side";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SideRepository } from "../../repositories";

interface UpdateSideUseCase {
  execute(side: UpdateSideDto, user: User): Promise<object>;
}

export class UpdateSide implements UpdateSideUseCase {
  constructor(private sideRepository: SideRepository) {}

  public async execute(side: UpdateSideDto, user: User): Promise<object> {
    if(!user.rol) throw CustomError.unAurothorized('User rol is required');
    const sideFound = await this.sideRepository.getSideById(side.sideId);
    if(sideFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
      throw CustomError.unAurothorized('User does not have access to this kitchen');
    }
    const sideUpdated = await this.sideRepository.updateSide(side);
    return {
      side: sideUpdated
    }
  }
}