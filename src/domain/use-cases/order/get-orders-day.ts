import { Order, User } from "../../entities";
import { PaginationDto, OrderFiltersDto, OrderResponseDto, PaginatedResponse } from "../../dtos";
import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { OrderRepository } from "../../repositories";
import { OrderRange } from "../../dvo";
import { envs } from "../../../configuration";
import { CustomError } from "../../errors";
import { OrderMapper } from "../../mappers";

enum UserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  // agrega más roles si lo necesitas
}

interface GetOrdersDayUseCase {
  execute(
    user: User,
    paginationDto: PaginationDto,
    filtersDto?: OrderFiltersDto
  ): Promise<PaginatedResponse<OrderResponseDto>>;
}

export class GetOrdersDay implements GetOrdersDayUseCase {
  private readonly timezone = "America/Merida"; //TODO: TOMAR EL TIME ZONE DE LA COCINA (KITCHEN)

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderMapper: OrderMapper,
  ){}

  async execute(
    user: User,
    paginationDto: PaginationDto,
    filtersDto?: OrderFiltersDto
  ): Promise<PaginatedResponse<OrderResponseDto>> {
    if (!user.kitchenId && user.rol !== UserRoles.SUPER_ADMIN) {
      throw CustomError.unAuthorized("User does not have access to any kitchen");
    }

    const ordersRange = await this.getOrders(user, paginationDto, filtersDto);

    const ordersDto: OrderResponseDto[] = await Promise.all(
      ordersRange.map((order) => this.mapOrderToDto(order))
    );

    return this.buildResponse(
      ordersDto,
      paginationDto.page,
      paginationDto.limit,
      ordersRange.length
    );
  }

  private async getOrders(
    user: User,
    paginationDto: PaginationDto,
    filtersDto?: OrderFiltersDto
  ): Promise<Order[]> {
    if (user.rol === UserRoles.SUPER_ADMIN) {
      return this.orderRepository.getOrders(paginationDto);
    }

    const { startUTC, endUTC } = luxonAdapter.getDayRangeUtcByZone(this.timezone);
    const orderRange = new OrderRange(startUTC, endUTC);

    return this.orderRepository.getKitchenOrdersInRange(
      user.kitchenId!,
      orderRange,
      paginationDto,
      filtersDto
    );
  }

  private async mapOrderToDto(order: Order): Promise<OrderResponseDto> {
    const orderMapper = this.orderMapper;
    const orderResponseDto = await orderMapper.mapOrderToDto(order);
    return orderResponseDto;
  }

  private buildResponse(
    orders: OrderResponseDto[],
    page: number,
    limit: number,
    count: number
  ): PaginatedResponse<OrderResponseDto> {
    return {
      page,
      limit,
      total: count,
      next: page * limit < count ? `${envs.WEB_SERVICE_URL}/dish/get-orders-day?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `${envs.WEB_SERVICE_URL}/dish/get-orders-day?page=${page - 1}&limit=${limit}` : null,
      data: orders,
      message: orders.length === 0 ? "No more orders available for this query." : null,
    };
  }
}
