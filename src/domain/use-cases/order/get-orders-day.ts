import { Order, User } from "../../entities";
import { PaginationDto, OrderFiltersDto } from '../../dtos/index';
import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { OrderRepository } from "../../repositories";
import { OrderRange } from "../../dvo";
import { envs } from "../../../configuration";
import { CustomError } from "../../errors";

interface GetOrdersDayUseCase {
    execute(
      user: User, 
      paginationDto: PaginationDto,
      filtersDto?: OrderFiltersDto
    ): Promise<object>;
}

export class GetOrdersDay implements GetOrdersDayUseCase {

  constructor(
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(user: User, paginationDto: PaginationDto, filtersDto?: OrderFiltersDto): Promise<object> {

    const orders = await this.getOrders(user, paginationDto, filtersDto);

    if (!user.kitchenId) {
        throw CustomError.unAuthorized('User does not have access to any kitchen');
    }

    return this.buildResponse(orders, paginationDto.page, paginationDto.limit, orders.length);
  }

  private async getOrders(user: User, paginationDto: PaginationDto, filtersDto?: OrderFiltersDto): Promise<Order[]> {

    if (user.rol === "SUPER_ADMIN") {
      return await this.orderRepository.getOrders(paginationDto); //TODO: CAMBIAR EL RETRUN DE LOS SUPER_ADMIN
    }

    const userDayRangeUTC = luxonAdapter.getDayRangeUtcByZone("America/Merida");
    const orderRange = new OrderRange(userDayRangeUTC.startUTC, userDayRangeUTC.endUTC)

    return await this.orderRepository.getKitchenOrdersInRange(
      user.kitchenId!,
      orderRange,
      paginationDto,
      filtersDto
    );
  }

    private buildResponse(orders: Order[], page: number, limit: number, count: number): object { //TODO: REFACTORIZAR ESTO.... 
    return {
        page,
        limit,
        total: count,
        next: (page * limit) < count ? `/api/dish/get-orders-day?page=${ (page + 1) }&limit=${ limit }` : null,
        prev: ( page - 1 > 0 ) ? `${envs.WEB_SERVICE_URL}/dish/get-orders-day?page=${ (page - 1) }&limit=${ limit }` : null,
        orders: orders,
        message: orders.length === 0 ? 'No more orders available for this query.' : null,
    };
  }

}


