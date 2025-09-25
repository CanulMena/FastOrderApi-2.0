import { Dish, Order, User } from "../../entities";
import { PaginationDto, OrderFiltersDto, OrderResponseDto, PaginatedResponse } from "../../dtos";
import { luxonAdapter } from "../../../configuration/plugins/luxon.adapter";
import { CustomerRepository, DishRepository, OrderRepository } from "../../repositories";
import { OrderRange } from "../../dvo";
import { envs } from "../../../configuration";
import { CustomError } from "../../errors";

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
    private readonly customerRepository: CustomerRepository,
    private readonly dishRepository: DishRepository
  ) {}

  async execute(
    user: User,
    paginationDto: PaginationDto,
    filtersDto?: OrderFiltersDto
  ): Promise<PaginatedResponse<OrderResponseDto>> {
    if (!user.kitchenId && user.rol !== UserRoles.SUPER_ADMIN) {
      throw CustomError.unAuthorized("User does not have access to any kitchen");
    }

    const orders = await this.getOrders(user, paginationDto, filtersDto);

    const ordersDto: OrderResponseDto[] = await Promise.all(
      orders.map((order) => this.mapOrderToDto(order))
    );

    return this.buildResponse(
      ordersDto,
      paginationDto.page,
      paginationDto.limit,
      orders.length
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
    const customer = order.clientId
      ? await this.customerRepository.getCustomerById(order.clientId)
      : null;

    const orderDetails = await Promise.all(
      order.orderDetails.map(async (detail) => {
        const dish: Dish = await this.dishRepository.getDishById(detail.dishId);
        const subtotal =
          detail.portion * dish.pricePerServing +
          (detail.halfPortion ?? 0) * dish.pricePerHalfServing;

        return {
          orderDetailId: detail.orderDetailId,
          portion: detail.portion,
          dishId: detail.dishId,
          orderId: detail.orderId,
          halfPortion: detail.halfPortion,
          imagePath: dish.imagePath,
          subtotal,
          dishName: dish.name,
        };
      })
    );

    const total = orderDetails.reduce((acc, d) => acc + d.subtotal, 0);

    return {
      orderId: order.orderId,
      date: order.date,
      status: order.status,
      deliveryType: order.deliveryType,
      paymentType: order.paymentType,
      isPaid: order.isPaid,
      clientName: customer?.name ?? "Anonimo",
      kitchenId: order.kitchenId,
      clientId: order.clientId,
      total,
      orderDetails,
    };
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
