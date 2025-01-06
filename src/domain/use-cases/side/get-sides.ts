import { PaginationDto } from "../../dtos";
import { Side, User } from "../../entities";
import { CustomError } from "../../errors";
import { SideRepository } from "../../repositories";

//* Retorna los sides por paginación dependiendo de la cocina a la que pertenece el usuario. (SUPER_ADMIN puede ver todos los sides por paginación).
interface GetSidesUseCase {
  execute(user: User, paginationDto: PaginationDto): Promise<object>;
}

export class GetSides implements GetSidesUseCase {
  constructor(
    private readonly sideRepository: SideRepository
  ) {}

  async execute(user: User, paginationDto: PaginationDto): Promise<object> {
    const { page, limit } = paginationDto;

    if (user.rol === 'SUPER_ADMIN') {
      const sides = await this.sideRepository.getSides(paginationDto);
      const sidesCount = await this.sideRepository.getSidesCount();
      return this.buildResponse(sides, page, limit, sidesCount);
    }

    if (!user.kitchenId) {
      throw CustomError.unAurothorized('User does not have access to any kitchen');
    }

    //*solo me va a traer los sides de la cocina a la que pertenece el usuario
    const sidesByKitchenIdCount = await this.sideRepository.getSidesByKitchenIdCount(user.kitchenId);
    const sidesByKitchenId = await this.sideRepository.getSidesByKitchenId(user.kitchenId, paginationDto);

    return this.buildResponse(sidesByKitchenId, page, limit, sidesByKitchenIdCount);
  }

  private buildResponse(sides: Side[], page: number, limit: number, count: number): object {
    return {
      page,
      limit,
      total: count,
      next: (page * limit) < count ? `/api/side/get-all?page=${ (page + 1) }&limit=${ limit }` : null,
      prev: ( page - 1 > 0 ) ? `http://localhost:3000/sides/get-all?page=${ (page - 1) }&limit=${ limit }` : null,
      sides: sides,
      message: sides.length === 0 ? 'No more sides available for this query.' : null,
    };
  }

}